import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/iterations", label: "Iterations" },
  { href: "/system", label: "System" },
  { href: "/waitlist", label: "Waitlist" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.12)] bg-[#050505]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group font-mono text-[11px] uppercase tracking-[0.28em] text-[#F5F5F5]">
          NULL<span className="text-[#00FF9C]">//</span>DIVISION
          <span className="mt-1 block h-px max-w-0 bg-[#00FF9C] transition-all group-hover:max-w-full" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF] transition hover:text-[#00FF9C] hover:drop-shadow-[0_0_12px_rgba(0,255,156,0.35)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/drop/current"
            className="border border-[rgba(255,255,255,0.12)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#F5F5F5] transition hover:border-[#00FF9C]/55 hover:text-[#00FF9C]"
          >
            Current drop
          </Link>
        </nav>
        <details className="relative sm:hidden">
          <summary className="cursor-pointer list-none border border-[rgba(255,255,255,0.12)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#F5F5F5] marker:content-none">
            Menu
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-56 border border-[rgba(255,255,255,0.12)] bg-[#050505] p-2 shadow-[0_16px_60px_rgba(0,0,0,0.65)]">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF] hover:bg-[#0A0A0A] hover:text-[#00FF9C]"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/drop/current" className="block px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#F5F5F5] hover:bg-[#0A0A0A]">
              Current drop
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
