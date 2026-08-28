import { getSignatureItems } from "@/lib/menu";
import { MenuCard } from "@/components/menu/menu-card";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui/button-link";

export function SignatureBowls() {
  const items = getSignatureItems();

  return (
    <section className="shell py-20">
      <SectionHeading eyebrow="Straight from our kitchen" title="Signature dishes">
        What Bhilai–Durg keeps re-ordering — freshly tossed, never pre-made.
      </SectionHeading>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <ButtonLink href="/menu" variant="outline">
          See the full menu
        </ButtonLink>
      </div>
    </section>
  );
}
