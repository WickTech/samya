# Instagram data — @samya.health

Pulled 2026-08-28 via `instagram.com/api/v1/users/web_profile_info` (public,
unauthenticated). Supplements the older full-profile scrape in
`SĀMYA (@samya.health) • Instagram photos and videos.md`.

## Profile

| Field | Value |
|---|---|
| Handle | @samya.health |
| Display name | SĀMYA |
| Instagram user id | `61167192461` |
| Category | "Digital creator" (personal account, `is_business_account: false`) |
| Business contact method | CALL |
| Followers | 300 |
| Following | 19 |
| Posts | 23 |
| Bio | Clean • Pure Veg • High Protein / Weight Loss \| Office Lunch \| Gut Friendly / 💪🏻 30-40-50 grams protein / 📍 Bhilai–Durg / Order on Zomato ⬇️ |
| Business email / phone in profile | none set |
| Address fields | all null (city/street/zip/lat/long) |

### Bio links (3)

1. **Zomato** — `https://zomato.onelink.me/xqzv/bvuasnfp`
   (AppsFlyer onelink; internal Zomato resource id `124161902f88b920f`; no public
   zomato.com slug resolvable without the app)
2. **WhatsApp chat** — `https://wa.me/919902220334?countryName=IN&countryCode=91&phoneNumber=9902220334`
3. **WhatsApp catalog** — `https://wa.me/c/919902220334`
   → redirects to `whatsapp.com/catalog/919902220334/` (contents load only in-app;
   not scrapable). **A WhatsApp product catalog exists** — likely the best source
   of real prices/images; ask the owner to export it.

### Mission statement (from profile "about" text)

> "Redefine the way people think about healthy food by making fresh,
> high-protein vegetarian meals … a part of everyday life."
> "Inspire healthier lifestyles by making fresh, preservative-free food
> accessible, enjoyable, and trustworthy."

### Story highlights (covers only; contents need login)

OPEN HOURS · SMOOTHIE BOWLS · ARTISANAL MENU · EVENT

## Posts (12 most recent, with full captions)

| Date | Type | Likes | Shortcode | Gist |
|---|---|---|---|---|
| 2026-06-28 | video | 20 | DaH-ToHt8Ae | "comfort food got a wellness upgrade" — **available on Zomato AND Swiggy** |
| 2026-06-20 | carousel | 15 | DZz_tmhCtwV | "About Us" card — brand mission |
| 2026-05-22 | carousel | 19 | DYoitgkFLNm | **"Launching three new dishes"** — new flavours, healthy touch (tofu noodle bowl is one) |
| 2026-05-20 | carousel | 17 | DYkgs3QCgW6 | **Smoothie bowls in Bhilai** — flavours: 1. Mango Muse 2. Midnight Cacao 3. Nutty Velvet 4. Berry Bliss |
| 2026-04-02 | video | 16 | DWow9AIqJuP | "Healthy Salads part 1" |
| 2026-03-26 | video | 11 | DWV8rr0qwbN | **Protein-Rich Brown Rice Paneer Biryani Bowl** — Carbs 56g, Protein 30g, 570 kcal, Fats 24–26g; paneer + soya chunks + brown rice + probiotic raita. On Zomato/Swiggy/WhatsApp/DM |
| 2026-03-13 | video | 10 | DVz850pipbR | Chocolate smoothie — "all-time favourite" |
| 2026-03-12 | video | 10 | DVxVgL-DzFT | **Mango Thunder** — ripened mango + Greek yogurt + almond milk; vit A & C, no refined sugar; "High Protein \| Antioxidant-Rich \| Pure Vegetarian \| Summer Essential" |
| 2026-03-07 | image | 4 | DVl_y9OipHT | Happy Women's Day |
| 2026-03-05 | video | 8 | DVftCLgj9rl | **Strawberry Smoothie** — strawberries + Greek yogurt + almond milk; protein, fibre, vit C, no refined sugar / additives |
| 2026-01-31 | video | 18 | DUKWmkligO3 | **Black Grain Dimsum — "from Artisanal Menu"** — high protein & calcium |
| 2026-01-25 | carousel | 18 | DT76yPGjxSb | "Almost two months … NEW MENU COMING SOON" (→ launched ~early Dec 2025) |

Older ~11 posts (Aug 2025 – Jan 2026: Dec 8 2025 Bhilai launch, Holi, 50%-off
Zomato promo, hummus salad bowl, creamy pesto spaghetti / whole-wheat, treasure
run event) — captions already in the older scrape file.

## Photos

22 images from the 12 recent posts downloaded to
`reference/instagram-photos/` (see its `MANIFEST.md`). 10 curated dish/product
shots copied to `public/menu/photos/` and wired into `menu.json`:
Veg Korean Bibimbap, Veg Teriyaki Rice Bowl, Veg Fried Rice, the 4 smoothie
bowls (Mango Muse / Midnight Cacao / Nutty Velvet / Berry Bliss), the biryani
bowl, Black Grain Dimsum, and a Pink Chia packaging shot.

The 4-frame carousel in post `DT76yPGjxSb` (Jan 2026) is the current **printed
menu** (Salads / Protein+Sandwiches / Meals / Juice+Smoothie) — same as
`reference/Menu/*.png` but cleaner. Note the printed card's own sandwich
descriptions are wrong/placeholder ("Spinach, banana, almond milk, and honey"
for the Pesto Paneer Sandwich, etc.) — the app's rewritten copy stands.

Full mission / goal text (from the `DZz_tmhCtwV` carousel) → About page.
Brand line: **"Real Ingredients. High Protein. Pure Vegetarian. No Preservatives."**

## The three new dishes (post DYoitgkFLNm, May 2026)

Veg Korean Bibimbap · Veg Teriyaki Rice Bowl · Veg Fried Rice — added to
`menu.json` as meal bowls; prices/macros are placeholders pending the real card.

## New / confirmed facts vs PROJECT_STATE.md

- **WhatsApp catalog exists** (`wa.me/c/919902220334`) — untapped menu+price source.
- Real Zomato link is the onelink above, not a generic zomato.com URL.
- **Smoothie Bowls** is a real menu line with 4 named flavours — was missing from
  the app's `menu.json`. Added.
- **Artisanal Menu** is a distinct premium line (Black Grain Dimsum). Not yet in app.
- Biryani bowl macros now confirmed exactly (P30 / C56 / F24–26 / 570 kcal).
- Both **Zomato and Swiggy** confirmed live (June 2026 post).
- IG account is a personal "Digital creator" account, not an IG Business account —
  so no structured hours/address via API. Hours live only in the OPEN HOURS
  highlight.
- "NEW MENU COMING SOON" (Jan 2026) — menu was mid-revision; current card scans
  may be partly outdated.

## Not obtainable without login / app

- Full post list beyond 12 (GraphQL pagination now returns 401 `require_login`)
- Highlight contents (OPEN HOURS hours, SMOOTHIE BOWLS, ARTISANAL MENU, EVENT)
- WhatsApp catalog products / prices / images
- Reel video files
- Higher-res images
