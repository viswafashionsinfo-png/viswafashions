const REVIEWS = [
  { name: 'Customer Name', location: 'City', quote: 'Replace with a real customer quote once you have reviews.' },
  { name: 'Customer Name', location: 'City', quote: 'Replace with a real customer quote once you have reviews.' },
  { name: 'Customer Name', location: 'City', quote: 'Replace with a real customer quote once you have reviews.' },
];

// These are placeholders, not real reviews — swap for real customer quotes
// once you've collected a few (ask happy customers over WhatsApp).
export default function Testimonials() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-brand-maroon text-xs font-semibold tracking-[0.2em] uppercase mb-2">Words From Our Clientele</p>
        <h2 className="font-serif text-2xl md:text-3xl text-neutral-900 mb-10">What They&apos;re Saying</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-brand-bg rounded-xl p-5 shadow-card">
              <div className="text-brand-maroon text-sm mb-2">★★★★★</div>
              <p className="text-sm text-neutral-700 leading-relaxed mb-4">&ldquo;{review.quote}&rdquo;</p>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-500">
                  {review.name[0]}
                </span>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">{review.name}</p>
                  <p className="text-[11px] text-neutral-500">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
