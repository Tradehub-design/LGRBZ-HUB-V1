"use client";

import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function TransactionErrorState({
  title = "Transactions could not be loaded",
  message = "The ledger could not be read. Your stored transactions have not been changed.",
  onRetry,
}: Props) {
  return (
    <section
      className="rounded-3xl border border-red-200 bg-red-50 px-6 py-14 text-center dark:border-red-900 dark:bg-red-950/30"
      role="alert"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
        <AlertTriangle className="h-7 w-7" />
      </span>

      <h2 className="mt-5 text-lg font-semibold text-red-950 dark:text-red-100">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-700 dark:text-red-300">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </section>
  );
}
