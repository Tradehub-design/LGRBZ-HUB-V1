"use client";

import {
  ArrowDown,
  ArrowUp,
  Minus,
} from "lucide-react";
import {
  createWatchlistMovers,
} from "@/lib/watchlist/watchlistIntelligence";
import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  securities: WatchlistSecurity[];
  onOpenSecurity: (
    security: WatchlistSecurity
  ) => void;
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
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export function WatchlistMoversPanel({
  securities,
  onOpenSecurity,
}: Props) {
  const movers =
    createWatchlistMovers(
      securities
    ).all.slice(
      0,
      8
    );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Market Movement
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
          Today's watchlist movers
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Ranked by the latest recorded daily percentage change.
        </p>
      </div>

      {movers.length ===
      0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500 dark:border-slate-700">
          No movement data is available.
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          {movers.map(
            (mover) => {
              const positive =
                mover.changePercent >
                0;

              const negative =
                mover.changePercent <
                0;

              const Icon =
                positive
                  ? ArrowUp
                  : negative
                    ? ArrowDown
                    : Minus;

              const security =
                securities.find(
                  (entry) =>
                    entry.id ===
                    mover.securityId
                );

              return (
                <button
                  key={
                    mover.securityId
                  }
                  type="button"
                  onClick={() => {
                    if (
                      security
                    ) {
                      onOpenSecurity(
                        security
                      );
                    }
                  }}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 dark:border-slate-900 dark:hover:bg-slate-900/70"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-950 dark:text-slate-50">
                      {mover.symbol}
                    </span>

                    <span className="block truncate text-xs text-slate-500">
                      {mover.name}
                    </span>
                  </span>

                  <span className="text-right">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(
                        mover.price,
                        mover.currency
                      )}
                    </span>

                    <span className="block text-[11px] text-slate-500">
                      {mover.sector}
                    </span>
                  </span>

                  <span
                    className={`inline-flex min-w-[78px] items-center justify-end gap-1 text-sm font-bold ${
                      positive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : negative
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-500"
                    }`}
                  >
                    <Icon className="h-4 w-4" />

                    {positive
                      ? "+"
                      : ""}
                    {mover.changePercent.toFixed(
                      2
                    )}
                    %
                  </span>
                </button>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}
