'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  const hasDiscount =
    product.original_price != null && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : null;

  return (
    <div className="w-56 sm:w-64 shrink-0 snap-start bg-white rounded-xl shadow-card overflow-hidden flex flex-col">
      <div className="relative h-80 bg-neutral-100">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
            No image
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-brand-maroon text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full w-fit">
              {product.badge}
            </span>
          )}
          {discountPercent !== null && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-fit">
              -{discountPercent}%
            </span>
          )}
        </div>

        {!product.in_stock && (
          <span className="absolute top-3 right-12 bg-neutral-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Sold Out
          </span>
        )}

        <button
          onClick={() => setLiked((v) => !v)}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 shadow-sm"
        >
          <Heart size={18} className={liked ? 'fill-brand-maroon text-brand-maroon' : 'text-neutral-500'} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        {product.material_label && (
          <p className="text-[10px] font-semibold tracking-wide uppercase text-brand-maroon">
            {product.material_label}
          </p>
        )}
        <h3 className="font-serif text-base text-neutral-900 line-clamp-1">{product.name}</h3>

        <p className="flex items-baseline gap-2">
          <span className="text-brand-maroon font-semibold">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-neutral-400 text-sm line-through">
              ₹{product.original_price!.toLocaleString('en-IN')}
            </span>
          )}
        </p>

        <div className="mt-auto pt-3">
          {product.in_stock ? (
            <Link
              href={`/checkout?productId=${product.id}`}
              className="block w-full text-center bg-brand-maroon text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-maroonDark transition-colors"
            >
              Buy Now
            </Link>
          ) : (
            <button
              disabled
              className="block w-full text-center bg-neutral-200 text-neutral-500 text-sm font-medium py-2.5 rounded-lg cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
