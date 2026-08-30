"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { adminFetch } from "@/lib/admin/client";
import { ADMIN_HOME_PATH } from "@/lib/admin/config";
import { Button, Field, TextInput } from "@/components/admin/primitives";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const from = params.get("from") ?? ADMIN_HOME_PATH;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await adminFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.replace(from.startsWith("/admin") ? from : ADMIN_HOME_PATH);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="wordmark text-xl text-plum-deep">
            {SITE.wordmark}
          </span>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-mauve">
            Owner sign in
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-plum-deep/10 bg-white p-6 shadow-sm"
        >
          <Field label="Email" htmlFor="email">
            <TextInput
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <TextInput
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-mauve">
          Restricted area. All activity is logged.
        </p>
      </div>
    </div>
  );
}
