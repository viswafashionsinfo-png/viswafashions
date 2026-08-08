'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { lookupPincode } from '@/lib/pincode';
import type { Product } from '@/lib/types';

interface CheckoutFormProps {
  product: Product;
}

const GST_RATE = 0.05; // 5% total: 2.5% CGST + 2.5% SGST
const CGST_RATE = 0.025;
const SGST_RATE = 0.025;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  completeAddress: string;
};

const initialForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  pincode: '',
  area: '',
  city: '',
  state: '',
  completeAddress: '',
};

export default function CheckoutForm({ product }: CheckoutFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'found' | 'not-found'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { cgst, sgst, total } = useMemo(() => {
    const subtotal = product.price;
    const cgstAmount = subtotal * CGST_RATE;
    const sgstAmount = subtotal * SGST_RATE;
    return {
      cgst: cgstAmount,
      sgst: sgstAmount,
      total: subtotal + cgstAmount + sgstAmount,
    };
  }, [product.price]);

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Simulates a pincode lookup (per the brief — not a real API call).
  // See lib/pincode.ts for the mock data and how to swap in a real API later.
  function handleCheckPincode() {
    setPincodeStatus('checking');
    setTimeout(() => {
      const result = lookupPincode(form.pincode.trim());
      if (result) {
        setForm((prev) => ({ ...prev, city: result.city, state: result.state }));
        setPincodeStatus('found');
      } else {
        setPincodeStatus('not-found');
      }
    }, 400); // tiny delay so the "Checking..." state is visible
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.from('orders').insert([{
  full_name: form.fullName,
  email: form.email,
  phone_number: form.phone,
  pincode: form.pincode,
  area: form.area,
  city: form.city,
  state: form.state,
  complete_address: form.completeAddress,
  product_id: product.id,
  total_amount: Number(total.toFixed(2)),
  payment_status: 'pending',
}] as any); // <--- Add this [ ] around the object and the 'as any'

      if (error) throw error;

      // Mock Razorpay integration — replace this block with a real Razorpay
      // checkout.js call once you have API keys. On success there, update the
      // matching order row's payment_status to 'paid' (e.g. via a serverless
      // function using the service_role key, never the public anon key).
      window.alert(
        `Mock Razorpay Checkout\n\nAmount: ₹${total.toFixed(2)}\n\nThis is a placeholder — plug in real Razorpay keys to accept live payments.`
      );

      router.push('/');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong placing your order.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
      {/* Left column: Customer info + address */}
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-serif text-xl mb-4">Customer Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Email" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Phone Number" required>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-serif text-xl mb-4">Delivery Address</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Pincode" required>
              <div className="flex gap-2">
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) => {
                    handleChange('pincode', e.target.value);
                    setPincodeStatus('idle');
                  }}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={handleCheckPincode}
                  disabled={form.pincode.length !== 6 || pincodeStatus === 'checking'}
                  className="shrink-0 px-3 py-2 rounded-lg text-sm font-medium bg-brand-dark text-white disabled:opacity-40 hover:bg-black transition-colors"
                >
                  {pincodeStatus === 'checking' ? '...' : 'Check'}
                </button>
              </div>
              {pincodeStatus === 'found' && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={12} /> City &amp; state auto-filled
                </p>
              )}
              {pincodeStatus === 'not-found' && (
                <p className="text-xs text-red-600 mt-1">
                  Couldn&apos;t match that pincode — please enter city/state manually.
                </p>
              )}
            </Field>
            <Field label="Area / Locality">
              <input
                type="text"
                value={form.area}
                onChange={(e) => handleChange('area', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="City" required>
              <input
                required
                type="text"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="State" required>
              <input
                required
                type="text"
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Complete Address" required className="sm:col-span-3">
              <textarea
                required
                rows={3}
                value={form.completeAddress}
                onChange={(e) => handleChange('completeAddress', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </section>
      </div>

      {/* Right column: Order summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
          <h2 className="font-serif text-xl mb-4">Order Summary</h2>

          <div className="flex gap-4">
            <div className="w-20 h-24 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="font-medium text-neutral-900 line-clamp-2">{product.name}</p>
              <p className="text-brand-maroon font-semibold mt-1">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm border-t border-neutral-100 pt-4">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>₹{product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>CGST (2.5%)</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>SGST (2.5%)</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-neutral-900 text-base border-t border-neutral-100 pt-2 mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-red-600 mt-4">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-maroon text-white font-medium py-3 rounded-lg hover:bg-brand-maroonDark transition-colors disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Placing order...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/50 focus:border-brand-maroon';

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm ${className ?? ''}`}>
      <span className="block mb-1 text-neutral-700 font-medium">
        {label} {required && <span className="text-brand-maroon">*</span>}
      </span>
      {children}
    </label>
  );
}
