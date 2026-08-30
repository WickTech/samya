import { Card } from "@/components/admin/primitives";
import { cn } from "@/lib/cn";

export function MetricCard({
  label,
  value,
  sub,
  delta,
}: {
  label: string;
  value: string;
  sub?: string;
  /** Percentage change vs. the comparison period; omit to hide. */
  delta?: number | null;
}) {
  const showDelta = typeof delta === "number" && Number.isFinite(delta);
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-mauve">
        {label}
      </p>
      <p className="mt-1.5 font-display text-2xl leading-none text-plum-deep">
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
        {showDelta ? (
          <span
            className={cn(
              "font-semibold",
              delta! >= 0 ? "text-emerald-600" : "text-red-600",
            )}
          >
            {delta! >= 0 ? "▲" : "▼"} {Math.abs(Math.round(delta!))}%
          </span>
        ) : null}
        {sub ? <span className="text-mauve">{sub}</span> : null}
      </div>
    </Card>
  );
}
