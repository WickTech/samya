"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/menu";
import { adminFetch } from "@/lib/admin/client";
import type { AdminMenuItem } from "@/lib/admin/types";
import type { DietaryTag, Price } from "@/types/menu";
import {
  Button,
  Field,
  Modal,
  Select,
  Textarea,
  TextInput,
  Toggle,
} from "@/components/admin/primitives";

const DIETARY: { id: DietaryTag; label: string }[] = [
  { id: "veg", label: "Pure Veg" },
  { id: "vegan", label: "Vegan" },
  { id: "dairy-free", label: "Dairy-free" },
];

const DEFAULT_TIERS = [
  { grams: 30, amount: 0 },
  { grams: 40, amount: 0 },
  { grams: 50, amount: 0 },
];

interface Props {
  categories: { id: string; label: string }[];
  /** Item to edit; omit for a new item. */
  item?: AdminMenuItem;
  onClose: () => void;
  onSaved: (item: AdminMenuItem) => void;
}

export function MenuItemForm({ categories, item, onClose, onSaved }: Props) {
  const editing = Boolean(item);

  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(
    item?.category ?? categories[0]?.id ?? "",
  );
  const [description, setDescription] = useState(item?.description ?? "");
  const [priceType, setPriceType] = useState<Price["type"]>(
    item?.price.type ?? "fixed",
  );
  const [amount, setAmount] = useState(
    item?.price.type === "fixed" ? item.price.amount : 0,
  );
  const [tiers, setTiers] = useState(
    item?.price.type === "tiered" ? item.price.tiers : DEFAULT_TIERS,
  );
  const [dietary, setDietary] = useState<DietaryTag[]>(
    (item?.dietary as DietaryTag[]) ?? ["veg"],
  );
  const [kcal, setKcal] = useState<string>(
    item?.kcal != null ? String(item.kcal) : "",
  );
  const [protein, setProtein] = useState(
    item?.macros ? String(item.macros.protein) : "",
  );
  const [carb, setCarb] = useState(
    item?.macros ? String(item.macros.carb) : "",
  );
  const [fat, setFat] = useState(item?.macros ? String(item.macros.fat) : "");
  const [signature, setSignature] = useState(item?.signature ?? false);
  const [available, setAvailable] = useState(item?.available ?? true);
  const [image, setImage] = useState(item?.image ?? "");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggleDietary(tag: DietaryTag) {
    setDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function buildPrice(): Price {
    if (priceType === "fixed") return { type: "fixed", amount: Number(amount) };
    return {
      type: "tiered",
      tiers: tiers.map((t) => ({
        grams: Number(t.grams),
        amount: Number(t.amount),
      })),
    };
  }

  function buildMacros() {
    if (!protein && !carb && !fat) return null;
    return { protein: Number(protein), carb: Number(carb), fat: Number(fat) };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      name,
      category,
      description,
      price: buildPrice(),
      dietary,
      kcal: kcal ? Number(kcal) : null,
      macros: buildMacros(),
      signature,
      available,
      ...(image.trim() ? { image: image.trim() } : {}),
    };
    try {
      if (editing) {
        const { item: saved } = await adminFetch<{ item: AdminMenuItem }>(
          `/api/admin/menu/${item!.id}`,
          { method: "PATCH", body: JSON.stringify(payload) },
        );
        onSaved(saved);
      } else {
        const { item: saved } = await adminFetch<{ item: AdminMenuItem }>(
          "/api/admin/menu",
          { method: "POST", body: JSON.stringify(payload) },
        );
        onSaved(saved);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setBusy(false);
    }
  }

  return (
    <Modal
      title={editing ? `Edit · ${item!.name}` : "New menu item"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" form="menu-item-form" disabled={busy}>
            {busy ? "Saving…" : editing ? "Save changes" : "Add item"}
          </Button>
        </>
      }
    >
      <form id="menu-item-form" onSubmit={submit} className="space-y-4">
        <Field label="Name" htmlFor="mi-name">
          <TextInput
            id="mi-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Category">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Image path" hint="Public path, optional">
            <TextInput
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/menu/photos/…"
            />
          </Field>
        </div>

        <Field label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        {/* Pricing */}
        <div className="space-y-2 rounded-lg border border-plum-deep/10 p-3">
          <div className="flex gap-1">
            {(["fixed", "tiered"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPriceType(t)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  priceType === t
                    ? "bg-plum text-cream"
                    : "bg-white text-mauve ring-1 ring-inset ring-plum-deep/10",
                )}
              >
                {t === "fixed" ? "Single price" : "Protein tiers"}
              </button>
            ))}
          </div>

          {priceType === "fixed" ? (
            <Field label="Price (₹)">
              <TextInput
                type="number"
                min={0}
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </Field>
          ) : (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-mauve">
                Tiers (grams / ₹)
              </p>
              {tiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TextInput
                    type="number"
                    min={1}
                    aria-label="Grams"
                    value={tier.grams}
                    onChange={(e) =>
                      setTiers((prev) =>
                        prev.map((t, j) =>
                          j === i
                            ? { ...t, grams: Number(e.target.value) }
                            : t,
                        ),
                      )
                    }
                    className="w-24"
                  />
                  <span className="text-mauve">g</span>
                  <TextInput
                    type="number"
                    min={0}
                    aria-label="Amount"
                    value={tier.amount}
                    onChange={(e) =>
                      setTiers((prev) =>
                        prev.map((t, j) =>
                          j === i
                            ? { ...t, amount: Number(e.target.value) }
                            : t,
                        ),
                      )
                    }
                    className="w-28"
                  />
                  {tiers.length > 1 ? (
                    <button
                      type="button"
                      aria-label="Remove tier"
                      onClick={() =>
                        setTiers((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="text-mauve hover:text-red-600"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setTiers((prev) => [
                    ...prev,
                    { grams: 0, amount: 0 },
                  ])
                }
              >
                + Add tier
              </Button>
            </div>
          )}
        </div>

        {/* Dietary */}
        <Field label="Dietary tags">
          <div className="flex flex-wrap gap-2">
            {DIETARY.map((d) => (
              <label
                key={d.id}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                  dietary.includes(d.id)
                    ? "bg-lilac-soft text-plum-deep ring-plum/30"
                    : "bg-white text-mauve ring-plum-deep/10",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={dietary.includes(d.id)}
                  onChange={() => toggleDietary(d.id)}
                />
                {d.label}
              </label>
            ))}
          </div>
        </Field>

        {/* Nutrition */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="kcal">
            <TextInput
              type="number"
              min={0}
              value={kcal}
              onChange={(e) => setKcal(e.target.value)}
            />
          </Field>
          <Field label="Protein g">
            <TextInput
              type="number"
              min={0}
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />
          </Field>
          <Field label="Carb g">
            <TextInput
              type="number"
              min={0}
              value={carb}
              onChange={(e) => setCarb(e.target.value)}
            />
          </Field>
          <Field label="Fat g">
            <TextInput
              type="number"
              min={0}
              value={fat}
              onChange={(e) => setFat(e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Toggle checked={signature} onChange={setSignature} />
            Signature
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Toggle checked={available} onChange={setAvailable} />
            {available ? "In stock" : "Out of stock"}
          </label>
        </div>

        {priceType === "tiered" ? (
          <p className="text-xs text-mauve">
            Card will read “from {formatINR(
              Math.min(...tiers.map((t) => Number(t.amount) || 0)),
            )}
            ”.
          </p>
        ) : null}

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
