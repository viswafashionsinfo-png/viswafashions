-- ============================================================================
-- VISWAFASHIONS — SUPABASE SCHEMA
-- ============================================================================
-- Run this whole file once in: Supabase Dashboard > SQL Editor > New Query
-- It creates categories, products, orders, and locks them down with RLS so:
--   - Anyone (anon) can READ categories & products (needed for the storefront)
--   - Anyone (anon) can INSERT into orders (guest checkout, no login)
--   - Nobody can read/update/delete orders from the browser (only you, via
--     the Supabase dashboard or a service-role key, can see order data)
-- ============================================================================

-- Make sure gen_random_uuid() is available (it is by default on Supabase,
-- this is just a safety net).
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. CATEGORIES
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,                 -- e.g. "Georgette", "Pattu Sarees"
  image_url     text,                          -- circular thumbnail shown on homepage
  display_order numeric not null default 0,    -- lower number = shown first
  created_at    timestamptz not null default now()
);

comment on column public.categories.display_order is
  'Controls sort order in "Shop by Category" row. Edit this number in the Table Editor to reorder.';

-- ----------------------------------------------------------------------------
-- 2. PRODUCTS
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  price         numeric not null check (price >= 0),
  image_url     text,
  category_id   uuid references public.categories(id) on delete set null,
  badge         text,                          -- e.g. "NEW", "★ Best Seller", or NULL
  in_stock      boolean not null default true, -- false => frontend shows "Sold Out"
  display_order numeric not null default 0,    -- lower number = shown first
  created_at    timestamptz not null default now()
);

comment on column public.products.badge is
  'Free text shown as a floating badge on the product card. The homepage buckets products
   into "New Collections" when badge ILIKE ''%new%'' and "Best Sellers" when badge ILIKE ''%best%''.
   Leave NULL for no badge.';

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_display_order on public.products(display_order);

-- ----------------------------------------------------------------------------
-- 3. ORDERS (guest checkout, no auth)
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  full_name        text not null,
  email            text not null,
  phone_number     text not null,
  pincode          text not null,
  area             text,
  city             text,
  state            text,
  complete_address text not null,
  product_id       uuid references public.products(id),
  total_amount     numeric not null check (total_amount >= 0),
  payment_status   text not null default 'pending'  -- 'pending' | 'paid' | 'failed'
);

create index if not exists idx_orders_product_id on public.orders(product_id);

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.orders     enable row level security;

-- Public read access for the storefront
drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (true);

-- Public (anon) can create an order, but cannot read/update/delete any order.
-- This keeps customer data private while still allowing guest checkout.
drop policy if exists "Public can insert orders" on public.orders;
create policy "Public can insert orders"
  on public.orders for insert
  with check (true);

-- No select/update/delete policies are created for `orders` on purpose —
-- view/manage orders from the Supabase Table Editor (or with the service_role
-- key in a secure backend), never from the public anon key.

-- ----------------------------------------------------------------------------
-- 5. SAMPLE DATA (optional — delete or edit freely from the Table Editor)
-- ----------------------------------------------------------------------------
insert into public.categories (name, image_url, display_order) values
  ('Pattu Sarees', 'https://placehold.co/300x300/801a1a/fff?text=Pattu', 1),
  ('Georgette',    'https://placehold.co/300x300/801a1a/fff?text=Georgette', 2),
  ('Kanjivaram',   'https://placehold.co/300x300/801a1a/fff?text=Kanjivaram', 3),
  ('Cotton',       'https://placehold.co/300x300/801a1a/fff?text=Cotton', 4)
on conflict do nothing;
