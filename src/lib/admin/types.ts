import type { Macros, Price } from "@/types/menu";
import type {
  ORDER_CHANNELS,
  ORDER_STATUSES,
} from "@/lib/admin/config";

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderChannel = (typeof ORDER_CHANNELS)[number];

export interface OrderItemLine {
  name: string;
  qty: number;
  /** Protein weight for Protein Box lines, in grams. */
  grams?: number;
  /** Unit price in INR at the time the order was taken. */
  unitAmount: number;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  /** Digits only, country code first (matches CONTACT.whatsapp style). */
  whatsapp: string;
  channel: OrderChannel;
  items: OrderItemLine[];
  /** Order total in INR. */
  total: number;
  status: OrderStatus;
  note?: string;
}

export type OrderInput = Omit<
  Order,
  "id" | "createdAt" | "updatedAt" | "total"
> & { total?: number };

export type OrderPatch = Partial<
  Pick<
    Order,
    "customerName" | "whatsapp" | "channel" | "items" | "status" | "note" | "total"
  >
>;

/** A menu item as managed by the owner — the public MenuItem plus stock state. */
export interface AdminMenuItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: Price;
  /** In-stock / out-of-stock toggle. */
  available: boolean;
  dietary: string[];
  kcal: number | null;
  macros: Macros | null;
  signature: boolean;
  image: string;
  updatedAt: string;
}

export type AdminMenuItemInput = Omit<AdminMenuItem, "updatedAt">;
export type AdminMenuItemPatch = Partial<Omit<AdminMenuItem, "id" | "updatedAt">>;

export interface ActivityEntry {
  id: string;
  at: string;
  kind: "order" | "menu" | "auth";
  message: string;
}

export interface DailyPoint {
  /** IST calendar date, YYYY-MM-DD. */
  date: string;
  /** Short label for charts, e.g. "Mon 25". */
  label: string;
  revenue: number;
  orders: number;
}

export interface Analytics {
  todayRevenue: number;
  yesterdayRevenue: number;
  weekRevenue: number;
  weekOrders: number;
  totalOrders: number;
  openOrders: number;
  avgOrderValue: number;
  statusCounts: Record<OrderStatus, number>;
  dailySeries: DailyPoint[];
  activity: ActivityEntry[];
}
