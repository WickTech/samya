# Instagram photos — @samya.health

Downloaded 2026-08-28 from `instagram.com/api/v1/users/web_profile_info`
(public, unauthenticated). These are the 12 most-recent posts only — older
posts need a logged-in session (see `../INSTAGRAM_DATA.md`).

Reel posts expose only their cover frame (often low-res / text-heavy), not the
`.mp4`. Filenames = `<shortcode>[_<carousel-index>].jpg`.

Curated dish/product shots are also copied to `public/menu/photos/` and wired
into `src/data/menu.json`.

| File | Post | Type | Content | Used in app |
|---|---|---|---|---|
| `DYoitgkFLNm_0.jpg` | DYoitgkFLNm | carousel | **Veg Korean Bibimbap** — tofu, rice, wakame, carrot, cucumber, gochujang | ✅ `veg-korean-bibimbap.jpg` |
| `DYoitgkFLNm_1.jpg` | DYoitgkFLNm | carousel | **Veg Teriyaki Rice Bowl** — teriyaki tofu + fried rice | ✅ `veg-teriyaki-rice-bowl.jpg` |
| `DYoitgkFLNm_2.jpg` | DYoitgkFLNm | carousel | **Veg Fried Rice** | ✅ `veg-fried-rice.jpg` |
| `DYkgs3QCgW6_0.jpg` | DYkgs3QCgW6 | carousel | **Mango Muse** smoothie bowl (yellow) — kraft bowl, granola/seeds/dark choc | ✅ `mango-muse-bowl.jpg` |
| `DYkgs3QCgW6_1.jpg` | DYkgs3QCgW6 | carousel | **Midnight Cacao** smoothie bowl (cocoa/purple) | ✅ `midnight-cacao-bowl.jpg` |
| `DYkgs3QCgW6_2.jpg` | DYkgs3QCgW6 | carousel | **Nutty Velvet** smoothie bowl (peanut/tan) | ✅ `nutty-velvet-bowl.jpg` |
| `DYkgs3QCgW6_3.jpg` | DYkgs3QCgW6 | carousel | **Berry Bliss** smoothie bowl (pink) | ✅ `berry-bliss-bowl.jpg` |
| `DWV8rr0qwbN.jpg` | DWV8rr0qwbN | reel cover | **Paneer Soya Hyderabadi Biryani** (= "Protein-Rich Brown Rice Paneer Biryani Bowl") | ✅ `paneer-soya-biryani.jpg` |
| `DUKWmkligO3.jpg` | DUKWmkligO3 | reel cover | **Black Grain Dimsum** — leaf-pleated dumplings + orange dip, "Artisanal Menu" | ✅ `black-grain-dimsum.jpg` |
| `DaH-ToHt8Ae.jpg` | DaH-ToHt8Ae | reel cover | **Packaging shot** — Pink Chia cold-pressed bottle (label: pomegranate + pineapple + chia seed + lemon), pink menu cards, sealed kraft bowls. Reposted by @chhattisgarh_got_served ("Served" watermark). | ✅ `pink-chia-packaging.jpg` |
| `DT76yPGjxSb_0.jpg` | DT76yPGjxSb | carousel | **Printed menu — Salads page** (Jan 2026 card; = `../Menu/1.png`) | — |
| `DT76yPGjxSb_1.jpg` | DT76yPGjxSb | carousel | **Printed menu — Protein & Sandwiches page** (note: card's own sandwich descriptions are wrong/placeholder) | — |
| `DT76yPGjxSb_2.jpg` | DT76yPGjxSb | carousel | **Printed menu — Meals page** | — |
| `DT76yPGjxSb_3.jpg` | DT76yPGjxSb | carousel | **Printed menu — Juice & Smoothie page** | — |
| `DZz_tmhCtwV_0.jpg` | DZz_tmhCtwV | carousel | "About Us" text card (bibimbap bowl behind) | — |
| `DZz_tmhCtwV_1.jpg` | DZz_tmhCtwV | carousel | "Our Mission" text card (full mission copy) | text → About page |
| `DZz_tmhCtwV_2.jpg` | DZz_tmhCtwV | carousel | "Our Goal" text card | text → About page |
| `DaH` (see above) | | | | |
| `DVz850pipbR.jpg` | DVz850pipbR | reel cover | Chocolate Smoothie bottle, "NEW ARRIVALS" — low-res, text-heavy | — |
| `DVftCLgj9rl.jpg` | DVftCLgj9rl | reel cover | Strawberry Smoothie bottle — low-res | — |
| `DVxVgL-DzFT.jpg` | DVxVgL-DzFT | reel cover | Mango Thunder bottle, "NEW ARRIVALS" — low-res | — |
| `DWow9AIqJuP.jpg` | DWow9AIqJuP | reel cover | "Healthy Salads Part 1" — low-res | — |
| `DVl_y9OipHT.jpg` | DVl_y9OipHT | image | Happy Women's Day graphic — not a dish | — |

## New menu facts from these photos

- **Three new dishes** (May 2026 launch) = Veg Korean Bibimbap, Veg Teriyaki
  Rice Bowl, Veg Fried Rice. Added to `menu.json` as meal bowls (price/macros
  are placeholders — confirm).
- Biryani bowl's real name on the reel: **"Paneer Soya Hyderabadi Biryani"**
  (white basmati on the reel, though the caption/description says brown rice).
- Smoothie bowls are served in **kraft paper bowls**; smoothies/juices in clear
  PET bottles with a minimalist SĀMYA label; meal bowls in blue-rim enamel
  bowls for photos, sealed kraft bowls for delivery.
- The printed Jan-2026 card does **not** list the biryani bowl, smoothie bowls,
  the artisanal dimsum, or the three new rice bowls — all added since.
