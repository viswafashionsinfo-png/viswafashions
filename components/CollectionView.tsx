import Link from 'next/link';
import type { Category, Product } from '@/lib/types';
import { MERCH_FILTERS, type MerchFilter } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';

interface CollectionViewProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  products: Product[];
  categories: Category[];
  activeFilter?: MerchFilter;
  activeCategorySlug?: string;
}

export default function CollectionView({
  eyebrow,
  title,
  subtitle,
  products,
  categories,
  activeFilter,
  activeCategorySlug,
}: CollectionViewProps) {
  const isAll = !activeFilter && !activeCategorySlug;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <p className="text-brand-maroon text-xs font-semibold tracking-[0.2em] uppercase mb-1">
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-neutral-900">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
      </div>

      <nav
        aria-label="Browse collections"
        className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 text-sm font-medium"
      >
        <Pill href="/collections" active={isAll}>All</Pill>
        {(Object.keys(MERCH_FILTERS) as MerchFilter[]).map((key) => (
          <Pill key={key} href={`/collections?filter=${key}`} active={activeFilter === key}>
            {MERCH_FILTERS[key].label}
          </Pill>
        ))}
        {categories.length > 0 && (
          <span aria-hidden className="w-px shrink-0 bg-neutral-200 mx-1" />
        )}
        {categories.map((cat) => (
          <Pill key={cat.id} href={`/collections/${cat.slug}`} active={activeCategorySlug === cat.slug}>
            {cat.name}
          </Pill>
        ))}
      </nav>

      {products.length > 0 ? (
        <div className="flex flex-wrap justify-center sm:justify-start gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500 py-16 text-center">
          No products in this collection yet.
        </p>
      )}
    </main>
  );
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 border transition-colors ${
        active
          ? 'bg-brand-maroon border-brand-maroon text-white'
          : 'border-neutral-300 text-neutral-700 hover:border-brand-maroon hover:text-brand-maroon'
      }`}
    >
      {children}
    </Link>
  );
}
