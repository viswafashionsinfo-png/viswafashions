export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { supabase } from '@/lib/supabase/client';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Viswafashions — Womens World',
  description: 'Premium sarees and ethnic wear for the modern Indian woman.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <TopBar />
        <Navbar categories={categories ?? []} />
        {children}
        <Footer />
      </body>
    </html>
  );
}