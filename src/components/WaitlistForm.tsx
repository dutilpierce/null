"use client";

import { useState } from "react";

type WaitlistFormProps = {
  source: string;
  showPhone?: boolean;
  className?: string;
};

export function WaitlistForm({ source, showPhone = true, className }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, phone: showPhone ? phone : undefined, source }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Request failed.");
        return;
      }
      setStatus("success");
      setMessage("Transmission received.");
      setEmail("");
      setPhone("");
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className ?? ""}`}>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor={`email-${source}`} className="mb-1 block font-mono text-[10px] uppercase tracking-[0.24em] text-[#9CA3AF]">
            Email
          </label>
          <input
            id={`email-${source}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[rgba(255,255,255,0.12)] bg-[#050505] px-3 py-2.5 text-sm text-[#F5F5F5] outline-none ring-[#00FF9C]/0 transition focus:border-[#00FF9C]/60 focus:ring-2 focus:ring-[#00FF9C]/25"
            placeholder="you@domain"
          />
        </div>
        {showPhone ? (
          <div>
            <label htmlFor={`phone-${source}`} className="mb-1 block font-mono text-[10px] uppercase tracking-[0.24em] text-[#9CA3AF]">
              Phone (optional)
            </label>
            <input
              id={`phone-${source}`}
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-[rgba(255,255,255,0.12)] bg-[#050505] px-3 py-2.5 text-sm text-[#F5F5F5] outline-none transition focus:border-[#00FF9C]/60 focus:ring-2 focus:ring-[#00FF9C]/25"
              placeholder="+1"
            />
          </div>
        ) : null}
      </div>
      <input type="hidden" name="source" value={source} readOnly />
      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex w-full items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5F5F5] transition hover:border-[#00FF9C]/55 hover:text-[#00FF9C] hover:shadow-[0_0_24px_rgba(0,255,156,0.12)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {status === "loading" ? "Submitting…" : "Receive transmission"}
      </button>
      {message ? (
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.16em] ${
            status === "success" ? "text-[#00FF9C]" : "text-red-300"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
