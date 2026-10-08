export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase/client';
import { getActiveCategories, isMerchFilter, MERCH_FILTERS } from '@/lib/catalog';
import CollectionView from '@/components/CollectionView';
import type { Product } from '@/lib/types';

interface CollectionsPageProps {
  searchParams: { filter?: string };
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const filter = isMerchFilter(searchParams.filter) ? searchParams.filter : undefined;

  let productsQuery = supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true });

  if (filter) {
    productsQuery = productsQuery.ilike('badge', MERCH_FILTERS[filter].badgePattern);
  }

  const [categories, { data: products }] = await Promise.all([
    getActiveCategories(),
    productsQuery,
  ]);

  return (
    <CollectionView
      eyebrow={filter ? 'Curated Edit' : 'The Full Catalog'}
      title={filter ? MERCH_FILTERS[filter].label : 'All Collections'}
      subtitle={
        filter === 'new'
          ? 'The latest weaves to enter the Viswafashions atelier this season.'
          : filter === 'best'
            ? 'Our most cherished weaves, chosen again and again.'
            : 'Every weave in the Viswafashions atelier.'
      }
      products={(products as Product[] | null) ?? []}
      categories={categories}
      activeFilter={filter}
    />
  );
}
