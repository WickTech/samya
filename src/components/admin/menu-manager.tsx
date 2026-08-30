"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatPriceLabel } from "@/lib/menu";
import { adminFetch } from "@/lib/admin/client";
import { istDayLabel } from "@/lib/admin/time";
import type { AdminMenuItem } from "@/lib/admin/types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Select,
  TextInput,
  Toggle,
} from "@/components/admin/primitives";
import { MenuItemForm } from "@/components/admin/menu-item-form";

type Editing = { mode: "new" } | { mode: "edit"; item: AdminMenuItem } | null;

export function MenuManager({
  initialItems,
  categories,
}: {
  initialItems: AdminMenuItem[];
  categories: { id: string; label: string }[];
}) {
  const [items, setItems] = useState(initialItems);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Editing>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const catLabel = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.label])),
    [categories],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (category !== "all" && i.category !== category) return false;
      if (q && !`${i.name} ${i.description}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [items, category, query]);

  function upsert(item: AdminMenuItem) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx === -1) return [...prev, item];
      const next = [...prev];
      next[idx] = item;
      return next;
    });
  }

  async function toggleAvailable(item: AdminMenuItem) {
    setPending(item.id);
    const optimistic = { ...item, available: !item.available };
    upsert(optimistic);
    try {
      const { item: saved } = await adminFetch<{ item: AdminMenuItem }>(
        `/api/admin/menu/${item.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ available: !item.available }),
        },
      );
      upsert(saved);
    } catch (err) {
      upsert(item);
      setFlash(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setPending(null);
    }
  }

  async function remove(item: AdminMenuItem) {
    if (!window.confirm(`Delete “${item.name}” from the menu?`)) return;
    try {
      await adminFetch(`/api/admin/menu/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setFlash(`“${item.name}” deleted.`);
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
            aria-label="Dismiss"
            className="text-mauve hover:text-plum-deep"
          >
            ✕
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-44"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </Select>
        <TextInput
          type="search"
          placeholder="Search items…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-44 sm:w-56"
        />
        <Button
          className="ml-auto"
          onClick={() => setEditing({ mode: "new" })}
        >
          + Add item
        </Button>
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState title="No items">
            Nothing in this view yet.
          </EmptyState>
        </Card>
      ) : (
        <>
          {/* Desktop */}
          <Card className="hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-plum-deep/10 text-left text-xs uppercase tracking-wide text-mauve">
                  <th className="px-4 py-2.5 font-semibold">Item</th>
                  <th className="px-4 py-2.5 font-semibold">Price</th>
                  <th className="px-4 py-2.5 font-semibold">In stock</th>
                  <th className="px-4 py-2.5 font-semibold">Updated</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-plum-deep/8">
                {visible.map((item) => (
                  <tr key={item.id} className="hover:bg-lilac-soft/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-plum-deep">
                          {item.name}
                        </span>
                        {item.signature ? (
                          <Badge tone="lilac">Signature</Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-mauve">
                        {catLabel[item.category] ?? item.category}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-plum-deep">
                      {formatPriceLabel(item.price)}
                    </td>
                    <td className="px-4 py-3">
                      <Toggle
                        checked={item.available}
                        disabled={pending === item.id}
                        onChange={() => toggleAvailable(item)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-mauve">
                      {istDayLabel(item.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setEditing({ mode: "edit", item })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => remove(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile */}
          <div className="space-y-2 md:hidden">
            {visible.map((item) => (
              <Card key={item.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-plum-deep">
                        {item.name}
                      </span>
                      {item.signature ? (
                        <Badge tone="lilac">Signature</Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-mauve">
                      {catLabel[item.category] ?? item.category} ·{" "}
                      {formatPriceLabel(item.price)}
                    </p>
                  </div>
                  <Toggle
                    checked={item.available}
                    disabled={pending === item.id}
                    onChange={() => toggleAvailable(item)}
                  />
                </div>
                <div className="mt-2.5 flex gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditing({ mode: "edit", item })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => remove(item)}
                  >
                    Delete
                  </Button>
                  <span
                    className={cn(
                      "ml-auto self-center text-xs",
                      item.available ? "text-emerald-600" : "text-red-600",
                    )}
                  >
                    {item.available ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {editing ? (
        <MenuItemForm
          categories={categories}
          item={editing.mode === "edit" ? editing.item : undefined}
          onClose={() => setEditing(null)}
          onSaved={(item) => {
            upsert(item);
            setEditing(null);
            setFlash(
              `“${item.name}” ${
                editing.mode === "edit" ? "updated" : "added"
              }.`,
            );
          }}
        />
      ) : null}
    </div>
  );
}
