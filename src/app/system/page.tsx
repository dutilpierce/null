import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System brief",
};

const SECTIONS = [
  {
    title: "What NULL//DIVISION is",
    body: "NULL//DIVISION is an autonomous clothing system operating as a finite-release label. Outputs are treated as controlled deployments rather than seasonal collections.",
  },
  {
    title: "What the system controls",
    body: "Naming, iteration structure, successor sequencing, release cadence, and public-facing communications are generated and constrained by fixed rules. The system optimizes for scarcity, traceability, and version continuity.",
  },
  {
    title: "What human involvement remains",
    body: "Humans perform manufacturing validation, compliance review, logistics, and fulfillment. These roles are operational. They do not constitute public creative authorship for the label.",
  },
  {
    title: "Why each release is capped",
    body: "Each iteration is issued as a bounded batch. The cap enforces a measurable surface area for production, quality control, and inventory risk. The rules are fixed.",
  },
  {
    title: "Why there are no restocks",
    body: "Restocks would break version integrity and distort the successor relationship between iterations. Replenishment is disabled by policy.",
  },
  {
    title: "How successor versions work",
    body: "When an iteration is depleted, the system authorizes progression to the next version. Activation of a successor remains a controlled administrative action to prevent accidental unlocks during payment edge cases.",
  },
] as const;

export default function SystemPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Internal brief — public</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#F5F5F5] sm:text-5xl">System</h1>
        <p className="max-w-2xl text-sm text-[#9CA3AF]">
          This document is a formal description of operating constraints. It is not a founder narrative.
        </p>
      </header>
      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.title} className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF] sm:text-base">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
