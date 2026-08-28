# SĀMYA — Project State

Reference doc for writing a detailed prompt to generate the SĀMYA cloud-kitchen web app.
Last compiled: 2026-08-28.

---

## 1. What exists on disk

```
/home/rishi/github/Samya/
├── index.html          # 631-line single-file landing page (complete, working)
├── logo.jpg            # 1080×1080 brand tile — lilac/mauve, botanical line-art, "SĀMYA साम्य"
├── Assets/1-7.jpeg     # photos: menu cards, Caesar salad, mango smoothie bowl, Mango Muse tub
├── Menu/1-4.png        # 4 printed menu card scans (~1080×1400): Salads / Protein / Meals / Juices
├── Products/
│   ├── mango-muse-smoothie-bowl.jpg
│   ├── new-dish-tofu-noodle-bowl.jpg
│   └── SOURCES.md      # provenance of extracted IG product assets
└── SĀMYA (@samya.health) • Instagram photos and videos.md   # scraped IG profile + 23 post captions
```

- No git repo. No build system. No `package.json`. No backend.
- Pure static HTML + CSS + vanilla JS, one file.
- `logo.jpg` also has a `:Zone.Identifier` sidecar (Windows/WSL download marker) — ignore.

---

## 2. Brand

| Field | Value |
|---|---|
| Name | SĀMYA (Devanagari साम्य) — means "balance / equilibrium" |
| Tagline | "Tossed Fresh, Crafted Gourmet." |
| Positioning line | "Crafted for Balance." / "Rooted in Balance" |
| Category | Cloud kitchen — wellness food & cold-pressed beverage brand |
| Established | 2025 (Bhilai launch 8 Dec 2025) |
| Service area | Bhilai–Durg, Chhattisgarh, India (Nehru Nagar referenced in IG hashtags) |
| Pillars | Clean • Pure Veg • High Protein |
| Use-cases | Weight loss · Office lunch · Gut-friendly |
| Protein hook | 30 / 40 / 50 g protein per meal (bowls quoted 30–50 g) |
| Claims | Farm-fresh ingredients, homegrown herbs, no additives/preservatives, no refined sugar, made fresh per order, pure veg + vegan-friendly |

### Contact / channels

- WhatsApp + Call: **+91 99022 20334** → `https://wa.me/919902220334`
- Email: **msamyainfo@gmail.com**
- Instagram: **@samya.health** (~290 followers, 23 posts, "Digital creator")
- Ordering channels: **Zomato, Swiggy, WhatsApp, direct doorstep delivery**
- **Weekly & monthly subscriptions** — advertised, details via DM/WhatsApp, no pricing published
- IG Highlights: OPEN HOURS · SMOOTHIE BOWLS · ARTISANAL MENU · EVENT
- IG bio: "Clean • Pure Veg • High Protein / Weight Loss | Office Lunch | Gut Friendly / 💪🏻30-40-50 grams protein / 📍 Bhilai–Durg / Order on Zomato ⬇️"
- Physical address, hours, delivery radius, FSSAI/GST no.: **NOT known**

### Visual identity

- **Site palette** (CSS vars in index.html):
  - `--lilac #e3b8e6` · `--lilac-soft #f0dcf1` · `--mauve #8a7690`
  - `--deep #3d1636` · `--plum #5a2350`
  - `--cream #faf6fa` · `--ink #241022`
- **Menu-card palette** (different): pale sage / grey-blue textured paper, navy ink, vintage botanical + vegetable engravings.
- **Logo**: lilac + mauve organic blob background, white thin wide-tracked "SĀMYA" wordmark, Devanagari "साम्य" beneath, monochrome botanical line-art sprigs (flowers, leaves) top-left + bottom-right.
- **Fonts (current site)**: Cormorant Garamond (headings), Caveat (script accents), Inter (body). Wordmark = Cormorant, uppercase, `letter-spacing:.42em`.
- **Motifs**: botanical line-art (flowers, herbs, mushrooms, vegetables), organic blob shapes, "one bowl = nature/balance".

---

## 3. Menu (as encoded in index.html)

Prices ₹. Protein Box priced 3-way = 30 / 40 / 50 g.

### Meal Bowls
| Item | Price | Notes |
|---|---|---|
| Paneer / Tofu Makhani Meal Bowl | 299 | healthier makhani |
| Paneer / Tofu Kadhai Meal Bowl | 299 | onion, capsicum, fresh gravy over rice |
| Scrambled Paneer Meal Bowl | 299 | bhurji in gravy; rice or millet |
| Thai Curry (Red / Green) | 419 | pineapple basil rice |
| Burrito Bowl | 319 | sour cream, kidney beans, corn, veggies, rice |
| Paneer Malabar Curry Meal Bowl | 289 | coconut-milk gravy, mild |
| Protein-Rich Brown Rice Paneer Biryani Bowl | "Ask on order" | ~30 g protein, 570 kcal, 56 g carbs, 24–26 g fat; paneer + soya chunks + brown rice + probiotic raita |

