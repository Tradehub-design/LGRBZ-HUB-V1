"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  DividendCalendarMarker,
} from "./dividendCentreTypes";
import {
  dividendStatusClasses,
  formatDividendMoney,
  formatDividendMonth,
} from "./dividendCentreFormatters";

type Props = {
  month: Date;
  markers:
    DividendCalendarMarker[];
  onMonthChange: (
    date: Date
  ) => void;
};

function startOfCalendar(
  date: Date
) {
  const first =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );

  const day =
    first.getDay();

  first.setDate(
    first.getDate() -
      day
  );

  return first;
}

function sameDate(
  left: Date,
  right: Date
) {
  return (
    left.getFullYear() ===
      right.getFullYear() &&
    left.getMonth() ===
      right.getMonth() &&
    left.getDate() ===
      right.getDate()
  );
}

export function DividendCalendar({
  month,
  markers,
  onMonthChange,
}: Props) {
  const calendarStart =
    startOfCalendar(
      month
    );

  const days =
    Array.from({
      length: 42,
    }).map(
      (
        _,
        index
      ) => {
        const date =
          new Date(
            calendarStart
          );

        date.setDate(
          date.getDate() +
            index
        );

        return date;
      }
    );

  const previousMonth =
    () => {
      const next =
        new Date(
          month
        );

      next.setMonth(
        next.getMonth() -
          1
      );

      onMonthChange(
        next
      );
    };

  const nextMonth =
    () => {
      const next =
        new Date(
          month
        );

      next.setMonth(
        next.getMonth() +
          1
      );

      onMonthChange(
        next
      );
    };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Dividend Calendar
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
            {formatDividendMonth(
              month
            )}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={
              previousMonth
            }
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={
              nextMonth
            }
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map(
          (day) => (
            <div
              key={day}
              className="px-1 py-2"
            >
              {day}
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-7">
        {days.map(
          (date) => {
            const currentMonth =
              date.getMonth() ===
              month.getMonth();

            const today =
              sameDate(
                date,
                new Date()
              );

            const dateMarkers =
              markers.filter(
                (marker) =>
                  sameDate(
                    new Date(
                      marker.date
                    ),
                    date
                  )
              );

            return (
              <div
                key={date.toISOString()}
                className={`min-h-24 border-b border-r border-slate-200 p-1.5 dark:border-slate-800 sm:min-h-28 sm:p-2 ${
                  currentMonth
                    ? "bg-white dark:bg-slate-950"
                    : "bg-slate-50/70 dark:bg-slate-900/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      today
                        ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                        : currentMonth
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-400"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>

                <div className="mt-1 space-y-1">
                  {dateMarkers
                    .slice(
                      0,
                      3
                    )
                    .map(
                      (marker) => (
                        <div
                          key={marker.id}
                          title={`${marker.symbol} ${marker.label}`}
                          className={`truncate rounded-md px-1.5 py-1 text-[9px] font-bold sm:text-[10px] ${dividendStatusClasses(
                            marker.status
                          )}`}
                        >
                          {marker.symbol}{" "}
                          <span className="hidden sm:inline">
                            {marker.markerType ===
                            "PAYMENT_DATE"
                              ? formatDividendMoney(
                                  marker.amount,
                                  marker.currency,
                                  0
                                )
                              : marker.label}
                          </span>
                        </div>
                      )
                    )}

                  {dateMarkers.length >
                    3 && (
                    <p className="text-[9px] font-semibold text-slate-500">
                      +
                      {dateMarkers.length -
                        3}{" "}
                      more
                    </p>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      <footer className="flex flex-wrap gap-2 border-t border-slate-200 p-3 text-[10px] font-semibold dark:border-slate-800">
        <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          Announced
        </span>

        <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          Forecast
        </span>

        <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          Received
        </span>
      </footer>
    </section>
  );
}
