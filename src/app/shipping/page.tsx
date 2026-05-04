import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F5F5F5]">Shipping</h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-200">
          Draft for operations + legal review — replace placeholders before launch.
        </p>
      </header>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Regions</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">
          Checkout currently collects shipping addresses for [United States / Canada — align with Stripe Checkout configuration].
        </p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Carriers</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[USPS / UPS / FedEx — specify]</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Processing time</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Insert SLA] Orders are batched for fulfillment after payment confirmation.</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Tracking</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Describe when tracking is sent and through which channel]</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Lost packages</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Carrier claims process]</p>
      </section>
    </div>
  );
}
