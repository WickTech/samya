import type { MenuItem } from "@/types/menu";
import { CONTACT } from "@/lib/site";
import { formatINR, getItemById } from "@/lib/menu";

/** One line in the order, as stored in local state. */
export interface OrderLine {
  /** Stable key = itemId or itemId:grams for tiered items. */
  key: string;
  itemId: string;
  /** Chosen protein weight for Protein Box items. */
  grams?: number;
  qty: number;
}

export interface ResolvedLine extends OrderLine {
  item: MenuItem;
  unitAmount: number;
  lineAmount: number;
  label: string;
}

export function lineKey(itemId: string, grams?: number): string {
  return grams ? `${itemId}:${grams}` : itemId;
}

function unitAmountFor(item: MenuItem, grams?: number): number {
  if (item.price.type === "fixed") return item.price.amount;
  const tier =
    item.price.tiers.find((t) => t.grams === grams) ?? item.price.tiers[0];
  return tier.amount;
}

export function resolveLines(lines: OrderLine[]): ResolvedLine[] {
  return lines
    .map((line) => {
      const item = getItemById(line.itemId);
      if (!item) return null;
      const unitAmount = unitAmountFor(item, line.grams);
      const label = line.grams ? `${item.name} (${line.grams}g)` : item.name;
      return {
        ...line,
        item,
        unitAmount,
        lineAmount: unitAmount * line.qty,
        label,
      } satisfies ResolvedLine;
    })
    .filter((l): l is ResolvedLine => l !== null);
}

export function orderTotal(lines: ResolvedLine[]): number {
  return lines.reduce((sum, l) => sum + l.lineAmount, 0);
}

export function orderCount(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

/**
 * Phase 1 checkout: no gateway. Build a wa.me link with a readable
 * order summary that the customer sends; the kitchen confirms on chat.
 */
export function buildWhatsAppOrderUrl(lines: ResolvedLine[]): string {
  const rows = lines.map(
    (l) => `• ${l.label} × ${l.qty} — ${formatINR(l.lineAmount)}`,
  );
  const total = orderTotal(lines);

  const message = [
    "Hi SĀMYA! I'd like to place an order:",
    "",
    ...rows,
    "",
    `Estimated total: ${formatINR(total)}`,
    "",
    "Name:",
    "Delivery address:",
    "Preferred delivery time:",
    "",
    "(Sent from the SĀMYA website — please confirm availability & final total.)",
  ].join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
