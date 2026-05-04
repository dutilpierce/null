type SystemStatusBarProps = {
  lines: string[];
  className?: string;
};

export function SystemStatusBar({ lines, className }: SystemStatusBarProps) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-4xl border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#9CA3AF]",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex flex-col items-center justify-center gap-1 text-center sm:flex-row sm:flex-wrap sm:gap-x-6">
        {lines.map((line) => (
          <span key={line} className="text-[#F5F5F5]/90">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
