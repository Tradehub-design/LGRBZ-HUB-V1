"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";

export function PortfolioWeightTable() {
  const { accountId } = useHoldingsStore();

  const rows = holdingRows
    .filter(
      (row) => accountId === "all" || row.accountId === accountId
    )
    .sort((a, b) => b.portfolioWeight - a.portfolioWeight);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Portfolio Weight Ranking
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">
              Symbol
            </th>

            <th className="px-5 py-3 text-left font-semibold text-slate-600">
              Asset
            </th>

            <th className="px-5 py-3 text-right font-semibold text-slate-600">
              Weight
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-4 font-semibold text-slate-950">
                {row.symbol}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {row.assetClass}
              </td>

              <td className="px-5 py-4 text-right font-semibold text-slate-950">
                {row.portfolioWeight.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
