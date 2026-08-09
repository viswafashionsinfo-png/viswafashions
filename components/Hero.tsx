import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

// Stats are hand-set copy, not database-driven — edit the numbers directly
// here as your real figures change.
const STATS = [
  { value: '12k+', label: 'Happy Customers' },
  { value: '450+', label: 'Handloom Weaves' },
  { value: '4.9★', label: 'Customer Rating' },
];

// IMAGE: replace PASTE_YOUR_HERO_IMAGE_URL_HERE below with your real photo's
// Supabase Storage URL before deploying.
export default function Hero() {
  return (
    <section className="bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 md:gap-12 items-center py-12 md:py-16">
        <div>
          <p className="text-brand-maroon text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            The Heritage Weave Edit — 2026
          </p>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-neutral-900">
            Drape yourself in
            <br />
            <span className="italic text-brand-maroon">timeless</span> elegance
          </h1>

          <p className="mt-5 text-neutral-600 text-base md:text-lg max-w-md">
            Handpicked Kanjivaram, Banarasi and designer sarees, woven by
            master artisans and curated for the woman who wears her heritage
            with pride.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-8">
            <Link
              href="/#new-collections"
              className="px-8 py-3 rounded-full text-white font-medium bg-brand-dark hover:bg-black transition-colors inline-flex items-center gap-2"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/?filter=new"
              className="text-sm font-semibold text-neutral-800 hover:text-brand-maroon transition-colors inline-flex items-center gap-1.5"
            >
              Shop New Arrivals
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-8 mt-10 pt-8 border-t border-neutral-200">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl text-neutral-900">{stat.value}</p>
                <p className="text-[10px] tracking-wide uppercase text-neutral-500 mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-card">
            <img
              src=https://ewmkgivhnjbzedbewuvc.supabase.co/storage/v1/object/public/viswafashionsinfo-png's%20Org/Teacher.jpg"
              alt="Model draped in a luxury handwoven silk saree"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-72 bg-white rounded-xl shadow-card p-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-brand-maroon/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} className="text-brand-maroon" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900 leading-tight">
                Handpicked Weaves
              </p>
              <p className="text-xs text-neutral-500 leading-tight mt-0.5">
                Authentic handloom, verified craftsmanship
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
