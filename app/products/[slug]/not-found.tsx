import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-brand-maroon text-xs font-semibold tracking-[0.2em] uppercase mb-3">
        Not Available
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-neutral-900">
        We couldn&apos;t find this saree
      </h1>
      <p className="text-neutral-600 mt-3">
        It may have been removed or the link may be incorrect.
      </p>
      <Link
        href="/collections"
        className="inline-block mt-8 px-8 py-3 rounded-full text-white font-medium bg-brand-dark hover:bg-black transition-colors"
      >
        Browse Collections
      </Link>
    </main>
  );
}
