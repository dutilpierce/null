const STEPS = [
  "01 — Signal",
  "02 — Iteration generated",
  "03 — Release authorized",
  "04 — Inventory depleted",
  "05 — Successor version unlocked",
] as const;

export function IterationTimeline() {
  return (
    <ol className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-5">
      {STEPS.map((s) => (
        <li key={s} className="flex items-start gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">
          <span className="mt-[2px] text-[#00FF9C]">▹</span>
          <span className="text-[#F5F5F5]">{s}</span>
        </li>
      ))}
    </ol>
  );
}
