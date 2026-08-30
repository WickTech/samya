"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/menu";
import { adminFetch } from "@/lib/admin/client";
import {
  ORDER_CHANNEL_LABEL,
  ORDER_STATUS_LABEL,
  ORDER_STATUSES,
} from "@/lib/admin/config";
import { istDayLabel, istTimeLabel } from "@/lib/admin/time";
import type { Order, OrderItemLine, OrderStatus } from "@/lib/admin/types";
import {
  Button,
  Card,
  Drawer,
  EmptyState,
  Field,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@/components/admin/primitives";
import { StatusBadge } from "@/components/admin/status-badge";

export interface MenuPickerItem {
  id: string;
  name: string;
  tiers: { grams: number; amount: number }[];
  startingAmount: number;
}

type Filter = "all" | OrderStatus;

function itemsSummary(items: OrderItemLine[]): string {
  return items
    .map((l) => `${l.qty}× ${l.name}${l.grams ? ` (${l.grams}g)` : ""}`)
    .join(", ");
}

function waLink(digits: string): string {
  return `https://wa.me/${digits.replace(/[^\d]/g, "")}`;
}

export function OrdersTable({
  initialOrders,
  menu,
}: {
  initialOrders: Order[];
  menu: MenuPickerItem[];
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: orders.length } as never;
    for (const s of ORDER_STATUSES) c[s] = 0;
    for (const o of orders) c[o.status] += 1;
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (
        q &&
        !`${o.customerName} ${o.whatsapp} ${itemsSummary(o.items)}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [orders, filter, query]);

  function upsert(order: Order) {
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === order.id);
      if (idx === -1) return [order, ...prev];
      const next = [...prev];
      next[idx] = order;
      return next;
    });
    setSelected((cur) => (cur?.id === order.id ? order : cur));
  }

  async function changeStatus(order: Order, status: OrderStatus) {
    const prev = order;
    upsert({ ...order, status }); // optimistic
    try {
      const { order: saved } = await adminFetch<{ order: Order }>(
        `/api/admin/orders/${order.id}`,
        { method: "PATCH", body: JSON.stringify({ status }) },
      );
      upsert(saved);
      setFlash(`${saved.customerName} → ${ORDER_STATUS_LABEL[status]}`);
    } catch (err) {
      upsert(prev);
      setFlash(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function removeOrder(order: Order) {
    if (!window.confirm(`Delete the order from ${order.customerName}?`)) return;
    try {
      await adminFetch(`/api/admin/orders/${order.id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setSelected(null);
      setFlash("Order deleted.");
    } catch (err) {
      setFlash(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-3">
      {flash ? (
        <div
          role="status"
          className="flex items-center justify-between rounded-lg bg-lilac-soft px-3 py-2 text-sm text-plum-deep"
        >
          <span>{flash}</span>
          <button
            type="button"
            onClick={() => setFlash(null)}
            className="text-mauve hover:text-plum-deep"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {(["all", ...ORDER_STATUSES] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                filter === f
                  ? "bg-plum text-cream"
                  : "bg-white text-mauve ring-1 ring-inset ring-plum-deep/10 hover:text-plum-deep",
              )}
            >
              {f === "all" ? "All" : ORDER_STATUS_LABEL[f]}
              <span className="ml-1 opacity-70">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <TextInput
            type="search"
            placeholder="Search name, number, item…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-44 sm:w-56"
          />
          <Button onClick={() => setCreating(true)}>+ New</Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState title="No orders match">
            Adjust the filter or search, or add one manually.
          </EmptyState>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-plum-deep/10 text-left text-xs uppercase tracking-wide text-mauve">
                  <th className="px-4 py-2.5 font-semibold">Placed</th>
                  <th className="px-4 py-2.5 font-semibold">Customer</th>
                  <th className="px-4 py-2.5 font-semibold">Items</th>
                  <th className="px-4 py-2.5 font-semibold">Total</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-plum-deep/8">
                {visible.map((o) => (
                  <tr key={o.id} className="align-top hover:bg-lilac-soft/30">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-mauve">
                      {istDayLabel(o.createdAt)}
                      <br />
                      {istTimeLabel(o.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-plum-deep">
                        {o.customerName}
                      </p>
                      <a
                        href={waLink(o.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-mauve underline-offset-2 hover:underline"
                      >
                        +{o.whatsapp}
                      </a>
                      <p className="text-[11px] text-mauve">
                        {ORDER_CHANNEL_LABEL[o.channel]}
                      </p>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs text-ink">
                      {itemsSummary(o.items)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-plum-deep">
                      {formatINR(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        value={o.status}
                        onChange={(s) => changeStatus(o, s)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(o)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {visible.map((o) => (
              <Card key={o.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-plum-deep">
                      {o.customerName}
                    </p>
                    <a
                      href={waLink(o.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-mauve underline-offset-2 hover:underline"
                    >
                      +{o.whatsapp} · {ORDER_CHANNEL_LABEL[o.channel]}
                    </a>
                  </div>
                  <span className="whitespace-nowrap font-semibold text-plum-deep">
                    {formatINR(o.total)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink">{itemsSummary(o.items)}</p>
                <p className="mt-1 text-[11px] text-mauve">
                  {istDayLabel(o.createdAt)} · {istTimeLabel(o.createdAt)}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <StatusSelect
                    value={o.status}
                    onChange={(s) => changeStatus(o, s)}
                    className="flex-1"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelected(o)}
                  >
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {selected ? (
        <OrderDetailDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onSaved={upsert}
          onDelete={() => removeOrder(selected)}
          onStatus={(s) => changeStatus(selected, s)}
        />
      ) : null}

      {creating ? (
        <NewOrderModal
          menu={menu}
          onClose={() => setCreating(false)}
          onCreated={(o) => {
            upsert(o);
            setCreating(false);
            setFlash(`Order added for ${o.customerName}.`);
          }}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------ status select --------------------------- */

function StatusSelect({
  value,
  onChange,
  className,
}: {
  value: OrderStatus;
  onChange: (s: OrderStatus) => void;
  className?: string;
}) {
  return (
    <Select
      aria-label="Order status"
      value={value}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className={cn("py-1 text-xs", className)}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABEL[s]}
        </option>
      ))}
    </Select>
  );
}

/* --------------------------- order detail drawer ----------------------- */

function OrderDetailDrawer({
  order,
  onClose,
  onSaved,
  onDelete,
  onStatus,
}: {
  order: Order;
  onClose: () => void;
  onSaved: (o: Order) => void;
  onDelete: () => void;
  onStatus: (s: OrderStatus) => void;
}) {
  const [note, setNote] = useState(order.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveNote() {
    setSaving(true);
    setError(null);
    try {
      const { order: saved } = await adminFetch<{ order: Order }>(
        `/api/admin/orders/${order.id}`,
        { method: "PATCH", body: JSON.stringify({ note }) },
      );
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer
      title={`Order · ${order.customerName}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={saveNote}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save note"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <StatusBadge status={order.status} />
          <span className="text-xs text-mauve">
            {istDayLabel(order.createdAt)} · {istTimeLabel(order.createdAt)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <Info label="WhatsApp">
            <a
              href={waLink(order.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum underline-offset-2 hover:underline"
            >
              +{order.whatsapp}
            </a>
          </Info>
          <Info label="Channel">{ORDER_CHANNEL_LABEL[order.channel]}</Info>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mauve">
            Items
          </p>
          <ul className="divide-y divide-plum-deep/8 rounded-lg border border-plum-deep/10">
            {order.items.map((l, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span>
                  {l.qty}× {l.name}
                  {l.grams ? (
                    <span className="text-mauve"> ({l.grams}g)</span>
                  ) : null}
                </span>
                <span className="font-semibold text-plum-deep">
                  {formatINR(l.unitAmount * l.qty)}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-plum-deep">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </li>
          </ul>
        </div>

        <Field label="Update status">
          <StatusSelect
            value={order.status}
            onChange={onStatus}
          />
        </Field>

        <Field label="Internal note" error={error ?? undefined}>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Delivery instructions, allergies, follow-ups…"
          />
        </Field>
      </div>
    </Drawer>
  );
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-mauve">
        {label}
      </p>
      <p className="text-ink">{children}</p>
    </div>
  );
}

/* ----------------------------- new order modal ------------------------- */

interface DraftLine {
  menuId: string;
  name: string;
  grams: number;
  qty: number;
  unitAmount: number;
}

function NewOrderModal({
  menu,
  onClose,
  onCreated,
}: {
  menu: MenuPickerItem[];
  onClose: () => void;
  onCreated: (o: Order) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [channel, setChannel] = useState("whatsapp");
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [lines, setLines] = useState<DraftLine[]>([blankLine(menu)]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const total = lines.reduce((s, l) => s + l.unitAmount * l.qty, 0);

  function updateLine(i: number, patch: Partial<DraftLine>) {
    setLines((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  function pickMenu(i: number, menuId: string) {
    const m = menu.find((x) => x.id === menuId);
    if (!m) return;
    const tier = m.tiers[0];
    updateLine(i, {
      menuId,
      name: m.name,
      grams: tier.grams,
      unitAmount: tier.amount || m.startingAmount,
    });
  }

  function pickGrams(i: number, grams: number) {
    const m = menu.find((x) => x.id === lines[i].menuId);
    const tier = m?.tiers.find((t) => t.grams === grams);
    updateLine(i, { grams, unitAmount: tier?.amount ?? lines[i].unitAmount });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = {
        customerName,
        whatsapp,
        channel,
        status,
        items: lines
          .filter((l) => l.name.trim() && l.qty > 0)
          .map((l) => ({
            name: l.name.trim(),
            qty: l.qty,
            unitAmount: l.unitAmount,
            ...(l.grams > 0 ? { grams: l.grams } : {}),
          })),
      };
      const { order } = await adminFetch<{ order: Order }>(
        "/api/admin/orders",
        { method: "POST", body: JSON.stringify(payload) },
      );
      onCreated(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create order.");
      setBusy(false);
    }
  }

  return (
    <Modal
      title="New order"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            form="new-order-form"
            disabled={busy}
          >
            {busy ? "Saving…" : `Create · ${formatINR(total)}`}
          </Button>
        </>
      }
    >
      <form id="new-order-form" onSubmit={submit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Customer name" htmlFor="cust">
            <TextInput
              id="cust"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Field>
          <Field label="WhatsApp number" htmlFor="wa" hint="With country code">
            <TextInput
              id="wa"
              required
              inputMode="tel"
              placeholder="9190000 00000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </Field>
          <Field label="Channel">
            <Select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="zomato">Zomato</option>
              <option value="swiggy">Swiggy</option>
              <option value="manual">Manual</option>
            </Select>
          </Field>
          <Field label="Status">
            <StatusSelect
              value={status}
              onChange={setStatus}
            />
          </Field>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-mauve">
            Items
          </p>
          {lines.map((line, i) => {
            const m = menu.find((x) => x.id === line.menuId);
            const tiered = m && m.tiers.length > 1;
            return (
              <div
                key={i}
                className="rounded-lg border border-plum-deep/10 bg-white p-2"
              >
                <div className="flex flex-wrap items-end gap-2">
                  <label className="min-w-[8rem] flex-1">
                    <span className="sr-only">Menu item</span>
                    <Select
                      value={line.menuId}
                      onChange={(e) => pickMenu(i, e.target.value)}
                    >
                      <option value="">— custom —</option>
                      {menu.map((mi) => (
                        <option key={mi.id} value={mi.id}>
                          {mi.name}
                        </option>
                      ))}
                    </Select>
                  </label>
                  {!line.menuId ? (
                    <TextInput
                      placeholder="Item name"
                      value={line.name}
                      onChange={(e) => updateLine(i, { name: e.target.value })}
                      className="min-w-[8rem] flex-1"
                    />
                  ) : null}
                  {tiered ? (
                    <label className="w-20">
                      <span className="sr-only">Grams</span>
                      <Select
                        value={line.grams}
                        onChange={(e) =>
                          pickGrams(i, Number(e.target.value))
                        }
                      >
                        {m!.tiers.map((t) => (
                          <option key={t.grams} value={t.grams}>
                            {t.grams}g
                          </option>
                        ))}
                      </Select>
                    </label>
                  ) : null}
                  <label className="w-16">
                    <span className="sr-only">Quantity</span>
                    <TextInput
                      type="number"
                      min={1}
                      max={99}
                      value={line.qty}
                      onChange={(e) =>
                        updateLine(i, { qty: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="w-24">
                    <span className="sr-only">Unit price</span>
                    <TextInput
                      type="number"
                      min={0}
                      value={line.unitAmount}
                      onChange={(e) =>
                        updateLine(i, { unitAmount: Number(e.target.value) })
                      }
                    />
                  </label>
                  {lines.length > 1 ? (
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() =>
                        setLines((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="px-1.5 py-1 text-mauve hover:text-red-600"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLines((prev) => [...prev, blankLine(menu)])}
          >
            + Add item
          </Button>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}

function blankLine(menu: MenuPickerItem[]): DraftLine {
  const m = menu[0];
  const tier = m?.tiers[0];
  return {
    menuId: m?.id ?? "",
    name: m?.name ?? "",
    grams: tier?.grams ?? 0,
    qty: 1,
    unitAmount: tier?.amount ?? m?.startingAmount ?? 0,
  };
}
