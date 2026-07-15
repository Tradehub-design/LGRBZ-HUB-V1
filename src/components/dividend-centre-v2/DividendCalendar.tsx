"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Landmark,
  List,
  ReceiptText,
  Sparkles,
  X,
} from "lucide-react";
import type {
  DividendEventStatus,
} from "@/lib/dividend-data";
import type {
  DividendCalendarMarker,
  DividendCalendarMarkerType,
} from "./dividendCentreTypes";
import {
  dividendStatusClasses,
  formatDividendDate,
  formatDividendMoney,
  formatDividendMonth,
} from "./dividendCentreFormatters";

type Props = {
  month: Date;
  markers: DividendCalendarMarker[];
  onMonthChange: (
    date: Date
  ) => void;
};

type CalendarView =
  | "MONTH"
  | "AGENDA";

type DayCell = {
  date: Date;
  key: string;
  dateKey: string;
  currentMonth: boolean;
  today: boolean;
  markers: DividendCalendarMarker[];
  paymentTotal: number;
};

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(
  value: Date
): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate()
  );
}

function toDateKey(
  value: Date
): string {
  const year =
    value.getFullYear();

  const month =
    String(
      value.getMonth() +
      1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      value.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

function parseMarkerDate(
  value: string
): Date | null {
  const normalized =
    value.slice(
      0,
      10
    );

  const match =
    normalized.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (!match) {
    const fallback =
      new Date(
        value
      );

    return Number.isNaN(
      fallback.getTime()
    )
      ? null
      : fallback;
  }

  const date =
    new Date(
      Number(
        match[1]
      ),
      Number(
        match[2]
      ) -
        1,
      Number(
        match[3]
      )
    );

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}

function sameDate(
  left: Date,
  right: Date
): boolean {
  return (
    left.getFullYear() ===
      right.getFullYear() &&
    left.getMonth() ===
      right.getMonth() &&
    left.getDate() ===
      right.getDate()
  );
}

function sameMonth(
  left: Date,
  right: Date
): boolean {
  return (
    left.getFullYear() ===
      right.getFullYear() &&
    left.getMonth() ===
      right.getMonth()
  );
}

function startOfCalendar(
  month: Date
): Date {
  const first =
    new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    );

  first.setDate(
    first.getDate() -
      first.getDay()
  );

  return first;
}

function endOfMonth(
  month: Date
): Date {
  return new Date(
    month.getFullYear(),
    month.getMonth() +
      1,
    0,
    23,
    59,
    59,
    999
  );
}

function markerTypeLabel(
  markerType: DividendCalendarMarkerType
): string {
  if (
    markerType ===
    "EX_DATE"
  ) {
    return "Ex-dividend";
  }

  if (
    markerType ===
    "PAYMENT_DATE"
  ) {
    return "Payment";
  }

  if (
    markerType ===
    "RECORD_DATE"
  ) {
    return "Record date";
  }

  return "Declaration";
}

function markerTypeClasses(
  markerType: DividendCalendarMarkerType
): string {
  if (
    markerType ===
    "EX_DATE"
  ) {
    return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300";
  }

  if (
    markerType ===
    "PAYMENT_DATE"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300";
  }

  if (
    markerType ===
    "RECORD_DATE"
  ) {
    return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300";
  }

  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300";
}

function markerTypeDotClasses(
  markerType: DividendCalendarMarkerType
): string {
  if (
    markerType ===
    "EX_DATE"
  ) {
    return "bg-violet-500";
  }

  if (
    markerType ===
    "PAYMENT_DATE"
  ) {
    return "bg-emerald-500";
  }

  if (
    markerType ===
    "RECORD_DATE"
  ) {
    return "bg-sky-500";
  }

  return "bg-amber-500";
}

function statusLabel(
  status: DividendEventStatus
): string {
  if (
    status ===
    "ANNOUNCED"
  ) {
    return "Announced";
  }

  if (
    status ===
    "FORECAST"
  ) {
    return "Forecast";
  }

  if (
    status ===
    "RECEIVED"
  ) {
    return "Received";
  }

  if (
    status ===
    "CANCELLED"
  ) {
    return "Cancelled";
  }

  return "Unknown";
}

function statusIcon(
  status: DividendEventStatus
) {
  if (
    status ===
    "ANNOUNCED"
  ) {
    return Landmark;
  }

  if (
    status ===
    "FORECAST"
  ) {
    return Sparkles;
  }

  if (
    status ===
    "RECEIVED"
  ) {
    return CheckCircle2;
  }

  if (
    status ===
    "CANCELLED"
  ) {
    return AlertCircle;
  }

  return Clock3;
}

function uniqueYears(
  month: Date,
  markers: DividendCalendarMarker[]
): number[] {
  const years =
    new Set<number>();

  const currentYear =
    new Date().getFullYear();

  for (
    let year =
      currentYear -
      5;
    year <=
    currentYear +
      5;
    year +=
    1
  ) {
    years.add(
      year
    );
  }

  years.add(
    month.getFullYear()
  );

  for (
    const marker of
    markers
  ) {
    const date =
      parseMarkerDate(
        marker.date
      );

    if (date) {
      years.add(
        date.getFullYear()
      );
    }
  }

  return Array.from(
    years
  ).sort(
    (
      left,
      right
    ) =>
      left -
      right
  );
}

function eventSummary(
  marker: DividendCalendarMarker
): string {
  const type =
    markerTypeLabel(
      marker.markerType
    );

  if (
    marker.markerType ===
      "PAYMENT_DATE" &&
    marker.amount !==
      null
  ) {
    return `${type} · ${formatDividendMoney(
      marker.amount,
      marker.currency
    )}`;
  }

  return `${type} · ${marker.label}`;
}

function monthMarkers(
  month: Date,
  markers: DividendCalendarMarker[]
): DividendCalendarMarker[] {
  return markers
    .filter(
      (
        marker
      ) => {
        const date =
          parseMarkerDate(
            marker.date
          );

        return Boolean(
          date &&
          sameMonth(
            date,
            month
          )
        );
      }
    )
    .sort(
      (
        left,
        right
      ) =>
        left.date.localeCompare(
          right.date
        )
    );
}

function monthPaymentTotal(
  month: Date,
  markers: DividendCalendarMarker[]
): number {
  return monthMarkers(
    month,
    markers
  )
    .filter(
      (
        marker
      ) =>
        marker.markerType ===
        "PAYMENT_DATE"
    )
    .reduce(
      (
        total,
        marker
      ) =>
        total +
        (
          marker.amount ||
          0
        ),
      0
    );
}

function countMarkerType(
  month: Date,
  markers: DividendCalendarMarker[],
  markerType: DividendCalendarMarkerType
): number {
  return monthMarkers(
    month,
    markers
  ).filter(
    (
      marker
    ) =>
      marker.markerType ===
      markerType
  ).length;
}

function DayEventBadge({
  marker,
  compact = false,
}: {
  marker: DividendCalendarMarker;
  compact?: boolean;
}) {
  return (
    <div
      title={`${marker.symbol} · ${eventSummary(
        marker
      )}`}
      className={`flex min-w-0 items-center gap-1 rounded-md border px-1.5 py-1 text-[9px] font-bold sm:text-[10px] ${markerTypeClasses(
        marker.markerType
      )}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${markerTypeDotClasses(
          marker.markerType
        )}`}
      />

      <span className="truncate">
        {marker.symbol.replace(
          /\.AX$/i,
          ""
        )}
      </span>

      {!compact && (
        <span className="hidden truncate font-medium opacity-80 sm:inline">
          {marker.markerType ===
            "PAYMENT_DATE" &&
          marker.amount !==
            null
            ? formatDividendMoney(
                marker.amount,
                marker.currency,
                0
              )
            : markerTypeLabel(
                marker.markerType
              )}
        </span>
      )}
    </div>
  );
}

function SelectedDayPanel({
  date,
  markers,
  onClose,
}: {
  date: Date;
  markers: DividendCalendarMarker[];
  onClose: () => void;
}) {
  const paymentTotal =
    markers
      .filter(
        (
          marker
        ) =>
          marker.markerType ===
          "PAYMENT_DATE"
      )
      .reduce(
        (
          total,
          marker
        ) =>
          total +
          (
            marker.amount ||
            0
          ),
        0
      );

  const currency =
    markers[0]
      ?.currency ||
    "AUD";

  return (
    <aside className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:p-5 xl:border-l xl:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
            Selected Date
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
            {date.toLocaleDateString(
              "en-AU",
              {
                weekday:
                  "long",
                day:
                  "2-digit",
                month:
                  "long",
                year:
                  "numeric",
              }
            )}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {markers.length} dividend event
            {markers.length ===
            1
              ? ""
              : "s"}
          </p>
        </div>

        <button
          type="button"
          onClick={
            onClose
          }
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          aria-label="Close selected date panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {paymentTotal >
        0 && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Payment Total
              </p>

              <p className="mt-1 text-xl font-bold text-emerald-800 dark:text-emerald-200">
                {formatDividendMoney(
                  paymentTotal,
                  currency
                )}
              </p>
            </div>

            <CircleDollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {markers.length ===
        0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
            <CalendarDays className="mx-auto h-6 w-6 text-slate-400" />

            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              No dividend events
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              There are no ex-dividend, payment, record or declaration events on this date.
            </p>
          </div>
        ) : (
          markers.map(
            (
              marker
            ) => {
              const StatusIcon =
                statusIcon(
                  marker.status
                );

              return (
                <article
                  key={
                    marker.id
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-slate-950 dark:text-slate-50">
                          {marker.symbol.replace(
                            /\.AX$/i,
                            ""
                          )}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${dividendStatusClasses(
                            marker.status
                          )}`}
                        >
                          <StatusIcon className="h-3 w-3" />

                          {statusLabel(
                            marker.status
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {markerTypeLabel(
                          marker.markerType
                        )}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {marker.label}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-xl border p-2 ${markerTypeClasses(
                        marker.markerType
                      )}`}
                    >
                      {marker.markerType ===
                      "PAYMENT_DATE" ? (
                        <CircleDollarSign className="h-4 w-4" />
                      ) : marker.markerType ===
                        "EX_DATE" ? (
                        <CalendarDays className="h-4 w-4" />
                      ) : marker.markerType ===
                        "RECORD_DATE" ? (
                        <ReceiptText className="h-4 w-4" />
                      ) : (
                        <Landmark className="h-4 w-4" />
                      )}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Date
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {formatDividendDate(
                          marker.date
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Confidence
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {marker.confidence}
                      </p>
                    </div>
                  </div>

                  {marker.amount !==
                    null && (
                    <div className="mt-3 rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Expected Cash
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50">
                        {formatDividendMoney(
                          marker.amount,
                          marker.currency
                        )}
                      </p>
                    </div>
                  )}
                </article>
              );
            }
          )
        )}
      </div>
    </aside>
  );
}

export function DividendCalendar({
  month,
  markers,
  onMonthChange,
}: Props) {
  const [
    view,
    setView,
  ] =
    useState<CalendarView>(
      "MONTH"
    );

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState<Date | null>(
      null
    );

  const today =
    useMemo(
      () =>
        startOfDay(
          new Date()
        ),
      []
    );

  const years =
    useMemo(
      () =>
        uniqueYears(
          month,
          markers
        ),
      [
        month,
        markers,
      ]
    );

  const markersByDate =
    useMemo(
      () => {
        const map =
          new Map<
            string,
            DividendCalendarMarker[]
          >();

        for (
          const marker of
          markers
        ) {
          const date =
            parseMarkerDate(
              marker.date
            );

          if (!date) {
            continue;
          }

          const key =
            toDateKey(
              date
            );

          const existing =
            map.get(
              key
            ) ||
            [];

          existing.push(
            marker
          );

          map.set(
            key,
            existing
          );
        }

        for (
          const [
            key,
            value,
          ] of map
        ) {
          map.set(
            key,
            value.sort(
              (
                left,
                right
              ) => {
                const typeOrder:
                  Record<
                    DividendCalendarMarkerType,
                    number
                  > = {
                    PAYMENT_DATE:
                      0,
                    EX_DATE:
                      1,
                    RECORD_DATE:
                      2,
                    DECLARATION_DATE:
                      3,
                  };

                const typeComparison =
                  typeOrder[
                    left.markerType
                  ] -
                  typeOrder[
                    right.markerType
                  ];

                if (
                  typeComparison !==
                  0
                ) {
                  return typeComparison;
                }

                return left.symbol.localeCompare(
                  right.symbol
                );
              }
            )
          );
        }

        return map;
      },
      [
        markers,
      ]
    );

  const calendarDays =
    useMemo(
      () => {
        const start =
          startOfCalendar(
            month
          );

        return Array.from({
          length:
            42,
        }).map(
          (
            _,
            index
          ): DayCell => {
            const date =
              new Date(
                start
              );

            date.setDate(
              date.getDate() +
                index
            );

            const dateKey =
              toDateKey(
                date
              );

            const dayMarkers =
              markersByDate.get(
                dateKey
              ) ||
              [];

            const paymentTotal =
              dayMarkers
                .filter(
                  (
                    marker
                  ) =>
                    marker.markerType ===
                    "PAYMENT_DATE"
                )
                .reduce(
                  (
                    total,
                    marker
                  ) =>
                    total +
                    (
                      marker.amount ||
                      0
                    ),
                  0
                );

            return {
              date,
              key:
                date.toISOString(),
              dateKey,
              currentMonth:
                sameMonth(
                  date,
                  month
                ),
              today:
                sameDate(
                  date,
                  today
                ),
              markers:
                dayMarkers,
              paymentTotal,
            };
          }
        );
      },
      [
        month,
        markersByDate,
        today,
      ]
    );

  const visibleMonthMarkers =
    useMemo(
      () =>
        monthMarkers(
          month,
          markers
        ),
      [
        month,
        markers,
      ]
    );

  const selectedMarkers =
    useMemo(
      () => {
        if (!selectedDate) {
          return [];
        }

        return (
          markersByDate.get(
            toDateKey(
              selectedDate
            )
          ) ||
          []
        );
      },
      [
        selectedDate,
        markersByDate,
      ]
    );

  const monthlyPaymentTotal =
    useMemo(
      () =>
        monthPaymentTotal(
          month,
          markers
        ),
      [
        month,
        markers,
      ]
    );

  const monthlyCurrency =
    visibleMonthMarkers[0]
      ?.currency ||
    markers[0]
      ?.currency ||
    "AUD";

  const exDateCount =
    useMemo(
      () =>
        countMarkerType(
          month,
          markers,
          "EX_DATE"
        ),
      [
        month,
        markers,
      ]
    );

  const paymentCount =
    useMemo(
      () =>
        countMarkerType(
          month,
          markers,
          "PAYMENT_DATE"
        ),
      [
        month,
        markers,
      ]
    );

  useEffect(
    () => {
      if (
        selectedDate &&
        !sameMonth(
          selectedDate,
          month
        )
      ) {
        setSelectedDate(
          null
        );
      }
    },
    [
      month,
      selectedDate,
    ]
  );

  const previousMonth =
    () => {
      const next =
        new Date(
          month.getFullYear(),
          month.getMonth() -
            1,
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
          month.getFullYear(),
          month.getMonth() +
            1,
          1
        );

      onMonthChange(
        next
      );
    };

  const goToToday =
    () => {
      const now =
        new Date();

      onMonthChange(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        )
      );

      setSelectedDate(
        startOfDay(
          now
        )
      );
    };

  const changeMonth =
    (
      monthIndex:
        number
    ) => {
      onMonthChange(
        new Date(
          month.getFullYear(),
          monthIndex,
          1
        )
      );
    };

  const changeYear =
    (
      year:
        number
    ) => {
      onMonthChange(
        new Date(
          year,
          month.getMonth(),
          1
        )
      );
    };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <header className="border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="shrink-0 rounded-xl bg-violet-100 p-2.5 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
              <CalendarDays className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                Dividend Calendar
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
                {formatDividendMonth(
                  month
                )}
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                Review payment dates, ex-dividend dates, record dates and declaration events across your portfolio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Monthly Payments
              </p>

              <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50">
                {formatDividendMoney(
                  monthlyPaymentTotal,
                  monthlyCurrency
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Payment Events
              </p>

              <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {paymentCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Ex-Dividend Events
              </p>

              <p className="mt-1 text-sm font-bold text-violet-700 dark:text-violet-300">
                {exDateCount}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={
                previousMonth
              }
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={
                goToToday
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <CalendarDays className="h-4 w-4" />
              Today
            </button>

            <button
              type="button"
              onClick={
                nextMonth
              }
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <select
              value={
                month.getMonth()
              }
              onChange={(
                event
              ) =>
                changeMonth(
                  Number(
                    event.target.value
                  )
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
              aria-label="Select month"
            >
              {MONTHS.map(
                (
                  label,
                  index
                ) => (
                  <option
                    key={
                      label
                    }
                    value={
                      index
                    }
                  >
                    {label}
                  </option>
                )
              )}
            </select>

            <select
              value={
                month.getFullYear()
              }
              onChange={(
                event
              ) =>
                changeYear(
                  Number(
                    event.target.value
                  )
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
              aria-label="Select year"
            >
              {years.map(
                (
                  year
                ) => (
                  <option
                    key={
                      year
                    }
                    value={
                      year
                    }
                  >
                    {year}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() =>
                setView(
                  "MONTH"
                )
              }
              className={`inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                view ===
                "MONTH"
                  ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Month
            </button>

            <button
              type="button"
              onClick={() =>
                setView(
                  "AGENDA"
                )
              }
              className={`inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                view ===
                "AGENDA"
                  ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Agenda
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
          {[
            {
              type:
                "PAYMENT_DATE" as const,
              label:
                "Payment",
            },
            {
              type:
                "EX_DATE" as const,
              label:
                "Ex-dividend",
            },
            {
              type:
                "RECORD_DATE" as const,
              label:
                "Record date",
            },
            {
              type:
                "DECLARATION_DATE" as const,
              label:
                "Declaration",
            },
          ].map(
            (
              item
            ) => (
              <span
                key={
                  item.type
                }
                className="inline-flex items-center gap-2"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${markerTypeDotClasses(
                    item.type
                  )}`}
                />

                {item.label}
              </span>
            )
          )}
        </div>
      </header>

      {view ===
      "MONTH" ? (
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
              {WEEK_DAYS.map(
                (
                  day
                ) => (
                  <div
                    key={
                      day
                    }
                    className="px-1 py-2.5"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map(
                (
                  day
                ) => {
                  const selected =
                    Boolean(
                      selectedDate &&
                      sameDate(
                        selectedDate,
                        day.date
                      )
                    );

                  const hasExDate =
                    day.markers.some(
                      (
                        marker
                      ) =>
                        marker.markerType ===
                        "EX_DATE"
                    );

                  const hasPayment =
                    day.markers.some(
                      (
                        marker
                      ) =>
                        marker.markerType ===
                        "PAYMENT_DATE"
                    );

                  return (
                    <button
                      key={
                        day.key
                      }
                      type="button"
                      onClick={() =>
                        setSelectedDate(
                          day.date
                        )
                      }
                      className={`relative min-h-24 border-b border-r border-slate-200 p-1.5 text-left transition dark:border-slate-800 sm:min-h-32 sm:p-2 ${
                        day.currentMonth
                          ? "bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/50"
                          : "bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-900/60"
                      } ${
                        selected
                          ? "z-10 ring-2 ring-inset ring-slate-950 dark:ring-slate-100"
                          : ""
                      } ${
                        hasPayment
                          ? "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-emerald-500"
                          : hasExDate
                            ? "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-violet-500"
                            : ""
                      }`}
                      aria-label={`${day.date.toLocaleDateString(
                        "en-AU",
                        {
                          day:
                            "numeric",
                          month:
                            "long",
                          year:
                            "numeric",
                        }
                      )}, ${day.markers.length} dividend events`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                            day.today
                              ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                              : day.currentMonth
                                ? "text-slate-700 dark:text-slate-200"
                                : "text-slate-400"
                          }`}
                        >
                          {day.date.getDate()}
                        </span>

                        {day.paymentTotal >
                          0 && (
                          <span className="hidden truncate text-[9px] font-bold text-emerald-700 dark:text-emerald-300 sm:block">
                            {formatDividendMoney(
                              day.paymentTotal,
                              day.markers[0]
                                ?.currency ||
                                "AUD",
                              0
                            )}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 space-y-1">
                        {day.markers
                          .slice(
                            0,
                            3
                          )
                          .map(
                            (
                              marker
                            ) => (
                              <DayEventBadge
                                key={
                                  marker.id
                                }
                                marker={
                                  marker
                                }
                              />
                            )
                          )}

                        {day.markers.length >
                          3 && (
                          <div className="rounded-md bg-slate-100 px-1.5 py-1 text-[9px] font-bold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                            +
                            {day.markers.length -
                              3}{" "}
                            more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {selectedDate ? (
            <SelectedDayPanel
              date={
                selectedDate
              }
              markers={
                selectedMarkers
              }
              onClose={() =>
                setSelectedDate(
                  null
                )
              }
            />
          ) : (
            <aside className="hidden border-l border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40 xl:block">
              <CalendarDays className="h-7 w-7 text-slate-400" />

              <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-slate-50">
                Select a calendar day
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose a date to inspect its payment, ex-dividend, record and declaration events.
              </p>

              <div className="mt-5 space-y-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Current Month
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                    {visibleMonthMarkers.length} events
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Payment Income
                  </p>

                  <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    {formatDividendMoney(
                      monthlyPaymentTotal,
                      monthlyCurrency
                    )}
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {visibleMonthMarkers.length ===
          0 ? (
            <div className="px-4 py-16 text-center sm:px-6">
              <CalendarDays className="mx-auto h-8 w-8 text-slate-400" />

              <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-slate-50">
                No dividend events this month
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Use the month controls to review another period. Historical ledger payments and forecast events will appear when available.
              </p>
            </div>
          ) : (
            visibleMonthMarkers.map(
              (
                marker
              ) => {
                const StatusIcon =
                  statusIcon(
                    marker.status
                  );

                return (
                  <button
                    key={
                      marker.id
                    }
                    type="button"
                    onClick={() => {
                      const date =
                        parseMarkerDate(
                          marker.date
                        );

                      if (
                        date
                      ) {
                        setSelectedDate(
                          date
                        );

                        setView(
                          "MONTH"
                        );
                      }
                    }}
                    className="flex w-full items-start gap-4 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900/50 sm:p-5"
                  >
                    <div className="w-14 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        {new Date(
                          `${marker.date.slice(
                            0,
                            10
                          )}T00:00:00`
                        ).toLocaleDateString(
                          "en-AU",
                          {
                            month:
                              "short",
                          }
                        )}
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
                        {new Date(
                          `${marker.date.slice(
                            0,
                            10
                          )}T00:00:00`
                        ).getDate()}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-950 dark:text-slate-50">
                          {marker.symbol.replace(
                            /\.AX$/i,
                            ""
                          )}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${dividendStatusClasses(
                            marker.status
                          )}`}
                        >
                          <StatusIcon className="h-3 w-3" />

                          {statusLabel(
                            marker.status
                          )}
                        </span>

                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold ${markerTypeClasses(
                            marker.markerType
                          )}`}
                        >
                          {markerTypeLabel(
                            marker.markerType
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {marker.label}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
                        {marker.amount !==
                        null
                          ? formatDividendMoney(
                              marker.amount,
                              marker.currency
                            )
                          : "—"}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                        {marker.confidence}
                      </p>
                    </div>
                  </button>
                );
              }
            )
          )}
        </div>
      )}

      {selectedDate &&
        view ===
          "MONTH" && (
        <div className="xl:hidden">
          <SelectedDayPanel
            date={
              selectedDate
            }
            markers={
              selectedMarkers
            }
            onClose={() =>
              setSelectedDate(
                null
              )
            }
          />
        </div>
      )}
    </section>
  );
}
