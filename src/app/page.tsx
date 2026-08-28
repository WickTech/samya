import Link from "next/link";
import { Hero } from "@/components/hero";
import { MarqueeStrip } from "@/components/marquee-strip";
import { SignatureBowls } from "@/components/signature-bowls";
import { SectionHeading } from "@/components/section-heading";
import { LeafDivider, BotanicalField } from "@/components/botanical";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button-link";
import { CONTACT, ORDER_PLATFORMS, SITE, whatsappChatUrl } from "@/lib/site";

const WHY = [
  {
    icon: "🌿",
    title: "Farm-fresh, zero additives",
    body: "Ingredients sourced fresh with homegrown herbs — no preservatives, ever.",
  },
  {
    icon: "💪",
    title: "High protein, every bowl",
    body: "30–50g of protein per meal, built for weight loss and muscle support.",
  },
  {
    icon: "🛵",
    title: "Doorstep delivery in Bhilai–Durg",
    body: "Order via Zomato, Swiggy, the WhatsApp builder or direct — subscriptions available.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <SignatureBowls />

      {/* Why SĀMYA */}
      <section className="relative overflow-hidden bg-lilac-soft/60 py-20">
        <BotanicalField className="-right-16 top-0 h-96 w-96" />
        <div className="shell relative">
          <SectionHeading eyebrow="Why SĀMYA" title="Healthy, made simple" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="rounded-3xl border border-plum-deep/10 bg-white/70 p-8 text-center"
              >
                <div className="text-3xl">{w.icon}</div>
                <h3 className="mt-3 font-display text-xl text-plum-deep">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm text-ink/65">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="shell py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-gradient-to-br from-lilac to-mauve shadow-xl shadow-plum-deep/10" />
            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-cream px-5 py-3 font-script text-2xl text-plum shadow-lg">
              {SITE.devanagari} — {SITE.meaning}
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="About us"
              title="Rooted in balance"
              align="left"
            >
              <p>
                SĀMYA — meaning “balance” — is a wellness-focused food &amp;
                beverage brand dedicated to fresh, nutrient-rich meals and
                cold-pressed juices for {SITE.serviceArea}.
              </p>
              <p className="mt-3">
                Fresh ingredients straight from the farm, homegrown herbs — nature
                in one bowl. Every meal is crafted with one goal: making healthy
                living simple, accessible and enjoyable.
              </p>
            </SectionHeading>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Pure Vegetarian",
                "No Additives",
                "30–50g Protein",
                "Gut Friendly",
                "Subscriptions",
              ].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-mauve/40 bg-white/70 px-4 py-1.5 text-xs font-medium text-plum-deep"
                >
                  {b}
                </span>
              ))}
            </div>
            <div className="mt-7">
              <ButtonLink href="/about" variant="outline">
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="bg-ink py-20 text-cream">
        <div className="shell">
          <SectionHeading
            eyebrow={`@${CONTACT.instagram}`}
            title="From the feed"
            tone="cream"
          >
            Clean • Pure Veg • High Protein — weight loss, office lunch &amp;
            gut-friendly. 📍 {SITE.serviceArea}.
          </SectionHeading>
          <div className="mt-10">
            <GalleryGrid />
          </div>
          <div className="mt-8 text-center">
            <Link
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-lilac pb-0.5 font-semibold text-lilac"
            >
              Follow @{CONTACT.instagram} →
            </Link>
          </div>
        </div>
      </section>

      {/* Order CTA */}
      <section className="shell py-20">
        <div className="rounded-[2rem] border border-plum-deep/10 bg-lilac-soft/60 p-10 text-center">
          <SectionHeading eyebrow="Get in touch" title="Order your bowl of balance" />
          <LeafDivider className="mx-auto my-6 max-w-xs" />
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/menu" variant="primary">
              Build an order
            </ButtonLink>
            <ButtonAnchor
              href={whatsappChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Chat on WhatsApp
            </ButtonAnchor>
          </div>
          <p className="mt-6 text-xs text-ink/55">
            Also on{" "}
            {ORDER_PLATFORMS.map((p, i) => (
              <span key={p.name}>
                {i > 0 && " · "}
                {p.name}
              </span>
            ))}{" "}
            — search “SĀMYA” in {SITE.serviceArea}.
          </p>
        </div>
      </section>
    </>
  );
}
