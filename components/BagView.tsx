'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Minus, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useGuestStore } from '@/components/GuestStoreProvider';
import { MAX_ORDER_QUANTITY, formatINR } from '@/lib/pricing';
import type { Product } from '@/lib/types';

export default function BagView() {
  const { ready, bag, setBagQuantity, removeFromBag } = useGuestStore();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const idsKey = useMemo(() => bag.map((i) => i.productId).sort().join(','), [bag]);

  useEffect(() => {
    if (!ready) return;
    if (!idsKey) {
      setProducts({});
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    supabase
      .from('products')
      .select('*')
      .in('id', idsKey.split(','))
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('[BagView] Supabase error:', error.code, error.message);
          setLoadError(true);
        }
        const rows = (data as Product[] | null) ?? [];
        setProducts(Object.fromEntries(rows.map((p) => [p.id, p])));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ready, idsKey]);

  if (!ready || loading) {
    return (
      <div className="flex justify-center py-20 text-neutral-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="text-sm text-neutral-600 py-10 text-center">
        We couldn&apos;t load your bag right now. Please refresh the page.
      </p>
    );
  }

  const items = bag.filter((i) => products[i.productId]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-serif text-xl text-neutral-900">Your bag is empty</p>
        <p className="text-sm text-neutral-500 mt-1">Discover our handwoven sarees and add your favourites.</p>
        <Link
          href="/collections"
          className="inline-block mt-6 px-8 py-3 rounded-full text-white font-medium bg-brand-dark hover:bg-black transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">
        Each item is checked out separately for now.
      </p>

      <ul className="space-y-4">
        {items.map(({ productId, quantity }) => {
          const product = products[productId];
          return (
            <li key={productId} className="bg-white rounded-xl shadow-card p-4 flex gap-4">
              <Link
                href={`/products/${product.slug}`}
                className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-neutral-100"
              >
                {product.image_url && (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                )}
              </Link>

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-serif text-base text-neutral-900 hover:text-brand-maroon transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromBag(productId)}
                    aria-label={`Remove ${product.name} from bag`}
                    className="text-neutral-400 hover:text-brand-maroon transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-brand-maroon font-semibold">{formatINR(product.price * quantity)}</p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-neutral-300">
                    <button
                      type="button"
                      onClick={() => setBagQuantity(productId, quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 flex items-center justify-center text-neutral-700 disabled:text-neutral-300"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setBagQuantity(productId, quantity + 1)}
                      disabled={quantity >= MAX_ORDER_QUANTITY}
                      aria-label="Increase quantity"
                      className="w-8 h-8 flex items-center justify-center text-neutral-700 disabled:text-neutral-300"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {product.in_stock ? (
                    <Link
                      href={`/checkout?productId=${product.id}&qty=${quantity}`}
                      className="px-5 py-2 rounded-lg bg-brand-maroon text-white text-sm font-medium hover:bg-brand-maroonDark transition-colors"
                    >
                      Checkout
                    </Link>
                  ) : (
                    <span className="px-5 py-2 rounded-lg bg-neutral-200 text-neutral-500 text-sm font-medium">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
