'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useGuestStore } from '@/components/GuestStoreProvider';
import { MAX_ORDER_QUANTITY, clampQuantity } from '@/lib/pricing';

interface PurchasePanelProps {
  productId: string;
  inStock: boolean;
}

export default function PurchasePanel({ productId, inStock }: PurchasePanelProps) {
  const router = useRouter();
  const { addToBag, isWishlisted, toggleWishlist } = useGuestStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const liked = isWishlisted(productId);

  function changeQuantity(next: number) {
    setQuantity(clampQuantity(next));
    setAdded(false);
  }

  function handleAddToBag() {
    if (!inStock) return;
    addToBag(productId, quantity);
    setAdded(true);
  }

  function handleBuyNow() {
    if (!inStock) return;
    router.push(`/checkout?productId=${productId}&qty=${quantity}`);
  }

  const stepperButton =
    'w-10 h-10 flex items-center justify-center text-neutral-700 hover:text-brand-maroon disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-800">Quantity</span>
          <div className="flex items-center rounded-lg border border-neutral-300 bg-white">
            <button
              type="button"
              onClick={() => changeQuantity(quantity - 1)}
              disabled={!inStock || quantity <= 1}
              aria-label="Decrease quantity"
              className={stepperButton}
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-medium tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => changeQuantity(quantity + 1)}
              disabled={!inStock || quantity >= MAX_ORDER_QUANTITY}
              aria-label="Increase quantity"
              className={stepperButton}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(productId)}
          aria-pressed={liked}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-800 hover:text-brand-maroon transition-colors"
        >
          <Heart size={16} className={liked ? 'fill-brand-maroon text-brand-maroon' : 'text-brand-maroon'} />
          {liked ? 'In Wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleAddToBag}
          disabled={!inStock}
          className="flex items-center justify-center gap-2 rounded-lg border border-brand-maroon text-brand-maroon font-medium py-3 hover:bg-brand-maroon/5 transition-colors disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          <ShoppingBag size={16} />
          Add to Bag
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!inStock}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-maroon text-white font-medium py-3 hover:bg-brand-maroonDark transition-colors disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed"
        >
          {inStock ? 'Buy Now' : 'Sold Out'}
          {inStock && <ArrowRight size={16} />}
        </button>
      </div>

      {added && (
        <p className="flex items-center gap-1.5 text-sm text-green-700 animate-fade-in">
          <CheckCircle2 size={14} />
          Added to your bag.
          <Link href="/bag" className="font-medium underline underline-offset-2 hover:text-green-800">
            View bag
          </Link>
        </p>
      )}

      {!inStock && (
        <p className="text-sm text-neutral-600">
          This saree is currently unavailable. Browse similar weaves below.
        </p>
      )}
    </div>
  );
}
