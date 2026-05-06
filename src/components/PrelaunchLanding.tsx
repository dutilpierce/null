import Link from "next/link";
import { CountdownPanel } from "@/components/CountdownPanel";
import { WaitlistForm } from "@/components/WaitlistForm";

type PrelaunchLandingProps = {
  targetIso: string;
};

const SIGNAL_BLOCKS = [
  {
    title: "Limited",
    body: "First-wave access is capped. When it closes, it closes.",
  },
  {
    title: "Intentional",
    body: "No noise. No restocks. Only the opening transmission.",
  },
  {
    title: "Precision",
    body: "One iteration at a time. Every unit accounted for.",
  },
] as const;

export function PrelaunchLanding({ targetIso }: PrelaunchLandingProps) {
  return (
    <div className="space-y-16 sm:space-y-20">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.42em] text-[#9CA3AF]">Arriving soon</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[#F5F5F5] sm:text-6xl">
          Something rare is coming.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
          NULL//DIVISION opens with a controlled first release. Access arrives in a short window, then disappears.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="#early-access"
            className="inline-flex items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[#F5F5F5] px-5 py-3 text-center font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#050505] transition hover:bg-[#00FF9C]"
          >
            Get early access
          </Link>
          <Link
            href="#window"
            className="inline-flex items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-5 py-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5F5F5] transition hover:border-[#00FF9C]/55 hover:text-[#00FF9C]"
          >
            Be first in
          </Link>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <CountdownPanel targetIso={targetIso} />
        </div>
      </header>

      <section id="early-access" className="mx-auto max-w-xl space-y-4 scroll-mt-24">
        <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">Request early access</p>
          <p className="mb-5 text-sm text-[#9CA3AF]">
            Limited first-wave access. No noise. Just the opening signal.
          </p>
          <WaitlistForm source="prelaunch" showPhone={false} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {SIGNAL_BLOCKS.map((b) => (
          <div key={b.title} className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#00FF9C]">{b.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF]">{b.body}</p>
          </div>
        ))}
      </section>

      <section className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-10 sm:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Signal artifact</p>
          <p className="mt-4 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[#F5F5F5] sm:text-4xl">
            Identity is not loaded yet.
          </p>
          <div className="mx-auto mt-6 max-w-2xl border border-[rgba(255,255,255,0.10)] bg-[#050505] px-5 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9CA3AF]">
              A release is forming behind the blackout.
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              The system reveals only what it must, only when the window opens.
            </p>
          </div>
        </div>
      </section>

      <section id="window" className="mx-auto max-w-3xl space-y-4 text-center scroll-mt-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Launch window</p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[#F5F5F5] sm:text-4xl">
          30 days until first access.
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
          The opening window will be limited. When launch begins, this page disappears.
        </p>
      </section>

      <section className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-8 text-center sm:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Final transmission</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[#F5F5F5] sm:text-4xl">
          Be early, or watch it happen from the outside.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[#9CA3AF] sm:text-base">
          The first release won’t wait. Secure your place before the signal goes live.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="#early-access"
            className="inline-flex items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[#F5F5F5] px-5 py-3 text-center font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#050505] transition hover:bg-[#00FF9C]"
          >
            Get early access
          </Link>
          <Link
            href="/iterations"
            className="inline-flex items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-5 py-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5F5F5] transition hover:border-[#00FF9C]/55 hover:text-[#00FF9C]"
          >
            Observe the archive
          </Link>
        </div>
      </section>
    </div>
  );
}

