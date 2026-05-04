import { TypeLine } from "@/components/TypeLine";
import { StatusPhraseRotator } from "@/components/StatusPhraseRotator";

type TerminalHeroProps = {
  mode: "blackout" | "live";
  blackoutStatusLines?: string[];
};

const BLACKOUT_DEFAULT_LINES = ["SIGNAL PENDING", "ACCESS RESTRICTED", "TRANSMISSION INBOUND"];

export function TerminalHero({ mode, blackoutStatusLines }: TerminalHeroProps) {
  if (mode === "blackout") {
    const lines = blackoutStatusLines?.length ? blackoutStatusLines : BLACKOUT_DEFAULT_LINES;
    return (
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.42em] text-[#9CA3AF]">System</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[#F5F5F5] sm:text-6xl">
          <TypeLine text="NULL//DIVISION" className="text-[#F5F5F5]" />
        </h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.32em] text-[#00FF9C]">
          AUTONOMOUS CLOTHING SYSTEM
        </p>
        <div className="mx-auto mt-10 max-w-xl border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-4 py-3">
          <div className="flex min-h-[72px] items-center justify-center text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]/90">
            <StatusPhraseRotator phrases={lines} stepMs={2600} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="mx-auto max-w-4xl">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.42em] text-[#9CA3AF]">Live channel</p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight text-[#F5F5F5] sm:text-6xl">
        <TypeLine text="THIS BRAND HAS NO DESIGNER." />
      </h1>
      <p className="mt-5 max-w-2xl font-mono text-[12px] uppercase tracking-[0.18em] text-[#00FF9C]">
        Generated. Not Designed.
      </p>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
        NULL//DIVISION operates as an autonomous clothing system. Every name, garment, release structure, and
        successor version is system-generated. Human involvement is restricted to manufacturing, validation,
        logistics, and fulfillment.
      </p>
    </header>
  );
}
