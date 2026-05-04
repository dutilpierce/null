import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout interrupted",
};

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Stripe session</p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#F5F5F5] sm:text-5xl">CHECKOUT INTERRUPTED</h1>
      <p className="text-sm leading-relaxed text-[#9CA3AF]">Iteration ND_01 remains active while inventory exists.</p>
      <Link
        href="/drop/current"
        className="inline-flex border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5F5F5] transition hover:border-[#00FF9C]/55 hover:text-[#00FF9C]"
      >
        Return to product
      </Link>
    </div>
  );
}
