/** Brand + contact constants. Single source of truth for the app. */

export const SITE = {
  name: "SĀMYA",
  wordmark: "Sāmya",
  devanagari: "साम्य",
  meaning: "balance",
  tagline: "Tossed Fresh, Crafted Gourmet.",
  positioning: "Crafted for Balance.",
  established: "2025",
  serviceArea: "Bhilai–Durg, Chhattisgarh",
  pillars: ["Clean", "Pure Veg", "High Protein"] as const,
  useCases: ["Weight loss", "Office lunch", "Gut-friendly"] as const,
  url: "https://samya.vercel.app",
  description:
    "SĀMYA — fresh, high-protein, pure-veg meal bowls, salads, sandwiches and cold-pressed juices, tossed fresh in Bhilai–Durg.",
} as const;

export const CONTACT = {
  /** Digits only, country code first — used to build wa.me links. */
  whatsapp: "919902220334",
  phoneDisplay: "+91 99022 20334",
  email: "msamyainfo@gmail.com",
  instagram: "samya.health",
  instagramUrl: "https://www.instagram.com/samya.health/",
  /** AppsFlyer onelink from the Instagram bio — opens the SĀMYA page on Zomato. */
  zomatoUrl: "https://zomato.onelink.me/xqzv/bvuasnfp",
  /** WhatsApp product catalog (opens in the WhatsApp app). */
  whatsappCatalogUrl: "https://wa.me/c/919902220334",
} as const;

export const ORDER_PLATFORMS = [
  {
    name: "Zomato",
    href: "https://zomato.onelink.me/xqzv/bvuasnfp",
    note: "Opens the SĀMYA page on Zomato",
  },
  {
    name: "Swiggy",
    href: "https://www.swiggy.com/",
    note: "Search “SĀMYA” in Bhilai–Durg",
  },
] as const;

export const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const MARQUEE_WORDS = [
  "Pure Veg",
  "No Additives",
  "30–50g Protein",
  "Fresh From The Farm",
  "Homegrown Herbs",
  "Bhilai–Durg",
] as const;

/** Plain "chat with us" link, no order payload. */
export function whatsappChatUrl(
  message = "Hi SĀMYA! I'd like to ask about your menu.",
): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
