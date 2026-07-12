"use client";

import {
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";
import type {
  DividendTimelineRow,
} from "./dividendCentreTypes";
import {
  daysUntilDividend,
  dividendStatusClasses,
  formatDividendDate,
  formatDividendMoney,
  formatDividendNumber,
} from "./dividendCentreFormatters";

type Props = {
  rows:
    DividendTimelineRow[];
};

export function DividendUpcomingTimeline({
  rows,
}: Props) {
  const now =
    Date.now();

  const upcoming =
    rows
      .filter(
        (row) =>
          !row.date ||
          new Date(
            row.date
          ).getTime() >=
            now -
              86_400_000
      )
      .slice(
        0,
        20
      );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Upcoming Events
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
            Dividend Timeline
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Payment dates are shown when supplied. Otherwise the ex-dividend date is used.
          </p>
        </div>

        <span className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <CalendarDays className="h-5 w-5" />
        </span>
      </div>

      {upcoming.length ===
      0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center dark:border-slate-700">
          <CircleDollarSign className="mx-auto h-7 w-7 text-slate-400" />

          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            No upcoming dividend events
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Configure a dividend provider or add dividend history to generate forecasts.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {upcoming.map(
            (row) => {
              const days =
                daysUntilDividend(
                  row.date
                );

              return (
                <article
                  key={row.id}
                  className="grid gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-950">
                      {row.displaySymbol.slice(
                        0,
                        4
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950 dark:text-slate-50">
                          {row.displaySymbol}
                        </p>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${dividendStatusClasses(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Ex-date{" "}
                        {formatDividendDate(
                          row.exDate
                        )}{" "}
                        · Payment{" "}
                        {formatDividendDate(
                          row.paymentDate
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDividendNumber(
                          row.eligibleQuantity,
                          4
                        )}{" "}
                        eligible shares ·{" "}
                        {formatDividendMoney(
                          row.dividendPerShare,
                          row.currency,
                          4
                        )}{" "}
                        per share
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-base font-bold text-slate-950 dark:text-slate-50">
                      {formatDividendMoney(
                        row.amount,
                        row.currency
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {days === null
                        ? "Date unavailable"
                        : days === 0
                          ? "Today"
                          : days > 0
                            ? `In ${days} day${
                                days === 1
                                  ? ""
                                  : "s"
                              }`
                            : `${Math.abs(
                                days
                              )} days ago`}
                    </p>

                    {row.frankingCredit >
                      0 && (
                      <p className="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        +{" "}
                        {formatDividendMoney(
                          row.frankingCredit,
                          row.currency
                        )}{" "}
                        franking
                      </p>
                    )}
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}
