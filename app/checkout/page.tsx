import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import CheckoutForm from '@/components/CheckoutForm';

interface CheckoutPageProps {
  searchParams: { productId?: string };
}

// The "global state" for the selected product is just the URL
// (?productId=...). This is more robust than client-side global state
// because it survives refreshes, works with back/forward navigation, and
// needs no Context/Provider wiring. We fetch the product server-side here
// and hand it down as a prop to the client CheckoutForm.
export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { productId } = searchParams;

  if (!productId) {
    notFound();
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-8">Checkout</h1>
      <CheckoutForm product={product} />
    </main>
  );
}
