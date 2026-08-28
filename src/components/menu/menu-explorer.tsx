"use client";

import { useMemo, useState } from "react";
import {
  EMPTY_FILTERS,
  filterItems,
  getAllItems,
  getCategories,
  type MenuFilters,
} from "@/lib/menu";
import { FilterBar } from "@/components/menu/filter-bar";
import { MenuCard } from "@/components/menu/menu-card";

export function MenuExplorer() {
  const [filters, setFilters] = useState<MenuFilters>(EMPTY_FILTERS);
  const allItems = useMemo(() => getAllItems(), []);
  const categories = getCategories();

  const results = useMemo(
    () => filterItems(allItems, filters),
    [allItems, filters],
  );

  // Group results by category, preserving the canonical category order.
  const grouped = useMemo(
    () =>
      categories
        .map((c) => ({
          category: c,
          items: results.filter((i) => i.category === c.id),
        }))
        .filter((g) => g.items.length > 0),
    [categories, results],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          resultCount={results.length}
        />
      </div>

      <div className="space-y-14">
        {grouped.length === 0 && (
          <div className="rounded-3xl border border-dashed border-mauve/40 p-12 text-center">
            <p className="font-script text-2xl text-plum">Nothing matches that.</p>
            <p className="mt-2 text-sm text-ink/60">
              Try loosening a filter — most SĀMYA dishes are pure veg and
              high-protein.
            </p>
          </div>
        )}

        {grouped.map(({ category, items }) => (
          <section key={category.id} id={category.id} className="scroll-mt-24">
            <div className="mb-5">
              <h2 className="font-display text-2xl text-plum-deep">
                {category.label}
              </h2>
              <p className="mt-1 text-sm text-ink/60">{category.blurb}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
