import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { PlanCard } from "@/components/subscriptions/plan-card";
import { LeafDivider } from "@/components/botanical";
import { SUBSCRIPTION_PLANS } from "@/data/subscriptions";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subscriptions",
  description:
    "Weekly and monthly SĀMYA meal plans for Bhilai–Durg — high-protein bowls and salads delivered to your door, with pause and swap built in.",
};

const STEPS = [
  {
    n: "01",
    title: "Pick a plan",
    body: "Weekly Reset, Monthly Balance or a custom corporate plan for your team.",
  },
  {
    n: "02",
    title: "Set your target",
    body: "Choose a protein target and your lunch or dinner slot. Tell us about allergies.",
  },
  {
    n: "03",
    title: "Eat, pause, swap",
    body: "A rotating menu lands daily. Pause days you're away, swap dishes you're not feeling.",
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="shell py-16">
      <SectionHeading eyebrow="Eat well, on repeat" title="Subscriptions">
        The simplest way to hit your protein target every weekday. Plans are set
        up over WhatsApp for now — billing and self-serve scheduling are on the
        way.
      </SectionHeading>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <LeafDivider className="mx-auto my-16 max-w-md" />

      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-2xl text-plum-deep">
          How it works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl bg-lilac-soft/60 p-6">
              <p className="font-script text-3xl text-plum">{s.n}</p>
              <h3 className="mt-1 font-display text-lg text-plum-deep">
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-ink/65">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ink/55">
          Delivery included across {SITE.serviceArea}. Plan pricing is shared on
          enquiry while we finalise public rates.
        </p>
      </div>
    </div>
  );
}
