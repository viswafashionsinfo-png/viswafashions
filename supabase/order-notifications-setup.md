# Getting notified when someone places an order (free setup)

Right now, orders land silently in your Supabase `orders` table. Here's the
free way to get an email/WhatsApp alert the moment one comes in.

## Step 1 — Create a free Zapier account
https://zapier.com → sign up free.

## Step 2 — Create a "Catch Hook" Zap
1. Create Zap → trigger: Webhooks by Zapier → Catch Hook.
2. Copy the unique URL Zapier gives you.

## Step 3 — Wire it to Supabase
1. Supabase Dashboard → Database → Webhooks → Create a new hook.
2. Table: orders. Events: Insert only. Type: HTTP Request.
3. URL: paste the Zapier webhook URL. Method: POST. Save.

## Step 4 — Add an action in Zapier
After the trigger, add: Email by Zapier (free), WhatsApp, or Slack —
whichever you check daily.

Test by placing a test order and checking you get notified within seconds.
