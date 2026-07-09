import { formatMoney, formatPercent } from "../format";

const rows = [
  {
    label: "Today",
    value: 842.18,
    percent: 0.66,
  },
  {
    label: "This Week",
    value: 1860.42,
    percent: 1.47,
  },
  {
    label: "This Month",
    value: 4660.72,
    percent: 3.76,
  },
  {
    label: "This Year",
    value: 18420.72,
    percent: 16.74,
  },
];

export function PerformanceBreakdown() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Performance Breakdown
      </h2>

      <div className="mt-5 space-y-4">
        {rows.map((row) => {
          const positive = row.value >= 0;

          return (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-600">
                {row.label}
              </span>

              <div className="text-right">
                <div
                  className={[
                    "text-sm font-semibold",
                    positive ? "text-emerald-700" : "text-rose-700",
                  ].join(" ")}
                >
                  {formatMoney(row.value)}
                </div>
                <div
                  className={[
                    "text-xs",
                    positive ? "text-emerald-600" : "text-rose-600",
                  ].join(" ")}
                >
                  {formatPercent(row.percent)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
