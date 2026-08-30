import type { Metadata } from "next";
import { formatINR } from "@/lib/menu";
import { getAnalytics } from "@/lib/admin/store";
import { ORDER_STATUS_LABEL, ORDER_STATUSES } from "@/lib/admin/config";
import { Card } from "@/components/admin/primitives";
import { MetricCard } from "@/components/admin/metric-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

function pct(current: number, prev: number): number | null {
  if (prev <= 0) return current > 0 ? 100 : null;
  return ((current - prev) / prev) * 100;
}

export default async function OverviewPage() {
  const a = await getAnalytics();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl text-plum-deep">
          Revenue &amp; analytics
        </h1>
        <p className="text-sm text-mauve">
          Live view of the kitchen. Figures exclude cancelled orders.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Revenue today"
          value={formatINR(a.todayRevenue)}
          delta={pct(a.todayRevenue, a.yesterdayRevenue)}
          sub="vs. yesterday"
        />
        <MetricCard
          label="Revenue · 7 days"
          value={formatINR(a.weekRevenue)}
          sub={`${a.weekOrders} orders`}
        />
        <MetricCard
          label="Total orders"
          value={String(a.totalOrders)}
          sub={`${a.openOrders} open`}
        />
        <MetricCard
          label="Avg order value"
          value={formatINR(a.avgOrderValue)}
          sub="all-time"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-4">
          <h2 className="mb-3 font-display text-lg text-plum-deep">
            Revenue · last 7 days
          </h2>
          <RevenueChart data={a.dailySeries} />
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 font-display text-lg text-plum-deep">
            Orders by status
          </h2>
          <ul className="space-y-2">
            {ORDER_STATUSES.map((s) => (
              <li
                key={s}
                className="flex items-center justify-between text-sm"
              >
                <StatusBadge status={s} />
                <span className="font-semibold text-plum-deep">
                  {a.statusCounts[s]}
                </span>
                <span className="sr-only">{ORDER_STATUS_LABEL[s]}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section>
        <Card className="p-4">
          <h2 className="mb-1 font-display text-lg text-plum-deep">
            Recent activity
          </h2>
          <ActivityFeed entries={a.activity} />
        </Card>
      </section>
    </div>
  );
}
