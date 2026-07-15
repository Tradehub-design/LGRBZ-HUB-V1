"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  GitMerge,
  Layers3,
  ReceiptText,
  RefreshCcw,
  Repeat2,
} from "lucide-react";
import type {
  PositionActivityEvent,
  PositionActivityFilter,
} from "@/lib/holdings-professional/positionActivityModels";
import type {
  PositionIntelligenceSummary,
} from "@/lib/holdings-professional/positionIntelligenceModels";
import {
  createPositionActivitySnapshot,
} from "@/lib/holdings-professional/positionActivityEngine";
import {
  PositionActivityFilters,
} from "./PositionActivityFilters";

type PositionActivityTimelineProps = {
  summary:
    PositionIntelligenceSummary;
};

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

function money(
  value: number | null,
  currency: string
): string {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

function iconForEvent(
  type:
    PositionActivityEvent["type"]
) {
  if (type === "BUY") {
    return ArrowDownLeft;
  }

  if (type === "SELL") {
    return ArrowUpRight;
  }

  if (
    type === "DIVIDEND"
  ) {
    return CircleDollarSign;
  }

  if (type === "DRP") {
    return Repeat2;
  }

  if (type === "SPLIT") {
    return GitMerge;
  }

  if (type === "TRANSFER") {
    return RefreshCcw;
  }

  if (
    type ===
    "CORPORATE_ACTION"
  ) {
    return Layers3;
  }

  return ReceiptText;
}

function eventClass(
  type:
    PositionActivityEvent["type"]
): string {
  if (type === "BUY") {
    return "border-sky-400/20 bg-sky-400/10 text-sky-300";
  }

  if (type === "SELL") {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  if (
    type === "DIVIDEND" ||
    type === "DRP"
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (
    type === "SPLIT" ||
    type ===
      "CORPORATE_ACTION"
  ) {
    return "border-violet-400/20 bg-violet-400/10 text-violet-300";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-300";
}

export function PositionActivityTimeline({
  summary,
}: PositionActivityTimelineProps) {
  const snapshot =
    createPositionActivitySnapshot(
      summary.position
    );

  const [
    filter,
    setFilter,
  ] =
    useState<PositionActivityFilter>(
      "ALL"
    );

  const filteredEvents =
    useMemo(
      () =>
        filter === "ALL"
          ? snapshot.events
          : snapshot.events.filter(
              event =>
                event.type ===
                filter
            ),
      [
        filter,
        snapshot.events,
      ]
    );

  const counts =
    useMemo(
      () => {
        const result:
          Partial<
            Record<
              PositionActivityFilter,
              number
            >
          > = {
            ALL:
              snapshot.events.length,
          };

        for (
          const event of
          snapshot.events
        ) {
          result[event.type] =
            (
              result[
                event.type
              ] ||
              0
            ) +
            1;
        }

        return result;
      },
      [
        snapshot.events,
      ]
    );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/30">
      <header className="border-b border-slate-800 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <ReceiptText className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
              Position Activity
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Transaction and event timeline
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Buys, sells, income, reinvestment and corporate actions.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <PositionActivityFilters
            value={
              filter
            }
            counts={
              counts
            }
            onChange={
              setFilter
            }
          />
        </div>
      </header>

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-800 bg-[#071522] p-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-700">
            Total events
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {snapshot.totals.eventCount}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-[#071522] p-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-700">
            Purchases
          </p>

          <p className="mt-1 text-lg font-semibold text-sky-300">
            {snapshot.totals.buyCount}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-[#071522] p-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-700">
            Sales
          </p>

          <p className="mt-1 text-lg font-semibold text-rose-300">
            {snapshot.totals.sellCount}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-[#071522] p-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-700">
            Income events
          </p>

          <p className="mt-1 text-lg font-semibold text-emerald-300">
            {snapshot.totals.dividendCount}
          </p>
        </article>
      </div>

      <div className="p-5">
        <div className="relative space-y-4 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:w-px before:bg-slate-800">
          {filteredEvents.map(
            event => {
              const Icon =
                iconForEvent(
                  event.type
                );

              return (
                <article
                  key={event.id}
                  className="relative flex gap-4"
                >
                  <span
                    className={[
                      "relative",
                      "z-10",
                      "flex",
                      "h-10",
                      "w-10",
                      "shrink-0",
                      "items-center",
                      "justify-center",
                      "rounded-xl",
                      "border",
                      eventClass(
                        event.type
                      ),
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-[#071522] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">
                            {event.title}
                          </p>

                          <span
                            className={[
                              "rounded-full",
                              "border",
                              "px-2",
                              "py-0.5",
                              "text-[9px]",
                              "font-semibold",
                              eventClass(
                                event.type
                              ),
                            ].join(" ")}
                          >
                            {event.type.replace(
                              "_",
                              " "
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {event.description}
                        </p>

                        <p className="mt-2 text-[10px] text-slate-700">
                          {dateLabel(
                            event.date
                          )}{" "}
                          · {event.broker} ·{" "}
                          {event.account}
                        </p>
                      </div>

                      <div className="shrink-0 sm:text-right">
                        {event.netAmount !==
                        null ? (
                          <p
                            className={[
                              "font-semibold",
                              event.type ===
                              "BUY"
                                ? "text-sky-300"
                                : event.type ===
                                    "SELL" ||
                                  event.type ===
                                    "DIVIDEND" ||
                                  event.type ===
                                    "DRP"
                                  ? "text-emerald-300"
                                  : "text-white",
                            ].join(" ")}
                          >
                            {money(
                              event.netAmount,
                              event.currency
                            )}
                          </p>
                        ) : null}

                        {event.quantity !==
                        null ? (
                          <p className="mt-1 text-[10px] text-slate-600">
                            {event.quantity.toLocaleString(
                              "en-AU",
                              {
                                maximumFractionDigits:
                                  4,
                              }
                            )}{" "}
                            units
                          </p>
                        ) : null}

                        {event.price !==
                        null ? (
                          <p className="mt-0.5 text-[10px] text-slate-700">
                            @{" "}
                            {money(
                              event.price,
                              event.currency
                            )}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            }
          )}

          {filteredEvents.length ===
          0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <ReceiptText className="mx-auto h-8 w-8 text-slate-700" />

              <p className="mt-3 text-sm font-medium text-slate-300">
                No matching activity events
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Position events will appear when transaction history is available.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
