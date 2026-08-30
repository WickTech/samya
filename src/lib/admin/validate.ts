import { ORDER_CHANNELS, ORDER_STATUSES } from "@/lib/admin/config";
import type {
  AdminMenuItemInput,
  OrderInput,
  OrderItemLine,
  OrderPatch,
  AdminMenuItemPatch,
} from "@/lib/admin/types";
import type { Price } from "@/types/menu";

export class ValidationError extends Error {}

const isStr = (v: unknown): v is string => typeof v === "string";
const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function reqStr(v: unknown, field: string, max = 500): string {
  if (!isStr(v) || !v.trim()) throw new ValidationError(`${field} is required.`);
  if (v.length > max) throw new ValidationError(`${field} is too long.`);
  return v.trim();
}

function parseItems(v: unknown): OrderItemLine[] {
  if (!Array.isArray(v) || v.length === 0) {
    throw new ValidationError("At least one order item is required.");
  }
  return v.map((raw, i) => {
    if (!isObj(raw)) throw new ValidationError(`Item ${i + 1} is malformed.`);
    const name = reqStr(raw.name, `Item ${i + 1} name`, 200);
    const qty = raw.qty;
    const unitAmount = raw.unitAmount;
    if (!isNum(qty) || qty < 1 || qty > 99) {
      throw new ValidationError(`Item ${i + 1} quantity must be 1–99.`);
    }
    if (!isNum(unitAmount) || unitAmount < 0 || unitAmount > 100000) {
      throw new ValidationError(`Item ${i + 1} price is invalid.`);
    }
    const line: OrderItemLine = {
      name,
      qty: Math.round(qty),
      unitAmount: Math.round(unitAmount),
    };
    if (raw.grams !== undefined && raw.grams !== null) {
      if (!isNum(raw.grams) || raw.grams <= 0) {
        throw new ValidationError(`Item ${i + 1} protein weight is invalid.`);
      }
      line.grams = Math.round(raw.grams);
    }
    return line;
  });
}

function parseStatus(v: unknown): OrderInput["status"] {
  if (!isStr(v) || !ORDER_STATUSES.includes(v as never)) {
    throw new ValidationError("Unknown order status.");
  }
  return v as OrderInput["status"];
}

function parseChannel(v: unknown): OrderInput["channel"] {
  if (!isStr(v) || !ORDER_CHANNELS.includes(v as never)) {
    throw new ValidationError("Unknown order channel.");
  }
  return v as OrderInput["channel"];
}

export function parseOrderInput(body: unknown): OrderInput {
  if (!isObj(body)) throw new ValidationError("Invalid request body.");
  return {
    customerName: reqStr(body.customerName, "Customer name", 120),
    whatsapp: reqStr(body.whatsapp, "WhatsApp number", 20).replace(/[^\d]/g, ""),
    channel: body.channel === undefined ? "manual" : parseChannel(body.channel),
    items: parseItems(body.items),
    status: body.status === undefined ? "pending" : parseStatus(body.status),
    note: isStr(body.note) ? body.note.trim() : undefined,
  };
}

export function parseOrderPatch(body: unknown): OrderPatch {
  if (!isObj(body)) throw new ValidationError("Invalid request body.");
  const patch: OrderPatch = {};
  if (body.status !== undefined) patch.status = parseStatus(body.status);
  if (body.channel !== undefined) patch.channel = parseChannel(body.channel);
  if (body.customerName !== undefined) {
    patch.customerName = reqStr(body.customerName, "Customer name", 120);
  }
  if (body.whatsapp !== undefined) {
    patch.whatsapp = reqStr(body.whatsapp, "WhatsApp number", 20);
  }
  if (body.items !== undefined) patch.items = parseItems(body.items);
  if (body.note !== undefined) {
    patch.note = isStr(body.note) ? body.note : "";
  }
  if (Object.keys(patch).length === 0) {
    throw new ValidationError("Nothing to update.");
  }
  return patch;
}

/* ---------------------------------- menu --------------------------------- */

