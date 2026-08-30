import { safeEqual, verifyPasswordHash } from "@/lib/admin/password";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin/config";

/**
 * Sign-in accounts. Node-only (uses node:crypto via ./password).
 *
 * Primary config — one JSON env var holding every account:
 *
 *   ADMIN_USERS='[
 *     {"email":"owner@samya.example","role":"owner","passwordHash":"<salt:key>"},
 *     {"email":"dev@example.com","role":"dev","passwordHash":"<salt:key>"}
 *   ]'
 *
 * `passwordHash` comes from `npm run admin:hash`. `password` (plaintext) is a
 * dev-only fallback per entry.
 *
 * Legacy fallback (used only when ADMIN_USERS is unset): the single-owner vars
 * ADMIN_EMAIL + ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD).
 */

interface Account {
  email: string;
  role: AdminRole;
  passwordHash?: string;
  password?: string;
}

export interface AuthResult {
  email: string;
  role: AdminRole;
}

function toRole(value: unknown): AdminRole {
  return ADMIN_ROLES.includes(value as AdminRole) ? (value as AdminRole) : "owner";
}

function loadAccounts(): Account[] {
  const raw = process.env.ADMIN_USERS?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (a): a is Record<string, unknown> =>
              !!a && typeof a === "object" && !Array.isArray(a),
          )
          .map((a) => ({
            email: String(a.email ?? "").trim().toLowerCase(),
            role: toRole(a.role),
            passwordHash:
              typeof a.passwordHash === "string" ? a.passwordHash.trim() : undefined,
            password: typeof a.password === "string" ? a.password : undefined,
          }))
          .filter((a) => a.email && (a.passwordHash || a.password));
      }
    } catch {
      // Malformed ADMIN_USERS — fall through to the legacy vars.
    }
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return [];
  return [
    {
      email,
      role: "owner",
      passwordHash: process.env.ADMIN_PASSWORD_HASH?.trim() || undefined,
      password: process.env.ADMIN_PASSWORD || undefined,
    },
  ];
}

/** Returns the matched account (email + role), or null. */
export function authenticate(
  email: string,
  password: string,
): AuthResult | null {
  const want = email.trim().toLowerCase();
  let match: AuthResult | null = null;

  // Check every account (no early return) to keep timing roughly uniform.
  for (const acc of loadAccounts()) {
    const emailOk = safeEqual(want, acc.email);
    const passOk = acc.passwordHash
      ? verifyPasswordHash(password, acc.passwordHash)
      : acc.password
        ? safeEqual(password, acc.password)
        : false;
    if (emailOk && passOk) match = { email: acc.email, role: acc.role };
  }
  return match;
}
