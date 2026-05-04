"use client";

import { useMemo, useState } from "react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { InventoryCounter } from "@/components/InventoryCounter";
import { SizeSelector } from "@/components/SizeSelector";
import { WaitlistForm } from "@/components/WaitlistForm";
import type { GarmentSize } from "@/lib/constants";
import { isPurchaseable, isSoldOut } from "@/lib/product-state";
import type { ProductRow } from "@/lib/types";

type DropPurchaseProps = {
  product: ProductRow;
  blackout: boolean;
  imagesPresent: boolean;
};

export function DropPurchase({ product, blackout, imagesPresent }: DropPurchaseProps) {
  const [size, setSize] = useState<GarmentSize>("M");

  const soldOut = isSoldOut(product);
  const canBuy = useMemo(() => isPurchaseable(product, blackout), [product, blackout]);

  return (
    <div className="space-y-6">
      <InventoryCounter product={product} />
      <SizeSelector value={size} onChange={setSize} disabled={!canBuy} />
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#9CA3AF]">Quantity</p>
        <p className="text-sm text-[#F5F5F5]">Locked to 1 unit per order.</p>
      </div>
      <CheckoutButton productSlug={product.slug} size={size} disabled={!canBuy} />
      {!canBuy ? (
        <div className="space-y-3 border border-[rgba(255,255,255,0.12)] bg-[#050505] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">
            {blackout ? "Blackout" : soldOut ? "Inventory" : "State"}
          </p>
          <p className="text-sm text-[#9CA3AF]">
            {blackout
              ? "Checkout disabled while blackout is active."
              : soldOut
                ? "Iteration depleted. Join the successor waitlist."
                : "Iteration not authorized for purchase."}
          </p>
          <WaitlistForm source="drop_nd01_waitlist" />
        </div>
      ) : null}
      <p className="text-xs leading-relaxed text-[#6B7280]">
        All sales final unless otherwise required by law. No restocks. Numbered run. Replenishment disabled by system rule.
      </p>
      {!imagesPresent ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">Gallery assets use placeholder paths until final renders are mounted in /public/products.</p>
      ) : null}
    </div>
  );
}
