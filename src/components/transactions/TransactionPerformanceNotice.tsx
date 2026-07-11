"use client";

import {
  Gauge,
  Zap,
} from "lucide-react";

type Props = {
  transactionCount: number;
  filteredCount: number;
};

export function TransactionPerformanceNotice({
  transactionCount,
  filteredCount,
}: Props) {
  if (transactionCount < 1000) {
    return null;
  }

  const veryLarge =
    transactionCount >= 10000;

  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/30">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {veryLarge ? (
            <Gauge className="h-4 w-4" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
        </span>

        <div>
          <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">
            Large ledger performance mode
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300">
            {transactionCount.toLocaleString(
              "en-AU"
            )}{" "}
            transactions are loaded and{" "}
            {filteredCount.toLocaleString(
              "en-AU"
            )}{" "}
            currently match the selected view. Pagination and deferred filtering keep the workspace responsive.
          </p>
        </div>
      </div>
    </section>
  );
}
