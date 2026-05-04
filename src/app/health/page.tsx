export const dynamic = "force-dynamic";

type Health = {
  ok: boolean;
  env: { ok: boolean; missingKeys: string[] };
  supabase: { configured: boolean; ok: boolean };
};

async function getHealth(): Promise<Health | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/health`, {
      cache: "no-store",
    });
    const json = (await res.json()) as unknown;
    if (!json || typeof json !== "object") return null;
    return json as Health;
  } catch {
    return null;
  }
}

export default async function HealthPage() {
  const health = await getHealth();

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <header className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Diagnostics</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#F5F5F5] sm:text-5xl">Health</h1>
        <p className="text-sm text-[#9CA3AF]">Lightweight server-side checks. No secrets are shown.</p>
      </header>

      {!health ? (
        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6 text-sm text-[#9CA3AF]">
          Unable to load health status. Ensure the dev server is running and `/api/health` is reachable.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Overall</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">
                {health.ok ? "OK" : "DEGRADED"}
              </span>
            </div>
          </div>

          <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Server env</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">
                {health.env.ok ? "OK" : "MISSING"}
              </span>
            </div>
            {!health.env.ok ? (
              <p className="mt-3 text-sm text-[#9CA3AF]">
                Missing/invalid keys: <span className="text-[#F5F5F5]">{health.env.missingKeys.join(", ") || "unknown"}</span>
              </p>
            ) : null}
          </div>

          <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Supabase</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">
                {health.supabase.configured ? (health.supabase.ok ? "OK" : "ERROR") : "NOT CONFIGURED"}
              </span>
            </div>
          </div>

          <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6 text-sm text-[#9CA3AF]">
            API: <span className="text-[#F5F5F5]">/api/health</span>
          </div>
        </div>
      )}
    </div>
  );
}

