"use client";

import { useState } from "react";
import { formatINR } from "@/lib/menu";
import type { DailyPoint } from "@/lib/admin/types";

/**
 * Dependency-free 7-day revenue bars. Pure SVG so it stays light and
 * theme-consistent with the brand palette.
 */
export function RevenueChart({ data }: { data: DailyPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.revenue));

  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-3" style={{ height: 160 }}>
        {data.map((d, i) => {
          const h = Math.round((d.revenue / max) * 100);
          return (
            <button
              key={d.date}
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group relative flex flex-1 flex-col items-center justify-end gap-1"
              style={{ height: "100%" }}
            >
              {active === i ? (
                <span className="absolute -top-1 z-10 -translate-y-full whitespace-nowrap rounded-md bg-plum-deep px-2 py-1 text-[11px] font-semibold text-cream shadow">
                  {formatINR(d.revenue)} · {d.orders} order
                  {d.orders === 1 ? "" : "s"}
                </span>
              ) : null}
              <span
                className="w-full max-w-10 rounded-t-md bg-lilac transition-colors group-hover:bg-plum"
                style={{ height: `${Math.max(h, 2)}%` }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {data.map((d) => (
          <span
            key={d.date}
            className="flex-1 text-center text-[11px] text-mauve"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
