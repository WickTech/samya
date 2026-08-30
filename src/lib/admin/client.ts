"use client";

import { ADMIN_LOGIN_PATH } from "@/lib/admin/config";

/**
 * Fetch wrapper for admin API calls. Sends/receives JSON, bounces to the
 * login page on 401, and throws a readable Error on any other failure.
 */
export async function adminFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  if (res.status === 401) {
    window.location.href = ADMIN_LOGIN_PATH;
    throw new Error("Session expired — redirecting to sign in.");
  }

  const body = (await res.json().catch(() => ({}))) as
    | (T & { error?: string })
    | { error?: string };

  if (!res.ok) {
    throw new Error(
      (body as { error?: string }).error ?? `Request failed (${res.status})`,
    );
  }
  return body as T;
}
