"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { NAV_LINKS, whatsappChatUrl } from "@/lib/site";
import { Wordmark } from "@/components/wordmark";
import { ButtonAnchor } from "@/components/ui/button-link";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock body scroll only while the mobile sheet is open (external system).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-plum-deep/10 bg-cream/85 backdrop-blur">
      <nav className="shell flex items-center justify-between py-3.5">
        <Wordmark />

        <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "link-underline",
                    active && "border-plum text-plum-deep",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <ButtonAnchor
              href={whatsappChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              variant="plum"
              size="sm"
            >
              Order on WhatsApp
            </ButtonAnchor>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center text-2xl text-plum-deep md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="md:hidden">
          <ul className="shell flex flex-col gap-1 border-t border-plum-deep/10 py-4 text-lg">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 font-display text-xl",
                      active
                        ? "bg-lilac-soft text-plum-deep"
                        : "text-ink/80",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="px-3 pt-3">
              <ButtonAnchor
                href={whatsappChatUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                variant="plum"
                size="md"
                className="w-full"
              >
                Order on WhatsApp
              </ButtonAnchor>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
