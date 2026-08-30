import { NextResponse } from "next/server";
import { guardApi } from "@/lib/admin/require-session";
import { createMenuItem, listMenuItems } from "@/lib/admin/store";
import { parseMenuItemInput, ValidationError } from "@/lib/admin/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guardApi();
  if (denied) return denied;
  return NextResponse.json({ items: await listMenuItems() });
}

export async function POST(req: Request) {
  const denied = await guardApi();
  if (denied) return denied;
  try {
    const input = parseMenuItemInput(await req.json().catch(() => null));
    const item = await createMenuItem(input);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
