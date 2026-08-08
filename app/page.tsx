import { supabase } from '@/lib/supabase/client';
import Hero from '@/components/Hero';
import CategoryRow from '@/components/CategoryRow';
import ProductCarousel from '@/components/ProductCarousel';
import WhyShopWithUs from '@/components/WhyShopWithUs';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import type { Product } from '@/lib/types';

interface HomePageProps {
  searchParams: { category?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const categoryFilter = searchParams.category;

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  let newArrivalsQuery = supabase
    .from('products')
    .select('*')
    .ilike('badge', '%new%')
    .order('display_order', { ascending: true })
    .limit(12);

  let bestSellersQuery = supabase
    .from('products')
    .select('*')
    .ilike('badge', '%best%')
    .order('display_order', { ascending: true })
    .limit(12);

  if (categoryFilter) {
    newArrivalsQuery = newArrivalsQuery.eq('category_id', categoryFilter);
    bestSellersQuery = bestSellersQuery.eq('category_id', categoryFilter);
  }

  const [{ data: newArrivals }, { data: bestSellers }] = await Promise.all([
    newArrivalsQuery,
    bestSellersQuery,
  ]);

  return (
    <main>
      <Hero />
      <ProductCarousel
        id="new-collections"
        eyebrow="Freshly Woven"
        title="New Arrivals"
        subtitle="The latest weaves to enter the Viswafashions atelier this season."
        products={(newArrivals as Product[]) ?? []}
      />
      <CategoryRow categories={categories ?? []} />
      <ProductCarousel
        id="best-sellers"
        eyebrow="Loved by Thousands"
        title="Best Sellers"
        subtitle="Our most cherished weaves, chosen again and again."
        products={(bestSellers as Product[]) ?? []}
      />
      <WhyShopWithUs />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
