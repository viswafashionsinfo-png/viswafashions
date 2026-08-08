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

// Layout is a server component so it can fetch categories once, server-side,
// and hand them to the (client) Navbar for its dynamic links + mobile menu.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  console.log('CATEGORIES RESULT:', categories);
  console.log('CATEGORIES ERROR:', error);

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