"use client";

import { formatHoldingMoney } from "../format";

const dividends = [
  {
    symbol: "VAS",
    annual: 806.4,
    yield: 2.96,
  },
  {
    symbol: "NAB",
    annual: 744.6,
    yield: 3.92,
  },
  {
    symbol: "NDQ",
    annual: 0,
    yield: 0,
  },
  {
    symbol: "COH",
    annual: 62.9,
    yield: 0.59,
  },
];

export function DividendSummaryCard() {
  const total = dividends.reduce((sum, item) => sum + item.annual, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-950">
          Dividend Income
        </h2>

        <span className="text-lg font-semibold text-slate-950">
          {formatHoldingMoney(total)}
        </span>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {dividends.map((item) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div>
              <div className="font-semibold text-slate-950">
                {item.symbol}
              </div>

              <div className="text-xs text-slate-500">
                Estimated Annual Income
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-slate-950">
                {formatHoldingMoney(item.annual)}
              </div>

              <div className="text-xs text-slate-500">
                {item.yield.toFixed(2)}% Yield
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
