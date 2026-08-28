import { CONTACT } from "@/lib/site";

export interface SubscriptionPlan {
  id: string;
  name: string;
  cadence: string;
  tagline: string;
  blurb: string;
  features: string[];
  bestFor: string;
  featured?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "weekly-reset",
    name: "Weekly Reset",
    cadence: "6 days a week",
    tagline: "A short, honest reset",
    blurb:
      "One meal bowl or salad a day, Monday to Saturday. Rotating menu so you never eat the same thing twice.",
    features: [
      "6 meals / week",
      "Choose lunch or dinner slot",
      "Swap any 2 meals a week",
      "Pause up to 1 day, no charge",
    ],
    bestFor: "Trying subscriptions for the first time",
  },
  {
    id: "monthly-balance",
    name: "Monthly Balance",
    cadence: "24 meals / month",
    tagline: "The everyday plan",
    blurb:
      "Your weekday meals sorted for the month — bowls, salads and a weekly cold-pressed juice, planned around your protein target.",
    features: [
      "24 meals / month",
      "Weekly cold-pressed juice included",
      "Set your protein target (30 / 40 / 50g)",
      "Free delivery across Bhilai–Durg",
      "Pause or roll over unused meals",
    ],
    bestFor: "Weight loss & consistent high-protein eating",
    featured: true,
  },
  {
    id: "corporate-lunch",
    name: "Corporate Lunch",
    cadence: "Custom, per team",
    tagline: "Office lunch, handled",
    blurb:
      "Fixed daily delivery for teams of 5 or more. One invoice, per-head pricing, a menu your office actually looks forward to.",
    features: [
      "5+ meals per delivery",
      "Single monthly invoice",
      "Rotating set menu + dietary tags",
      "Dedicated WhatsApp line for changes",
    ],
    bestFor: "Companies in Nehru Nagar & around Bhilai–Durg",
  },
];

export function planEnquiryUrl(plan: SubscriptionPlan): string {
  const message = [
    `Hi SĀMYA! I'm interested in the ${plan.name} subscription (${plan.cadence}).`,
    "",
    "Name:",
    "Delivery area:",
    "Preferred start date:",
    "Protein target (30 / 40 / 50g):",
  ].join("\n");
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
