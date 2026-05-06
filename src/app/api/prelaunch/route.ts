import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.PRELAUNCH_MODE ?? null;
  const normalized = (raw ?? "").trim().toLowerCase();
  const enabled = ["true", "1", "yes", "on"].includes(normalized);

  return NextResponse.json({
    prelaunch: {
      raw,
      normalized,
      enabled,
    },
    nodeEnv: process.env.NODE_ENV ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}

