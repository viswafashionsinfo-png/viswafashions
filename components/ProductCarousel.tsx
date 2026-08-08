'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface ProductCarouselProps {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function ProductCarousel({ id, eyebrow, title, subtitle, products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(direction: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' });
  }

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-brand-maroon text-xs font-semibold tracking-[0.2em] uppercase mb-1">
            {eyebrow}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-neutral-900">{title}</h2>
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:border-brand-maroon hover:text-brand-maroon transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:border-brand-maroon hover:text-brand-maroon transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
