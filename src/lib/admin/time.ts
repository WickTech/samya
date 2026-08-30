/**
 * SĀMYA operates in one city (Bhilai–Durg). Vercel runs in UTC, so "today"
 * has to be pinned to India Standard Time (UTC+5:30, no DST) for the daily
 * revenue numbers to line up with the kitchen's service day.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function toIst(date: Date | string | number): Date {
  return new Date(new Date(date).getTime() + IST_OFFSET_MS);
}

/** IST calendar date as YYYY-MM-DD. */
export function istDayKey(date: Date | string | number): string {
  return toIst(date).toISOString().slice(0, 10);
}

/** Short chart label, e.g. "Mon 25". */
export function istDayLabel(date: Date | string | number): string {
  const d = toIst(date);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
  return `${weekday} ${d.getUTCDate()}`;
}

/** Time-of-day label in IST, e.g. "2:45 PM". */
export function istTimeLabel(date: Date | string | number): string {
  const d = toIst(date);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/** The last `n` IST day keys, oldest first, ending today. */
export function recentDayKeys(n: number): string[] {
  const keys: string[] = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) {
    keys.push(istDayKey(now - i * 24 * 60 * 60 * 1000));
  }
  return keys;
}
