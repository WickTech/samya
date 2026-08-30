import { istTimeLabel, istDayLabel } from "@/lib/admin/time";
import type { ActivityEntry } from "@/lib/admin/types";

const KIND_MARK: Record<ActivityEntry["kind"], string> = {
  order: "▤",
  menu: "☰",
  auth: "◑",
};

export function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return <p className="px-1 py-4 text-sm text-mauve">No activity yet.</p>;
  }
  return (
    <ul className="divide-y divide-plum-deep/8">
      {entries.map((e) => (
        <li key={e.id} className="flex items-start gap-3 py-2.5">
          <span
            aria-hidden
            className="mt-0.5 text-xs text-mauve"
            title={e.kind}
          >
            {KIND_MARK[e.kind]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink">{e.message}</p>
            <p className="text-[11px] text-mauve">
              {istDayLabel(e.at)} · {istTimeLabel(e.at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
