import { NextResponse } from "next/server";
import { guardApi } from "@/lib/admin/require-session";
import { getAnalytics } from "@/lib/admin/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guardApi();
  if (denied) return denied;
  return NextResponse.json(await getAnalytics());
}
