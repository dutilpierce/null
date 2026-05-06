This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Windows development reliability

- **Avoid OneDrive-backed folders**: Windows file locking + real-time sync often causes `EBUSY`, `TAR_ENTRY_ERROR`, or partially-written `node_modules`. Prefer a path like `C:\dev\null-division-web` instead of `C:\Users\<you>\OneDrive\...`.
- **Recommended Node**: Use **Node 20 LTS** (see `.nvmrc`). If you use `nvm-windows`, install and `nvm use` that version.
- **If `npm install` fails / `node_modules` looks corrupted**:

```powershell
cd "C:\path\to\Null Division Web"
npm run clean
npm cache clean --force
npm install
```

- **If you still see `ECONNRESET`**: retry on a stable connection, and ensure your proxy/VPN/AV isn’t MITM-ing npm registry traffic.

## Pre-launch verification checklist

Run the dev server:

```powershell
npm install
npm run dev
```

- **Homepage loads**
  - Visit `http://localhost:3000/`
  - If you see a Supabase warning banner, configure `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- **Diagnostics / health**
  - Visit `http://localhost:3000/health`
  - Or `GET http://localhost:3000/api/health` (expects 200 when env + Supabase are configured, otherwise 503)

- **Product page loads**
  - Visit `http://localhost:3000/drop/current`
  - If it says current iteration not configured, confirm `site_settings.current_product_slug` exists in Supabase.

- **Waitlist form works**
  - Use the form on the homepage or `/waitlist`
  - Confirm the API returns `{"ok":true}` (Network tab) and the row appears in `public.waitlist`.

- **Checkout session creates**
  - On `/drop/current`, attempt a purchase.
  - Confirm `/api/checkout` returns `{ ok: true, url: "https://checkout.stripe.com/..." }`.

- **Stripe webhook works locally**
  - Install Stripe CLI and login.
  - Forward events to your local webhook:

```powershell
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

  - Complete a test Checkout payment; confirm your terminal shows `checkout.session.completed` delivered and the app returns `{"received":true}`.
  - Confirm Supabase:
    - `public.orders` has a row with the Stripe session id
    - `public.products.units_sold` increments by 1

- **Sold-out state works**
  - In Supabase, set `products.units_sold` to 50 (for the current product), or run 50 test purchases.
  - Reload `/drop/current` and confirm the UI shows `SOLD OUT` and checkout is blocked.

## Prelaunch landing toggle (temporary)

The homepage can be temporarily replaced with a pre-launch landing screen without deleting the real homepage.

- **Enable**: set `PRELAUNCH_MODE=true`
- **Optional countdown target**: set `PRELAUNCH_TARGET_ISO` to an ISO datetime string (e.g. `2026-06-05T00:00:00.000Z`).
  - If omitted, it defaults to **30 days from server time** at request time.
- **Disable at launch**: remove the env var or set `PRELAUNCH_MODE=false` and redeploy.

**Vercel tips**

- After changing env vars, you must **Redeploy** (Vercel shows a toast prompting this).
- If a variable is marked **Sensitive**, the value field stays **blank** after save—that is normal; the runtime still receives the value.
- Confirm what production sees under **`/api/health`** (JSON includes `prelaunch.enabled`) or open **`/health`** in the browser.
- If **`/api/prelaunch` returns 404**, that deployment does not include the latest code—redeploy from the latest `main` branch.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
