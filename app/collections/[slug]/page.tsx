export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getActiveCategories, getActiveCategoryBySlug } from '@/lib/catalog';
import CollectionView from '@/components/CollectionView';
import type { Product } from '@/lib/types';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getActiveCategoryBySlug(params.slug);
  if (!category) return {};
  return { title: `${category.name} — Viswafashions` };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getActiveCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const [categories, { data: products }] = await Promise.all([
    getActiveCategories(),
    supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .order('display_order', { ascending: true }),
  ]);

  return (
    <CollectionView
      eyebrow="Shop by Category"
      title={category.name}
      products={(products as Product[] | null) ?? []}
      categories={categories}
      activeCategorySlug={category.slug}
    />
  );
}
