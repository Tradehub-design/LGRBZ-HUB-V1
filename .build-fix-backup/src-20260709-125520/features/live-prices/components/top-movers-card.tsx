import { livePrices } from "../mock-data";
import {
  formatLiveMoney,
  formatLivePercent,
} from "../format";

export function TopMoversCard() {
  const rows = [...livePrices].sort(
    (a, b) => b.changePercent - a.changePercent
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Top Movers
      </h2>

      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-xl bg-slate-50 px-4 py-3"
          >
            <div className="flex justify-between">
              <span className="font-semibold">
                {row.symbol}
              </span>

              <span className="font-semibold text-emerald-700">
                {formatLivePercent(row.changePercent)}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {formatLiveMoney(row.price, row.currency)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
