-- ============================================================================
-- CATEGORY IMPROVEMENTS — run this ONCE in Supabase SQL Editor.
-- Adds `slug` (clean URLs like /collections/pattu-sarees) and `is_active`
-- (hide a category from the storefront without deleting it) to the existing
-- `categories` table. Existing ids, names, images and display_order are kept.
-- Safe to re-run.
-- ============================================================================

alter table public.categories
  add column if not exists slug      text,
  add column if not exists is_active boolean not null default true;

comment on column public.categories.slug is
  'URL segment for /collections/<slug>. Lowercase letters, numbers and hyphens, e.g. "pattu-sarees". Leave empty on insert to auto-generate from name.';
comment on column public.categories.is_active is
  'true = shown in Navbar, Shop by Category and /collections/<slug>. false = hidden from the storefront (not deleted).';

-- Turns "Pattu Sarees" into "pattu-sarees".
create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'));
$$;

-- Backfill slugs for existing rows. Duplicate names get a -2, -3 ... suffix.
with ranked as (
  select
    id,
    nullif(public.slugify(name), '') as base,
    row_number() over (
      partition by public.slugify(name)
      order by display_order, created_at, id
    ) as n
  from public.categories
  where slug is null or btrim(slug) = ''
)
update public.categories c
set slug = case
             when r.base is null then c.id::text
             when r.n = 1        then r.base
             else r.base || '-' || r.n
           end
from ranked r
where c.id = r.id;

-- Auto-fill slug from name when a row is inserted/updated in the Table Editor
-- with an empty slug. A slug you type yourself is kept, just normalized.
create or replace function public.categories_set_slug()
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

drop trigger if exists categories_set_slug on public.categories;
create trigger categories_set_slug
  before insert or update of slug, name on public.categories
  for each row execute function public.categories_set_slug();

alter table public.categories alter column slug set not null;

create unique index if not exists categories_slug_key on public.categories(slug);
create index if not exists idx_categories_active_order
  on public.categories(is_active, display_order);

-- RLS: the existing "Public can read categories" SELECT policy already covers
-- the new columns; the storefront filters on is_active = true itself.
