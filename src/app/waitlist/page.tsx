import type { Metadata } from "next";
import { WaitlistForm } from "@/components/WaitlistForm";
import { GlitchText } from "@/components/GlitchText";

export const metadata: Metadata = {
  title: "Waitlist",
};

export default function WaitlistPage() {
  return (
    <div className="mx-auto max-w-xl space-y-8 py-4">
      <header className="space-y-3 text-center sm:text-left">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Channel</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#F5F5F5] sm:text-5xl">
          <GlitchText as="span">RECEIVE NEXT TRANSMISSION</GlitchText>
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#6B7280]">ACCESS NEXT ITERATION // SUCCESSOR VERSION PENDING</p>
      </header>
      <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <p className="mb-4 text-sm text-[#9CA3AF]">Submit contact details for successor unlock notices. No promotional cadence implied.</p>
        <WaitlistForm source="waitlist_page" />
      </div>
    </div>
  );
}
