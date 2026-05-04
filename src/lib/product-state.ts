import type { ProductRow } from "@/lib/types";

export function remainingUnits(product: Pick<ProductRow, "total_inventory" | "units_sold">): number {
  return Math.max(0, product.total_inventory - product.units_sold);
}

export function isSoldOut(product: Pick<ProductRow, "total_inventory" | "units_sold" | "status">): boolean {
  return product.status === "sold_out" || remainingUnits(product) <= 0;
}

export function isPurchaseable(
  product: Pick<ProductRow, "active" | "status" | "total_inventory" | "units_sold">,
  blackout: boolean,
): boolean {
  if (blackout) return false;
  if (!product.active) return false;
  if (product.status !== "active") return false;
  return remainingUnits(product) > 0;
}
