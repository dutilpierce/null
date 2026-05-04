"use client";

import { useState } from "react";

export type GalleryImageItem = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
};

type ProductGalleryProps = {
  images: GalleryImageItem[];
  productName: string;
};

function isLocalPublicImageUrl(src: string): boolean {
  const s = src.trim();
  return s.startsWith("/") && !s.startsWith("//");
}

function isSafeRemoteImageUrl(src: string): boolean {
  try {
    const u = new URL(src);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

type GalleryImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

function GalleryImage({ src, alt, sizes, className, priority }: GalleryImageProps) {
  if (!isSafeRemoteImageUrl(src)) {
    // Local public assets (e.g. /products/...) and any other relative paths.
    // We intentionally use <img> to avoid coupling the gallery to Next image optimization.
    if (isLocalPublicImageUrl(src)) {
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className ?? ""}`}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
      );
    }

    return <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A] text-xs text-[#9CA3AF]">Invalid image URL</div>;
  }

  // Remote URLs: avoid `next/image` remotePatterns coupling for arbitrary CDNs.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);
  const current = sorted[active] ?? sorted[0];

  if (!current) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] text-sm text-[#9CA3AF]">
        Visuals pending.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A]">
        <GalleryImage
          src={current.image_url}
          alt={current.alt_text ?? productName}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div
        className={[
          "grid gap-2",
          sorted.length <= 1 ? "grid-cols-1" : "",
          sorted.length === 2 ? "grid-cols-2" : "",
          sorted.length === 3 ? "grid-cols-3" : "",
          sorted.length >= 4 ? "grid-cols-4" : "",
        ].join(" ")}
      >
        {sorted.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(idx)}
            className={`relative aspect-square overflow-hidden border text-left transition ${
              idx === active
                ? "border-[#00FF9C]/70 shadow-[0_0_18px_rgba(0,255,156,0.12)]"
                : "border-[rgba(255,255,255,0.12)] hover:border-[#00FF9C]/35"
            }`}
            aria-label={img.alt_text ?? `View ${idx + 1}`}
          >
            <GalleryImage src={img.image_url} alt={img.alt_text ?? "Thumbnail"} sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
