import { NextResponse } from "next/server";
import { guardApi } from "@/lib/admin/require-session";
import { createOrder, listOrders } from "@/lib/admin/store";
import { parseOrderInput, ValidationError } from "@/lib/admin/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guardApi();
  if (denied) return denied;
  return NextResponse.json({ orders: await listOrders() });
}

export async function POST(req: Request) {
  const denied = await guardApi();
  if (denied) return denied;
  try {
    const input = parseOrderInput(await req.json().catch(() => null));
    const order = await createOrder(input);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
