import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F5F5F5]">Terms of sale</h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-200">
          Draft for legal review — replace placeholders before launch.
        </p>
      </header>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Agreement</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">
          By completing checkout, you agree to these terms and the returns/shipping policies linked in the footer.
        </p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Product</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">
          Goods are offered as limited iterations. Descriptions and imagery are provided for identification. Minor variance may occur
          within manufacturing tolerance.
        </p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Pricing and taxes</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Specify tax handling] Stripe calculates tax if enabled in the merchant account.</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Acceptance</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">Orders are accepted upon successful payment capture and valid inventory allocation.</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Prohibited use</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Resale policy if any — automated purchasing restrictions, etc.]</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Limitation of liability</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Jurisdiction-specific limitation clause to be drafted by counsel]</p>
      </section>
    </div>
  );
}
