import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { CONTACT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Bowls, smoothies and cold-pressed juices from the SĀMYA kitchen. Straight from @samya.health.",
};

export default function GalleryPage() {
  return (
    <div className="bg-ink text-cream">
      <div className="shell py-16">
        <SectionHeading
          eyebrow={`@${CONTACT.instagram}`}
          title="From the feed"
          tone="cream"
        >
          Clean • Pure Veg • High Protein — weight loss, office lunch &amp;
          gut-friendly. 📍 {SITE.serviceArea}. Tiles link straight to Instagram.
        </SectionHeading>

        <div className="mt-12">
          <GalleryGrid />
        </div>

        <div className="mt-10 text-center">
          <Link
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-lilac pb-0.5 font-semibold text-lilac"
          >
            Follow @{CONTACT.instagram} →
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-lilac-soft/50">
          Placeholder imagery for now — real photography and Instagram embeds
          land in the next phase.
        </p>
      </div>
    </div>
  );
}
