import { SignJWT, jwtVerify } from "jose";
import { ADMIN_SESSION_MAX_AGE } from "@/lib/admin/config";

/**
 * Stateless owner session — an HS256 JWT stored in an httpOnly cookie.
 * Uses only `jose` + Web Crypto, so it runs in Edge middleware as well as
 * Node route handlers. Password verification lives in ./password (Node only).
 */

export interface AdminSession {
  /** Owner email. */
  sub: string;
  role: "owner";
}

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (need >= 16 chars).",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt(now)
    .setExpirationTime(now + ADMIN_SESSION_MAX_AGE)
    .sign(secretKey());
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== "owner" || typeof payload.sub !== "string") return null;
    return { sub: payload.sub, role: "owner" };
  } catch {
    return null;
  }
}
