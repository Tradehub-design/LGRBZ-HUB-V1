"use client";

import { livePrices } from "../mock-data";
import { useLivePricesStore } from "../store";
import {
  formatLiveMoney,
  formatLiveNumber,
  formatLivePercent,
} from "../format";

export function LivePricesTable() {
  const { search, exchange } = useLivePricesStore();

  const rows = livePrices.filter((row) => {
    const matchesExchange = exchange === "All" || row.exchange === exchange;
    const matchesSearch =
      row.symbol.toLowerCase().includes(search.toLowerCase()) ||
      row.name.toLowerCase().includes(search.toLowerCase());

    return matchesExchange && matchesSearch;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Market Prices
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Symbol</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Exchange</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Price</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Change</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Volume</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const positive = row.change >= 0;

              return (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950">{row.symbol}</div>
                    <div className="text-xs text-slate-500">{row.name}</div>
                  </td>

                  <td className="px-5 py-4 text-slate-700">{row.exchange}</td>

                  <td className="px-5 py-4 text-right font-semibold text-slate-950">
                    {formatLiveMoney(row.price, row.currency)}
                  </td>

                  <td
                    className={[
                      "px-5 py-4 text-right font-semibold",
                      positive ? "text-emerald-700" : "text-rose-700",
                    ].join(" ")}
                  >
                    {formatLiveMoney(row.change, row.currency)} ·{" "}
                    {formatLivePercent(row.changePercent)}
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatLiveNumber(row.volume)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
