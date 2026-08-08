# How to deploy this final version — step by step

## Step 1 — Run the new Supabase SQL (1 minute)
1. Supabase Dashboard → SQL Editor → New Query.
2. Open `supabase/phase2-additions.sql` from this folder, copy all, paste, click Run.
   (Skip `supabase/schema.sql` — you already ran that one originally.)

## Step 2 — Replace your project folder
1. In VS Code, close the project.
2. Delete (or rename) your old `viswafashions` project folder — but FIRST,
   copy your `.env.local` file somewhere safe (Explorer/Finder), since it's
   not included in this download and holds your real Supabase keys.
3. Unzip this new folder in its place.
4. Put your saved `.env.local` back into the root of this new folder.
5. Open this folder in VS Code.

## Step 3 — Fix the hero image
1. Open `components/Hero.tsx`.
2. Find `PASTE_YOUR_HERO_IMAGE_URL_HERE` and replace it with your real
   saree photo URL from Supabase Storage.
3. Save.

## Step 4 — Test locally
```bash
npm install
npm run dev
```
Open `localhost:3000` and check everything looks right: Hero, New Arrivals,
Shop by Category, Best Sellers, Why Shop With Us, Testimonials, Newsletter,
and `/track`.

## Step 5 — Push to GitHub
```bash
git add .
git commit -m "Full redesign: hero, navbar, product cards, trust section, testimonials, newsletter, track order"
git push
```

## Step 6 — Fix Vercel (this is the step that's been silently broken)
1. Vercel Dashboard → your project → Settings → Environment Variables.
2. Check `NEXT_PUBLIC_SUPABASE_URL` — it must be EXACTLY:
   `https://your-project-ref.supabase.co`
   with NO `/rest/v1/` and NO trailing slash at the end.
3. If it was wrong, fix it, save.
4. Go to Deployments → latest deployment → ⋯ menu → Redeploy.

## Step 7 — Verify live
Visit shop.ajverma.shop and confirm it now matches your localhost.

## Still outstanding (not in this package)
- Real product/category photos (you're partway through this — keep going
  in Supabase Table Editor).
- Real Razorpay payment integration (currently a mock alert on checkout).
- Order notifications — see `supabase/order-notifications-setup.md` in this folder.
  if you need it again.
- `/shipping-policy`, `/returns`, `/faqs` pages — footer links exist but
  point to pages that don't exist yet.
