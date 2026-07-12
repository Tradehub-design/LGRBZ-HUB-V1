"use client";

import {
  BarChart3,
} from "lucide-react";
import type {
  MonthlyDividendForecast,
} from "@/lib/dividend-data";
import {
  formatDividendMoney,
} from "./dividendCentreFormatters";

type Props = {
  items:
    MonthlyDividendForecast[];
  currency: string;
};

export function DividendMonthlyForecast({
  items,
  currency,
}: Props) {
  const maximum =
    Math.max(
      1,
      ...items.map(
        (item) =>
          item.totalIncome
      )
    );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Forecast
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
            Monthly Dividend Income
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Announced and estimated income for the next twelve months.
          </p>
        </div>

        <span className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <BarChart3 className="h-5 w-5" />
        </span>
      </div>

      {items.length ===
      0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
          No monthly dividend forecast is available.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <div className="flex min-w-[720px] items-end gap-2">
            {items.map(
              (item) => {
                const height =
                  Math.max(
                    4,
                    (
                      item.totalIncome /
                      maximum
                    ) *
                      180
                  );

                return (
                  <div
                    key={item.month}
                    className="flex min-w-0 flex-1 flex-col items-center"
                  >
                    <p className="mb-2 text-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {formatDividendMoney(
                        item.totalIncome,
                        currency,
                        0
                      )}
                    </p>

                    <div className="flex h-48 w-full items-end rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
                      <div
                        className="w-full rounded-lg bg-slate-950 dark:bg-slate-100"
                        style={{
                          height:
                            `${height}px`,
                        }}
                        title={`${item.label}: ${formatDividendMoney(
                          item.totalIncome,
                          currency
                        )}`}
                      />
                    </div>

                    <p className="mt-2 text-center text-[10px] font-semibold text-slate-500">
                      {item.label}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/20">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Announced
          </p>

          <p className="mt-1 text-base font-bold text-blue-900 dark:text-blue-100">
            {formatDividendMoney(
              items.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  item.announcedIncome,
                0
              ),
              currency,
              0
            )}
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/20">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Forecast
          </p>

          <p className="mt-1 text-base font-bold text-amber-900 dark:text-amber-100">
            {formatDividendMoney(
              items.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  item.forecastIncome,
                0
              ),
              currency,
              0
            )}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/20">
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Franking Credits
          </p>

          <p className="mt-1 text-base font-bold text-emerald-900 dark:text-emerald-100">
            {formatDividendMoney(
              items.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  item.frankingCredits,
                0
              ),
              currency,
              0
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
