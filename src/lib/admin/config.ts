/**
 * Shared admin constants. Kept dependency-free so this module is safe to
 * import from Edge middleware, Node route handlers and client components.
 */

export const ADMIN_SESSION_COOKIE = "samya_admin_session";

/** Session lifetime in seconds (8 hours — one service day). */
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin";

/** Accounts that may sign in. Both roles currently get full access. */
export const ADMIN_ROLES = ["owner", "dev"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  owner: "Owner",
  dev: "Developer",
};

export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

export const ORDER_STATUS_LABEL: Record<
  (typeof ORDER_STATUSES)[number],
  string
> = {
  pending: "Pending",
  preparing: "Preparing",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_CHANNELS = ["whatsapp", "zomato", "swiggy", "manual"] as const;

export const ORDER_CHANNEL_LABEL: Record<
  (typeof ORDER_CHANNELS)[number],
  string
> = {
  whatsapp: "WhatsApp",
  zomato: "Zomato",
  swiggy: "Swiggy",
  manual: "Manual",
};
