"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";
import { formatHoldingMoney } from "../format";

export function ExchangeExposureCard() {
  const { accountId } = useHoldingsStore();

  const rows = holdingRows.filter(
    (row) => accountId === "all" || row.accountId === accountId
  );

  const total = rows.reduce((sum, row) => sum + row.marketValue, 0);

  const exchanges = Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.exchange]) {
        acc[row.exchange] = {
          exchange: row.exchange,
          value: 0,
        };
      }

      acc[row.exchange].value += row.marketValue;
      return acc;
    }, {} as Record<string, { exchange: string; value: number }>)
  ).sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Exchange Exposure
      </h2>

      <div className="mt-5 space-y-4">
        {exchanges.map((item) => {
          const percent = total === 0 ? 0 : (item.value / total) * 100;

          return (
            <div key={item.exchange}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {item.exchange}
                </span>
                <span className="text-sm text-slate-500">
                  {percent.toFixed(2)}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-950"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {formatHoldingMoney(item.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