function parsePrice(v: unknown): Price {
  if (!isObj(v)) throw new ValidationError("Price is required.");
  if (v.type === "fixed") {
    if (!isNum(v.amount) || v.amount < 0 || v.amount > 100000) {
      throw new ValidationError("Fixed price amount is invalid.");
    }
    return { type: "fixed", amount: Math.round(v.amount) };
  }
  if (v.type === "tiered") {
    if (!Array.isArray(v.tiers) || v.tiers.length === 0) {
      throw new ValidationError("Tiered price needs at least one tier.");
    }
    const tiers = v.tiers.map((t) => {
      if (!isObj(t) || !isNum(t.grams) || !isNum(t.amount)) {
        throw new ValidationError("Each tier needs grams and amount.");
      }
      if (t.grams <= 0 || t.amount < 0) {
        throw new ValidationError("Tier values must be positive.");
      }
      return { grams: Math.round(t.grams), amount: Math.round(t.amount) };
    });
    return { type: "tiered", tiers };
  }
  throw new ValidationError("Price type must be 'fixed' or 'tiered'.");
}

function parseMacros(v: unknown) {
  if (v === undefined || v === null) return null;
  if (!isObj(v) || !isNum(v.protein) || !isNum(v.carb) || !isNum(v.fat)) {
    throw new ValidationError("Macros need numeric protein, carb and fat.");
  }
  return { protein: v.protein, carb: v.carb, fat: v.fat };
}

const DIETARY = new Set(["veg", "vegan", "dairy-free"]);

function parseDietary(v: unknown): string[] {
  if (v === undefined) return [];
  if (!Array.isArray(v)) throw new ValidationError("Dietary tags must be a list.");
  return v.map((t) => {
    if (!isStr(t) || !DIETARY.has(t)) {
      throw new ValidationError(`Unknown dietary tag: ${String(t)}`);
    }
    return t;
  });
}

export function parseMenuItemInput(body: unknown): AdminMenuItemInput {
  if (!isObj(body)) throw new ValidationError("Invalid request body.");
  return {
    id: isStr(body.id) ? body.id.trim() : "",
    slug: isStr(body.slug) ? body.slug.trim() : "",
    name: reqStr(body.name, "Name", 160),
    category: reqStr(body.category, "Category", 60),
    description: isStr(body.description) ? body.description.trim() : "",
    price: parsePrice(body.price),
    available: body.available !== false,
    dietary: parseDietary(body.dietary),
    kcal: isNum(body.kcal) ? Math.round(body.kcal) : null,
    macros: parseMacros(body.macros),
    signature: body.signature === true,
    image:
      isStr(body.image) && body.image.trim()
        ? body.image.trim()
        : "/menu/placeholder-bowl.svg",
  };
}

export function parseMenuItemPatch(body: unknown): AdminMenuItemPatch {
  if (!isObj(body)) throw new ValidationError("Invalid request body.");
  const patch: AdminMenuItemPatch = {};
  if (body.name !== undefined) patch.name = reqStr(body.name, "Name", 160);
  if (body.slug !== undefined) patch.slug = reqStr(body.slug, "Slug", 160);
  if (body.category !== undefined) {
    patch.category = reqStr(body.category, "Category", 60);
  }
  if (body.description !== undefined) {
    patch.description = isStr(body.description) ? body.description.trim() : "";
  }
  if (body.price !== undefined) patch.price = parsePrice(body.price);
  if (body.available !== undefined) patch.available = body.available === true;
  if (body.dietary !== undefined) patch.dietary = parseDietary(body.dietary);
  if (body.kcal !== undefined) {
    patch.kcal = isNum(body.kcal) ? Math.round(body.kcal) : null;
  }
  if (body.macros !== undefined) patch.macros = parseMacros(body.macros);
  if (body.signature !== undefined) patch.signature = body.signature === true;
  if (body.image !== undefined && isStr(body.image)) patch.image = body.image.trim();
  if (Object.keys(patch).length === 0) {
    throw new ValidationError("Nothing to update.");
  }
  return patch;
}
