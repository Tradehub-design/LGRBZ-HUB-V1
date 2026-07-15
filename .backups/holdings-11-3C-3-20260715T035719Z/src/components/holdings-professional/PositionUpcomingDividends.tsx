"use client";

import {
  CalendarClock,
  CircleDollarSign,
} from "lucide-react";
import type {
  PositionDividendEvent,
} from "@/lib/holdings-professional/positionDividendModels";

type PositionUpcomingDividendsProps = {
  events:
    PositionDividendEvent[];

  daysUntilPayment:
    number | null;

  daysUntilExDividend:
    number | null;
};

function money(
  value: number,
  currency: string
): string {
  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

function dateLabel(
  value: string | null
): string {
  if (!value) {
    return "Date unavailable";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function statusClass(
  status:
    PositionDividendEvent["status"]
): string {
  if (
    status === "ANNOUNCED"
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (
    status === "EXPECTED"
  ) {
    return "border-sky-400/20 bg-sky-400/10 text-sky-200";
  }

  if (
    status === "FORECAST"
  ) {
    return "border-violet-400/20 bg-violet-400/10 text-violet-200";
  }

  return "border-slate-700 bg-slate-800 text-slate-400";
}

export function PositionUpcomingDividends({
  events,
  daysUntilPayment,
  daysUntilExDividend,
}: PositionUpcomingDividendsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/35">
      <header className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
            <CalendarClock className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300/80">
              Upcoming Income
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Future dividend payments
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="rounded-xl border border-slate-800 bg-[#071522] px-3 py-2">
            <p className="text-[9px] uppercase tracking-wider text-slate-700">
              Next ex-date
            </p>

            <p className="mt-0.5 text-xs font-semibold text-white">
              {daysUntilExDividend ===
              null
                ? "—"
                : daysUntilExDividend < 0
                  ? "Passed"
                  : `${daysUntilExDividend} days`}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#071522] px-3 py-2">
            <p className="text-[9px] uppercase tracking-wider text-slate-700">
              Next payment
            </p>

            <p className="mt-0.5 text-xs font-semibold text-white">
              {daysUntilPayment ===
              null
                ? "—"
                : daysUntilPayment < 0
                  ? "Passed"
                  : `${daysUntilPayment} days`}
            </p>
          </div>
        </div>
      </header>

      <div className="divide-y divide-slate-800">
        {events
          .slice(
            0,
            8
          )
          .map(
            event => (
              <article
                key={event.id}
                className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                    <CircleDollarSign className="h-4 w-4" />
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">
                        {event.symbol}
                      </p>

                      <span
                        className={[
                          "rounded-full",
                          "border",
                          "px-2",
                          "py-0.5",
                          "text-[9px]",
                          "font-semibold",
                          statusClass(
                            event.status
                          ),
                        ].join(" ")}
                      >
                        {event.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Payment{" "}
                      {dateLabel(
                        event.paymentDate
                      )}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-700">
                      Ex-dividend{" "}
                      {dateLabel(
                        event.exDividendDate
                      )}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="font-semibold text-emerald-200">
                    {money(
                      event.netAmount,
                      event.currency
                    )}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    {money(
                      event.amountPerShare,
                      event.currency
                    )}{" "}
                    per share
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-700">
                    {event.confidence.toFixed(
                      0
                    )}
                    % confidence
                  </p>
                </div>
              </article>
            )
          )}

        {events.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarClock className="mx-auto h-8 w-8 text-slate-700" />

            <p className="mt-3 text-sm font-medium text-slate-300">
              No future dividend payments are dated
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Forecast or announced payments will appear here.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
