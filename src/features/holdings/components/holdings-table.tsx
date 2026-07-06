"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";
import {
  formatHoldingMoney,
  formatHoldingNumber,
  formatHoldingPercent,
} from "../format";

export function HoldingsTable() {
  const { accountId, search } = useHoldingsStore();

  const filteredRows = holdingRows.filter((row) => {
    const matchesAccount = accountId === "all" || row.accountId === accountId;
    const matchesSearch =
      row.symbol.toLowerCase().includes(search.toLowerCase()) ||
      row.name.toLowerCase().includes(search.toLowerCase());

    return matchesAccount && matchesSearch;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Holdings Table
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Holding
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Sector
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Qty
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Avg Price
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Price
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Value
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                P/L
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Weight
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row) => {
              const positive = row.unrealisedPnl >= 0;

              return (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950">
                      {row.symbol}
                    </div>
                    <div className="text-xs text-slate-500">{row.name}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {row.exchange} · {row.assetClass}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-700">{row.sector}</td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatHoldingNumber(row.quantity)}
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatHoldingMoney(row.averagePrice, row.currency)}
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatHoldingMoney(row.currentPrice, row.currency)}
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-slate-950">
                    {formatHoldingMoney(row.marketValue, row.currency)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div
                      className={[
                        "font-semibold",
                        positive ? "text-emerald-700" : "text-rose-700",
                      ].join(" ")}
                    >
                      {formatHoldingMoney(row.unrealisedPnl, row.currency)}
                    </div>
                    <div
                      className={[
                        "text-xs",
                        positive ? "text-emerald-600" : "text-rose-600",
                      ].join(" ")}
                    >
                      {formatHoldingPercent(row.unrealisedPnlPercent)}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {row.portfolioWeight.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredRows.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          No holdings found.
        </div>
      ) : null}
    </div>
  );
}
