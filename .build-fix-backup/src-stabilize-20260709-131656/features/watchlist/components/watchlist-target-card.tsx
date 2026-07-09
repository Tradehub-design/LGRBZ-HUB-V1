import { watchlistItems } from "../mock-data";
import { formatWatchlistMoney } from "../format";

export function WatchlistTargetCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Target Price Gap
      </h2>

      <div className="mt-5 space-y-3">
        {watchlistItems.map((item) => {
          const gap = ((item.price - item.targetPrice) / item.targetPrice) * 100;

          return (
            <div key={item.id} className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{item.symbol}</span>
                <span className="text-sm font-semibold">{gap.toFixed(2)}%</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Price {formatWatchlistMoney(item.price, item.currency)} · Target{" "}
                {formatWatchlistMoney(item.targetPrice, item.currency)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
