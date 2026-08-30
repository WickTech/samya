import { NextResponse } from "next/server";
import { guardApi } from "@/lib/admin/require-session";
import { deleteOrder, getOrder, updateOrder } from "@/lib/admin/store";
import { parseOrderPatch, ValidationError } from "@/lib/admin/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  const order = await getOrder((await params).id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  try {
    const patch = parseOrderPatch(await req.json().catch(() => null));
    const order = await updateOrder((await params).id, patch);
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  const ok = await deleteOrder((await params).id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
