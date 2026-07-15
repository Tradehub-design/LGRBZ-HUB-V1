"use client";

import {
  CalendarDays,
  Layers3,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type {
  PositionFifoLot,
} from "@/lib/holdings-professional/positionActivityModels";
import type {
  PositionIntelligenceSummary,
} from "@/lib/holdings-professional/positionIntelligenceModels";
import {
  createPositionActivitySnapshot,
} from "@/lib/holdings-professional/positionActivityEngine";

type PositionFifoLotsProps = {
  summary:
    PositionIntelligenceSummary;
};

function money(
  value: number | null,
  currency: string,
  digits = 2
): string {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits:
        digits,
    }
  ).format(value);
}

function percent(
  value: number | null
): string {
  if (value === null) {
    return "—";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

function dateLabel(
  value: string | null
): string {
  if (!value) {
    return "Unknown";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unknown";
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
    PositionFifoLot["status"]
): string {
  if (status === "OPEN") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (
    status ===
    "PARTIALLY_REALISED"
  ) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  return "border-slate-700 bg-slate-800 text-slate-400";
}

export function PositionFifoLots({
  summary,
}: PositionFifoLotsProps) {
  const snapshot =
    createPositionActivitySnapshot(
      summary.position
    );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/30">
      <header className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
            <Layers3 className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/80">
              FIFO Cost Lots
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Open purchase lots
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Remaining shares, cost basis, age and unrealised performance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <div className="rounded-xl border border-slate-800 bg-[#071522] px-3 py-2">
            <p className="text-[9px] uppercase tracking-wider text-slate-700">
              Lots
            </p>

            <p className="mt-0.5 text-sm font-semibold text-white">
              {snapshot.totals.lotCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#071522] px-3 py-2">
            <p className="text-[9px] uppercase tracking-wider text-slate-700">
              Open units
            </p>

            <p className="mt-0.5 text-sm font-semibold text-white">
              {snapshot.totals.remainingQuantity.toLocaleString(
                "en-AU",
                {
                  maximumFractionDigits:
                    4,
                }
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-800 bg-[#071522] p-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-700">
            Remaining cost
          </p>

          <p className="mt-1 font-semibold text-white">
            {money(
              snapshot.totals.remainingCost,
              summary.position.currency
            )}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-[#071522] p-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-700">
            Current value
          </p>

          <p className="mt-1 font-semibold text-white">
            {money(
              snapshot.totals.currentValue,
              summary.position.currency
            )}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-[#071522] p-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-700">
            Unrealised return
          </p>

          <p
            className={[
              "mt-1",
              "font-semibold",
              snapshot.totals.unrealisedGainLoss >=
              0
                ? "text-emerald-300"
                : "text-rose-300",
            ].join(" ")}
          >
            {percent(
              snapshot.totals.unrealisedGainLossPercent
            )}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-[#071522] p-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-700">
            Oldest lot
          </p>

          <p className="mt-1 font-semibold text-white">
            {snapshot.totals.oldestHoldingDays ===
            null
              ? "—"
              : `${snapshot.totals.oldestHoldingDays.toLocaleString(
                  "en-AU"
                )} days`}
          </p>
        </article>
      </div>

      <div className="hidden max-h-[560px] overflow-auto lg:block">
        <table className="w-full min-w-[1200px]">
          <thead className="sticky top-0 z-10 bg-[#071522]/95 backdrop-blur-xl">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Purchase date
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Original units
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Remaining
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Purchase price
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Current price
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Remaining cost
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Current value
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Return
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Age
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {snapshot.lots.map(
              lot => {
                const ReturnIcon =
                  lot.unrealisedGainLoss >=
                  0
                    ? TrendingUp
                    : TrendingDown;

                return (
                  <tr
                    key={lot.id}
                    className="border-b border-slate-800/80 transition hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-violet-300" />

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {dateLabel(
                              lot.purchaseDate
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-700">
                            {lot.broker} ·{" "}
                            {lot.account}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                      {lot.originalQuantity.toLocaleString(
                        "en-AU",
                        {
                          maximumFractionDigits:
                            4,
                        }
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <p className="font-semibold text-white">
                        {lot.remainingQuantity.toLocaleString(
                          "en-AU",
                          {
                            maximumFractionDigits:
                              4,
                          }
                        )}
                      </p>

                      {lot.realisedQuantity >
                      0 ? (
                        <p className="mt-0.5 text-[10px] text-slate-700">
                          {lot.realisedQuantity.toLocaleString(
                            "en-AU",
                            {
                              maximumFractionDigits:
                                4,
                            }
                          )}{" "}
                          realised
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                      {money(
                        lot.purchasePrice,
                        lot.currency,
                        4
                      )}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                      {money(
                        lot.currentPrice,
                        lot.currency,
                        4
                      )}
                    </td>

                    <td className="px-4 py-4 text-right font-semibold text-white">
                      {money(
                        lot.remainingCost,
                        lot.currency
                      )}
                    </td>

                    <td className="px-4 py-4 text-right font-semibold text-white">
                      {money(
                        lot.currentValue,
                        lot.currency
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <p
                        className={[
                          "inline-flex",
                          "items-center",
                          "justify-end",
                          "gap-1",
                          "font-semibold",
                          lot.unrealisedGainLoss >=
                          0
                            ? "text-emerald-300"
                            : "text-rose-300",
                        ].join(" ")}
                      >
                        <ReturnIcon className="h-3.5 w-3.5" />

                        {percent(
                          lot.unrealisedGainLossPercent
                        )}
                      </p>

                      <p
                        className={[
                          "mt-0.5",
                          "text-[10px]",
                          lot.unrealisedGainLoss >=
                          0
                            ? "text-emerald-300/70"
                            : "text-rose-300/70",
                        ].join(" ")}
                      >
                        {money(
                          lot.unrealisedGainLoss,
                          lot.currency
                        )}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-400">
                      {lot.holdingDays ===
                      null
                        ? "—"
                        : `${lot.holdingDays.toLocaleString(
                            "en-AU"
                          )}d`}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span
                        className={[
                          "inline-flex",
                          "rounded-full",
                          "border",
                          "px-2",
                          "py-0.5",
                          "text-[9px]",
                          "font-semibold",
                          statusClass(
                            lot.status
                          ),
                        ].join(" ")}
                      >
                        {lot.status.replace(
                          "_",
                          " "
                        )}
                      </span>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {snapshot.lots.map(
          lot => (
            <article
              key={lot.id}
              className="rounded-xl border border-slate-800 bg-[#071522] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {dateLabel(
                      lot.purchaseDate
                    )}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-700">
                    {lot.broker} ·{" "}
                    {lot.account}
                  </p>
                </div>

                <span
                  className={[
                    "rounded-full",
                    "border",
                    "px-2",
                    "py-0.5",
                    "text-[9px]",
                    "font-semibold",
                    statusClass(
                      lot.status
                    ),
                  ].join(" ")}
                >
                  {lot.status.replace(
                    "_",
                    " "
                  )}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-700">
                    Remaining
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {lot.remainingQuantity.toLocaleString(
                      "en-AU",
                      {
                        maximumFractionDigits:
                          4,
                      }
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-slate-700">
                    Purchase price
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {money(
                      lot.purchasePrice,
                      lot.currency,
                      4
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-700">
                    Current value
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {money(
                      lot.currentValue,
                      lot.currency
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-slate-700">
                    Return
                  </p>

                  <p
                    className={[
                      "mt-1",
                      "font-semibold",
                      lot.unrealisedGainLoss >=
                      0
                        ? "text-emerald-300"
                        : "text-rose-300",
                    ].join(" ")}
                  >
                    {percent(
                      lot.unrealisedGainLossPercent
                    )}
                  </p>
                </div>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}
