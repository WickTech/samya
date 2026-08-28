import Link from "next/link";
import { BotanicalSprig } from "@/components/botanical";
import { Wordmark } from "@/components/wordmark";
import { NAV_LINKS, CONTACT, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-lilac-soft/80">
      <BotanicalSprig className="absolute -left-6 bottom-0 h-56 w-32 text-lilac/25" />
      <BotanicalSprig
        flip
        className="absolute -right-6 top-4 h-48 w-28 text-lilac/20"
      />
      <div className="shell relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Wordmark className="text-lilac" showDevanagari={false} />
          <p className="max-w-xs text-sm text-lilac-soft/70">
            {SITE.positioning} Fresh, high-protein, pure-veg meals for{" "}
            {SITE.serviceArea}.
          </p>
        </div>

        <nav className="space-y-2 text-sm">
          <p className="eyebrow text-lilac/70">Explore</p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block w-fit link-underline hover:border-lilac"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 text-sm">
          <p className="eyebrow text-lilac/70">Order</p>
          <p>Zomato · Swiggy</p>
          <p>WhatsApp order builder</p>
          <p>Direct doorstep delivery</p>
          <p>Weekly &amp; monthly subscriptions</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="eyebrow text-lilac/70">Contact</p>
          <p>{SITE.serviceArea}</p>
          <a className="block link-underline hover:border-lilac" href={`tel:+${CONTACT.whatsapp}`}>
            {CONTACT.phoneDisplay}
          </a>
          <a
            className="block link-underline hover:border-lilac"
            href={`mailto:${CONTACT.email}`}
          >
            {CONTACT.email}
          </a>
          <a
            className="block link-underline hover:border-lilac"
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{CONTACT.instagram}
          </a>
        </div>
      </div>

      <div className="shell relative flex flex-col gap-1 border-t border-lilac/15 py-6 text-xs text-lilac-soft/60 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name} · Est. {SITE.established} ·{" "}
          {SITE.serviceArea}
        </p>
        <p>{SITE.devanagari} — {SITE.meaning}</p>
      </div>
    </footer>
  );
}
