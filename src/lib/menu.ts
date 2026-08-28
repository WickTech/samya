import menuData from "@/data/menu.json";
import type {
  DietaryTag,
  MenuCategory,
  MenuCategoryMeta,
  MenuItem,
  Price,
  ProteinLevel,
} from "@/types/menu";

const CATEGORIES = menuData.categories as unknown as MenuCategoryMeta[];
const ITEMS = menuData.items as unknown as MenuItem[];

export const NUTRITION_NOTE = menuData.note as string;

export function getCategories(): MenuCategoryMeta[] {
  return CATEGORIES;
}

export function getCategoryMeta(id: MenuCategory): MenuCategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getAllItems(): MenuItem[] {
  return ITEMS;
}

export function getItemById(id: string): MenuItem | undefined {
  return ITEMS.find((i) => i.id === id);
}

export function getSignatureItems(): MenuItem[] {
  return ITEMS.filter((i) => i.signature);
}

/** Lowest protein weight for a tiered item, else the macro protein figure. */
export function proteinGrams(item: MenuItem): number {
  if (item.price.type === "tiered") {
    return Math.min(...item.price.tiers.map((t) => t.grams));
  }
  return item.macros?.protein ?? 0;
}

export function proteinLevel(item: MenuItem): ProteinLevel {
  const g = proteinGrams(item);
  if (g >= 20) return "high";
  if (g >= 10) return "moderate";
  return "light";
}

export const PROTEIN_LEVELS: { id: ProteinLevel; label: string }[] = [
  { id: "high", label: "High protein (20g+)" },
  { id: "moderate", label: "Moderate (10–19g)" },
  { id: "light", label: "Light (under 10g)" },
];

export const DIETARY_TAGS: { id: DietaryTag; label: string }[] = [
  { id: "veg", label: "Pure Veg" },
  { id: "vegan", label: "Vegan" },
  { id: "dairy-free", label: "Dairy-free" },
];

/** Starting price in INR — the minimum across tiers for tiered items. */
export function startingAmount(price: Price): number {
  return price.type === "fixed"
    ? price.amount
    : Math.min(...price.tiers.map((t) => t.amount));
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Human-readable price for a card: "₹299" or "from ₹189". */
export function formatPriceLabel(price: Price): string {
  if (price.type === "fixed") return formatINR(price.amount);
  return `from ${formatINR(startingAmount(price))}`;
}

export interface MenuFilters {
  categories: MenuCategory[];
  dietary: DietaryTag[];
  proteinLevels: ProteinLevel[];
  search: string;
}

export const EMPTY_FILTERS: MenuFilters = {
  categories: [],
  dietary: [],
  proteinLevels: [],
  search: "",
};

export function filterItems(items: MenuItem[], filters: MenuFilters): MenuItem[] {
  const q = filters.search.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.categories.length && !filters.categories.includes(item.category)) {
      return false;
    }
    if (
      filters.dietary.length &&
      !filters.dietary.every((tag) => item.dietary.includes(tag))
    ) {
      return false;
    }
    if (
      filters.proteinLevels.length &&
      !filters.proteinLevels.includes(proteinLevel(item))
    ) {
      return false;
    }
    if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
}
