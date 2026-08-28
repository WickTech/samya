"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/menu";
import { buildWhatsAppOrderUrl } from "@/lib/order";
import { useOrder } from "@/components/order/order-provider";
import { LeafDivider } from "@/components/botanical";

export function OrderDrawer() {
  const { resolved, count, total, isOpen, open, close, setQty, remove, clear, isHydrated } =
    useOrder();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={open}
        aria-label={`Open your order (${count} item${count === 1 ? "" : "s"})`}
        className={cn(
          "fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-plum-deep px-5 py-3.5 text-sm font-semibold text-cream shadow-lg shadow-plum-deep/30 transition-transform hover:-translate-y-0.5",
          isOpen && "pointer-events-none opacity-0",
        )}
      >
        <span aria-hidden>🧺</span>
        Your order
        {isHydrated && count > 0 && (
          <span className="ml-1 grid h-6 min-w-6 place-items-center rounded-full bg-lilac px-1.5 text-xs font-bold text-plum-deep">
            {count}
          </span>
        )}
      </button>

      {/* Overlay + panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition",
          isOpen ? "visible" : "invisible",
        )}
        aria-hidden={!isOpen}
      >
        <div
          onClick={close}
          className={cn(
            "absolute inset-0 bg-ink/50 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Your order"
          className={cn(
            "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <header className="flex items-center justify-between border-b border-plum-deep/10 px-6 py-5">
            <div>
              <p className="eyebrow">Order builder</p>
              <h2 className="font-display text-2xl text-plum-deep">Your order</h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="text-2xl text-plum-deep"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {resolved.length === 0 ? (
              <div className="mt-16 text-center">
                <p className="font-script text-2xl text-plum">Nothing here yet.</p>
                <p className="mt-2 text-sm text-ink/60">
                  Add bowls, salads or juices from the menu and they&apos;ll
                  gather here.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {resolved.map((line) => (
                  <li
                    key={line.key}
                    className="rounded-2xl border border-plum-deep/10 bg-white/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg leading-tight text-plum-deep">
                          {line.label}
                        </p>
                        <p className="text-xs text-ink/55">
                          {formatINR(line.unitAmount)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        aria-label={`Remove ${line.label}`}
                        className="text-xs text-mauve underline underline-offset-2 hover:text-plum-deep"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-inset ring-mauve/40 hover:ring-plum-deep"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label="Increase quantity"
                          className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-inset ring-mauve/40 hover:ring-plum-deep"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-plum">
                        {formatINR(line.lineAmount)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {resolved.length > 0 && (
            <footer className="border-t border-plum-deep/10 px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Estimated total</span>
                <span className="font-display text-2xl text-plum-deep">
                  {formatINR(total)}
                </span>
              </div>
              <LeafDivider className="my-4" />
              <a
                href={buildWhatsAppOrderUrl(resolved)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full bg-[#25D366] px-5 py-3.5 text-center text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Send order on WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-ink/50">
                We confirm availability, delivery slot and final total on chat.
                No payment is taken here.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mx-auto mt-3 block text-xs text-mauve underline underline-offset-2"
              >
                Clear order
              </button>
            </footer>
          )}
        </aside>
      </div>
    </>
  );
}
