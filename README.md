# Katrina Realty

Single-page site for **Katrina Kirton Sherrod** — REALTOR® serving Maryland, Washington D.C., and Pennsylvania (Samson Properties).

Built with React + Vite + TypeScript + Tailwind v4 + Supabase. Deployed on Netlify.

## Sections

- Cinematic hero with looping video background
- About + bio + stats (56 sales, 5.0 Zillow rating)
- Listings grid (For Sale / Sold filters, pulls from Supabase)
- Service Areas (MD · DC · PA, 11+ counties)
- Open House Sign-In form (writes to Supabase)
- Reviews
- Contact
- `/admin` — PIN-protected dashboard to manage listings + view/export sign-ins

## Local dev

```bash
npm install
cp .env.example .env.local
# Fill in Supabase URL + anon key + admin PIN hash
npm run dev
```

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. SQL Editor → paste `schema.sql` → Run
3. Project Settings → API → copy the URL + anon key into `.env.local` and Netlify env vars

## Admin PIN

The admin page (`/admin`) is gated by a SHA-256 PIN hash. Generate yours:

```bash
echo -n "1234" | shasum -a 256
# 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4
```

Paste the hash into `VITE_ADMIN_PIN_HASH`. With no env var set, the dev fallback PIN is `1234`.

## Deploy

```bash
netlify deploy --prod --build
```

## Updating Katrina's photo

Replace `public/katrina.jpg` with a new headshot (4:5 aspect ratio).

## Custom domain

1. Netlify → Domain settings → Add custom domain
2. Update DNS at registrar to Netlify's records
3. Free HTTPS via Let's Encrypt
