import { CONTACT } from "@/lib/site";

export interface GalleryPost {
  id: string;
  caption: string;
  image: string;
  href: string;
}

/**
 * Instagram feed layout. Phase 1 uses placeholder art + real captions
 * pulled from @samya.health; every tile links out to the profile.
 * Swap `image` for a real embed/asset when available.
 */
export const GALLERY_POSTS: GalleryPost[] = [
  {
    id: "comfort-upgrade",
    caption: "POV: your comfort food finally got a wellness upgrade. ✨",
    image: "/gallery/placeholder-1.svg",
    href: CONTACT.instagramUrl,
  },
  {
    id: "mango-bowls",
    caption: "Slow mornings, thick mango bowls, and real toppings. 🥭",
    image: "/gallery/placeholder-2.svg",
    href: CONTACT.instagramUrl,
  },
  {
    id: "mango-muse",
    caption: "Freshly made Mango Muse — hung curd, mix seeds, milk. No refined sugar.",
    image: "/gallery/placeholder-3.svg",
    href: CONTACT.instagramUrl,
  },
  {
    id: "healthy-salads",
    caption: "Healthy salads, part 1. Order from us or DM. 👉🏻👈🏻",
    image: "/gallery/placeholder-4.svg",
    href: CONTACT.instagramUrl,
  },
  {
    id: "tossed-fresh",
    caption: "“Tossed Fresh, Crafted Gourmet.” Est. 2025.",
    image: "/gallery/placeholder-5.svg",
    href: CONTACT.instagramUrl,
  },
  {
    id: "farm-fresh",
    caption: "Fresh ingredients straight from the farm and homegrown herbs.",
    image: "/gallery/placeholder-6.svg",
    href: CONTACT.instagramUrl,
  },
  {
    id: "biryani-bowl",
    caption: "Protein-Rich Brown Rice Paneer Biryani Bowl — 30g protein, probiotic raita.",
    image: "/gallery/placeholder-7.svg",
    href: CONTACT.instagramUrl,
  },
  {
    id: "balance",
    caption: "SĀMYA · साम्य — balance in one bowl.",
    image: "/gallery/placeholder-8.svg",
    href: CONTACT.instagramUrl,
  },
];
