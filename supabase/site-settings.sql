-- ============================================================================
-- SITE SETTINGS — run this ONCE in Supabase SQL Editor.
-- Stores storefront content that is not a product/category, e.g. the homepage
-- Hero image URL. Edit values later from: Table Editor > site_settings.
-- ============================================================================

create table if not exists public.site_settings (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  value      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.site_settings is
  'Key/value storefront config. Change values in Table Editor; no code deploy needed.';
comment on column public.site_settings.key is
  'Stable identifier, e.g. hero_image_url.';
comment on column public.site_settings.value is
  'For hero_image_url: a publicly reachable image URL (Supabase Storage public URL or any https URL).';

alter table public.site_settings enable row level security;

-- Public storefront needs to READ settings. Writes stay dashboard-only
-- (no insert/update/delete policies for anon).
drop policy if exists "Public can read site_settings" on public.site_settings;
create policy "Public can read site_settings"
  on public.site_settings for select
  using (true);

grant select on table public.site_settings to anon, authenticated;

-- Seed the homepage Hero. Teacher.webp is not in Storage (404), so this uses a
-- known-public object from the same bucket. Replace `value` in Table Editor
-- with your real Hero photo URL whenever you like.
insert into public.site_settings (key, value)
values (
  'hero_image_url',
  'https://ewmkgivhnjbzedbewuvc.supabase.co/storage/v1/object/public/viswafashionsinfo-png''s%20Org/purpleRoyal-Kanjivaram-Silk-Saree.webp'
)
on conflict (key) do nothing;
