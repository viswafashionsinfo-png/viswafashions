import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-serif text-xl text-white mb-3">
            Viswa<span className="text-brand-maroon">fashions</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Handwoven sarees rooted in Indian craftsmanship, curated for the
            modern woman who honors tradition with every drape.
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3 text-sm tracking-wide uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/#categories" className="hover:text-white transition-colors">Collections</Link></li>
            <li><Link href="/?filter=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link href="/#best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3 text-sm tracking-wide uppercase">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-white transition-colors">Returns &amp; Exchanges</Link></li>
            <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3 text-sm tracking-wide uppercase">Get In Touch</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> India</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +91 12345 67890</li>
            <li className="flex items-center gap-2"><Mail size={14} /> viswafashions.info@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Viswafashions. All rights reserved.
      </div>
    </footer>
  );
}
