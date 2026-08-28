import { cn } from "@/lib/cn";
import { formatPriceLabel, getCategoryMeta } from "@/lib/menu";
import type { MenuItem } from "@/types/menu";
import { DietaryBadge } from "@/components/menu/dietary-badge";
import { AddToOrderButton } from "@/components/order/add-to-order-button";

export function MenuCard({ item }: { item: MenuItem }) {
  const category = getCategoryMeta(item.category);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-plum-deep/10 bg-white/70 shadow-sm shadow-plum-deep/5 transition-shadow hover:shadow-lg hover:shadow-plum-deep/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-lilac-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.signature && (
          <span className="absolute left-3 top-3 rounded-full bg-plum-deep/90 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-cream">
            Signature
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-mauve">
          {category?.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-plum-deep">
            {item.name}
          </h3>
          <span className="whitespace-nowrap pt-1 text-sm font-bold text-plum">
            {formatPriceLabel(item.price)}
          </span>
        </div>

        <p className="mt-2 text-[0.85rem] leading-relaxed text-ink/65">
          {item.description}
        </p>

        {item.macros && (
          <dl className="mt-4 grid grid-cols-4 gap-2 rounded-2xl bg-lilac-soft/60 p-3 text-center">
            <Stat label="kcal" value={item.kcal ?? "—"} />
            <Stat label="protein" value={`${item.macros.protein}g`} />
            <Stat label="carb" value={`${item.macros.carb}g`} />
            <Stat label="fat" value={`${item.macros.fat}g`} />
          </dl>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.dietary.map((tag) => (
            <DietaryBadge key={tag} tag={tag} />
          ))}
          {item.estimated && item.macros && (
            <span className="text-[0.68rem] italic text-ink/45">
              macros estimated
            </span>
          )}
        </div>

        <div className="mt-5 pt-1">
          <AddToOrderButton item={item} className="w-full" />
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dd className="font-display text-base text-plum-deep">{value}</dd>
      <dt className={cn("text-[0.6rem] uppercase tracking-eyebrow text-mauve")}>
        {label}
      </dt>
    </div>
  );
}
