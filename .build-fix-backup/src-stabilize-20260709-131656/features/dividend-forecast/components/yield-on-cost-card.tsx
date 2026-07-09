import { dividendForecastRows } from "../mock-data";
import { formatForecastPercent } from "../format";

export function YieldOnCostCard() {
  const average =
    dividendForecastRows.reduce((sum, row) => sum + row.yieldOnCost, 0) /
    dividendForecastRows.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Yield on Cost
      </h2>

      <div className="mt-5 text-4xl font-bold text-emerald-700">
        {formatForecastPercent(average)}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        Average portfolio yield on cost
      </div>

      <div className="mt-5 space-y-3">
        {dividendForecastRows.map((row) => (
          <div key={row.id} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-sm font-semibold text-slate-950">
              {row.symbol}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {formatForecastPercent(row.yieldOnCost)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
