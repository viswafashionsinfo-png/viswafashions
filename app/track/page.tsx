import TrackOrderForm from '@/components/TrackOrderForm';

export default function TrackOrderPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-2">Track Your Order</h1>
      <p className="text-neutral-600 mb-8">
        Enter the phone number and email you used at checkout to see your order status.
      </p>
      <TrackOrderForm />
    </main>
  );
}
