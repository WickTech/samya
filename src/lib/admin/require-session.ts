import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/config";
import { verifySessionToken, type AdminSession } from "@/lib/admin/session";

/** Read + verify the owner session from the request cookies (Node runtime). */
export async function getSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * For API route handlers: returns a 401 response if unauthenticated, else null.
 * Middleware already gates /api/admin/*, this is defence in depth.
 *
 *   const denied = await guardApi();
 *   if (denied) return denied;
 */
export async function guardApi(): Promise<NextResponse | null> {
  const session = await getSession();
  if (session) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
