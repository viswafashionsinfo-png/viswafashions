'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    const { error } = await supabase.from('newsletter_signups' as any).insert({ email } as any);
    setStatus(error ? 'error' : 'done');
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-brand-maroon rounded-2xl px-6 py-12 text-center text-white">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/70 mb-2">
          Join the Viswafashions Circle
        </p>
        <h2 className="font-serif text-2xl md:text-3xl mb-2">
          Be first to know about new weaves &amp; private previews
        </h2>
        <p className="text-sm text-white/80 max-w-md mx-auto mb-6">
          Subscribe for early access to limited-edition drops and exclusive festive offers.
        </p>

        {status === 'done' ? (
          <p className="text-sm font-medium">You&apos;re on the list — thank you!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-[200px] rounded-full px-4 py-2.5 text-sm text-neutral-900 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'saving'}
              className="bg-white text-brand-maroon font-semibold text-sm px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 hover:bg-white/90 transition-colors disabled:opacity-60"
            >
              {status === 'saving' ? 'Saving...' : 'Subscribe'}
              <ArrowRight size={14} />
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs text-white/80 mt-3">
            Something went wrong — make sure the newsletter_signups table exists in Supabase.
          </p>
        )}
      </div>
    </section>
  );
}
