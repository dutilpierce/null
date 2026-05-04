"use client";

type GlitchTextProps = {
  children: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
};

export function GlitchText({ children, className, as: Tag = "span" }: GlitchTextProps) {
  return (
    <Tag
      className={`relative inline-block animate-[flicker_4.5s_ease-in-out_infinite] motion-reduce:animate-none ${className ?? ""}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 translate-x-[0.5px] text-[#00FF9C]/25 blur-[0.3px] motion-reduce:hidden"
      >
        {children}
      </span>
    </Tag>
  );
}