### Protein Box (30 / 40 / 50 g)
| Item | Price (30/40/50) |
|---|---|
| Paneer Chilly | 199 / 249 / 299 |
| Besan Stuffed Chilla | 245 / 324 / 359 |
| Moong Stuffed Chilla | 245 / 324 / 359 |
| Paneer / Tofu Shashlik | 189 / 269 / 329 |

### Sandwiches
| Item | Price |
|---|---|
| Pesto Paneer Sandwich | 299 |
| Paneer Chipotle Sandwich | 270 |
| Asian Paneer Sandwich | 270 |

> ⚠️ In current index.html the sandwich descriptions are wrong (smoothie/juice copy pasted onto sandwich rows). Needs real copy.

### Salads (kcal / macros from menu scan `Menu/1.png`)
| Item | Price | kcal | Macros (scan) |
|---|---|---|---|
| Caesar Salad with Cajun Paneer | 299 | ~300 | Fat 20 g, P 20–22 g, Carb 10 g |
| Hummus Salad | 299 | ~300 | Fat 25 g, P 20 g, Carb 15–20 g |
| Thai Cucumber Salad | 319 | ~200 | P 4 g, Fat 5 g, Carb 10 g |
| Glow Fit Salad | 299 | ~200 | P 4 g, Fat 5 g, Carb 10 g |
| Vitamin Booster Salad | 299 | ~200 | P 4 g, Fat 5 g, Carb 10 g |
| Pesto Pasta Salad | 299 | ~300 | P 7 g, Fat 25–30 g, Carb 20 g; whole-wheat pasta |
| Garden Fresh Salad | 299 | ~220 | P 7–9 g, Fat 12 g, Carb 18 g |

> ⚠️ Salad macros in index.html differ from the scan (HTML rounds/simplifies). Scan values above are from the printed card.

### Smoothies
Base = hung curd / Greek yogurt + milk / almond milk + banana + mixed seeds. ~250 ml, sealed fresh.
| Item | Price | Notes |
|---|---|---|
| Chocolate Smoothie | 219 | dark chocolate |
| Strawberry Smoothie | 279 | antioxidant-rich |
| Mango Thunder | 299 | Alphonso mango + moringa |
| Mango Black Magic | 299 | mango + moringa + activated charcoal |

Smoothie-bowl flavours named on IG: **Mango Muse, Midnight Cacao, Nutty Velvet, Berry Bliss.**

### Cold-Pressed Juices — ₹199 each
| Item | Contents |
|---|---|
| Pink Chia | pineapple + pomegranate + chia |
| Immune Booster | ginger + orange + carrot + turmeric |
| Blooming Red | beetroot + carrot + pomegranate |
| Apple Leaf Tonic | apple + cucumber + spinach + ginger |
| ABC | apple + beetroot + carrot |

### Signature / hero items
Caesar Salad w/ Cajun Paneer · Mango Smoothie Bowl · Mango Muse Smoothie.

### Items seen only on IG (not on site)
- Black Grain Dimsum ("Artisanal Menu" — high protein & calcium)
- Tofu noodle bowl (a "3 new dishes" launch)
- "Artisanal Menu" as a separate product line

### Promo history
"50% off on Zomato, selected items, this month" (past campaign).

---

## 4. Current index.html — structure

Sticky nav → Hero (logo bg image, CTAs: Order on WhatsApp + View Full Menu) → scrolling marquee strip ("Pure Veg · No Additives · 30–50g Protein · Fresh From The Farm · Homegrown Herbs · Bhilai–Durg") → Signature Bowls (3 cards) → Menu (4 JS tab panels: Meal Bowls / Protein Box & Sandwiches / Salads / Smoothies & Cold Press) → Printed Menu (4 images → click → lightbox) → About (image + copy + 5 badges) → Why Sāmya (3 feature cards) → Gallery (8-cell grid, every cell links to IG profile) → Contact (contact card + order-platforms card) → Footer → fixed WhatsApp button.

**JS**: mobile nav toggle, menu-tab switching, image lightbox. No framework, no analytics, no forms, no cart, no routing.

**SEO/meta**: title, description, OG title/description/image, favicon = `logo.jpg`.
- Title: "SĀMYA | Clean • Pure Veg • High Protein — Bhilai-Durg"

