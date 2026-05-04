"use client";

import { useEffect, useState } from "react";

type TypeLineProps = {
  text: string;
  className?: string;
  speedMs?: number;
};

export function TypeLine({ text, className, speedMs = 28 }: TypeLineProps) {
  const [shown, setShown] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setShown("");
    setComplete(false);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      setComplete(true);
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setComplete(true);
      }
    }, speedMs);

    return () => window.clearInterval(id);
  }, [text, speedMs]);

  return (
    <span className={className}>
      {shown}
      {!complete ? <span className="animate-pulse motion-reduce:hidden">▍</span> : null}
    </span>
  );
}
