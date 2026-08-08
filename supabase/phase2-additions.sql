-- ============================================================================
-- PHASE 2 ADDITIONS — run this ONCE in Supabase SQL Editor, after your
-- original supabase/schema.sql has already been run.
-- Adds: discount pricing, material labels, newsletter signups, and a secure
-- order-tracking lookup function.
-- ============================================================================

-- Optional product fields for discount pricing + a small material caption
alter table public.products
  add column if not exists original_price numeric,
  add column if not exists material_label text;

comment on column public.products.original_price is
  'Optional. Set higher than price to show a strikethrough "was" price and a discount % badge. Leave NULL for no discount.';
comment on column public.products.material_label is
  'Optional small caption above the product name, e.g. "Pure Kanjivaram Silk". Leave NULL to hide it.';

-- Newsletter signups table
create table if not exists public.newsletter_signups (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;

drop policy if exists "Public can subscribe" on public.newsletter_signups;
create policy "Public can subscribe"
  on public.newsletter_signups for insert
  with check (true);

-- Secure order-tracking function — requires phone AND email to match, so it
-- does NOT expose the orders table to public reads (that stays locked down).
create or replace function public.track_order(p_phone text, p_email text)
returns table (
  id uuid,
  product_name text,
  total_amount numeric,
  payment_status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    o.id,
    p.name as product_name,
    o.total_amount,
    o.payment_status,
    o.created_at
  from public.orders o
  left join public.products p on p.id = o.product_id
  where o.phone_number = p_phone
    and lower(o.email) = lower(p_email)
  order by o.created_at desc;
$$;

grant execute on function public.track_order(text, text) to anon;
