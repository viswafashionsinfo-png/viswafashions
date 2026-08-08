import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryRowProps {
  categories: Category[];
}

export default function CategoryRow({ categories }: CategoryRowProps) {
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 py-10 text-center">
      <p className="text-brand-maroon text-xs font-semibold tracking-[0.2em] uppercase mb-2">
        Curated by Weave
      </p>
      <h2 className="font-serif text-2xl md:text-3xl text-neutral-900">Shop by Category</h2>
      <p className="text-sm text-neutral-500 mt-1 mb-8">
        From everyday cottons to bridal silks, find the drape for every occasion.
      </p>

      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2 justify-start sm:justify-center">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/?category=${cat.id}#new-collections`} className="flex flex-col items-center gap-3 shrink-0 group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-1 ring-neutral-200 group-hover:ring-brand-maroon overflow-hidden bg-neutral-50 transition-all p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                    {cat.name[0]}
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs font-medium text-neutral-700 text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
