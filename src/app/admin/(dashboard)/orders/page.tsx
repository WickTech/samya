import type { Metadata } from "next";
import { listMenuItems, listOrders } from "@/lib/admin/store";
import { startingAmount } from "@/lib/menu";
import { OrdersTable } from "@/components/admin/orders-table";
import type { MenuPickerItem } from "@/components/admin/orders-table";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [orders, menu] = await Promise.all([listOrders(), listMenuItems()]);

  const pickable: MenuPickerItem[] = menu
    .filter((m) => m.available)
    .map((m) => ({
      id: m.id,
      name: m.name,
      tiers:
        m.price.type === "tiered"
          ? m.price.tiers
          : [{ grams: 0, amount: m.price.amount }],
      startingAmount: startingAmount(m.price),
    }));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl text-plum-deep">Orders</h1>
        <p className="text-sm text-mauve">
          Incoming orders from WhatsApp, Zomato, Swiggy and walk-ins.
        </p>
      </header>
      <OrdersTable initialOrders={orders} menu={pickable} />
    </div>
  );
}
