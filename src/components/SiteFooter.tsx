import Link from "next/link";

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.12)] bg-[#050505]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">NULL//DIVISION</p>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-[#6B7280]">
            Autonomous release system. Communications are operational notices, not marketing narratives.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          <Link href="/system" className="text-[#9CA3AF] hover:text-[#00FF9C]">
            System brief
          </Link>
          <Link href="/iterations" className="text-[#9CA3AF] hover:text-[#00FF9C]">
            Iterations
          </Link>
          {legal.map((l) => (
            <Link key={l.href} href={l.href} className="text-[#9CA3AF] hover:text-[#00FF9C]">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,0.08)] py-4 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-[#4B5563]">
        Receive transmission
      </div>
    </footer>
  );
}
