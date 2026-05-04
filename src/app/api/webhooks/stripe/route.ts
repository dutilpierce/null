import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { z } from "zod";
import { ALLOWED_SIZES } from "@/lib/constants";
import { tryParseServerEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createServiceSupabase } from "@/lib/supabase/service";
import { sendOrderConfirmationEmail } from "@/lib/emails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const sessionMetadataSchema = z.object({
  product_id: z.string().uuid(),
  slug: z.string().min(1).optional(),
  product_slug: z.string().min(1).optional(),
  selected_size: z.enum(ALLOWED_SIZES).optional(),
  size: z.enum(ALLOWED_SIZES).optional(),
  version: z.string().min(1).optional(),
});

const checkoutSessionSchema = z.object({
  id: z.string().min(1),
  metadata: z.record(z.string()).nullable().optional(),
  amount_total: z.number().int().nullable().optional(),
  customer_email: z.string().email().nullable().optional(),
  customer_details: z
    .object({
      email: z.string().email().nullable().optional(),
    })
    .nullable()
    .optional(),
  payment_status: z.string().nullable().optional(),
  payment_intent: z.union([z.string(), z.object({ id: z.string().min(1) }).passthrough()]).nullable().optional(),
});

type RpcResult = {
  ok: boolean;
  duplicate?: boolean;
  error?: string;
  remaining?: number;
  product_status?: string;
};

export async function POST(req: Request) {
  const envResult = tryParseServerEnv();
  if (!envResult.success) {
    console.error("stripe webhook: missing server env", envResult.fieldErrors);
    return NextResponse.json({ error: "server_misconfigured" }, { status: 503 });
  }
  const env = envResult.data;

  const rawBody = await req.text();
  const headerStore = await headers();
  const signature = headerStore.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid_signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const parsedSession = checkoutSessionSchema.safeParse(event.data.object);
  if (!parsedSession.success) {
    console.error("stripe webhook: unexpected checkout session payload", {
      eventId: event.id,
      type: event.type,
    });
    return NextResponse.json({ received: true, error: "invalid_session_payload" }, { status: 200 });
  }

  const session = parsedSession.data;
  const stripeSessionId = session.id;
  const metaRaw = session.metadata ?? {};
  const metaParsed = sessionMetadataSchema.safeParse(metaRaw);
  if (!metaParsed.success) {
    console.error("stripe webhook: invalid metadata", { eventId: event.id, stripeSessionId });
    const pi = session.payment_intent;
    const piId = typeof pi === "string" ? pi : pi?.id;
    if (piId) {
      try {
        await stripe.refunds.create({ payment_intent: piId });
      } catch (refundErr) {
        console.error("stripe refund failed (invalid metadata)", { eventId: event.id, stripeSessionId, refundErr });
      }
    }
    return NextResponse.json({ received: true, error: "invalid_metadata" }, { status: 200 });
  }

  const meta = metaParsed.data;
  const productId = meta.product_id;
  const slug = meta.slug ?? meta.product_slug ?? "unknown";
  const size = meta.selected_size ?? meta.size;

  if (!size) {
    console.error("stripe webhook: size missing", { eventId: event.id, stripeSessionId, productId, slug });
    const pi = session.payment_intent;
    const piId = typeof pi === "string" ? pi : pi?.id;
    if (piId) {
      try {
        await stripe.refunds.create({ payment_intent: piId });
      } catch (refundErr) {
        console.error("stripe refund failed (missing size)", { eventId: event.id, stripeSessionId, refundErr });
      }
    }
    return NextResponse.json({ received: true, error: "metadata_missing_size" }, { status: 200 });
  }

  if (session.payment_status && session.payment_status !== "paid") {
    console.error("stripe webhook: session not paid", { eventId: event.id, stripeSessionId, paymentStatus: session.payment_status });
    return NextResponse.json({ received: true, ignored: true }, { status: 200 });
  }

  const amountTotal = session.amount_total ?? 0;
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  if (!email) {
    console.error("stripe webhook: email missing", { eventId: event.id, stripeSessionId, productId, slug });
    const pi = session.payment_intent;
    const piId = typeof pi === "string" ? pi : pi?.id;
    if (piId) {
      try {
        await stripe.refunds.create({ payment_intent: piId });
      } catch (refundErr) {
        console.error("stripe refund failed (missing email)", { eventId: event.id, stripeSessionId, refundErr });
      }
    }
    return NextResponse.json({ received: true, error: "email_missing" }, { status: 200 });
  }

  const supabase = createServiceSupabase();

  const { data: rpcRaw, error: rpcError } = await supabase.rpc("process_checkout_session", {
    p_stripe_session_id: stripeSessionId,
    p_product_id: productId,
    p_email: email,
    p_size: size,
    p_amount_total: amountTotal,
  });

  if (rpcError) {
    console.error("process_checkout_session rpc", {
      eventId: event.id,
      stripeSessionId,
      productId,
      slug,
      error: rpcError,
    });
    return NextResponse.json({ error: "rpc_failed" }, { status: 500 });
  }

  const result = (Array.isArray(rpcRaw) ? rpcRaw[0] : rpcRaw) as RpcResult | null;
  if (!result || typeof result !== "object") {
    return NextResponse.json({ error: "rpc_unexpected" }, { status: 500 });
  }

  if (result.ok && result.duplicate) {
    console.info("stripe webhook: duplicate session processed", { eventId: event.id, stripeSessionId, productId, slug });
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (!result.ok) {
    const pi = session.payment_intent;
    const piId = typeof pi === "string" ? pi : pi?.id;
    if (piId && (result.error === "sold_out" || result.error === "inventory_race")) {
      try {
        await stripe.refunds.create({ payment_intent: piId });
      } catch (refundErr) {
        console.error("stripe refund failed", { eventId: event.id, stripeSessionId, refundErr });
      }
    }
    console.error("stripe webhook: checkout processing failed", {
      eventId: event.id,
      stripeSessionId,
      productId,
      slug,
      error: result.error,
    });
    return NextResponse.json({ received: true, inventory: result.error }, { status: 200 });
  }

  const { data: product } = await supabase.from("products").select("name").eq("id", productId).maybeSingle();

  try {
    await sendOrderConfirmationEmail({
      to: email,
      productName: product?.name ?? "NULL//DIVISION",
      size,
      amountCents: amountTotal,
    });
  } catch (e) {
    console.error("order email", { stripeSessionId, error: e });
  }

  console.info("stripe webhook: order processed", {
    eventId: event.id,
    stripeSessionId,
    productId,
    slug,
    remaining: result.remaining,
    productStatus: result.product_status,
  });

  return NextResponse.json({ received: true });
}
