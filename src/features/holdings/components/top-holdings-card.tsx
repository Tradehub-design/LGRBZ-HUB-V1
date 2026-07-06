"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";
import { formatHoldingMoney } from "../format";

export function TopHoldingsCard() {
  const { accountId } = useHoldingsStore();

  const rows = holdingRows
    .filter(
      (row) => accountId === "all" || row.accountId === accountId
    )
    .sort((a, b) => b.marketValue - a.marketValue)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Top Holdings
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div>
              <div className="font-semibold text-slate-950">
                {row.symbol}
              </div>

              <div className="text-xs text-slate-500">
                {row.name}
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-slate-950">
                {formatHoldingMoney(row.marketValue)}
              </div>

              <div className="text-xs text-slate-500">
                {row.portfolioWeight.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
