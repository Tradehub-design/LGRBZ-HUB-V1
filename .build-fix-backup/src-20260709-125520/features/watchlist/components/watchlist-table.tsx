"use client";

import { watchlistItems } from "../mock-data";
import { useWatchlistStore } from "../store";
import {
  formatWatchlistMoney,
  formatWatchlistPercent,
} from "../format";

export function WatchlistTable() {
  const { search } = useWatchlistStore();

  const rows = watchlistItems.filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Watchlist Table
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {["Symbol", "Exchange", "Price", "Target", "Change", "Sector", "Status"].map(
              (item) => (
                <th
                  key={item}
                  className="px-5 py-3 text-left font-semibold text-slate-600"
                >
                  {item}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="px-5 py-4">
                <div className="font-semibold text-slate-950">{item.symbol}</div>
                <div className="text-xs text-slate-500">{item.name}</div>
              </td>
              <td className="px-5 py-4">{item.exchange}</td>
              <td className="px-5 py-4 font-semibold">
                {formatWatchlistMoney(item.price, item.currency)}
              </td>
              <td className="px-5 py-4">
                {formatWatchlistMoney(item.targetPrice, item.currency)}
              </td>
              <td className="px-5 py-4 font-semibold text-emerald-700">
                {formatWatchlistPercent(item.changePercent)}
              </td>
              <td className="px-5 py-4">{item.sector}</td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
