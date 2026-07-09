import { formatMoney, formatPercent } from "../format";

const movers = [
  {
    symbol: "ADBE",
    name: "Adobe Inc.",
    price: 391.2,
    change: 2.44,
    pnl: 428.2,
    currency: "USD",
  },
  {
    symbol: "NDQ",
    name: "BetaShares Nasdaq 100 ETF",
    price: 47.88,
    change: 1.86,
    pnl: 372.4,
    currency: "AUD",
  },
  {
    symbol: "LIFE360",
    name: "Life360 Inc.",
    price: 24.18,
    change: -1.42,
    pnl: -184.9,
    currency: "AUD",
  },
  {
    symbol: "NAB",
    name: "National Australia Bank",
    price: 37.26,
    change: -0.34,
    pnl: -62.1,
    currency: "AUD",
  },
];

export function TopMoversCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Top Movers</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {movers.map((item) => {
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
                  {formatPercent(item.change)} ·{" "}
                  {formatMoney(item.pnl, item.currency)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