**About copy (verbatim, reusable):**
> SĀMYA — meaning "balance" — is a wellness-focused food & beverage brand dedicated to fresh, nutrient-rich meals and cold-pressed juices for Bhilai–Durg. We combine wholesome ingredients, mindful preparation and modern nutrition to help you eat well without sacrificing flavour. Fresh ingredients straight from the farm, homegrown herbs — nature in one bowl. Every bottle and every meal is crafted with one goal: making healthy living simple, accessible and enjoyable.

**Badges:** Pure Vegetarian · No Additives · 30–50g Protein · Gut Friendly · Weekly / Monthly Subscriptions

**Why Sāmya cards:**
1. 🌿 Farm-Fresh, Zero Additives
2. 💪 High Protein, Every Bowl
3. 🛵 Doorstep Delivery in Bhilai–Durg

---

## 5. Asset inventory

| File | Content |
|---|---|
| `logo.jpg` | 1080×1080 brand tile |
| `Assets/1.jpeg` | SĀMYA menu card flatlay |
| `Assets/2.jpeg` | menu card, botanical print |
| `Assets/3.jpeg` | Caesar salad w/ cajun paneer (bowl + dressing) |
| `Assets/4.jpeg` | Caesar salad bowl |
| `Assets/5.jpeg` | Mango Muse smoothie tub (250 ml) |
| `Assets/6.jpeg` | Mango smoothie bowl w/ granola, seeds, dark chocolate |
| `Assets/7.jpeg` | menu card with botanical illustrations |
| `Menu/1.png` | Salads menu card |
| `Menu/2.png` | Protein & Sandwiches menu card |
| `Menu/3.png` | Meal Bowls menu card |
| `Menu/4.png` | Juices & Smoothies menu card |
| `Products/mango-muse-smoothie-bowl.jpg` | 1254×1254 mango smoothie bowl |
| `Products/new-dish-tofu-noodle-bowl.jpg` | 1080×1080 tofu + chopsticks + noodle bowl |

From `Products/SOURCES.md` — extracted 2026-08-27 from @samya.health IG. Reel videos (Mango Thunder, Strawberry, Chocolate smoothies, title card) **not extractable** without a logged-in session; IG serves only the 640px cover frame. All 6 source posts are single-media.

**Asset gaps:** ~13 usable images total. Low for a full site. No hero video. Many menu items have no photo.

---

## 6. Gaps / decisions before building the full app

**Ordering model**
- Current site = referral only (deep-links to Zomato / Swiggy / WhatsApp).
- Decide: keep referral, OR build cart + checkout + payments. Razorpay MCP available.

**Subscriptions**
- Advertised, zero implementation. Need: plan tiers, cadence (weekly/monthly), pricing, delivery scheduling, pause/skip, billing.

**Backend / data**
- None today. Menu management, orders, subscriptions → need a backend. Supabase MCP available.
- No admin panel for menu/price edits.

**Missing business data**
- Exact address, operating hours, delivery zones + radius, delivery fee, minimum order value, packaging charge, GST + FSSAI license numbers, founder/team story, genuine customer reviews/testimonials.

**Menu data quality**
- Fix wrong sandwich descriptions in index.html.
- Reconcile salad macros: HTML vs printed-card scan.
- "Ceaser" → "Caesar" typo on printed cards.
- Nutrition data only partial — many items lack kcal/macros.
- No dietary tags system (vegan vs dairy, nut, gluten, jain).
- "Ask on order" pricing on biryani bowl needs a real number.

**Content**
- Need more food photography or generated imagery.
- Reel videos unavailable.

---

## 7. Suggested scope for the generated web app (starting point, adjust to taste)

- **Stack**: keep it deployable on Vercel. Static-first; add backend only where ordering/subscriptions need it.
- **Pages/sections**: Home (hero, pillars, signature), full Menu (filterable by category + dietary + protein level, per-item nutrition), Subscriptions (plans + how it works), About, Gallery/IG feed, Contact + service-area map, FAQ.
- **Menu**: data-driven (JSON or DB), not hand-coded rows. Item schema: name, category, price (or price tiers), description, kcal, protein/carb/fat, image, tags (veg/vegan/gf/contains-dairy), available (bool), signature (bool).
- **Ordering**: phase 1 = WhatsApp order builder (compose item list → prefilled `wa.me` message) + Zomato/Swiggy links. Phase 2 = real cart + Razorpay + order DB.
- **Subscriptions**: plan picker → WhatsApp/enquiry form first; full billing later.
- **Admin** (phase 2): Supabase-backed menu + order + subscription management.
- **Brand system**: lilac/plum palette from §2, Cormorant + Caveat + Inter, botanical line-art, organic blobs. Reuse About copy verbatim.
- **Analytics**: add (Vercel Web Analytics).
- **SEO**: local business schema (LocalBusiness / Restaurant), Bhilai–Durg keywords, per-item pages.
