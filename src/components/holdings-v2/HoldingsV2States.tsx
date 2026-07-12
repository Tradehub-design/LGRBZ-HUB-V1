"use client";

import {
  AlertTriangle,
  Inbox,
  Plus,
  RefreshCw,
  WalletCards,
} from "lucide-react";

export function HoldingsV2LoadingState() {
  return (
    <div className="space-y-4">
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
              key={
                index
              }
              className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900"
            />
          )
        )}
      </div>

      <div className="h-96 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-900" />
    </div>
  );
}

type EmptyProps = {
  filtered?: boolean;
  onReset?: () => void;
  onAdd?: () => void;
};

export function HoldingsV2EmptyState({
  filtered = false,
  onReset,
  onAdd,
}: EmptyProps) {
  return (
    <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950">
      {filtered ? (
        <Inbox className="mx-auto h-9 w-9 text-slate-400" />
      ) : (
        <WalletCards className="mx-auto h-9 w-9 text-slate-400" />
      )}

      <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">
        {filtered
          ? "No holdings match these filters"
          : "No holdings available"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? "Adjust the current search or filters to display more positions."
          : "Add or import portfolio transactions to create your current holdings."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {filtered &&
          onReset && (
            <button
              type="button"
              onClick={
                onReset
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Filters
            </button>
          )}

        {onAdd && (
          <button
            type="button"
            onClick={
              onAdd
            }
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        )}
      </div>
    </section>
  );
}

type ErrorProps = {
  message?: string | null;
  onRetry?: () => void;
};

export function HoldingsV2ErrorState({
  message,
  onRetry,
}: ErrorProps) {
  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/20">
      <AlertTriangle className="mx-auto h-9 w-9 text-red-500" />

      <h2 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-200">
        Holdings could not be loaded
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-700 dark:text-red-300">
        {message ||
          "The Holdings source returned an error."}
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
    </section>
  );
}
