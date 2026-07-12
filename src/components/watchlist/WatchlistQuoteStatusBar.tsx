"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Database,
  History,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  marketSessionLabel,
  quoteStoreSummary,
  WatchlistQuoteProvider,
  WatchlistQuoteStore,
} from "@/lib/watchlist/watchlistQuotes";
import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  store: WatchlistQuoteStore;
  securities: WatchlistSecurity[];
  refreshing: boolean;
  error: string | null;
  onRefresh: (
    provider:
      WatchlistQuoteProvider
  ) => void;
  onProviderChange: (
    provider:
      WatchlistQuoteProvider
  ) => void;
  onOpenHistory: () => void;
};

function formatDateTime(
  value: string | null
) {
  if (!value) {
    return "Never";
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

  return date.toLocaleString(
    "en-AU",
    {
      dateStyle:
        "medium",
      timeStyle:
        "short",
    }
  );
}

export function WatchlistQuoteStatusBar({
  store,
  securities,
  refreshing,
  error,
  onRefresh,
  onProviderChange,
  onOpenHistory,
}: Props) {
  const summary =
    quoteStoreSummary(
      store,
      securities
    );

  const openMarkets =
    securities.filter(
      (security) =>
        marketSessionLabel(
          store.quotes[
            security.id
          ]?.marketSession ??
            "UNKNOWN"
        ) ===
        "Market open"
    ).length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {store.provider ===
              "LIVE_ADAPTER" ? (
                <Wifi className="h-3.5 w-3.5" />
              ) : (
                <Database className="h-3.5 w-3.5" />
              )}

              {store.provider ===
              "MANUAL"
                ? "Manual quotes"
                : store.provider ===
                    "DELAYED"
                  ? "Delayed adapter"
                  : "Live adapter"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {summary.live +
                summary.fresh}{" "}
              fresh
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <Clock3 className="h-3.5 w-3.5" />
              {summary.delayed}{" "}
              delayed
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300">
              <WifiOff className="h-3.5 w-3.5" />
              {summary.stale +
                summary.unavailable}{" "}
              stale
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Last successful refresh:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatDateTime(
                store.lastSuccessfulRefreshAt
              )}
            </span>
            {" · "}
            {openMarkets} market
            {openMarkets === 1
              ? ""
              : "s"}{" "}
            currently open
          </p>

          {error && (
            <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={
              store.provider
            }
            onChange={(
              event
            ) =>
              onProviderChange(
                event.target
                  .value as WatchlistQuoteProvider
              )
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <option value="MANUAL">
              Manual quotes
            </option>

            <option value="DELAYED">
              Delayed adapter
            </option>
          </select>

          <button
            type="button"
            onClick={
              onOpenHistory
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <History className="h-4 w-4" />
            Price History
          </button>

          <button
            type="button"
            disabled={
              refreshing
            }
            onClick={() =>
              onRefresh(
                store.provider
              )
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            {refreshing
              ? "Refreshing"
              : "Refresh Prices"}
          </button>
        </div>
      </div>
    </section>
  );
}
