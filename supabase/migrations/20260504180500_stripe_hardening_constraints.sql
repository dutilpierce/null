-- Stripe hardening: enforce inventory cap and valid sizes.
-- Apply via Supabase SQL editor or `supabase db push`.

alter table public.products
  add constraint products_inventory_cap_50 check (total_inventory <= 50);

alter table public.products
  add constraint products_units_sold_cap_50 check (units_sold <= 50);

alter table public.orders
  add constraint orders_size_allowed check (size in ('S', 'M', 'L', 'XL', 'XXL'));

