import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F5F5F5]">Returns</h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-200">
          Draft for legal review — align with consumer protection requirements in your jurisdictions.
        </p>
      </header>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Default policy</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">
          All sales are final unless otherwise required by applicable law. Limited iterations are not restocked; exchanges may be
          operationally constrained.
        </p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Defective goods</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Define defect window, photo evidence process, replacement vs refund]</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">How to request review</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[support email / form]</p>
      </section>
    </div>
  );
}
