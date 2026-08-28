"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/menu";
import type { MenuItem } from "@/types/menu";
import { useOrder } from "@/components/order/order-provider";

export function AddToOrderButton({
  item,
  className,
}: {
  item: MenuItem;
  className?: string;
}) {
  const { add } = useOrder();
  const price = item.price;
  const [grams, setGrams] = useState<number>(
    price.type === "tiered" ? price.tiers[0].grams : 0,
  );

  if (price.type === "tiered") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Protein weight">
          {price.tiers.map((tier) => (
            <button
              key={tier.grams}
              type="button"
              onClick={() => setGrams(tier.grams)}
              aria-pressed={grams === tier.grams}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                grams === tier.grams
                  ? "bg-plum-deep text-cream"
                  : "bg-cream text-plum-deep ring-1 ring-inset ring-mauve/40 hover:ring-plum-deep",
              )}
            >
              {tier.grams}g · {formatINR(tier.amount)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => add(item.id, grams)}
          className="w-full rounded-full bg-plum px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-plum-deep"
        >
          Add to order
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(item.id)}
      className={cn(
        "rounded-full bg-plum px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-plum-deep",
        className,
      )}
    >
      Add to order
    </button>
  );
}
