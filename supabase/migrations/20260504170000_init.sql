-- NULL//DIVISION schema
-- Run via Supabase SQL editor or `supabase db push`

-- Extensions
create extension if not exists "pgcrypto";

-- Helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  version text not null,
  description text not null,
  price_cents integer not null,
  total_inventory integer not null default 50,
  units_sold integer not null default 0,
  status text not null,
  active boolean not null default false,
  hero_mode text not null default 'blackout',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint products_units_sold_nonneg check (units_sold >= 0),
  constraint products_inventory_positive check (total_inventory > 0),
  constraint products_units_cap check (units_sold <= total_inventory)
);

create index if not exists products_status_idx on public.products (status);
create index if not exists products_active_idx on public.products (active);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- product_images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  product_id uuid references public.products(id),
  email text not null,
  size text not null,
  amount_total integer not null,
  status text not null,
  created_at timestamptz default now()
);

create index if not exists orders_product_id_idx on public.orders (product_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- waitlist
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text,
  source text,
  created_at timestamptz default now()
);

create index if not exists waitlist_email_idx on public.waitlist (lower(email));
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- site_settings (single row pattern)
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  blackout_mode boolean not null default true,
  countdown_enabled boolean not null default false,
  countdown_target timestamptz,
  current_product_slug text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- inventory_events
create table if not exists public.inventory_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  event_type text not null,
  event_note text,
  created_at timestamptz default now()
);

create index if not exists inventory_events_product_id_idx on public.inventory_events (product_id);

-- Atomic checkout processing (idempotent, serialized per product)
create or replace function public.process_checkout_session(
  p_stripe_session_id text,
  p_product_id uuid,
  p_email text,
  p_size text,
  p_amount_total integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product public.products%rowtype;
  v_remaining int;
  v_order_id uuid;
begin
  select * into v_product from public.products where id = p_product_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'product_not_found');
  end if;

  insert into public.orders (stripe_session_id, product_id, email, size, amount_total, status)
  values (p_stripe_session_id, p_product_id, p_email, p_size, p_amount_total, 'paid')
  on conflict (stripe_session_id) do nothing
  returning id into v_order_id;

  if v_order_id is null then
    if exists (select 1 from public.orders where stripe_session_id = p_stripe_session_id) then
      return jsonb_build_object('ok', true, 'duplicate', true);
    end if;
    return jsonb_build_object('ok', false, 'error', 'order_insert_failed');
  end if;

  if v_product.units_sold >= v_product.total_inventory then
    delete from public.orders where stripe_session_id = p_stripe_session_id;
    return jsonb_build_object('ok', false, 'error', 'sold_out');
  end if;

  update public.products
  set
    units_sold = units_sold + 1,
    updated_at = now(),
    status = case
      when units_sold + 1 >= total_inventory then 'sold_out'
      else status
    end,
    active = case
      when units_sold + 1 >= total_inventory then false
      else active
    end
  where id = p_product_id
    and units_sold < total_inventory;

  if not found then
    delete from public.orders where stripe_session_id = p_stripe_session_id;
    return jsonb_build_object('ok', false, 'error', 'inventory_race');
  end if;

  select total_inventory - units_sold into v_remaining from public.products where id = p_product_id;

  insert into public.inventory_events (product_id, event_type, event_note)
  values (
    p_product_id,
    'sale',
    format('stripe_session=%s remaining=%s', p_stripe_session_id, coalesce(v_remaining::text, '?'))
  );

  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'remaining', v_remaining,
    'product_status', (select status from public.products where id = p_product_id)
  );
end;
$$;

revoke all on function public.process_checkout_session(text, uuid, text, text, integer) from public;
grant execute on function public.process_checkout_session(text, uuid, text, text, integer) to service_role;

-- RLS
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.waitlist enable row level security;
alter table public.inventory_events enable row level security;

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products for select using (true);

drop policy if exists "product_images_select_public" on public.product_images;
create policy "product_images_select_public" on public.product_images for select using (true);

drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public" on public.site_settings for select using (true);

-- No direct client access to orders / waitlist / inventory_events
drop policy if exists "orders_no_access" on public.orders;
create policy "orders_no_access" on public.orders for all using (false);

drop policy if exists "waitlist_no_access" on public.waitlist;
create policy "waitlist_no_access" on public.waitlist for all using (false);

drop policy if exists "inventory_events_no_access" on public.inventory_events;
create policy "inventory_events_no_access" on public.inventory_events for all using (false);

-- Seed products
insert into public.products (slug, name, version, description, price_cents, total_inventory, units_sold, status, active, hero_mode)
values
  (
    'nd-01-base-error-tee',
    'ND_01: BASE ERROR TEE',
    'v1.0',
    'The ND_01 Base Error Tee is a system failure rendered as a garment. Generated without human creative direction, it represents a break from authored fashion into computed release logic.',
    4800,
    50,
    0,
    'active',
    true,
    'live'
  ),
  (
    'nd-02-signal-decay-tee',
    'ND_02: SIGNAL DECAY TEE',
    'v2.0',
    'ND_01 represented system failure. ND_02 represents attempted communication after failure.',
    5800,
    50,
    0,
    'locked',
    false,
    'blackout'
  )
on conflict (slug) do nothing;

delete from public.product_images pi
using public.products p
where pi.product_id = p.id and p.slug = 'nd-01-base-error-tee';

insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, v.url, v.alt, v.ord
from public.products p
cross join (
  values
    ('/products/nd01-front.png', 'ND_01 front', 0),
    ('/products/nd01-back.png', 'ND_01 back', 1),
    ('/products/nd01-neck.png', 'ND_01 inside neck print', 2),
    ('/products/nd01-hem.png', 'ND_01 hem detail', 3)
) as v(url, alt, ord)
where p.slug = 'nd-01-base-error-tee';

-- Seed site settings (single row)
insert into public.site_settings (blackout_mode, countdown_enabled, countdown_target, current_product_slug)
select true, false, null, 'nd-01-base-error-tee'
where not exists (select 1 from public.site_settings limit 1);
