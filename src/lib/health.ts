import { tryParseServerEnv } from "@/lib/env";
import { createPublicSupabase } from "@/lib/supabase/public";

function prelaunchFromEnv(): { raw: string | null; enabled: boolean } {
  const raw = process.env.PRELAUNCH_MODE ?? null;
  const normalized = (raw ?? "").trim().toLowerCase();
  const enabled = ["true", "1", "yes", "on"].includes(normalized);
  return { raw: raw === null || raw === undefined ? null : raw, enabled };
}

function publicCatalogEnvMissing(): string[] {
  const missing: string[] = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  else {
    try {
      new URL(url);
    } catch {
      missing.push("NEXT_PUBLIC_SUPABASE_URL");
    }
  }
  if (!anon) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    try {
      new URL(site);
    } catch {
      missing.push("NEXT_PUBLIC_SITE_URL");
    }
  }
  return missing;
}

export type HealthPayload = {
  /** Overall: public pages can render with real or fallback catalog data. */
  ok: boolean;
  /** True when checkout, webhooks, waitlist email, or service Supabase need full server secrets. */
  serverEnvComplete: boolean;
  prelaunch: {
    enabled: boolean;
    raw: string | null;
  };
  /** Client-visible Supabase; when incomplete, app uses embedded fallback catalog (demo-safe). */
  publicEnv: {
    ok: boolean;
    missingKeys: string[];
  };
  /** All secrets required by server routes (stripe, resend, service role, etc.). */
  serverEnv: {
    ok: boolean;
    missingKeys: string[];
  };
  supabase: {
    configured: boolean;
    ok: boolean;
  };
};

export async function getHealthPayload(): Promise<HealthPayload> {
  const prelaunch = prelaunchFromEnv();
  const publicMissing = publicCatalogEnvMissing();
  const full = tryParseServerEnv();
  const serverMissingKeys = full.success ? [] : Object.keys(full.fieldErrors ?? {}).filter(Boolean);

  const supabase = createPublicSupabase();
  let supabaseOk = false;
  if (supabase) {
    const { error } = await supabase.from("site_settings").select("id").limit(1);
    supabaseOk = !error;
  }

  const publicEnvOk = publicMissing.length === 0;
  const serverEnvOk = full.success;
  /**
   * Public pages can show real catalog data: if Supabase env is set, expect a successful ping.
   * If public env is missing, the app serves an embedded fallback catalog (demo still works).
   */
  const ok = publicEnvOk ? Boolean(supabase) && supabaseOk : true;

  return {
    ok,
    serverEnvComplete: serverEnvOk,
    prelaunch: {
      enabled: prelaunch.enabled,
      raw: prelaunch.raw,
    },
    publicEnv: {
      ok: publicEnvOk,
      missingKeys: publicMissing,
    },
    serverEnv: {
      ok: serverEnvOk,
      missingKeys: serverMissingKeys,
    },
    supabase: {
      configured: Boolean(supabase),
      ok: supabaseOk,
    },
  };
}
