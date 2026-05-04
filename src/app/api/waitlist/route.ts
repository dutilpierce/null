import { NextResponse } from "next/server";
import { z } from "zod";
import { isServerEnvConfigurationError } from "@/lib/env";
import { createServiceSupabase } from "@/lib/supabase/service";
import { sendWaitlistConfirmationEmail } from "@/lib/emails";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
  phone: z.string().max(32).optional().nullable(),
  source: z.string().max(120).default("unknown"),
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
    return NextResponse.json({ ok: false, error: "Invalid fields." }, { status: 400 });
  }

  const { email, phone, source } = parsed.data;

  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("waitlist").insert({
      email: email.toLowerCase(),
      phone: phone?.trim() || null,
      source,
    });
    if (error) {
      console.error("waitlist insert", error);
      return NextResponse.json({ ok: false, error: "Persistence failed." }, { status: 500 });
    }
  } catch (e) {
    console.error("waitlist env/service", e);
    if (isServerEnvConfigurationError(e)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Waitlist unavailable: required server environment variables are missing or invalid.",
          code: "ENV_MISCONFIGURED",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: false, error: "Server configuration error." }, { status: 500 });
  }

  try {
    await sendWaitlistConfirmationEmail({ to: email });
  } catch (e) {
    console.error("waitlist email", e);
  }

  return NextResponse.json({ ok: true });
}
