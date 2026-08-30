import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrderProvider } from "@/components/order/order-provider";
import { OrderDrawer } from "@/components/order/order-drawer";

/**
 * Chrome for the public marketing site. Lives in a route group so the
 * private /admin section can opt out of the header, footer and order cart
 * entirely (see src/app/admin/layout.tsx).
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <OrderDrawer />
    </OrderProvider>
  );
}
