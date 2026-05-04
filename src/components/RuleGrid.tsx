type RuleGridProps = {
  rules: string[];
};

export function RuleGrid({ rules }: RuleGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rules.map((rule) => (
        <div
          key={rule}
          className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-4 py-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-[#F5F5F5]"
        >
          {rule}
        </div>
      ))}
    </div>
  );
}
