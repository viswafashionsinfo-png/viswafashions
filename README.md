# Viswafashions

A fully database-driven e-commerce storefront. The frontend is a mirror of
your Supabase tables — manage products, categories, stock, and sort order
entirely from the Supabase Table Editor. No admin dashboard, no redeploys
needed to change the catalog.

## Step 1 — Set up Supabase

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run the entire contents of `supabase/schema.sql`.
   This creates `categories`, `products`, and `orders`, enables Row Level
   Security, and adds public read policies for categories/products plus a
   public insert-only policy for orders (so guest checkout works, but nobody
   can read other customers' order data with the public key).
3. Open **Table Editor** and start adding your real categories and products.
   Use `display_order` to control sort position (lower = first).
   Set a product's `badge` to something containing "new" (e.g. `"NEW"`) to
   have it appear in the **New Collections** carousel, or containing "best"
   (e.g. `"★ Best Seller"`) for the **Best Sellers** carousel.
4. Upload product/category images to **Storage** (or use any public image
   URL) and paste the URL into `image_url`.

## Step 2 — Run locally

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local with your Supabase URL + anon key
npm run dev
```

Visit http://localhost:3000.

## Step 3 — How the data flows

- `app/layout.tsx` fetches `categories` once (server-side) and passes them to
  `Navbar` for dynamic nav links + the mobile menu.
- `app/page.tsx` (Home) fetches `categories` for "Shop by Category" and two
  `products` queries (filtered by `badge`) for the New Collections / Best
  Sellers carousels, all ordered by `display_order`.
- Clicking **Buy Now** on a `ProductCard` links to `/checkout?productId=...`
  — the product ID lives in the URL rather than client-side global state, so
  it survives refreshes and back/forward navigation.
- `app/checkout/page.tsx` fetches that one product server-side and renders
  `CheckoutForm`, which:
  - has a **Check Pincode** button that *simulates* a city/state lookup (see
    `lib/pincode.ts` — swap this for a real API like
    `https://api.postalpincode.in` whenever you're ready)
  - calculates 5% GST (2.5% CGST + 2.5% SGST) live as you look at the summary
  - on submit, inserts the order into Supabase with `payment_status: 'pending'`
    and then shows a **mock Razorpay alert** in place of real payment
    processing

## Step 4 — Going live with real payments (Razorpay)

The current "Proceed to Payment" button is a placeholder (`window.alert`) so
you can test the full flow without API keys. To wire up real payments:

1. Get your Razorpay Key ID / Secret from the Razorpay dashboard.
2. Add the Razorpay checkout script and replace the `window.alert(...)` block
   in `components/CheckoutForm.tsx` with a real `Razorpay` checkout instance.
3. On successful payment, call a small serverless function (e.g. a Next.js
   Route Handler) that uses your Supabase **service_role** key (never expose
   this key in the browser) to update that order's `payment_status` to
   `'paid'`.

## Step 5 — Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import the repo in Vercel.
3. In **Project Settings > Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (optional)
4. Deploy. Vercel will run `next build` automatically using these values.

## Project structure

```
app/
  layout.tsx          Root layout — fonts, TopBar, Navbar, Footer
  page.tsx            Home page — Hero, CategoryRow, two ProductCarousels
  checkout/page.tsx    Fetches the selected product, renders CheckoutForm
  globals.css
components/
  TopBar.tsx
  Navbar.tsx
  Hero.tsx
  CategoryRow.tsx
  ProductCarousel.tsx
  ProductCard.tsx
  CheckoutForm.tsx
  Footer.tsx
lib/
  supabase/client.ts   Shared Supabase client (anon key only)
  types.ts             Category / Product / Order types
  pincode.ts           Mock pincode -> city/state lookup
supabase/
  schema.sql           Full DB schema + RLS policies + sample categories
```
