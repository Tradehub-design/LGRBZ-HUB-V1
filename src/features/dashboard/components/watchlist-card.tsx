import { formatMoney, formatPercent } from "../format";

const watchlist = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 214.6,
    change: 1.26,
    currency: "USD",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 487.12,
    change: 0.88,
    currency: "USD",
  },
  {
    symbol: "LIFE360",
    name: "Life360 Inc.",
    price: 24.18,
    change: -1.42,
    currency: "AUD",
  },
  {
    symbol: "ADBE",
    name: "Adobe Inc.",
    price: 391.2,
    change: 2.44,
    currency: "USD",
  },
];

export function WatchlistCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Watchlist</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {watchlist.map((item) => {
          const positive = item.change >= 0;

          return (
            <div
              key={item.symbol}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <div className="font-semibold text-slate-950">
                  {item.symbol}
                </div>
                <div className="text-xs text-slate-500">{item.name}</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-slate-950">
                  {formatMoney(item.price, item.currency)}
                </div>
                <div
                  className={[
                    "text-xs font-medium",
                    positive ? "text-emerald-600" : "text-rose-600",
                  ].join(" ")}
                >
                  {formatPercent(item.change)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
