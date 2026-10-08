'use client';

import Link from 'next/link';

export default function ProductError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-3xl md:text-4xl text-neutral-900">
        This saree couldn&apos;t be loaded right now
      </h1>
      <p className="text-neutral-600 mt-3">Please try again in a moment.</p>
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={reset}
          className="px-8 py-3 rounded-full text-white font-medium bg-brand-maroon hover:bg-brand-maroonDark transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/collections"
          className="px-8 py-3 rounded-full font-medium border border-neutral-300 text-neutral-800 hover:border-brand-maroon hover:text-brand-maroon transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    </main>
  );
}
