"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";
import { formatHoldingMoney, formatHoldingPercent } from "../format";

export function HoldingsPerformanceCard() {
  const { accountId } = useHoldingsStore();

  const rows = holdingRows.filter(
    (row) => accountId === "all" || row.accountId === accountId
  );

  const best = [...rows].sort(
    (a, b) => b.unrealisedPnlPercent - a.unrealisedPnlPercent
  )[0];

  const worst = [...rows].sort(
    (a, b) => a.unrealisedPnlPercent - b.unrealisedPnlPercent
  )[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Holdings Performance
      </h2>

      <div className="mt-5 space-y-3">
        {[best, worst].filter(Boolean).map((row, index) => {
          const positive = row.unrealisedPnl >= 0;

          return (
            <div key={`${row.id}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {index === 0 ? "Best Performer" : "Worst Performer"}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">
                    {row.symbol}
                  </div>
                  <div className="text-xs text-slate-500">{row.name}</div>
                </div>

                <div className="text-right">
                  <div
                    className={[
                      "text-sm font-semibold",
                      positive ? "text-emerald-700" : "text-rose-700",
                    ].join(" ")}
                  >
                    {formatHoldingMoney(row.unrealisedPnl)}
                  </div>
                  <div
                    className={[
                      "text-xs",
                      positive ? "text-emerald-600" : "text-rose-600",
                    ].join(" ")}
                  >
                    {formatHoldingPercent(row.unrealisedPnlPercent)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
