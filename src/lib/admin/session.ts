import { SignJWT, jwtVerify } from "jose";
import {
  ADMIN_ROLES,
  ADMIN_SESSION_MAX_AGE,
  type AdminRole,
} from "@/lib/admin/config";

/**
 * Stateless admin session — an HS256 JWT stored in an httpOnly cookie.
 * Uses only `jose` + Web Crypto, so it runs in the Edge proxy as well as
 * Node route handlers. Account + password lookup lives in ./accounts (Node).
 */

export interface AdminSession {
  /** Account email. */
  sub: string;
  role: AdminRole;
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

export async function createSessionToken(
  email: string,
  role: AdminRole,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ role })
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
    if (
      typeof payload.sub !== "string" ||
      !ADMIN_ROLES.includes(payload.role as AdminRole)
    ) {
      return null;
    }
    return { sub: payload.sub, role: payload.role as AdminRole };
  } catch {
    return null;
  }
}
