import { NextResponse } from "next/server";
import { z } from "zod";
import { ALLOWED_SIZES } from "@/lib/constants";
import { createServiceSupabase } from "@/lib/supabase/service";
import { getPublicSiteUrl, isServerEnvConfigurationError } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { isPurchaseable, remainingUnits } from "@/lib/product-state";

export const runtime = "nodejs";

const bodySchema = z.object({
  productSlug: z.string().min(1),
  size: z.enum(ALLOWED_SIZES),
  quantity: z.literal(1),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid checkout payload." }, { status: 400 });
  }

  const { productSlug, size } = parsed.data;

  try {
    const supabase = createServiceSupabase();
    const { data: settings, error: settingsError } = await supabase
      .from("site_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (settingsError || !settings) {
      return NextResponse.json({ ok: false, error: "System settings unavailable." }, { status: 500 });
    }

    if (settings.blackout_mode) {
      return NextResponse.json({ ok: false, error: "Blackout active. Checkout disabled." }, { status: 403 });
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", productSlug)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
    }

    const purchaseable = isPurchaseable(product, Boolean(settings.blackout_mode));
    if (!purchaseable) {
      return NextResponse.json({ ok: false, error: "Iteration unavailable." }, { status: 409 });
    }

    if (remainingUnits(product) <= 0) {
      return NextResponse.json({ ok: false, error: "Inventory depleted." }, { status: 409 });
    }

    const priceCents = Number(product.price_cents);
    if (!Number.isFinite(priceCents) || priceCents <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid product price configuration." }, { status: 500 });
    }

    const stripe = getStripe();
    const origin = getPublicSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: priceCents,
            product_data: {
              name: String(product.name),
              metadata: {
                product_slug: String(product.slug),
              },
            },
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      phone_number_collection: { enabled: true },
      metadata: {
        product_id: String(product.id),
        slug: String(product.slug),
        selected_size: size,
        version: String(product.version),
        // Backwards-compatible keys (keep for any legacy consumers / older webhooks).
        product_slug: String(product.slug),
        size,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    if (!session.url) {
      return NextResponse.json({ ok: false, error: "Stripe session missing URL." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    console.error("checkout", e);
    if (isServerEnvConfigurationError(e)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Checkout unavailable: required server environment variables are missing or invalid.",
          code: "ENV_MISCONFIGURED",
        },
        { status: 503 },
      );
    }
    const message = e instanceof Error ? e.message : "Checkout failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
