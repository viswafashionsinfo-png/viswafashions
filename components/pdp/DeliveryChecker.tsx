'use client';

import { useState } from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import { lookupPincode } from '@/lib/pincode';

type Status =
  | { kind: 'idle' }
  | { kind: 'found'; city: string; state: string }
  | { kind: 'not-found' };

export default function DeliveryChecker() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = lookupPincode(pincode.trim());
    setStatus(result ? { kind: 'found', ...result } : { kind: 'not-found' });
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <form onSubmit={handleSubmit}>
        <label htmlFor="pdp-pincode" className="flex items-center gap-1.5 text-sm font-medium text-neutral-900 mb-2">
          <MapPin size={15} className="text-brand-maroon" />
          Check Delivery
        </label>
        <div className="flex">
          <input
            id="pdp-pincode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ''));
              setStatus({ kind: 'idle' });
            }}
            className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/40 focus:border-brand-maroon"
          />
          <button
            type="submit"
            disabled={pincode.length !== 6}
            className="rounded-r-lg bg-brand-maroon px-5 text-sm font-medium text-white hover:bg-brand-maroonDark transition-colors disabled:opacity-50"
          >
            Check
          </button>
        </div>
      </form>

      <div aria-live="polite" className="sm:pl-5 sm:border-l sm:border-neutral-200 sm:min-w-[12rem] text-sm">
        {status.kind === 'found' && (
          <p className="flex items-start gap-2">
            <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
            <span>
              <span className="block font-medium text-green-700">Delivery available</span>
              <span className="text-neutral-500">
                {status.city}, {status.state}
              </span>
            </span>
          </p>
        )}
        {status.kind === 'not-found' && (
          <p className="text-neutral-600">We couldn&apos;t verify that pincode. Please check it and try again.</p>
        )}
        {status.kind === 'idle' && (
          <p className="text-neutral-500">Enter your 6-digit pincode to check delivery.</p>
        )}
      </div>
    </div>
  );
}
