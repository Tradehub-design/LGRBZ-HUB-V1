"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";

export function HoldingsRiskCard() {
  const { accountId } = useHoldingsStore();

  const rows = holdingRows.filter(
    (row) => accountId === "all" || row.accountId === accountId
  );

  const total = rows.reduce((sum, row) => sum + row.marketValue, 0);
  const largest = [...rows].sort((a, b) => b.marketValue - a.marketValue)[0];

  const topThreeValue = [...rows]
    .sort((a, b) => b.marketValue - a.marketValue)
    .slice(0, 3)
    .reduce((sum, row) => sum + row.marketValue, 0);

  const topThreeWeight = total === 0 ? 0 : (topThreeValue / total) * 100;
  const largestWeight = total === 0 || !largest ? 0 : (largest.marketValue / total) * 100;

  const riskRows = [
    {
      label: "Largest Holding",
      value: largest?.symbol ?? "-",
      detail: `${largestWeight.toFixed(2)}% of filtered holdings`,
    },
    {
      label: "Top 3 Concentration",
      value: `${topThreeWeight.toFixed(2)}%`,
      detail: "Combined weight of largest positions",
    },
    {
      label: "Number of Holdings",
      value: rows.length.toString(),
      detail: "Current filtered positions",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Holdings Risk
      </h2>

      <div className="mt-5 space-y-3">
        {riskRows.map((row) => (
          <div key={row.label} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {row.label}
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-950">
              {row.value}
            </div>
            <div className="mt-1 text-xs text-slate-500">{row.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
