import type { Metadata } from "next";
import { MenuExplorer } from "@/components/menu/menu-explorer";
import { SectionHeading } from "@/components/section-heading";
import { NUTRITION_NOTE } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full SĀMYA menu — meal bowls, protein boxes, salads, sandwiches, smoothies and cold-pressed juices. Filter by category, dietary need and protein level.",
};

export default function MenuPage() {
  return (
    <div className="shell py-16">
      <SectionHeading eyebrow="Our menu" title="Crafted for balance">
        Pure vegetarian &amp; vegan-friendly. Prepared fresh from fresh
        ingredients — every order. Build your order and send it on WhatsApp.
      </SectionHeading>

      <div className="mt-12">
        <MenuExplorer />
      </div>

      <p className="mx-auto mt-14 max-w-prose text-center text-xs italic text-ink/50">
        {NUTRITION_NOTE}
      </p>
    </div>
  );
}
