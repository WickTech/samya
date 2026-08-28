# SĀMYA

Web app for **SĀMYA** — a wellness-focused cloud kitchen in Bhilai–Durg serving
clean, pure-veg, high-protein meal bowls, salads, sandwiches, smoothies and
cold-pressed juices.

> _Tossed Fresh, Crafted Gourmet._ · साम्य — *balance*

This is the Next.js rebuild of the original single-file site
(`reference/index.html`). Static-first, Vercel-ready, data-driven menu.

## Stack

- **Next.js 15** (App Router) + React 19
- **TypeScript**
- **Tailwind CSS 3.4** — brand tokens in `tailwind.config.ts`
- `next/font` — Cormorant Garamond (display), Inter (body), Caveat (accent)
- No backend, no database, no payment gateway in this phase (by design)

## Getting started

```bash
npm install
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
  order". **Confirm this price with the kitchen.**
- Sandwich descriptions were rewritten (the original HTML had placeholder copy).

Subscription plans: `src/data/subscriptions.ts`. Gallery posts:
`src/data/gallery.ts`.

## Ordering — Phase 1

No checkout or payments. The **order builder** (`src/components/order/`) keeps a
line-item list in React context + `localStorage`, then
`buildWhatsAppOrderUrl()` (`src/lib/order.ts`) generates a prefilled
`wa.me/919902220334` link with a readable order summary. The kitchen confirms
availability, delivery slot and final total on chat.

Zomato / Swiggy are linked as external ordering channels.

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

Supabase / any database, Razorpay / payments, real auth, a CMS or admin panel,
live Instagram embeds. See `reference/PROJECT_STATE.md` for the full backlog.
