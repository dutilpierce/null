import { NextResponse } from "next/server";
import { getHealthPayload } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getHealthPayload();
  /** Always 200 so clients can read the JSON breakdown (Stripe/Resend gaps are expected pre-launch). */
  return NextResponse.json(payload, { status: 200 });
}

