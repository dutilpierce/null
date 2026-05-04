import { unstable_noStore as noStore } from "next/cache";
import type { ProductWithImages, SiteSettingsRow } from "@/lib/types";
import { createPublicSupabase } from "@/lib/supabase/public";

const FALLBACK_SITE_SETTINGS: SiteSettingsRow = {
  id: "local",
  blackout_mode: true,
  countdown_enabled: false,
  countdown_target: null,
  current_product_slug: "nd-01-base-error-tee",
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};

const FALLBACK_PRODUCTS: ProductWithImages[] = [
  {
    id: "local-nd01",
    slug: "nd-01-base-error-tee",
    name: "ND_01: BASE ERROR TEE",
    version: "v1.0",
    description:
      "The ND_01 Base Error Tee is a system failure rendered as a garment. Generated without human creative direction, it represents a break from authored fashion into computed release logic.",
    price_cents: 4800,
    total_inventory: 50,
    units_sold: 0,
    status: "active",
    active: true,
    hero_mode: "live",
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    product_images: [
      {
        id: "local-nd01-front",
        product_id: "local-nd01",
        image_url: "/products/nd01-front.png",
        alt_text: "ND_01 front",
        sort_order: 0,
        created_at: new Date(0).toISOString(),
      },
      {
        id: "local-nd01-back",
        product_id: "local-nd01",
        image_url: "/products/nd01-back.png",
        alt_text: "ND_01 back",
        sort_order: 1,
        created_at: new Date(0).toISOString(),
      },
    ],
  },
  {
    id: "local-nd02",
    slug: "nd-02-signal-decay-tee",
    name: "ND_02: SIGNAL DECAY TEE",
    version: "v2.0",
    description: "ND_01 represented system failure. ND_02 represents attempted communication after failure.",
    price_cents: 5800,
    total_inventory: 50,
    units_sold: 0,
    status: "locked",
    active: false,
    hero_mode: "blackout",
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    product_images: null,
  },
] as const;

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  noStore();
  const supabase = createPublicSupabase();
  if (!supabase) return FALLBACK_SITE_SETTINGS;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("getSiteSettings", error);
    return FALLBACK_SITE_SETTINGS;
  }
  return (data as SiteSettingsRow | null) ?? FALLBACK_SITE_SETTINGS;
}

export async function getProducts(): Promise<ProductWithImages[]> {
  noStore();
  const supabase = createPublicSupabase();
  if (!supabase) return [...FALLBACK_PRODUCTS];
  const { data, error } = await supabase.from("products").select("*, product_images(*)").order("slug", { ascending: true });
  if (error) {
    console.error("getProducts", error);
    return [...FALLBACK_PRODUCTS];
  }
  const products = (data ?? []) as ProductWithImages[];
  return products.length ? products : [...FALLBACK_PRODUCTS];
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  noStore();
  const supabase = createPublicSupabase();
  if (!supabase) return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase.from("products").select("*, product_images(*)").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("getProductBySlug", error);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  return (data as ProductWithImages | null) ?? (FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null);
}

export async function getCurrentProduct(): Promise<ProductWithImages | null> {
  noStore();
  const settings = await getSiteSettings();
  const slug = settings?.current_product_slug;
  if (!slug) return null;
  return getProductBySlug(slug);
}
