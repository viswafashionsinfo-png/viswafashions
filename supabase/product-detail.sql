-- ============================================================================
-- PRODUCT DETAIL PAGE — run this ONCE in Supabase SQL Editor, after
-- category-improvements.sql. Safe to re-run.
--   1. products: slug (for /products/<slug>) + optional detail fields
--   2. product_images: extra gallery images per product
--   3. orders: quantity (still one product per order)
-- Existing product ids, names, prices, images and orders are kept.
-- ============================================================================

-- Same helper as category-improvements.sql (re-declared so this file can run
-- on its own): "Royal Kanjivaram Silk Saree" -> "royal-kanjivaram-silk-saree".
create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'));
$$;

-- ----------------------------------------------------------------------------
-- 1. PRODUCTS
-- ----------------------------------------------------------------------------
alter table public.products
  add column if not exists slug              text,
  add column if not exists description       text,
  add column if not exists fabric            text,
  add column if not exists weave             text,
  add column if not exists color             text,
  add column if not exists occasion          text,
  add column if not exists saree_length      text,
  add column if not exists blouse_length     text,
  add column if not exists care_instructions text;

comment on column public.products.slug is
  'URL segment for /products/<slug>. Leave empty on insert to auto-generate from name. Renaming a product keeps its slug.';
comment on column public.products.description is
  'Shown as "About the Saree" on the product page. Leave NULL to show "Product description coming soon."';
comment on column public.products.fabric is 'Optional, e.g. "Pure Silk". Hidden on the product page when NULL.';
comment on column public.products.weave is 'Optional, e.g. "Kanjivaram". Hidden when NULL.';
comment on column public.products.color is 'Optional, e.g. "Royal Purple". Hidden when NULL.';
comment on column public.products.occasion is 'Optional, e.g. "Wedding / Festive". Hidden when NULL.';
comment on column public.products.saree_length is 'Optional free text, e.g. "6.3 meters (with blouse)". Hidden when NULL.';
comment on column public.products.blouse_length is 'Optional free text, e.g. "0.8 meters". Hidden when NULL.';
comment on column public.products.care_instructions is 'Optional, e.g. "Dry Clean Only". Hidden when NULL.';

-- Backfill slugs. Products that share a name get -2, -3 ... suffixes.
with ranked as (
  select
    id,
    nullif(public.slugify(name), '') as base,
    row_number() over (
      partition by public.slugify(name)
      order by display_order, created_at, id
    ) as n
  from public.products
  where slug is null or btrim(slug) = ''
)
update public.products p
set slug = case
             when r.base is null then p.id::text
             when r.n = 1        then r.base
             else r.base || '-' || r.n
           end
from ranked r
where p.id = r.id;

create or replace function public.products_set_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or btrim(new.slug) = '' then
    new.slug := nullif(public.slugify(new.name), '');
  else
    new.slug := nullif(public.slugify(new.slug), '');
  end if;
  if new.slug is null then
    new.slug := new.id::text;
  end if;
  return new;
end;
$$;

drop trigger if exists products_set_slug on public.products;
create trigger products_set_slug
  before insert or update of slug, name on public.products
  for each row execute function public.products_set_slug();

alter table public.products alter column slug set not null;

create unique index if not exists products_slug_key on public.products(slug);

-- ----------------------------------------------------------------------------
-- 2. PRODUCT IMAGES (gallery)
-- products.image_url stays the main image; rows here add more photos.
-- Set is_primary = true on one row to use it as the main image instead.
-- ----------------------------------------------------------------------------
create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  image_url     text not null,
  display_order integer not null default 0,
  is_primary    boolean not null default false,
  created_at    timestamptz not null default now()
);

comment on table public.product_images is
  'Extra gallery photos for a product. Lower display_order = shown first.';

create index if not exists idx_product_images_product_order
  on public.product_images(product_id, display_order);

alter table public.product_images enable row level security;

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images"
  on public.product_images for select
  using (true);

grant select on table public.product_images to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 3. ORDERS — quantity of the single product in the order.
-- Upper bound must match MAX_ORDER_QUANTITY in lib/pricing.ts.
-- ----------------------------------------------------------------------------
alter table public.orders
  add column if not exists quantity integer not null default 1;

alter table public.orders drop constraint if exists orders_quantity_range;
alter table public.orders
  add constraint orders_quantity_range check (quantity between 1 and 10);
