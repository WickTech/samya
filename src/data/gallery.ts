import { CONTACT } from "@/lib/site";

export interface GalleryPost {
  id: string;
  caption: string;
  image: string;
  href: string;
}

/**
 * Instagram feed layout — real captions and (where available) real photos
 * pulled from @samya.health. Tiles link out to the profile. Placeholder art
 * fills the gaps until more assets land.
 */
export const GALLERY_POSTS: GalleryPost[] = [
  {
    id: "comfort-upgrade",
    caption: "POV: your comfort food finally got a wellness upgrade. ✨",
    image: "/menu/photos/veg-korean-bibimbap.jpg",
    href: "https://www.instagram.com/p/DYoitgkFLNm/",
  },
  {
    id: "mango-bowls",
    caption: "Smoothie bowls are here in Bhilai — Mango Muse. 🥭",
    image: "/menu/photos/mango-muse-bowl.jpg",
    href: "https://www.instagram.com/p/DYkgs3QCgW6/",
  },
  {
    id: "nutty-velvet",
    caption: "Nutty Velvet — blended thick, real toppings, no refined sugar.",
    image: "/menu/photos/nutty-velvet-bowl.jpg",
    href: "https://www.instagram.com/p/DYkgs3QCgW6/",
  },
  {
    id: "berry-bliss",
    caption: "Berry Bliss smoothie bowl. Slow mornings sorted.",
    image: "/menu/photos/berry-bliss-bowl.jpg",
    href: "https://www.instagram.com/p/DYkgs3QCgW6/",
  },
  {
    id: "dimsum",
    caption: "Black Grain Dimsum — from the artisanal menu. High protein & calcium.",
    image: "/menu/photos/black-grain-dimsum.jpg",
    href: "https://www.instagram.com/p/DUKWmkligO3/",
  },
  {
    id: "teriyaki",
    caption: "Veg Teriyaki Rice Bowl — one of three new dishes.",
    image: "/menu/photos/veg-teriyaki-rice-bowl.jpg",
    href: "https://www.instagram.com/p/DYoitgkFLNm/",
  },
  {
    id: "biryani-bowl",
    caption: "Paneer Soya Hyderabadi Biryani — 30g protein, probiotic raita.",
    image: "/menu/photos/paneer-soya-biryani.jpg",
    href: "https://www.instagram.com/p/DWV8rr0qwbN/",
  },
  {
    id: "packaging",
    caption: "Pink Chia cold-pressed — fresh ingredients from the farm, homegrown herbs.",
    image: "/menu/photos/pink-chia-packaging.jpg",
    href: "https://www.instagram.com/p/DaH-ToHt8Ae/",
  },
];
