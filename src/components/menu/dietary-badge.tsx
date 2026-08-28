import { cn } from "@/lib/cn";
import type { DietaryTag } from "@/types/menu";

const LABELS: Record<DietaryTag, string> = {
  veg: "Pure Veg",
  vegan: "Vegan",
  "dairy-free": "Dairy-free",
};

export function DietaryBadge({
  tag,
  className,
}: {
  tag: DietaryTag;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-lilac-soft px-2.5 py-0.5 text-[0.68rem] font-semibold text-plum-deep",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tag === "veg" && "bg-green-600",
          tag === "vegan" && "bg-emerald-500",
          tag === "dairy-free" && "bg-mauve",
        )}
      />
      {LABELS[tag]}
    </span>
  );
}
