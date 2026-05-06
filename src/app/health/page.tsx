export const dynamic = "force-dynamic";

import { getHealthPayload } from "@/lib/health";

export default async function HealthPage() {
  const health = await getHealthPayload();

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <header className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Diagnostics</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#F5F5F5] sm:text-5xl">Health</h1>
        <p className="text-sm text-[#9CA3AF]">
          Lightweight checks. Values for sensitive env vars are never shown here. On Vercel, “Sensitive” keys look empty after save—that is
          expected.
        </p>
      </header>

      <div className="space-y-4">
        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Catalog (public reads)</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">{health.ok ? "OK" : "DEGRADED"}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#9CA3AF]">
            If Supabase URL/anon are missing, the site still renders using an embedded demo catalog.
          </p>
        </div>

        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Prelaunch homepage</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">
              {health.prelaunch.enabled ? "ON" : "OFF"}
            </span>
          </div>
          <p className="mt-3 text-xs text-[#9CA3AF]">
            Set{" "}
            <span className="text-[#F5F5F5]">
              PRELAUNCH_MODE=true
            </span>{" "}
            in Vercel and redeploy. Value can be masked in the dashboard if the var is Sensitive.
          </p>
        </div>

        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Public env</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">
              {health.publicEnv.ok ? "OK" : "MISSING"}
            </span>
          </div>
          {!health.publicEnv.ok ? (
            <p className="mt-3 text-sm text-[#9CA3AF]">
              Missing or invalid:{" "}
              <span className="text-[#F5F5F5]">{health.publicEnv.missingKeys.join(", ") || "unknown"}</span>
            </p>
          ) : null}
        </div>

        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Full server env</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">
              {health.serverEnvComplete ? "COMPLETE" : "INCOMPLETE"}
            </span>
          </div>
          {!health.serverEnv.ok ? (
            <p className="mt-3 text-sm text-[#9CA3AF]">
              Needed for checkout, Stripe webhook, waitlist persistence, confirmation email:{" "}
              <span className="text-[#F5F5F5]">{health.serverEnv.missingKeys.join(", ") || "unknown"}</span>
            </p>
          ) : (
            <p className="mt-3 text-xs text-[#9CA3AF]">All server secrets from env schema are present.</p>
          )}
        </div>

        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Supabase ping</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">
              {!health.supabase.configured ? "NOT CONFIGURED" : health.supabase.ok ? "OK" : "ERROR"}
            </span>
          </div>
        </div>

        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6 text-sm text-[#9CA3AF]">
          API: <span className="text-[#F5F5F5]">/api/health</span> (includes the same payload as JSON)
        </div>
      </div>
    </div>
  );
}
