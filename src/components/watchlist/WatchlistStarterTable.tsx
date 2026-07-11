"use client";

import {
  ArrowDownUp,
  BellRing,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  WatchlistSecurity,
  WatchlistSortDirection,
  WatchlistSortKey,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  securities: WatchlistSecurity[];
  sortKey: WatchlistSortKey;
  sortDirection: WatchlistSortDirection;
  onSort: (
    key: WatchlistSortKey
  ) => void;
  onEdit: (
    security: WatchlistSecurity
  ) => void;
  onRemove: (
    security: WatchlistSecurity
  ) => void;
  onTransfer: (
    security: WatchlistSecurity
  ) => void;
};

function formatCurrency(
  value: number,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency:
        currency || "AUD",
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export function WatchlistStarterTable({
  securities,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onRemove,
  onTransfer,
}: Props) {
  const heading = (
    label: string,
    key: WatchlistSortKey,
    align:
      | "left"
      | "right" = "left"
  ) => (
    <th
      className={`border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      <button
        type="button"
        onClick={() =>
          onSort(key)
        }
        className="inline-flex items-center gap-1"
      >
        {label}
        <ArrowDownUp className="h-3 w-3" />

        {sortKey === key && (
          <span className="text-[10px] normal-case text-slate-400">
            {sortDirection}
          </span>
        )}
      </button>
    </th>
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              {heading(
                "Security",
                "symbol"
              )}
              {heading(
                "Price",
                "price",
                "right"
              )}
              {heading(
                "Change",
                "changePercent",
                "right"
              )}
              <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
                Sector
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
                Rating
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
                Alerts
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {securities.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-16 text-center text-slate-500"
                >
                  No securities match the current watchlist filters.
                </td>
              </tr>
            ) : (
              securities.map(
                (security) => (
                  <tr
                    key={security.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/70"
                  >
                    <td className="border-b border-slate-100 px-4 py-3 dark:border-slate-900">
                      <p className="font-semibold text-slate-950 dark:text-slate-50">
                        {security.symbol}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {security.name} ·{" "}
                        {security.exchange}
                      </p>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-3 text-right font-semibold tabular-nums dark:border-slate-900">
                      {formatCurrency(
                        security.price,
                        security.currency
                      )}
                    </td>

                    <td
                      className={`border-b border-slate-100 px-4 py-3 text-right font-semibold tabular-nums dark:border-slate-900 ${
                        security.changePercent >
                        0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : security.changePercent <
                              0
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-500"
                      }`}
                    >
                      {security.changePercent >
                      0
                        ? "+"
                        : ""}
                      {security.changePercent.toFixed(
                        2
                      )}
                      %
                    </td>

                    <td className="border-b border-slate-100 px-4 py-3 text-slate-600 dark:border-slate-900 dark:text-slate-300">
                      {security.sector}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-3 dark:border-slate-900">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {
                          security.analystRating
                        }
                      </span>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-3 text-right dark:border-slate-900">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <BellRing className="h-3 w-3" />
                        {
                          security.alertCount
                        }
                      </span>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-3 text-right dark:border-slate-900">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              security
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-slate-950 dark:border-slate-800 dark:hover:text-white"
                          aria-label={`Edit ${security.symbol}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onRemove(
                              security
                            )
                          }
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                          aria-label={`Remove ${security.symbol}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onTransfer(
                              security
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                          aria-label={`Move or copy ${security.symbol}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
