import { Truck, Award, ShieldCheck, RefreshCw } from 'lucide-react';

const REASONS = [
  { icon: Truck, title: 'Free Shipping', text: 'Complimentary delivery across India on all orders above ₹4,999.' },
  { icon: Award, title: 'Premium Quality', text: 'Every saree is hand-checked for weave, zari and finishing before it ships.' },
  { icon: ShieldCheck, title: 'Secure Payment', text: 'Bank-grade encryption on every transaction, always.' },
  { icon: RefreshCw, title: 'Easy Returns', text: '7-day hassle-free returns and exchanges, no questions asked.' },
];

export default function WhyShopWithUs() {
  return (
    <section className="bg-brand-bg py-14">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-brand-maroon text-xs font-semibold tracking-[0.2em] uppercase mb-2">Our Promise</p>
        <h2 className="font-serif text-2xl md:text-3xl text-neutral-900 mb-10">Why Shop With Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {REASONS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-xl shadow-card p-6 flex flex-col items-center text-center">
              <span className="w-10 h-10 rounded-full bg-brand-maroon/10 flex items-center justify-center mb-3">
                <Icon size={18} className="text-brand-maroon" />
              </span>
              <p className="font-serif text-sm text-neutral-900 mb-1">{title}</p>
              <p className="text-xs text-neutral-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
