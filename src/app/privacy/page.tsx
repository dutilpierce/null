import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F5F5F5]">Privacy</h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-200">
          Draft for legal review — replace placeholders before launch.
        </p>
      </header>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Data controller</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Insert legal entity name and address]</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">What is collected</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[#9CA3AF]">
          <li>Email addresses and optional phone numbers submitted through waitlist forms.</li>
          <li>Order identifiers, email, size selection, and payment totals processed by Stripe.</li>
          <li>Basic technical logs required for security and fraud prevention (IP, user agent) where applicable.</li>
        </ul>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Why it is processed</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">
          To operate waitlists, fulfill purchases, send transactional notices, and meet legal obligations.
        </p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Processors</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">
          Supabase (database), Stripe (payments), Resend (email), Vercel (hosting). Subprocessor lists must be verified contractually.
        </p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Retention</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Define retention windows] Transactional records may be retained as required for tax and compliance.</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Rights</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[Jurisdiction-specific rights language — GDPR / CCPA / other]</p>
      </section>
      <section className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F5F5]">Contact</h2>
        <p className="text-sm leading-relaxed text-[#9CA3AF]">[privacy contact email]</p>
      </section>
    </div>
  );
}
