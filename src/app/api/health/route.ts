import { NextResponse } from "next/server";
import { tryParseServerEnv } from "@/lib/env";
import { createPublicSupabase } from "@/lib/supabase/public";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HealthPayload = {
  ok: boolean;
  env: {
    ok: boolean;
    missingKeys: string[];
  };
  supabase: {
    configured: boolean;
    ok: boolean;
  };
};

export async function GET() {
  const envResult = tryParseServerEnv();
  const missingKeys = envResult.success ? [] : Object.keys(envResult.fieldErrors ?? {}).filter(Boolean);

  const supabase = createPublicSupabase();
  let supabaseOk = false;
  if (supabase) {
    const { error } = await supabase.from("site_settings").select("id").limit(1);
    supabaseOk = !error;
  }

  const payload: HealthPayload = {
    ok: envResult.success && Boolean(supabase) && supabaseOk,
    env: {
      ok: envResult.success,
      missingKeys,
    },
    supabase: {
      configured: Boolean(supabase),
      ok: supabaseOk,
    },
  };

  return NextResponse.json(payload, { status: payload.ok ? 200 : 503 });
}

