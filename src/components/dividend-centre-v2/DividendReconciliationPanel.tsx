"use client";

import {
  CircleCheck,
  CircleDashed,
  Receipt,
} from "lucide-react";
import type {
  DividendReconciliationSummary,
} from "./dividendCentreTypes";
import {
  formatDividendMoney,
} from "./dividendCentreFormatters";

type Props = {
  reconciliation:
    DividendReconciliationSummary;
  currency: string;
};

export function DividendReconciliationPanel({
  reconciliation,
  currency,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Reconciliation
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
            Forecast vs Received
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Tracks announced income against dividend transactions recorded in the ledger.
          </p>
        </div>

        <span className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <Receipt className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/20">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            Announced
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-950 dark:text-blue-100">
            {formatDividendMoney(
              reconciliation.announcedAmount,
              currency
            )}
          </p>
        </article>

        <article className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Received
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-950 dark:text-emerald-100">
            {formatDividendMoney(
              reconciliation.receivedAmount,
              currency
            )}
          </p>
        </article>

        <article className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/20">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            Forecast
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-950 dark:text-amber-100">
            {formatDividendMoney(
              reconciliation.forecastAmount,
              currency
            )}
          </p>
        </article>

        <article className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Outstanding
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-50">
            {formatDividendMoney(
              reconciliation.outstandingAmount,
              currency
            )}
          </p>
        </article>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-xs dark:border-slate-800">
          <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <CircleCheck className="h-4 w-4 text-emerald-500" />
            Matched ledger receipts
          </span>

          <strong>
            {reconciliation.matchedEventCount}
          </strong>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-xs dark:border-slate-800">
          <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <CircleDashed className="h-4 w-4 text-amber-500" />
            Unmatched receipts
          </span>

          <strong>
            {reconciliation.unmatchedReceivedCount}
          </strong>
        </div>
      </div>
    </section>
  );
}
