import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { LeafDivider } from "@/components/botanical";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button-link";
import { CONTACT, ORDER_PLATFORMS, SITE, whatsappChatUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach SĀMYA in Bhilai–Durg — WhatsApp, call, email or Instagram. Order direct or on Zomato and Swiggy.",
};

const ROWS = [
  { label: "Service area", value: `${SITE.serviceArea} (incl. Nehru Nagar)` },
  { label: "WhatsApp / Call", value: CONTACT.phoneDisplay, href: `tel:+${CONTACT.whatsapp}` },
  { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  {
    label: "Instagram",
    value: `@${CONTACT.instagram}`,
    href: CONTACT.instagramUrl,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div className="shell py-16">
      <SectionHeading eyebrow="Get in touch" title="Order your bowl of balance" />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-plum-deep/10 bg-white/70 p-8">
          <h2 className="font-display text-2xl text-plum-deep">
            Contact &amp; location
          </h2>
          <dl className="mt-5 space-y-3 text-sm">
            {ROWS.map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-plum" />
                <div>
                  <dt className="text-xs uppercase tracking-eyebrow text-mauve">
                    {row.label}
                  </dt>
                  <dd className="text-ink/80">
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.external ? "_blank" : undefined}
                        rel={row.external ? "noopener noreferrer" : undefined}
                        className="link-underline"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <LeafDivider className="my-6" />
          <ButtonAnchor
            href={whatsappChatUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="plum"
            className="w-full"
          >
            Chat on WhatsApp
          </ButtonAnchor>
        </div>

        <div className="rounded-3xl border border-plum-deep/10 bg-white/70 p-8">
          <h2 className="font-display text-2xl text-plum-deep">Order now</h2>
          <p className="mt-3 text-sm text-ink/65">Available for delivery on:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-lilac-soft px-4 py-1.5 text-xs font-medium text-plum-deep">
              WhatsApp order builder
            </span>
            <span className="rounded-full bg-lilac-soft px-4 py-1.5 text-xs font-medium text-plum-deep">
              Direct doorstep delivery
            </span>
            {ORDER_PLATFORMS.map((p) => (
              <span
                key={p.name}
                className="rounded-full bg-lilac-soft px-4 py-1.5 text-xs font-medium text-plum-deep"
              >
                {p.name}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink/55">
            On Zomato &amp; Swiggy, search “SĀMYA” in {SITE.serviceArea}.
          </p>
          <LeafDivider className="my-6" />
          <p className="text-sm text-ink/65">
            Weekly &amp; monthly subscriptions available — pick a plan and enquire
            on WhatsApp.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/menu" variant="primary">
              Build an order
            </ButtonLink>
            <ButtonLink href="/subscriptions" variant="outline">
              See subscriptions
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
