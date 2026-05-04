import type { Metadata } from "next";
import { IterationCard, type IterationVisualState } from "@/components/IterationCard";
import { getProducts } from "@/lib/data/catalog";
import { isSoldOut } from "@/lib/product-state";
import type { ProductRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Iterations",
};

function visualForArchive(product: Pick<ProductRow, "status" | "active" | "total_inventory" | "units_sold">): IterationVisualState {
  if (product.status === "locked") return "locked";
  if (isSoldOut(product)) return "archived";
  if (product.status === "active" && product.active) return "active";
  return "sold_out";
}

export default async function IterationsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Archive</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#F5F5F5] sm:text-5xl">Iterations</h1>
        <p className="max-w-2xl text-sm text-[#9CA3AF]">
          Deployed garments are listed as system iterations. States reflect inventory, authorization, and successor gating.
        </p>
      </header>
      <div className="grid gap-5">
        {products.map((p) => (
          <IterationCard
            key={p.id}
            product={p}
            href={p.slug === "nd-01-base-error-tee" ? "/drop/current" : undefined}
            visual={visualForArchive(p)}
            footnote={p.slug === "nd-02-signal-decay-tee" ? "Successor version pending manual activation." : undefined}
          />
        ))}
      </div>
    </div>
  );
}
