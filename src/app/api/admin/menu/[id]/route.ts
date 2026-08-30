import { NextResponse } from "next/server";
import { guardApi } from "@/lib/admin/require-session";
import { deleteMenuItem, getMenuItem, updateMenuItem } from "@/lib/admin/store";
import { parseMenuItemPatch, ValidationError } from "@/lib/admin/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  const item = await getMenuItem((await params).id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  try {
    const patch = parseMenuItemPatch(await req.json().catch(() => null));
    const item = await updateMenuItem((await params).id, patch);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item });
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
  const ok = await deleteMenuItem((await params).id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
