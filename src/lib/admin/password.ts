import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

/**
 * Owner password checks. Node-only (uses node:crypto scrypt) — never import
 * this from middleware. Storage format: "<saltHex>:<keyHex>".
 */

const KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, KEY_LEN);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;
  let expected: Buffer;
  try {
    expected = Buffer.from(keyHex, "hex");
  } catch {
    return false;
  }
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Constant-time string compare for the configured email / plaintext password. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // Still burn a compare to avoid leaking length via timing.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/**
 * Validate a login attempt against env config.
 * - ADMIN_EMAIL         — required, the owner's email.
 * - ADMIN_PASSWORD_HASH — preferred: scrypt hash from `npm run admin:hash`.
 * - ADMIN_PASSWORD      — dev-only fallback plaintext, used if no hash is set.
 */
export function checkCredentials(email: string, password: string): boolean {
  const wantEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const plain = process.env.ADMIN_PASSWORD;

  if (!wantEmail || (!hash && !plain)) return false;
  if (!safeEqual(email.trim().toLowerCase(), wantEmail)) return false;

  return hash ? verifyPasswordHash(password, hash) : safeEqual(password, plain!);
}
