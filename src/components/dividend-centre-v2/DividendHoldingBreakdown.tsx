"use client";

import {
  Building2,
} from "lucide-react";
import type {
  DividendHoldingSummary,
} from "@/lib/dividend-data";
import {
  formatDividendDate,
  formatDividendMoney,
  formatDividendPercent,
} from "./dividendCentreFormatters";

type Props = {
  items:
    DividendHoldingSummary[];
};

export function DividendHoldingBreakdown({
  items,
}: Props) {
  const ordered =
    [...items].sort(
      (
        left,
        right
      ) =>
        right.forwardTwelveMonthIncome -
        left.forwardTwelveMonthIncome
    );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Holding Income
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
            Dividend Contribution by Holding
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Forward income, yield, payment dates and franking by position.
          </p>
        </div>

        <span className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <Building2 className="h-5 w-5" />
        </span>
      </header>

      {ordered.length ===
      0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No holding dividend summaries are available.
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/60">
                <tr className="text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">
                    Holding
                  </th>
                  <th className="px-4 py-3 text-right">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right">
                    Forward Income
                  </th>
                  <th className="px-4 py-3 text-right">
                    Announced
                  </th>
                  <th className="px-4 py-3 text-right">
                    Forecast
                  </th>
                  <th className="px-4 py-3 text-right">
                    Yield
                  </th>
                  <th className="px-4 py-3 text-right">
                    Yield on Cost
                  </th>
                  <th className="px-4 py-3">
                    Next Payment
                  </th>
                  <th className="px-4 py-3 text-right">
                    Franking
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {ordered.map(
                  (item) => (
                    <tr
                      key={item.symbol}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/40"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-950 dark:text-slate-50">
                          {item.displaySymbol}
                        </p>

                        <p className="text-xs text-slate-500">
                          {item.currency}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-200">
                        {item.quantity.toLocaleString(
                          "en-AU",
                          {
                            maximumFractionDigits:
                              4,
                          }
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-slate-950 dark:text-slate-50">
                        {formatDividendMoney(
                          item.forwardTwelveMonthIncome,
                          item.currency
                        )}
                      </td>

                      <td className="px-4 py-3 text-right text-blue-700 dark:text-blue-300">
                        {formatDividendMoney(
                          item.announcedIncome,
                          item.currency
                        )}
                      </td>

                      <td className="px-4 py-3 text-right text-amber-700 dark:text-amber-300">
                        {formatDividendMoney(
                          item.forecastIncome,
                          item.currency
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {formatDividendPercent(
                          item.forwardYield
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {formatDividendPercent(
                          item.yieldOnCost
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {formatDividendDate(
                          item.nextPaymentDate
                        )}
                      </td>

                      <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-300">
                        {formatDividendMoney(
                          item.frankingCredits,
                          item.currency
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 p-3 lg:hidden">
            {ordered.map(
              (item) => (
                <article
                  key={item.symbol}
                  className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950 dark:text-slate-50">
                        {item.displaySymbol}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.quantity.toLocaleString(
                          "en-AU",
                          {
                            maximumFractionDigits:
                              4,
                          }
                        )}{" "}
                        shares
                      </p>
                    </div>

                    <p className="text-right font-bold text-slate-950 dark:text-slate-50">
                      {formatDividendMoney(
                        item.forwardTwelveMonthIncome,
                        item.currency
                      )}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-900">
                      <p className="text-slate-500">
                        Forward Yield
                      </p>

                      <p className="mt-1 font-bold">
                        {formatDividendPercent(
                          item.forwardYield
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-900">
                      <p className="text-slate-500">
                        Next Payment
                      </p>

                      <p className="mt-1 font-bold">
                        {formatDividendDate(
                          item.nextPaymentDate,
                          false
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </>
      )}
    </section>
  );
}
