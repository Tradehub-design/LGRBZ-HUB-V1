"use client";

import {
  AlertTriangle,
  CircleDollarSign,
  RefreshCw,
} from "lucide-react";

export function DividendCentreLoadingState() {
  return (
    <div className="mx-auto w-full max-w-[1800px] space-y-4 px-3 pb-12 sm:px-4 lg:px-6 xl:px-8">
      <div className="h-40 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-900" />

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
              className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900"
            />
          )
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
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
    <div className="mx-auto w-full max-w-3xl px-4 py-20">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20">
        <AlertTriangle className="mx-auto h-9 w-9 text-red-600 dark:text-red-400" />

        <h2 className="mt-4 text-xl font-bold text-red-950 dark:text-red-100">
          Dividend Centre could not load
        </h2>

        <p className="mt-2 text-sm text-red-700 dark:text-red-300">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={
              onRetry
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function DividendCentreEmptyState() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-20">
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-950">
        <CircleDollarSign className="mx-auto h-10 w-10 text-slate-400" />

        <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-slate-50">
          No dividend holdings available
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Add portfolio holdings or import transactions before requesting dividend forecasts.
        </p>
      </div>
    </div>
  );
}
