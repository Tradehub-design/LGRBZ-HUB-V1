import { watchlistItems } from "../mock-data";

export function WatchlistStatusCard() {
  const rows = Object.entries(
    watchlistItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Status Breakdown
      </h2>

      <div className="mt-5 space-y-3">
        {rows.map(([status, count]) => (
          <div
            key={status}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-semibold text-slate-950">
              {status}
            </span>
            <span className="text-sm font-semibold text-slate-600">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
