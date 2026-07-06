import { formatPercent } from "../format";

const marketRows = [
  {
    label: "ASX 200",
    value: "8,184.20",
    change: 0.42,
  },
  {
    label: "NASDAQ 100",
    value: "20,640.18",
    change: 0.88,
  },
  {
    label: "S&P 500",
    value: "5,620.44",
    change: 0.51,
  },
  {
    label: "AUD/USD",
    value: "0.6682",
    change: -0.18,
  },
];

export function MarketSummaryCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Market Summary
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {marketRows.map((row) => {
          const positive = row.change >= 0;

          return (
            <div
              key={row.label}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  {row.label}
                </div>
                <div className="text-xs text-slate-500">{row.value}</div>
              </div>

              <div
                className={[
                  "text-sm font-semibold",
                  positive ? "text-emerald-700" : "text-rose-700",
                ].join(" ")}
              >
                {formatPercent(row.change)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
