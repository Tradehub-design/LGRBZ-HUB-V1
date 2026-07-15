"use client";

import {
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  History,
  RefreshCw,
  Sparkles,
  WalletCards,
} from "lucide-react";

export function DividendCentreLoadingState() {
  return (
    <div className="mx-auto w-full max-w-[1800px] space-y-4 px-3 pb-12 sm:px-4 lg:px-6 xl:px-8">
      <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative p-6">
          <div className="h-7 w-56 animate-pulse rounded-full bg-white/10" />

          <div className="mt-5 h-10 w-72 max-w-full animate-pulse rounded bg-white/10" />

          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-white/10" />

          <div className="mt-2 h-4 w-4/5 max-w-lg animate-pulse rounded bg-white/10" />

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.06]"
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({
          length: 6,
        }).map(
          (
            _,
            index
          ) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
            />
          )
        )}
      </div>

      <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
        <div className="h-[520px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />

        <div className="h-[520px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="h-24 animate-pulse bg-slate-100 dark:bg-slate-900" />

        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (
              _,
              index
            ) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900"
              />
            )
          )}
        </div>

        <div className="grid gap-4 p-4 pt-0 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />

          <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>
    </div>
  );
}

type ErrorProps = {
  message: string;
  onRetry?: () => void;
};

export function DividendCentreErrorState({
  message,
  onRetry,
}: ErrorProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16">
      <div className="overflow-hidden rounded-[28px] border border-red-200 bg-white shadow-sm dark:border-red-900 dark:bg-slate-950">
        <div className="border-b border-red-100 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20 sm:p-8">
          <span className="inline-flex rounded-2xl bg-red-100 p-3 text-red-700 dark:bg-red-950/50 dark:text-red-300">
            <AlertTriangle className="h-7 w-7" />
          </span>

          <h2 className="mt-5 text-2xl font-bold text-red-950 dark:text-red-100">
            Dividend Centre could not load
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-red-700 dark:text-red-300">
            {message}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="text-sm font-bold text-slate-950 dark:text-slate-50">
            Your portfolio data is not deleted
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This message means the Dividend Centre could not process the current request. Historical transactions and holdings remain stored in the portfolio ledger.
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={
                onRetry
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Dividend Centre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DividendCentreEmptyState() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="overflow-hidden rounded-[28px] border border-dashed border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="bg-slate-950 p-6 text-white sm:p-8">
          <span className="inline-flex rounded-2xl border border-white/10 bg-white/[0.08] p-3 text-emerald-300">
            <CircleDollarSign className="h-8 w-8" />
          </span>

          <h2 className="mt-5 text-2xl font-bold">
            No dividend data is available yet
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            The Dividend Centre checks both your historical transaction ledger and your current holdings. It remains empty only when neither source contains usable dividend information.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <History className="h-5 w-5 text-sky-600 dark:text-sky-400" />

            <h3 className="mt-3 text-sm font-bold text-slate-950 dark:text-slate-50">
              Historical Receipts
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Transactions marked Cash Dividend or Distribution should appear as received income.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <WalletCards className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

            <h3 className="mt-3 text-sm font-bold text-slate-950 dark:text-slate-50">
              Current Holdings
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Open dividend-paying holdings allow the system to request announced and future events.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:col-span-2 lg:col-span-1">
            <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />

            <h3 className="mt-3 text-sm font-bold text-slate-950 dark:text-slate-50">
              Forecast Events
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Forecast dates appear when confirmed provider events are unavailable but sufficient holding data exists.
            </p>
          </article>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />

            Add or import transactions and holdings through the Transactions Centre before refreshing this page.
          </div>
        </div>
      </div>
    </div>
  );
}
