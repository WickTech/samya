import { getAllItems, startingAmount } from "@/lib/menu";
import { kv } from "@/lib/admin/kv";
import {
  istDayKey,
  istDayLabel,
  recentDayKeys,
} from "@/lib/admin/time";
import type {
  ActivityEntry,
  AdminMenuItem,
  AdminMenuItemInput,
  AdminMenuItemPatch,
  Analytics,
  Order,
  OrderInput,
  OrderPatch,
  OrderStatus,
} from "@/lib/admin/types";
import { ORDER_STATUSES } from "@/lib/admin/config";

const KEYS = {
  orders: "samya:orders",
  menu: "samya:menu",
  activity: "samya:activity",
  seeded: "samya:seeded:v1",
} as const;

const ACTIVITY_LIMIT = 60;

function rid(prefix: string): string {
  return `${prefix}_${globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function lineTotal(items: Order["items"]): number {
  return items.reduce((sum, l) => sum + l.unitAmount * l.qty, 0);
}

/* --------------------------------- seeding -------------------------------- */

function seedMenu(): AdminMenuItem[] {
  return getAllItems().map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    available: true,
    dietary: [...item.dietary],
    kcal: item.kcal,
    macros: item.macros,
    signature: item.signature,
    image: item.image,
    updatedAt: nowIso(),
  }));
}

const SAMPLE_NAMES = [
  ["Ananya Sharma", "919812340011"],
  ["Rohit Verma", "919812340022"],
  ["Priya Nair", "919812340033"],
  ["Karan Mehta", "919812340044"],
  ["Sneha Iyer", "919812340055"],
  ["Vikram Singh", "919812340066"],
  ["Divya Rao", "919812340077"],
  ["Aditya Kulkarni", "919812340088"],
] as const;

function seedOrders(menu: AdminMenuItem[]): Order[] {
  const pool = menu.filter((m) => m.available);
  const orders: Order[] = [];
  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();

  // Spread ~14 orders across the last 7 days.
  for (let i = 0; i < 14; i++) {
    const ageDays = Math.floor((i / 14) * 7);
    const created = new Date(
      now - ageDays * day - Math.floor(Math.random() * day),
    );
    const [name, wa] = SAMPLE_NAMES[i % SAMPLE_NAMES.length];
    const lineCount = 1 + Math.floor(Math.random() * 3);
    const items = Array.from({ length: lineCount }, () => {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const grams =
        pick.price.type === "tiered"
          ? pick.price.tiers[
              Math.floor(Math.random() * pick.price.tiers.length)
            ].grams
          : undefined;
      const unitAmount =
        pick.price.type === "tiered"
          ? (pick.price.tiers.find((t) => t.grams === grams)?.amount ??
            startingAmount(pick.price))
          : pick.price.amount;
      return {
        name: pick.name,
        qty: 1 + Math.floor(Math.random() * 2),
        grams,
        unitAmount,
      };
    });

    // Older orders are further along; newest are still pending / preparing.
    let status: OrderStatus;
    if (ageDays >= 2) status = Math.random() < 0.1 ? "cancelled" : "delivered";
    else if (ageDays === 1) status = "delivered";
    else status = (["pending", "preparing", "out-for-delivery"] as const)[
      Math.floor(Math.random() * 3)
    ];

    orders.push({
      id: rid("ord"),
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
      customerName: name,
      whatsapp: wa,
      channel: (["whatsapp", "whatsapp", "zomato", "swiggy"] as const)[
        Math.floor(Math.random() * 4)
      ],
      items,
      total: lineTotal(items),
      status,
    });
  }

  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function ensureSeeded(): Promise<void> {
  if (await kv.read<boolean>(KEYS.seeded)) return;
  const menu = seedMenu();
  const orders = seedOrders(menu);
  const seededEntry: ActivityEntry = {
    id: rid("act"),
    at: nowIso(),
    kind: "menu",
    message: `Menu initialised with ${menu.length} items from the published catalogue.`,
  };
  const orderEntries: ActivityEntry[] = orders.slice(0, 6).map((o) => ({
    id: rid("act"),
    at: o.createdAt,
    kind: "order",
    message: `Order from ${o.customerName} — ₹${o.total.toLocaleString("en-IN")}`,
  }));
  const activity: ActivityEntry[] = [seededEntry, ...orderEntries].sort(
    (a, b) => b.at.localeCompare(a.at),
  );

  await kv.write(KEYS.menu, menu);
  await kv.write(KEYS.orders, orders);
  await kv.write(KEYS.activity, activity);
  await kv.write(KEYS.seeded, true);
}

/* -------------------------------- activity -------------------------------- */

async function logActivity(
  kind: ActivityEntry["kind"],
  message: string,
): Promise<void> {
  const log = (await kv.read<ActivityEntry[]>(KEYS.activity)) ?? [];
  log.unshift({ id: rid("act"), at: nowIso(), kind, message });
  await kv.write(KEYS.activity, log.slice(0, ACTIVITY_LIMIT));
}

export async function getActivity(limit = 12): Promise<ActivityEntry[]> {
  await ensureSeeded();
  const log = (await kv.read<ActivityEntry[]>(KEYS.activity)) ?? [];
  return log.slice(0, limit);
}

/* --------------------------------- orders -------------------------------- */

export async function listOrders(): Promise<Order[]> {
  await ensureSeeded();
  const orders = (await kv.read<Order[]>(KEYS.orders)) ?? [];
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await listOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function createOrder(input: OrderInput): Promise<Order> {
  await ensureSeeded();
  const orders = (await kv.read<Order[]>(KEYS.orders)) ?? [];
  const at = nowIso();
  const order: Order = {
    id: rid("ord"),
    createdAt: at,
    updatedAt: at,
    customerName: input.customerName.trim(),
    whatsapp: input.whatsapp.replace(/[^\d]/g, ""),
    channel: input.channel,
    items: input.items,
    total: input.total ?? lineTotal(input.items),
    status: input.status,
    note: input.note?.trim() || undefined,
  };
  orders.unshift(order);
  await kv.write(KEYS.orders, orders);
  await logActivity(
    "order",
    `New order from ${order.customerName} — ₹${order.total.toLocaleString("en-IN")}`,
  );
  return order;
}

export async function updateOrder(
  id: string,
  patch: OrderPatch,
): Promise<Order | null> {
  await ensureSeeded();
  const orders = (await kv.read<Order[]>(KEYS.orders)) ?? [];
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const prev = orders[idx];
  const next: Order = { ...prev, ...patch, updatedAt: nowIso() };
  if (patch.whatsapp) next.whatsapp = patch.whatsapp.replace(/[^\d]/g, "");
  if (patch.items && patch.total === undefined) {
    next.total = lineTotal(patch.items);
  }
  if (patch.note !== undefined) next.note = patch.note.trim() || undefined;

  orders[idx] = next;
  await kv.write(KEYS.orders, orders);

  if (patch.status && patch.status !== prev.status) {
    await logActivity(
      "order",
      `${next.customerName}'s order → ${patch.status.replace(/-/g, " ")}`,
    );
  }
  return next;
}

