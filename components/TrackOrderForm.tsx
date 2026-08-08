'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface OrderResult {
  id: string;
  product_name: string | null;
  total_amount: number;
  payment_status: string;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Order placed — payment pending',
  paid: 'Payment confirmed — preparing your order',
  failed: 'Payment failed — please contact support',
};

export default function TrackOrderForm() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<OrderResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders(null);

    const { data, error } = await supabase.rpc('track_order', {
      p_phone: phone.trim(),
      p_email: email.trim(),
    });

    setLoading(false);
    if (error) {
      setError('Something went wrong looking up your order. Please try again.');
      return;
    }
    setOrders(data as OrderResult[]);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-maroon text-white font-medium py-2.5 rounded-lg hover:bg-brand-maroonDark transition-colors disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {orders && orders.length === 0 && (
        <p className="text-sm text-neutral-500 mt-6">
          No orders found for that phone number and email combination.
        </p>
      )}

      {orders && orders.length > 0 && (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-card p-4">
              <p className="font-medium text-neutral-900">{order.product_name ?? 'Product'}</p>
              <p className="text-sm text-neutral-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN')} &middot; ₹
                {order.total_amount.toFixed(2)}
              </p>
              <p className="text-sm font-medium text-brand-maroon mt-2">
                {STATUS_LABEL[order.payment_status] ?? order.payment_status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
