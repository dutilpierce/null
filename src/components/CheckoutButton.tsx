"use client";

import { useState } from "react";
import type { GarmentSize } from "@/lib/constants";

type CheckoutButtonProps = {
  productSlug: string;
  size: GarmentSize;
  disabled?: boolean;
};

export function CheckoutButton({ productSlug, size, disabled }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productSlug, size, quantity: 1 }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout unavailable.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={disabled || loading}
        className="w-full border border-[rgba(255,255,255,0.12)] bg-[#F5F5F5] px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#050505] transition hover:bg-[#00FF9C] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Connecting…" : "Authorize checkout"}
      </button>
      {error ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
