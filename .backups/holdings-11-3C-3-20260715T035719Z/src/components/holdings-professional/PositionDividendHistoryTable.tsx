"use client";

import {
  CircleDollarSign,
} from "lucide-react";
import type {
  PositionDividendEvent,
} from "@/lib/holdings-professional/positionDividendModels";

type PositionDividendHistoryTableProps = {
  events:
    PositionDividendEvent[];
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

export function PositionDividendHistoryTable({
  events,
}: PositionDividendHistoryTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/35">
      <header className="flex items-start gap-3 border-b border-slate-800 p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <CircleDollarSign className="h-5 w-5" />
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
            Payment History
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Historical dividends
          </h2>
        </div>
      </header>

      <div className="hidden max-h-[520px] overflow-auto lg:block">
        <table className="w-full min-w-[1000px]">
          <thead className="sticky top-0 z-10 bg-[#071522]/95 backdrop-blur-xl">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Payment date
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Ex-dividend
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Quantity
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Per share
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Gross
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Tax withheld
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Franking credits
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Net income
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map(
              event => (
                <tr
                  key={event.id}
                  className="border-b border-slate-800/80 transition hover:bg-slate-900/40"
                >
                  <td className="px-4 py-4 font-semibold text-white">
                    {dateLabel(
                      event.paymentDate
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-400">
                    {dateLabel(
                      event.exDividendDate
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-slate-300">
                    {event.quantity.toLocaleString(
                      "en-AU",
                      {
                        maximumFractionDigits:
                          4,
                      }
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-slate-300">
                    {money(
                      event.amountPerShare,
                      event.currency
                    )}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-white">
                    {money(
                      event.grossAmount,
                      event.currency
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-rose-300">
                    {money(
                      event.withholdingTax,
                      event.currency
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-amber-300">
                    {money(
                      event.frankingCredit,
                      event.currency
                    )}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-emerald-200">
                    {money(
                      event.netAmount,
                      event.currency
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {events.map(
          event => (
            <article
              key={event.id}
              className="rounded-xl border border-slate-800 bg-[#071522] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {dateLabel(
                      event.paymentDate
                    )}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-700">
                    Ex-dividend{" "}
                    {dateLabel(
                      event.exDividendDate
                    )}
                  </p>
                </div>

                <p className="font-semibold text-emerald-200">
                  {money(
                    event.netAmount,
                    event.currency
                  )}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-700">
                    Quantity
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {event.quantity.toLocaleString(
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
                    Per share
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {money(
                      event.amountPerShare,
                      event.currency
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-700">
                    Gross
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {money(
                      event.grossAmount,
                      event.currency
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-slate-700">
                    Franking
                  </p>

                  <p className="mt-1 text-sm font-semibold text-amber-300">
                    {money(
                      event.frankingCredit,
                      event.currency
                    )}
                  </p>
                </div>
              </div>
            </article>
          )
        )}

        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
            <p className="text-sm text-slate-500">
              Historical dividends will appear after payments are recorded.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
