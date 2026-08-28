/**
 * Tiny className joiner. No dependency — keeps the bundle lean.
 * Falsy values are dropped; strings are joined with a space.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
