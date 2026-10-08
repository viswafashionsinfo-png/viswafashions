'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Heart, Package, ChevronDown, ShoppingBag } from 'lucide-react';
import type { Category } from '@/lib/types';
import { useGuestStore } from '@/components/GuestStoreProvider';

interface NavbarProps {
  categories: Category[];
}

const STATIC_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/collections' },
  { label: 'New Arrivals', href: '/collections?filter=new' },
  { label: 'Best Sellers', href: '/collections?filter=best' },
];

// How many categories (in display_order) sit directly in the desktop bar
// before the rest move under "More". Two tiers because the bar is narrower
// at `lg` than at `xl`; the classes below must stay in sync with these.
const INLINE_CATEGORIES_LG = 2;
const INLINE_CATEGORIES_XL = 4;

export default function Navbar({ categories }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { bagCount } = useGuestStore();

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  const moreCategories = categories.slice(INLINE_CATEGORIES_LG);
  const moreButtonClass =
    categories.length > INLINE_CATEGORIES_XL
      ? 'relative'
      : categories.length > INLINE_CATEGORIES_LG
        ? 'relative xl:hidden'
        : 'hidden';

  return (
    <header className="sticky top-0 z-50 bg-brand-dark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="flex flex-col leading-none shrink-0">
          <span className="font-serif text-2xl tracking-wide">
            Viswa<span className="text-brand-maroon">fashions</span>
          </span>
          <span className="text-[9px] tracking-[0.25em] text-white/50 mt-1 uppercase">
            Handwoven Heritage
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium whitespace-nowrap">
          {STATIC_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-maroon transition-colors">
              {link.label}
            </Link>
          ))}
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className={`hover:text-brand-maroon transition-colors ${
                i >= INLINE_CATEGORIES_XL ? 'hidden' : i >= INLINE_CATEGORIES_LG ? 'hidden xl:inline' : ''
              }`}
            >
              {cat.name}
            </Link>
          ))}

          <div ref={moreRef} className={moreButtonClass}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              className="flex items-center gap-1 hover:text-brand-maroon transition-colors"
            >
              More
              <ChevronDown size={14} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-4 min-w-[12rem] bg-brand-dark border border-white/10 rounded-lg shadow-md py-2">
                {moreCategories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    onClick={() => setMoreOpen(false)}
                    className={`block px-4 py-2 hover:text-brand-maroon hover:bg-white/5 transition-colors ${
                      i + INLINE_CATEGORIES_LG < INLINE_CATEGORIES_XL ? 'xl:hidden' : ''
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hidden sm:flex hover:text-brand-maroon transition-colors">
            <Search size={18} />
          </button>
          <button aria-label="Wishlist" className="hidden sm:flex hover:text-brand-maroon transition-colors">
            <Heart size={18} />
          </button>
          <Link
            href="/bag"
            aria-label={bagCount > 0 ? `Shopping bag, ${bagCount} items` : 'Shopping bag'}
            className="relative flex hover:text-brand-maroon transition-colors"
          >
            <ShoppingBag size={18} />
            {bagCount > 0 && (
              <span className="absolute -top-2 -right-2.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-brand-maroon text-white text-[10px] font-semibold leading-[1.1rem] text-center">
                {bagCount}
              </span>
            )}
          </Link>

          <Link
            href="/track"
            className="hidden sm:flex items-center gap-1.5 border border-white/25 rounded-full px-4 py-2 text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            <Package size={14} />
            Track Order
          </Link>

          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-brand-dark max-h-[calc(100vh-7rem)] overflow-y-auto">
          {STATIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-1 hover:text-brand-maroon transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="py-1 hover:text-brand-maroon transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/track"
            onClick={() => setMenuOpen(false)}
            className="py-1 flex items-center gap-1.5 hover:text-brand-maroon transition-colors"
          >
            <Package size={14} />
            Track Order
          </Link>
        </nav>
      )}
    </header>
  );
}
