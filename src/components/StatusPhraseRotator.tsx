"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StatusPhraseRotatorProps = {
  phrases: string[];
  /** Total time per phrase cycle (ms). */
  stepMs?: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function StatusPhraseRotator({ phrases, stepMs = 2600 }: StatusPhraseRotatorProps) {
  const safePhrases = useMemo(() => phrases.filter((p) => p.trim().length > 0), [phrases]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [flickerOn, setFlickerOn] = useState(true);
  const timers = useRef<number[]>([]);
  const flickerTimer = useRef<number | null>(null);
  const phrase = safePhrases[idx] ?? safePhrases[0] ?? "";
  const phrasesKey = useMemo(() => safePhrases.join("\n"), [safePhrases]);

  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (flickerTimer.current != null) window.clearInterval(flickerTimer.current);
    flickerTimer.current = null;

    if (!phrase) return;
    if (prefersReducedMotion() || safePhrases.length <= 1) {
      setPhase("hold");
      setFlickerOn(false);
      return;
    }

    // If the phrase list changes and idx is out of bounds, reset cleanly.
    if (idx >= safePhrases.length) {
      setIdx(0);
      return;
    }

    // Entry: brief electrical flicker, then hold, then fade out.
    setPhase("enter");
    setFlickerOn(true);
    flickerTimer.current = window.setInterval(() => setFlickerOn((v) => !v), 48);

    timers.current.push(
      window.setTimeout(() => {
        if (flickerTimer.current != null) window.clearInterval(flickerTimer.current);
        flickerTimer.current = null;
        setFlickerOn(false);
        setPhase("hold");
      }, 220),
    );

    const holdMs = Math.max(1500, Math.min(2500, stepMs - 520));
    timers.current.push(
      window.setTimeout(() => {
        setPhase("exit");
      }, 220 + holdMs),
    );

    timers.current.push(
      window.setTimeout(() => {
        setIdx((v) => (v + 1) % safePhrases.length);
      }, stepMs),
    );

    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      if (flickerTimer.current != null) window.clearInterval(flickerTimer.current);
      flickerTimer.current = null;
    };
  }, [idx, phrase, phrasesKey, safePhrases.length, stepMs]);

  if (!phrase) return null;

  return (
    <>
      <span
        className={[
          "inline-block",
          "nd-signal-phrase",
          phase === "enter" ? "nd-signal-enter" : "",
          phase === "hold" ? "nd-signal-hold" : "",
          phase === "exit" ? "nd-signal-exit" : "",
          flickerOn ? "nd-signal-flicker" : "",
        ].join(" ")}
      >
        {phrase}
      </span>
      <style jsx>{`
        .nd-signal-phrase {
          opacity: 1; /* Always render text; phases control perceived visibility */
          transform: translateY(0px);
          filter: saturate(0.92);
          transition:
            opacity 420ms ease,
            filter 420ms ease,
            transform 420ms ease,
            text-shadow 420ms ease;
        }

        .nd-signal-enter {
          opacity: 0.88;
          filter: brightness(1.08) contrast(1.12) saturate(0.98);
          text-shadow: 0 0 10px rgba(0, 255, 156, 0.06);
        }

        .nd-signal-hold {
          opacity: 0.98;
          filter: brightness(1.02) contrast(1.05) saturate(0.95);
          text-shadow: 0 0 10px rgba(0, 255, 156, 0.04);
        }

        .nd-signal-exit {
          opacity: 0;
          filter: brightness(0.92) contrast(1.02) saturate(0.92);
          text-shadow: none;
        }

        .nd-signal-flicker {
          opacity: 0.5;
        }

        @media (prefers-reduced-motion: reduce) {
          .nd-signal-phrase {
            opacity: 1;
            transform: none;
            filter: none;
            text-shadow: none;
            transition: none;
          }
        }
      `}</style>
    </>
  );
}

