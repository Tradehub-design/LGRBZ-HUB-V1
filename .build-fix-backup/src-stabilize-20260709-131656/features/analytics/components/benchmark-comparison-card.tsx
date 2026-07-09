import { formatAnalyticsPercent } from "../format";

const rows = [
  {
    benchmark: "Portfolio",
    return: 28.42,
  },
  {
    benchmark: "ASX200",
    return: 11.82,
  },
  {
    benchmark: "S&P500",
    return: 18.34,
  },
];

export function BenchmarkComparisonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Benchmark Comparison
      </h2>

      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div
            key={row.benchmark}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span>{row.benchmark}</span>

            <span className="font-semibold">
              {formatAnalyticsPercent(row.return)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
