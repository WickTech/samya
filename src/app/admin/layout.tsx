import type { Metadata } from "next";

/**
 * Root of the private admin surface. Deliberately bare — no public site
 * header/footer/order-cart. The auth gate lives in src/proxy.ts and again
 * in the (dashboard) layout; this file only owns metadata + the base shell.
 */
export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · SĀMYA Admin",
  },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-cream font-body text-ink">{children}</div>
  );
}
