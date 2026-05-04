"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownPanelProps = {
  targetIso: string;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownPanel({ targetIso }: CountdownPanelProps) {
  const targetMs = useMemo(() => Date.parse(targetIso), [targetIso]);
  const targetValid = Number.isFinite(targetMs);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!targetValid) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [targetValid, targetMs]);

  if (!targetValid) {
    return (
      <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">Countdown</p>
        <p className="mt-2 text-sm text-[#9CA3AF]">Invalid countdown target in site settings.</p>
      </div>
    );
  }

  const remaining = now === null ? 0 : Math.max(0, targetMs - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-5 py-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">Countdown</p>
      <div className="grid grid-cols-4 gap-3 text-center font-mono text-sm text-[#F5F5F5] sm:text-base">
        <div>
          <div className="text-[#00FF9C]">{pad(days)}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-[#9CA3AF]">D</div>
        </div>
        <div>
          <div className="text-[#00FF9C]">{pad(hours)}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-[#9CA3AF]">H</div>
        </div>
        <div>
          <div className="text-[#00FF9C]">{pad(minutes)}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-[#9CA3AF]">M</div>
        </div>
        <div>
          <div className="text-[#00FF9C]">{pad(seconds)}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-[#9CA3AF]">S</div>
        </div>
      </div>
    </div>
  );
}
