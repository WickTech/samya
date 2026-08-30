import type { Metadata } from "next";
import { getCategories } from "@/lib/menu";
import { listMenuItems } from "@/lib/admin/store";
import { MenuManager } from "@/components/admin/menu-manager";

export const metadata: Metadata = { title: "Menu" };
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const items = await listMenuItems();
  const categories = getCategories().map((c) => ({ id: c.id, label: c.label }));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl text-plum-deep">Menu</h1>
        <p className="text-sm text-mauve">
          Prices, protein tiers, stock status and descriptions.
        </p>
      </header>
      <MenuManager initialItems={items} categories={categories} />
    </div>
  );
}
