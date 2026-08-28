import { ButtonAnchor, ButtonLink } from "@/components/ui/button-link";
import { BotanicalSprig } from "@/components/botanical";
import { SITE, whatsappChatUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Organic colour field */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-lilac via-lilac-soft to-mauve" />
      <div
        aria-hidden
        className="absolute -right-24 -top-24 -z-10 h-[32rem] w-[32rem] rounded-blob bg-cream/40 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-24 -z-10 h-[28rem] w-[28rem] rounded-blob bg-plum/20 blur-2xl"
      />
      <BotanicalSprig className="absolute left-2 top-10 hidden h-64 w-32 text-plum-deep/40 sm:block lg:left-10" />
      <BotanicalSprig
        flip
        className="absolute bottom-6 right-2 hidden h-64 w-32 text-plum-deep/40 sm:block lg:right-10"
      />

      <div className="shell relative flex min-h-[86vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow text-plum-deep/80">
          Est. {SITE.established} · {SITE.serviceArea}
        </p>
        <h1 className="mt-5 wordmark text-6xl text-plum-deep sm:text-7xl">
          {SITE.wordmark}
        </h1>
        <p className="mt-2 text-lg tracking-wide text-plum">
          {SITE.devanagari} — {SITE.meaning}
        </p>
        <p className="mt-6 font-script text-3xl text-plum-deep sm:text-4xl">
          {SITE.tagline}
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-plum-deep/75">
          Clean · Pure Veg · High Protein — weight-loss, office-lunch and
          gut-friendly meal bowls with 30–50g protein each, tossed fresh to
          order.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/menu" variant="primary">
            View the menu
          </ButtonLink>
          <ButtonAnchor
            href={whatsappChatUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            className="!text-plum-deep !ring-plum-deep/40 hover:!bg-plum-deep/10"
          >
            Order on WhatsApp
          </ButtonAnchor>
        </div>
      </div>
    </section>
  );
}
