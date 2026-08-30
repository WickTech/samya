"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { adminFetch } from "@/lib/admin/client";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_ROLE_LABEL,
  type AdminRole,
} from "@/lib/admin/config";

const NAV = [
  { href: "/admin", label: "Overview", exact: true, icon: "◧" },
  { href: "/admin/orders", label: "Orders", icon: "▤" },
  { href: "/admin/menu", label: "Menu", icon: "☰" },
];

export function AdminShell({
  email,
  role,
  children,
}: {
  email: string;
  role: AdminRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  async function signOut() {
    setSigningOut(true);
    try {
      await adminFetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* ignore — clear client state regardless */
    }
    router.push(ADMIN_LOGIN_PATH);
    router.refresh();
  }

  const navList = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          aria-current={isActive(item.href, item.exact) ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
            isActive(item.href, item.exact)
              ? "bg-lilac-soft text-plum-deep"
              : "text-mauve hover:bg-plum-deep/5 hover:text-plum-deep",
          )}
        >
          <span aria-hidden className="text-xs opacity-70">
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-plum-deep/10 bg-white px-4 py-5 md:flex">
        <Brand />
        <div className="mt-6 flex-1">{navList}</div>
        <Account
          email={email}
          role={role}
          onSignOut={signOut}
          signingOut={signingOut}
        />
      </aside>

      {/* Topbar — mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-plum-deep/10 bg-white px-4 py-3 md:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-plum-deep hover:bg-plum-deep/5"
        >
          {open ? "✕" : "☰"}
        </button>
      </header>

      {open ? (
        <div className="border-b border-plum-deep/10 bg-white px-4 py-3 md:hidden">
          {navList}
          <div className="mt-3 border-t border-plum-deep/10 pt-3">
            <Account
              email={email}
              role={role}
              onSignOut={signOut}
              signingOut={signingOut}
            />
          </div>
        </div>
      ) : null}

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-baseline gap-1.5">
      <span className="wordmark text-base text-plum-deep">{SITE.wordmark}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mauve">
        Admin
      </span>
    </Link>
  );
}

function Account({
  email,
  role,
  onSignOut,
  signingOut,
}: {
  email: string;
  role: AdminRole;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-plum-deep" title={email}>
          {email}
        </p>
        <p className="text-[11px] uppercase tracking-wide text-mauve">
          {ADMIN_ROLE_LABEL[role]}
        </p>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        disabled={signingOut}
        className="w-full rounded-lg border border-plum-deep/15 px-3 py-1.5 text-xs font-semibold text-plum-deep hover:bg-lilac-soft/50 disabled:opacity-50"
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
