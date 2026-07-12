"use client";

import {
  ArrowDown,
  ArrowUp,
  Clock3,
  History,
  X,
} from "lucide-react";
import {
  historyForSecurity,
  WatchlistQuoteStore,
} from "@/lib/watchlist/watchlistQuotes";
import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  open: boolean;
  store: WatchlistQuoteStore;
  securities: WatchlistSecurity[];
  selectedSecurityId: string;
  onSelectedSecurityChange: (
    securityId: string
  ) => void;
  onClose: () => void;
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
      maximumFractionDigits: 4,
    }
  ).format(value);
}

export function WatchlistPriceHistoryPanel({
  open,
  store,
  securities,
  selectedSecurityId,
  onSelectedSecurityChange,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  const selectedSecurity =
    securities.find(
      (security) =>
        security.id ===
        selectedSecurityId
    ) ??
    securities[0] ??
    null;

  const points =
    selectedSecurity
      ? historyForSecurity(
          store,
          selectedSecurity.id
        )
      : [];

  return (
    <div className="fixed inset-0 z-[82]">
      <button
        type="button"
        aria-label="Close price history"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <History className="h-4 w-4" />

              <p className="text-xs font-semibold uppercase tracking-wide">
                Price History
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Watchlist quote snapshots
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review stored manual and delayed quote updates.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:border-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <select
            value={
              selectedSecurity?.id ??
              ""
            }
            onChange={(
              event
            ) =>
              onSelectedSecurityChange(
                event.target.value
              )
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            {securities.map(
              (security) => (
                <option
                  key={
                    security.id
                  }
                  value={
                    security.id
                  }
                >
                  {security.symbol} —{" "}
                  {security.name}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {!selectedSecurity ||
          points.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-14 text-center dark:border-slate-700">
              <Clock3 className="mx-auto h-7 w-7 text-slate-400" />

              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                No quote history yet
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Refresh prices or save a manual quote to create the first snapshot.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...points]
                .reverse()
                .map(
                  (
                    point,
                    index
                  ) => {
                    const previous =
                      [...points]
                        .reverse()[
                        index + 1
                      ];

                    const movement =
                      previous
                        ? point.price -
                          previous.price
                        : 0;

                    const positive =
                      movement > 0;

                    return (
                      <article
                        key={
                          point.id
                        }
                        className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-lg font-bold text-slate-950 dark:text-slate-50">
                              {formatCurrency(
                                point.price,
                                selectedSecurity.currency
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {new Date(
                                point.quotedAt
                              ).toLocaleString(
                                "en-AU"
                              )}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              point.changePercent >
                              0
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : point.changePercent <
                                    0
                                  ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
                            }`}
                          >
                            {point.changePercent >
                            0 ? (
                              <ArrowUp className="h-3.5 w-3.5" />
                            ) : point.changePercent <
                              0 ? (
                              <ArrowDown className="h-3.5 w-3.5" />
                            ) : null}

                            {point.changePercent >
                            0
                              ? "+"
                              : ""}
                            {point.changePercent.toFixed(
                              2
                            )}
                            %
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold dark:bg-slate-900">
                            {point.provider}
                          </span>

                          {previous && (
                            <span>
                              Movement from prior snapshot:{" "}
                              <strong
                                className={
                                  positive
                                    ? "text-emerald-600"
                                    : movement <
                                        0
                                      ? "text-red-600"
                                      : "text-slate-600"
                                }
                              >
                                {positive
                                  ? "+"
                                  : ""}
                                {formatCurrency(
                                  movement,
                                  selectedSecurity.currency
                                )}
                              </strong>
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
