"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BellRing,
  Circle,
  Target,
} from "lucide-react";
import {
  createWatchlistSignals,
  WatchlistSignal,
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

function signalClasses(
  tone:
    WatchlistSignal["tone"]
) {
  if (
    tone === "POSITIVE"
  ) {
    return {
      wrapper:
        "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20",
      icon:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
      metric:
        "text-emerald-700 dark:text-emerald-300",
    };
  }

  if (
    tone === "NEGATIVE"
  ) {
    return {
      wrapper:
        "border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/20",
      icon:
        "bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300",
      metric:
        "text-red-700 dark:text-red-300",
    };
  }

  if (
    tone === "WARNING"
  ) {
    return {
      wrapper:
        "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20",
      icon:
        "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
      metric:
        "text-amber-700 dark:text-amber-300",
    };
  }

  return {
    wrapper:
      "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
    icon:
      "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    metric:
      "text-slate-700 dark:text-slate-300",
  };
}

function signalIcon(
  signal: WatchlistSignal
) {
  if (
    signal.type ===
      "TARGET_UPSIDE" ||
    signal.type ===
      "TARGET_DOWNSIDE" ||
    signal.type ===
      "ABOVE_TARGET"
  ) {
    return Target;
  }

  if (
    signal.type ===
      "DAILY_GAIN" ||
    signal.type ===
      "NEAR_52_WEEK_HIGH" ||
    signal.type ===
      "BUY_RATING"
  ) {
    return ArrowUp;
  }

  if (
    signal.type ===
      "DAILY_LOSS" ||
    signal.type ===
      "NEAR_52_WEEK_LOW" ||
    signal.type ===
      "SELL_RATING"
  ) {
    return ArrowDown;
  }

  if (
    signal.type ===
    "ACTIVE_ALERTS"
  ) {
    return BellRing;
  }

  if (
    signal.tone ===
    "WARNING"
  ) {
    return AlertTriangle;
  }

  return Circle;
}

export function WatchlistSignalsPanel({
  securities,
  onOpenSecurity,
}: Props) {
  const signals =
    createWatchlistSignals(
      securities
    );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Watchlist Intelligence
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
          Signals and opportunities
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Rules-based observations generated from saved watchlist data.
        </p>
      </div>

      {signals.length ===
      0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            No signals detected
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Add prices, targets, ratings and alerts to generate intelligence.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {signals
            .slice(0, 8)
            .map(
              (signal) => {
                const Icon =
                  signalIcon(
                    signal
                  );

                const classes =
                  signalClasses(
                    signal.tone
                  );

                const security =
                  securities.find(
                    (entry) =>
                      entry.id ===
                      signal.securityId
                  );

                return (
                  <button
                    key={
                      signal.id
                    }
                    type="button"
                    disabled={
                      !security
                    }
                    onClick={() => {
                      if (
                        security
                      ) {
                        onOpenSecurity(
                          security
                        );
                      }
                    }}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-default disabled:hover:translate-y-0 ${classes.wrapper}`}
                  >
                    <span
                      className={`rounded-xl p-2 ${classes.icon}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-950 dark:text-slate-50">
                          {signal.symbol}
                        </span>

                        <span className="truncate text-xs text-slate-500">
                          {signal.name}
                        </span>
                      </span>

                      <span className="mt-1 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {signal.title}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {signal.description}
                      </span>
                    </span>

                    <span
                      className={`shrink-0 text-xs font-bold ${classes.metric}`}
                    >
                      {
                        signal.metricLabel
                      }
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
