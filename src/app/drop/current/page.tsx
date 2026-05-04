import type { Metadata } from "next";
import { ProductDetailPanel } from "@/components/ProductDetailPanel";
import { ProductGallery } from "@/components/ProductGallery";
import { DropPurchase } from "@/components/DropPurchase";
import { GlitchText } from "@/components/GlitchText";
import { getCurrentProduct, getProducts, getSiteSettings } from "@/lib/data/catalog";
import { formatUsd } from "@/lib/format";
import { isSoldOut } from "@/lib/product-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Current iteration",
};

const DETAILS = [
  "Washed black oversized heavyweight tee",
  "260 GSM cotton",
  "Screen printed white distressed ink",
  "Inside neck print",
  "Numbered run",
  "No restocks",
] as const;

export default async function CurrentDropPage() {
  const settings = await getSiteSettings();
  const product = await getCurrentProduct();
  const products = await getProducts();
  const nd02 = products.find((p) => p.slug === "nd-02-signal-decay-tee");

  if (!product) {
    return (
      <div className="border border-[rgba(255,255,255,0.12)] bg-[#0A0A0A] p-8 text-sm text-[#9CA3AF]">
        Current iteration not configured. Verify `site_settings.current_product_slug` and Supabase connectivity.
      </div>
    );
  }

  const blackout = Boolean(settings?.blackout_mode);
  const imagesRaw = product.product_images ?? [];
  const normalizeImagePath = (raw: string): string => {
    const s = raw.trim();
    try {
      const u = new URL(s);
      return u.pathname;
    } catch {
      return s;
    }
  };
  const images =
    product.slug === "nd-01-base-error-tee"
      ? [
          { id: "nd01-front", image_url: "/products/nd01-front.png", alt_text: "ND_01 front", sort_order: 0 },
          { id: "nd01-back", image_url: "/products/nd01-back.png", alt_text: "ND_01 back", sort_order: 1 },
        ]
      : imagesRaw.map((img) => ({
          id: img.id,
          image_url: normalizeImagePath(img.image_url),
          alt_text: img.alt_text,
          sort_order: img.sort_order,
        }));
  const soldOut = isSoldOut(product);
  const shortCode = product.slug.startsWith("nd-02") ? "ND_02" : "ND_01";
  const versionLabel = `${shortCode} ${product.version} / ${product.total_inventory}`;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9CA3AF]">Live iteration</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.02] tracking-tight text-[#F5F5F5] sm:text-5xl">
          <GlitchText as="span">{product.name}</GlitchText>
        </h1>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF]">
          <span className="text-[#F5F5F5]">{formatUsd(product.price_cents)}</span>
          <span>Version {product.version}</span>
          <span className="border border-[rgba(255,255,255,0.12)] px-2 py-1 text-[#00FF9C]">
            {soldOut ? "SOLD OUT" : "ACTIVE"}
          </span>
          <span className="text-[#6B7280]">{versionLabel}</span>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={images} productName={product.name} />
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">Statement</h2>
            <p className="text-sm leading-relaxed text-[#E5E7EB] sm:text-base">
              The ND_01 Base Error Tee is a system failure rendered as a garment. Generated without human input, this piece
              represents a break in traditional design logic — where identity is no longer crafted, but computed.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9CA3AF]">Specifications</h2>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              {DETAILS.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-[#00FF9C]">/</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </section>
          <ProductDetailPanel product={product} successorLabel={nd02 ? `${nd02.name} — LOCKED` : "PENDING"} />
          <DropPurchase product={product} blackout={blackout} imagesPresent={images.length > 0} />
        </div>
      </div>
    </div>
  );
}
