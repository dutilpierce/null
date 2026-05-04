import Link from "next/link";
import type { ProductRow } from "@/lib/types";
import { formatUsd } from "@/lib/format";
import { isSoldOut } from "@/lib/product-state";

export type IterationVisualState = "active" | "sold_out" | "locked" | "archived";

type IterationCardProps = {
  product: ProductRow;
  href?: string;
  visual: IterationVisualState;
  footnote?: string;
};

function badgeLabel(visual: IterationVisualState) {
  switch (visual) {
    case "active":
      return "ACTIVE";
    case "sold_out":
      return "SOLD OUT";
    case "locked":
      return "LOCKED";
    case "archived":
      return "ARCHIVED";
    default:
      return visual;
  }
}

export function IterationCard({ product, href, visual, footnote }: IterationCardProps) {
  const sold = isSoldOut(product);
  const content = (
    <article
      className={`group border p-5 transition ${
        visual === "locked"
          ? "border-[rgba(255,255,255,0.12)] bg-[#050505] opacity-80"
          : "border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] hover:border-[#00FF9C]/35"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">{product.slug}</p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl tracking-tight text-[#F5F5F5] sm:text-2xl">
            {product.name}
          </h3>
        </div>
        <span className="shrink-0 border border-[rgba(255,255,255,0.12)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF9C]">
          {badgeLabel(visual)}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9CA3AF] sm:grid-cols-4">
        <div>
          <dt className="text-[#6B7280]">Units</dt>
          <dd className="text-[#F5F5F5]">{product.total_inventory}</dd>
        </div>
        <div>
          <dt className="text-[#6B7280]">Version</dt>
          <dd className="text-[#F5F5F5]">{product.version}</dd>
        </div>
        <div>
          <dt className="text-[#6B7280]">Price</dt>
          <dd className="text-[#F5F5F5]">{formatUsd(product.price_cents)}</dd>
        </div>
        <div>
          <dt className="text-[#6B7280]">Deploy</dt>
          <dd className="text-[#F5F5F5]">{sold ? "DEPLETED" : visual === "locked" ? "PENDING" : "LIVE"}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-relaxed text-[#9CA3AF]">{product.description}</p>
      {footnote ? <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B7280]">{footnote}</p> : null}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF9C]">
        {content}
      </Link>
    );
  }

  return content;
}
