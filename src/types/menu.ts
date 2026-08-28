/**
 * Menu domain types for SĀMYA.
 * Data lives in src/data/menu.json — this file is the contract for it.
 */

export type MenuCategory =
  | "meal-bowls"
  | "protein-box"
  | "artisanal"
  | "sandwiches"
  | "salads"
  | "smoothies"
  | "smoothie-bowls"
  | "cold-pressed-juices";

export type DietaryTag = "veg" | "vegan" | "dairy-free";

export type ProteinLevel = "light" | "moderate" | "high";

/** Grams of macronutrients per serving. */
export interface Macros {
  protein: number;
  carb: number;
  fat: number;
}

/** A single fixed price, in INR. */
export interface FixedPrice {
  type: "fixed";
  amount: number;
}

/** Protein Box style pricing — one price per protein weight. */
export interface TieredPrice {
  type: "tiered";
  tiers: Array<{ grams: number; amount: number }>;
}

export type Price = FixedPrice | TieredPrice;

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: Price;
  /** Kilocalories per serving; null when not published. */
  kcal: number | null;
  /** Macro split per serving; null when not published. */
  macros: Macros | null;
  dietary: DietaryTag[];
  /** Hero / most re-ordered item. */
  signature: boolean;
  /**
   * true  → macros are a kitchen estimate
   * false → macros are taken from the printed menu card
   */
  estimated: boolean;
  /** Public path to the item image (placeholder art in this phase). */
  image: string;
  /** Serving volume for drinks, in millilitres. */
  volumeMl?: number;
}

export interface MenuCategoryMeta {
  id: MenuCategory;
  label: string;
  blurb: string;
}
