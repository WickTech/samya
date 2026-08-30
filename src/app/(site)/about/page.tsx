import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { LeafDivider, BotanicalSprig } from "@/components/botanical";
import { ButtonLink } from "@/components/ui/button-link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "SĀMYA — meaning balance — is a wellness-focused cloud kitchen in Bhilai–Durg making fresh, high-protein, pure-veg meals and cold-pressed juices.",
};

const VALUES = [
  {
    title: "Balance over restriction",
    body: "Food should work with your goals, not fight them. Real flavour, honest macros, nothing stripped out for show.",
  },
  {
    title: "Fresh, not frozen",
    body: "Everything is tossed and blended to order from fresh ingredients — farm produce and homegrown herbs.",
  },
  {
    title: "Protein you can count on",
    body: "Every bowl is built around a 30–50g protein target, printed on the card so you always know.",
  },
];

export default function AboutPage() {
  return (
    <div className="shell py-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-lilac via-lilac-soft to-mauve p-10 sm:p-14">
        <BotanicalSprig className="absolute -right-4 -top-4 h-56 w-28 text-plum-deep/30" />
        <p className="eyebrow text-plum-deep/80">About us</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl text-plum-deep sm:text-5xl">
          Rooted in balance
        </h1>
        <p className="mt-4 font-script text-2xl text-plum">
          {SITE.positioning}
        </p>
      </section>

      <div className="mx-auto mt-14 max-w-prose space-y-4 text-[0.98rem] leading-relaxed text-ink/75">
        <p>
          SĀMYA — meaning “balance” — is a wellness-focused food &amp; beverage
          brand dedicated to fresh, nutrient-rich meals and cold-pressed juices
          for {SITE.serviceArea}.
        </p>
        <p>
          We combine wholesome ingredients, mindful preparation and modern
          nutrition to help you eat well without sacrificing flavour. Fresh
          ingredients straight from the farm, homegrown herbs — nature in one
          bowl.
        </p>
        <p>
          Every bottle and every meal is crafted with one goal: making healthy
          living simple, accessible and enjoyable.
        </p>
        <p>
          Our meals and cold-pressed juices are made using fresh, real
          ingredients — without preservatives, artificial flavours, artificial
          colours or powdered mixes. We&apos;re also on a mission to challenge
          the idea that plant-based meals can&apos;t provide enough protein.
        </p>
      </div>

      <blockquote className="mx-auto mt-12 max-w-2xl border-l-2 border-plum pl-6 font-display text-2xl italic leading-snug text-plum-deep">
        “Redefine the way people think about healthy food — making fresh,
        high-protein vegetarian meals a part of everyday life, and inspiring
        healthier lifestyles with food that&apos;s preservative-free, accessible,
        enjoyable and trustworthy — one meal at a time.”
      </blockquote>

      <p className="mx-auto mt-6 max-w-2xl text-center font-script text-2xl text-plum">
        Real Ingredients. High Protein. Pure Vegetarian. No Preservatives.
      </p>

      <LeafDivider className="mx-auto my-14 max-w-md" />

      <SectionHeading eyebrow="What we hold to" title="Our values" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {VALUES.map((v) => (
          <div
            key={v.title}
            className="rounded-3xl border border-plum-deep/10 bg-white/70 p-7"
          >
            <h3 className="font-display text-xl text-plum-deep">{v.title}</h3>
            <p className="mt-2 text-sm text-ink/65">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-[2rem] bg-lilac-soft/60 p-10 text-center">
        <p className="font-display text-2xl text-plum-deep">
          Est. {SITE.established} · {SITE.serviceArea}
        </p>
        <p className="mt-2 text-sm text-ink/60">
          Pure veg &amp; vegan-friendly. Made fresh, delivered to your door.
        </p>
        <div className="mt-6">
          <ButtonLink href="/menu" variant="primary">
            Explore the menu
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
