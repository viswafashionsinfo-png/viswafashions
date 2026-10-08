import { cache } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Category, Product, ProductImage } from '@/lib/types';

// Wrapped in React `cache` so the layout (Navbar) and the page share one
// categories query per request instead of each fetching their own copy.
export const getActiveCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getActiveCategories] Supabase error:', error.code, error.message);
  }

  return (data as Category[] | null) ?? [];
});

export async function getActiveCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getActiveCategories();
  return categories.find((cat) => cat.slug === slug) ?? null;
}

// Cached so generateMetadata and the page share one query. Throws on a
// Supabase failure (handled by the route's error.tsx); null means not found.
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[getProductBySlug] Supabase error:', error.code, error.message);
    throw new Error('Failed to load product');
  }

  return (data as Product | null) ?? null;
});

// Main image first: a product_images row marked is_primary, else
// products.image_url, then the remaining gallery rows. Duplicates dropped.
export async function getProductGallery(product: Product): Promise<string[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', product.id)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getProductGallery] Supabase error:', error.code, error.message);
  }

  const rows = (data as ProductImage[] | null) ?? [];
  const primary = rows.find((row) => row.is_primary);
  const ordered = [
    primary?.image_url,
    product.image_url,
    ...rows.filter((row) => row !== primary).map((row) => row.image_url),
  ];

  const seen = new Set<string>();
  return ordered.filter((url): url is string => {
    const trimmed = url?.trim();
    if (!trimmed || seen.has(trimmed)) return false;
    seen.add(trimmed);
    return true;
  });
}

const RELATED_LIMIT = 8;

// Same-category, in-stock products first; topped up from the rest of the
// in-stock catalog when the category has too few.
export async function getRelatedProducts(product: Product): Promise<Product[]> {
  let related: Product[] = [];

  if (product.category_id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .eq('in_stock', true)
      .neq('id', product.id)
      .order('display_order', { ascending: true })
      .limit(RELATED_LIMIT);
    if (error) console.error('[getRelatedProducts] Supabase error:', error.code, error.message);
    related = (data as Product[] | null) ?? [];
  }

  if (related.length < RELATED_LIMIT) {
    const excludeIds = [product.id, ...related.map((p) => p.id)];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .order('display_order', { ascending: true })
      .limit(RELATED_LIMIT - related.length);
    if (error) console.error('[getRelatedProducts] Supabase error:', error.code, error.message);
    related = [...related, ...((data as Product[] | null) ?? [])];
  }

  return related;
}

// Merchandising collections are badge-based filters, not categories.
export const MERCH_FILTERS = {
  new: { label: 'New Arrivals', badgePattern: '%new%' },
  best: { label: 'Best Sellers', badgePattern: '%best%' },
} as const;

export type MerchFilter = keyof typeof MERCH_FILTERS;

export function isMerchFilter(value: string | undefined): value is MerchFilter {
  return value !== undefined && Object.prototype.hasOwnProperty.call(MERCH_FILTERS, value);
}
