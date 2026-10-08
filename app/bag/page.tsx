import type { Metadata } from 'next';
import BagView from '@/components/BagView';

export const metadata: Metadata = {
  title: 'Your Bag — Viswafashions',
};

export default function BagPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-8">Your Bag</h1>
      <BagView />
    </main>
  );
}