export async function deleteOrder(id: string): Promise<boolean> {
  await ensureSeeded();
  const orders = (await kv.read<Order[]>(KEYS.orders)) ?? [];
  const next = orders.filter((o) => o.id !== id);
  if (next.length === orders.length) return false;
  await kv.write(KEYS.orders, next);
  await logActivity("order", `Order ${id} deleted.`);
  return true;
}

/* ---------------------------------- menu --------------------------------- */

export async function listMenuItems(): Promise<AdminMenuItem[]> {
  await ensureSeeded();
  const items = (await kv.read<AdminMenuItem[]>(KEYS.menu)) ?? [];
  return [...items].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
  );
}

export async function getMenuItem(id: string): Promise<AdminMenuItem | null> {
  const items = await listMenuItems();
  return items.find((i) => i.id === id) ?? null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createMenuItem(
  input: AdminMenuItemInput,
): Promise<AdminMenuItem> {
  await ensureSeeded();
  const items = (await kv.read<AdminMenuItem[]>(KEYS.menu)) ?? [];
  const base = input.slug?.trim() || slugify(input.name);
  let slug = base;
  let n = 2;
  while (items.some((i) => i.slug === slug)) slug = `${base}-${n++}`;

  const item: AdminMenuItem = {
    ...input,
    id: input.id?.trim() || rid("menu"),
    slug,
    name: input.name.trim(),
    description: input.description.trim(),
    updatedAt: nowIso(),
  };
  items.push(item);
  await kv.write(KEYS.menu, items);
  await logActivity("menu", `Menu item added: ${item.name}`);
  return item;
}

export async function updateMenuItem(
  id: string,
  patch: AdminMenuItemPatch,
): Promise<AdminMenuItem | null> {
  await ensureSeeded();
  const items = (await kv.read<AdminMenuItem[]>(KEYS.menu)) ?? [];
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  const prev = items[idx];
  const next: AdminMenuItem = { ...prev, ...patch, updatedAt: nowIso() };
  items[idx] = next;
  await kv.write(KEYS.menu, items);

  if (patch.available !== undefined && patch.available !== prev.available) {
    await logActivity(
      "menu",
      `${next.name} marked ${patch.available ? "in stock" : "out of stock"}`,
    );
  } else {
    await logActivity("menu", `Menu item updated: ${next.name}`);
  }
  return next;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  await ensureSeeded();
  const items = (await kv.read<AdminMenuItem[]>(KEYS.menu)) ?? [];
  const target = items.find((i) => i.id === id);
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await kv.write(KEYS.menu, next);
  await logActivity("menu", `Menu item removed: ${target?.name ?? id}`);
  return true;
}

/* ------------------------------- analytics ------------------------------- */

const ZERO_COUNTS = (): Record<OrderStatus, number> =>
  Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<
    OrderStatus,
    number
  >;

export async function getAnalytics(): Promise<Analytics> {
  const [orders, activity] = await Promise.all([listOrders(), getActivity(12)]);
  const counts = ZERO_COUNTS();

  const earning = orders.filter((o) => o.status !== "cancelled");
  const todayKey = istDayKey(Date.now());
  const yesterdayKey = istDayKey(Date.now() - 24 * 60 * 60 * 1000);
  const weekKeys = new Set(recentDayKeys(7));

  let todayRevenue = 0;
  let yesterdayRevenue = 0;
  let weekRevenue = 0;
  let weekOrders = 0;

  const byDay = new Map<string, { revenue: number; orders: number }>();

  for (const o of orders) counts[o.status] += 1;

  for (const o of earning) {
    const key = istDayKey(o.createdAt);
    if (key === todayKey) todayRevenue += o.total;
    if (key === yesterdayKey) yesterdayRevenue += o.total;
    if (weekKeys.has(key)) {
      weekRevenue += o.total;
      weekOrders += 1;
      const d = byDay.get(key) ?? { revenue: 0, orders: 0 };
      d.revenue += o.total;
      d.orders += 1;
      byDay.set(key, d);
    }
  }

  const dailySeries = recentDayKeys(7).map((date) => ({
    date,
    label: istDayLabel(`${date}T06:00:00.000Z`),
    revenue: byDay.get(date)?.revenue ?? 0,
    orders: byDay.get(date)?.orders ?? 0,
  }));

  const totalEarning = earning.length;

  return {
    todayRevenue,
    yesterdayRevenue,
    weekRevenue,
    weekOrders,
    totalOrders: orders.length,
    openOrders:
      counts.pending + counts.preparing + counts["out-for-delivery"],
    avgOrderValue: totalEarning
      ? Math.round(
          earning.reduce((s, o) => s + o.total, 0) / totalEarning,
        )
      : 0,
    statusCounts: counts,
    dailySeries,
    activity,
  };
}
