"use client";

import { cn } from "@/lib/cn";
import {
  DIETARY_TAGS,
  PROTEIN_LEVELS,
  getCategories,
  type MenuFilters,
} from "@/lib/menu";
import type { DietaryTag, MenuCategory, ProteinLevel } from "@/types/menu";

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-plum-deep text-cream"
          : "bg-white/70 text-plum-deep ring-1 ring-inset ring-mauve/35 hover:ring-plum-deep",
      )}
    >
      {children}
    </button>
  );
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: MenuFilters;
  onChange: (next: MenuFilters) => void;
  resultCount: number;
}) {
  const categories = getCategories();
  const hasFilters =
    filters.categories.length > 0 ||
    filters.dietary.length > 0 ||
    filters.proteinLevels.length > 0 ||
    filters.search.trim() !== "";

  return (
    <div className="rounded-3xl border border-plum-deep/10 bg-cream/70 p-5 backdrop-blur">
      <div className="flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search the menu</span>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search dishes, ingredients…"
            className="w-full rounded-full border border-mauve/30 bg-white/80 px-5 py-3 text-sm outline-none placeholder:text-ink/40 focus:border-plum"
          />
        </label>

        <FilterGroup label="Category">
          {categories.map((c) => (
            <Chip
              key={c.id}
              active={filters.categories.includes(c.id)}
              onClick={() =>
                onChange({
                  ...filters,
                  categories: toggle<MenuCategory>(filters.categories, c.id),
                })
              }
            >
              {c.label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Dietary">
          {DIETARY_TAGS.map((d) => (
            <Chip
              key={d.id}
              active={filters.dietary.includes(d.id)}
              onClick={() =>
                onChange({
                  ...filters,
                  dietary: toggle<DietaryTag>(filters.dietary, d.id),
                })
              }
            >
              {d.label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Protein level">
          {PROTEIN_LEVELS.map((p) => (
            <Chip
              key={p.id}
              active={filters.proteinLevels.includes(p.id)}
              onClick={() =>
                onChange({
                  ...filters,
                  proteinLevels: toggle<ProteinLevel>(
                    filters.proteinLevels,
                    p.id,
                  ),
                })
              }
            >
              {p.label}
            </Chip>
          ))}
        </FilterGroup>

        <div className="flex items-center justify-between border-t border-plum-deep/10 pt-3 text-xs text-ink/60">
          <span>
            {resultCount} dish{resultCount === 1 ? "" : "es"}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  categories: [],
                  dietary: [],
                  proteinLevels: [],
                  search: "",
                })
              }
              className="font-semibold text-mauve underline underline-offset-2 hover:text-plum-deep"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
