import { cn } from "@/lib/cn";
import { ButtonAnchor } from "@/components/ui/button-link";
import { LeafDivider } from "@/components/botanical";
import { planEnquiryUrl, type SubscriptionPlan } from "@/data/subscriptions";

export function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl border p-7",
        plan.featured
          ? "border-plum-deep/20 bg-white shadow-lg shadow-plum-deep/10"
          : "border-plum-deep/10 bg-white/60",
      )}
    >
      {plan.featured && (
        <span className="mb-4 w-fit rounded-full bg-plum-deep px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-cream">
          Most popular
        </span>
      )}
      <h3 className="font-display text-2xl text-plum-deep">{plan.name}</h3>
      <p className="font-script text-xl text-plum">{plan.tagline}</p>
      <p className="mt-1 text-xs uppercase tracking-eyebrow text-mauve">
        {plan.cadence}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-ink/65">{plan.blurb}</p>

      <LeafDivider className="my-5" />

      <ul className="space-y-2 text-sm text-ink/75">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-plum" />
            {f}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs text-ink/55">
        <span className="font-semibold text-plum-deep">Best for:</span>{" "}
        {plan.bestFor}
      </p>

      <div className="mt-6 pt-1">
        <ButtonAnchor
          href={planEnquiryUrl(plan)}
          target="_blank"
          rel="noopener noreferrer"
          variant={plan.featured ? "primary" : "outline"}
          className="w-full"
        >
          Enquire on WhatsApp
        </ButtonAnchor>
      </div>
    </article>
  );
}
