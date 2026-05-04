import { remainingUnits } from "@/lib/product-state";
import type { ProductRow } from "@/lib/types";

type InventoryCounterProps = {
  product: Pick<ProductRow, "total_inventory" | "units_sold">;
};

export function InventoryCounter({ product }: InventoryCounterProps) {
  const left = remainingUnits(product);
  return (
    <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">Inventory</p>
      <p className="mt-2 font-mono text-sm text-[#F5F5F5]">
        <span className="text-[#00FF9C]">{left}</span>
        <span className="text-[#9CA3AF]"> / {product.total_inventory} remaining</span>
      </p>
    </div>
  );
}
