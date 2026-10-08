export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  CheckCircle2,
  Flower2,
  Headset,
  Layers,
  Palette,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { getActiveCategories, getProductBySlug, getProductGallery, getRelatedProducts } from '@/lib/catalog';
import { discountPercent, formatINR } from '@/lib/pricing';
import ProductGallery from '@/components/pdp/ProductGallery';
import PurchasePanel from '@/components/pdp/PurchasePanel';
import DeliveryChecker from '@/components/pdp/DeliveryChecker';
import ProductTabs, { type ProductTab } from '@/components/pdp/ProductTabs';
import ProductCarousel from '@/components/ProductCarousel';

interface ProductPageProps {
  params: { slug: string };
}

// Same promises already made in TopBar / WhyShopWithUs — keep them in sync.
const TRUST_POINTS = [
  { icon: Truck, title: 'Free Shipping', text: 'On orders above ₹4,999' },
  { icon: ShieldCheck, title: 'Secure Payment', text: 'Bank-grade encryption' },
  { icon: RefreshCw, title: 'Easy Returns', text: '7-day returns & exchanges' },
  { icon: Headset, title: '24/7 Customer Support', text: "We're here to help" },
];

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — Viswafashions`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [categories, gallery, related] = await Promise.all([
    getActiveCategories(),
    getProductGallery(product),
    getRelatedProducts(product),
  ]);

  const category = categories.find((c) => c.id === product.category_id) ?? null;
  const discount = discountPercent(product.price, product.original_price);

  const highlights = [
    { icon: Layers, label: 'Fabric', value: product.fabric },
    { icon: Sparkles, label: 'Weave', value: product.weave },
    { icon: Palette, label: 'Color', value: product.color },
    { icon: Flower2, label: 'Occasion', value: product.occasion },
  ].filter((h): h is typeof h & { value: string } => Boolean(h.value?.trim()));

  const specs = [
    { label: 'Fabric', value: product.fabric },
    { label: 'Weave', value: product.weave },
    { label: 'Saree Length', value: product.saree_length },
    { label: 'Blouse Length', value: product.blouse_length },
    { label: 'Color', value: product.color },
    { label: 'Occasion', value: product.occasion },
    { label: 'Care', value: product.care_instructions },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value?.trim()));

  const description = product.description?.trim();

  const tabs: ProductTab[] = [
    {
      id: 'details',
      label: 'Product Details',
      content: (
        <div className={`grid gap-8 ${specs.length > 0 ? 'md:grid-cols-2' : ''}`}>
          <div>
            <h3 className="font-serif text-lg text-neutral-900 mb-3">About the Saree</h3>
            <p className="text-sm leading-relaxed text-neutral-600 whitespace-pre-line">
              {description || 'Product description coming soon.'}
            </p>
          </div>
          {specs.length > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="font-serif text-lg text-neutral-900 mb-3">Product Specifications</h3>
              <dl className="divide-y divide-neutral-100 text-sm">
                {specs.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-4 py-2">
                    <dt className="text-neutral-500">{spec.label}</dt>
                    <dd className="text-neutral-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'shipping',
      label: 'Shipping & Returns',
      content: (
        <ul className="space-y-3 text-sm leading-relaxed text-neutral-600 max-w-2xl">
          <li>Free shipping on orders above ₹4,999 across India.</li>
          <li>International shipping is available.</li>
          <li>7-day hassle-free returns and exchanges.</li>
        </ul>
      ),
    },
    ...(product.care_instructions?.trim()
      ? [
          {
            id: 'care',
            label: 'Care Instructions',
            content: (
              <p className="text-sm leading-relaxed text-neutral-600 whitespace-pre-line max-w-2xl">
                {product.care_instructions}
              </p>
            ),
          },
        ]
      : []),
    {
      id: 'reviews',
      label: 'Reviews',
      content: (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-10 text-center max-w-2xl">
          <p className="font-serif text-lg text-neutral-900">Reviews coming soon</p>
          <p className="text-sm text-neutral-500 mt-1">
            We&apos;re collecting feedback from our customers for this weave.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 pb-6">
        <nav aria-label="Breadcrumb" className="py-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
            <li>
              <Link href="/" className="hover:text-brand-maroon transition-colors">Home</Link>
            </li>
            <li aria-hidden><ChevronRight size={12} /></li>
            <li>
              <Link href="/collections" className="hover:text-brand-maroon transition-colors">Collections</Link>
            </li>
            {category && (
              <>
                <li aria-hidden><ChevronRight size={12} /></li>
                <li>
                  <Link href={`/collections/${category.slug}`} className="hover:text-brand-maroon transition-colors">
                    {category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden><ChevronRight size={12} /></li>
            <li aria-current="page" className="text-brand-maroon font-medium line-clamp-1">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <ProductGallery images={gallery} alt={product.name} />

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.badge && (
                  <span className="bg-brand-maroon text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded">
                    {product.badge}
                  </span>
                )}
                {product.material_label && (
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-maroon">
                    {product.material_label}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl leading-tight text-neutral-900">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="text-2xl md:text-3xl font-semibold text-brand-maroon">
                  {formatINR(product.price)}
                </span>
                {discount !== null && (
                  <>
                    <span className="text-base text-neutral-400 line-through">
                      {formatINR(product.original_price!)}
                    </span>
                    <span className="rounded bg-brand-maroon/10 px-2 py-1 text-xs font-semibold text-brand-maroon">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1">5% GST is added at checkout.</p>

              {description && (
                <p className="mt-4 text-sm leading-relaxed text-neutral-600 line-clamp-3">{description}</p>
              )}
            </div>

            {highlights.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-neutral-200 py-5">
                {highlights.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 shrink-0 rounded-full bg-brand-maroon/10 flex items-center justify-center">
                      <Icon size={16} className="text-brand-maroon" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] text-neutral-500">{label}</span>
                      <span className="block text-xs font-medium text-neutral-900 truncate">{value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {product.in_stock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <CheckCircle2 size={14} />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                Sold Out
              </span>
            )}

            <PurchasePanel productId={product.id} inStock={product.in_stock} />

            <DeliveryChecker />
          </div>
        </div>

        <section className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <ProductTabs tabs={tabs} />

          <aside className="rounded-xl border border-neutral-200 bg-white p-5 lg:mt-11">
            <ul className="space-y-4">
              {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon size={20} className="text-brand-maroon shrink-0 mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium text-neutral-900">{title}</span>
                    <span className="block text-xs text-neutral-500">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>

      <ProductCarousel
        id="related-products"
        eyebrow="Curated for You"
        title="You May Also Like"
        products={related}
      />
    </>
  );
}
