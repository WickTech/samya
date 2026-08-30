# SĀMYA

Web app for **SĀMYA** — a wellness-focused cloud kitchen in Bhilai–Durg serving
clean, pure-veg, high-protein meal bowls, salads, sandwiches, smoothies and
cold-pressed juices.

> _Tossed Fresh, Crafted Gourmet._ · साम्य — *balance*

**Live:** https://samya-tawny.vercel.app

This is the Next.js rebuild of the original single-file site
(`reference/index.html`). Static-first, data-driven menu, deployed on Vercel —
every push to `main` ships to production automatically.

## Stack

- **Next.js 15** (App Router) + React 19
- **TypeScript**
- **Tailwind CSS 3.4** — brand tokens in `tailwind.config.ts`
- `next/font` — Cormorant Garamond (display), Inter (body), Caveat (accent)
- No backend, no database, no payment gateway in this phase (by design)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the admin vars (see "Admin dashboard")
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Routes

| Path             | Purpose                                                              |
| ---------------- | ------------------------------------------------------------------- |
| `/`              | Home — hero, signature dishes, why SĀMYA, about + gallery teasers   |
| `/menu`          | Full menu, filterable by category, dietary tag and protein level   |
| `/subscriptions` | Weekly / monthly / corporate plans (WhatsApp enquiry)             |
| `/about`         | Brand story and values                                            |
| `/gallery`       | Instagram-style feed grid (links to @samya.health)                |
| `/contact`       | Contact details + ordering channels                              |
| `/admin`         | **Private** owner dashboard — revenue, orders, menu (see below)   |

## Data

Everything the menu renders from lives in **`src/data/menu.json`**, typed by
**`src/types/menu.ts`**. Item schema:

```ts
{
  id, slug, name, category, description,
  price: { type: "fixed", amount } | { type: "tiered", tiers: [{ grams, amount }] },
  kcal, macros: { protein, carb, fat } | null,
  dietary: ("veg" | "vegan" | "dairy-free")[],
  signature: boolean,
  estimated: boolean,   // true = kitchen estimate, false = from the printed menu card
  image, volumeMl?
}
```

- Salad macros are taken from the printed menu card (`estimated: false`).
- All other macro figures are kitchen estimates (`estimated: true`) and are
  confirmed on WhatsApp at order time.
- The biryani bowl is listed at **₹349** — the original card said "ask on
  order". Macros (P30 / C56 / F24–26 / 570 kcal) are confirmed from Instagram.
  **Confirm the price with the kitchen.**
- Sandwich descriptions were rewritten (the original HTML had placeholder copy).
- **Smoothie Bowls** (Mango Muse, Midnight Cacao, Nutty Velvet, Berry Bliss) and
  the **Artisanal Menu** (Black Grain Dimsum) come from Instagram posts —
  descriptions and prices are placeholders pending the real card. See
  `reference/INSTAGRAM_DATA.md`.
- A **WhatsApp product catalog** exists (`wa.me/c/919902220334`) and is likely
  the best source of real prices/images — not yet scraped (in-app only).

Subscription plans: `src/data/subscriptions.ts`. Gallery posts:
`src/data/gallery.ts`.

## Ordering — Phase 1

No checkout or payments. The **order builder** (`src/components/order/`) keeps a
line-item list in React context + `localStorage`, then
`buildWhatsAppOrderUrl()` (`src/lib/order.ts`) generates a prefilled
`wa.me/919902220334` link with a readable order summary. The kitchen confirms
availability, delivery slot and final total on chat.

Zomato / Swiggy are linked as external ordering channels.

## Admin dashboard

Private area at **`/admin`** — revenue & analytics, order management
(status workflow: pending → preparing → out for delivery → delivered), and menu
CRUD (pricing, 30/40/50 g protein tiers, in-stock toggle, descriptions).

**Access control**

- `src/proxy.ts` gates every `/admin` and `/api/admin` route on the Edge —
  unauthenticated requests redirect to `/admin/login` (or `401` for the API).
  Every admin response also carries `X-Robots-Tag: noindex`; `/admin` is
  disallowed in `robots.ts`.
- Two accounts, `owner` and `dev` (both currently full access). Session = an
  HS256 JWT (`jose`) carrying the role, in an `httpOnly` cookie, 8-hour
  lifetime. Passwords verified server-side only (scrypt) — see `src/lib/admin/`.

**Environment** (`.env.local` locally, Vercel project env in prod)

| Var                   | Notes                                                              |
| --------------------- | ----------------------------------------------------------------- |
| `ADMIN_USERS`         | JSON array of `{ email, role, passwordHash }`. Generate a hash with `npm run admin:hash -- "password" email role` |
| `ADMIN_SESSION_SECRET`| Random string ≥ 32 chars — signs the session cookie               |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Set automatically when a Vercel KV / Upstash Redis store is attached |

```jsonc
// ADMIN_USERS (one line in the actual env var)
[
  { "email": "owner@samya.example", "role": "owner", "passwordHash": "<salt:key>" },
  { "email": "dev@example.com",      "role": "dev",   "passwordHash": "<salt:key>" }
]
```

Legacy single-owner vars (`ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` / `ADMIN_PASSWORD`)
still work when `ADMIN_USERS` is unset. A per-entry `"password"` (plaintext) can
replace `passwordHash` for local dev.

**Persistence** — `src/lib/admin/store.ts`. Uses Vercel KV / Upstash Redis when
a `*_REST_API_URL` + `*_REST_API_TOKEN` pair is present (any prefix the storage
integration picks), otherwise falls back to an **ephemeral** JSON file in the OS
temp dir — fine for local dev, per-instance and wiped on serverless. Attach a
Redis store for anything real. On first read it seeds the menu from
`src/data/menu.json` and generates sample orders so the dashboard isn't empty.

> The public site still renders from `src/data/menu.json`. Wiring the public
> menu to the KV store (so owner edits go live) is the remaining step.

## Assets

Placeholder botanical SVGs in `public/menu/` and `public/gallery/`. Real
photography is not wired yet — swap the `image` paths in the data files when
assets are ready. Original brand assets and the previous site are kept in
`reference/` (not served).

## Brand tokens

| Token                | Hex       |
| -------------------- | --------- |
| `lilac`              | `#e3b8e6` |
| `lilac-soft`         | `#f0dcf1` |
| `mauve`              | `#8a7690` |
| `plum`               | `#5a2350` |
| `plum-deep`          | `#3d1636` |
| `cream`              | `#faf6fa` |
| `ink`                | `#241022` |

## Not in this phase

Razorpay / payments, public-facing accounts, live Instagram embeds, syncing the
public menu to the admin KV store. See `reference/PROJECT_STATE.md` for the full
backlog.
