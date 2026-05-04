import type { ProductRow } from "@/lib/types";
import { remainingUnits } from "@/lib/product-state";

type ProductDetailPanelProps = {
  product: ProductRow;
  successorLabel: string;
};

export function ProductDetailPanel({ product, successorLabel }: ProductDetailPanelProps) {
  const left = remainingUnits(product);
  const status =
    product.status === "sold_out" || left <= 0 ? "SOLD OUT" : product.status === "active" ? "ACTIVE" : product.status.toUpperCase();

  return (
    <aside className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">System panel</p>
      <dl className="space-y-2 font-mono text-[11px] uppercase tracking-[0.16em]">
        <div className="flex justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-2 text-[#9CA3AF]">
          <dt>Status</dt>
          <dd className="text-[#F5F5F5]">{status}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-2 text-[#9CA3AF]">
          <dt>Inventory</dt>
          <dd className="text-right text-[#F5F5F5]">
            {left} / {product.total_inventory} remaining
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-2 text-[#9CA3AF]">
          <dt>Replenishment</dt>
          <dd className="text-[#F5F5F5]">Disabled</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-2 text-[#9CA3AF]">
          <dt>Successor</dt>
          <dd className="text-right text-[#F5F5F5]">{successorLabel}</dd>
        </div>
        <div className="flex justify-between gap-4 pt-1 text-[#9CA3AF]">
          <dt>Human revision</dt>
          <dd className="text-[#F5F5F5]">Removed</dd>
        </div>
      </dl>
    </aside>
  );
}
