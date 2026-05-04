import { unstable_noStore as noStore } from "next/cache";
import type { ProductWithImages, SiteSettingsRow } from "@/lib/types";
import { createPublicSupabase } from "@/lib/supabase/public";

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  noStore();
  const supabase = createPublicSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("getSiteSettings", error);
    return null;
  }
  return data as SiteSettingsRow | null;
}

export async function getProducts(): Promise<ProductWithImages[]> {
  noStore();
  const supabase = createPublicSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from("products").select("*, product_images(*)").order("slug", { ascending: true });
  if (error) {
    console.error("getProducts", error);
    return [];
  }
  return (data ?? []) as ProductWithImages[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  noStore();
  const supabase = createPublicSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from("products").select("*, product_images(*)").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("getProductBySlug", error);
    return null;
  }
  return data as ProductWithImages | null;
}

export async function getCurrentProduct(): Promise<ProductWithImages | null> {
  noStore();
  const settings = await getSiteSettings();
  const slug = settings?.current_product_slug;
  if (!slug) return null;
  return getProductBySlug(slug);
}
