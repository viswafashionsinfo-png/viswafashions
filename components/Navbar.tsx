'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Heart, Package } from 'lucide-react';
import type { Category } from '@/lib/types';

interface NavbarProps {
  categories: Category[];
}

const STATIC_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/#categories' },
  { label: 'New Arrivals', href: '/?filter=new' },
  { label: 'Best Sellers', href: '/#best-sellers' },
];

export default function Navbar({ categories }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {STATIC_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-maroon transition-colors">
              {link.label}
            </Link>
          ))}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}#new-collections`}
              className="hover:text-brand-maroon transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hidden sm:flex hover:text-brand-maroon transition-colors">
            <Search size={18} />
          </button>
          <button aria-label="Wishlist" className="hidden sm:flex hover:text-brand-maroon transition-colors">
            <Heart size={18} />
          </button>

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
        <nav className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-brand-dark">
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
              href={`/?category=${cat.id}#new-collections`}
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
