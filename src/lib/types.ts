export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  version: string;
  description: string;
  price_cents: number;
  total_inventory: number;
  units_sold: number;
  status: string;
  active: boolean;
  hero_mode: string;
  created_at: string;
  updated_at: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

export type SiteSettingsRow = {
  id: string;
  blackout_mode: boolean;
  countdown_enabled: boolean;
  countdown_target: string | null;
  current_product_slug: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductWithImages = ProductRow & {
  product_images: ProductImageRow[] | null;
};
