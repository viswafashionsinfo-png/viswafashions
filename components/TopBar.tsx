import { Truck, Globe2, Headset } from 'lucide-react';

// Centered three-item announcement strip, separated by dots.
// Edit MESSAGES to change the copy/icons.
const MESSAGES = [
  { icon: Truck, text: 'Free Shipping on orders above ₹4,999' },
  { icon: Globe2, text: 'International Shipping Available' },
  { icon: Headset, text: '24/7 Customer Support' },
];

export default function TopBar() {
  return (
    <div className="bg-brand-dark text-white/90 text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-center gap-6">
        {MESSAGES.map(({ icon: Icon, text }, i) => (
          <span key={text} className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
            <Icon size={12} className="text-brand-maroon shrink-0" />
            {text}
            {i < MESSAGES.length - 1 && <span className="ml-6 text-white/30">&middot;</span>}
          </span>
        ))}
        <span className="flex sm:hidden items-center gap-1.5">
          <Truck size={12} className="text-brand-maroon shrink-0" />
          {MESSAGES[0].text}
        </span>
      </div>
    </div>
  );
}
