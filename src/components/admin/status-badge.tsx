import { Badge } from "@/components/admin/primitives";
import { ORDER_STATUS_LABEL } from "@/lib/admin/config";
import type { OrderStatus } from "@/lib/admin/types";

const TONE: Record<OrderStatus, Parameters<typeof Badge>[0]["tone"]> = {
  pending: "amber",
  preparing: "sky",
  "out-for-delivery": "lilac",
  delivered: "green",
  cancelled: "red",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={TONE[status]}>{ORDER_STATUS_LABEL[status]}</Badge>;
}
