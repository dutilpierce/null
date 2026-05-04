"use client";

import { ALLOWED_SIZES, type GarmentSize } from "@/lib/constants";

type SizeSelectorProps = {
  value: GarmentSize;
  onChange: (s: GarmentSize) => void;
  disabled?: boolean;
};

export function SizeSelector({ value, onChange, disabled }: SizeSelectorProps) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#9CA3AF]">Size</p>
      <div className="flex flex-wrap gap-2">
        {ALLOWED_SIZES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => onChange(s)}
            className={`min-w-[52px] border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition ${
              value === s
                ? "border-[#00FF9C]/70 text-[#00FF9C] shadow-[0_0_16px_rgba(0,255,156,0.12)]"
                : "border-[rgba(255,255,255,0.12)] text-[#F5F5F5] hover:border-[#00FF9C]/35"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
