import type { MetadataRoute } from "next";
import { SITE, NAV_LINKS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, priority: 1 },
    ...NAV_LINKS.map((link) => ({
      url: `${SITE.url}${link.href}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
