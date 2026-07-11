"use client";

import {
  FileSpreadsheet,
  FilterX,
  Plus,
  RotateCcw,
  SearchX,
} from "lucide-react";

type Props = {
  filtered?: boolean;
  search?: string;
  onResetFilters?: () => void;
  onAddTransaction?: () => void;
};

export function TransactionEmptyState({
  filtered = false,
  search = "",
  onResetFilters,
  onAddTransaction,
}: Props) {
  const Icon = search
    ? SearchX
    : filtered
      ? FilterX
      : FileSpreadsheet;

  const title = search
    ? `No results for “${search}”`
    : filtered
      ? "No transactions match these filters"
      : "No transactions yet";

  const message = search
    ? "Try a different symbol, company, broker or note."
    : filtered
      ? "Reset the filters or broaden the selected date range."
      : "Transactions will appear here after importing your master workbook or adding a transaction manually.";

  return (
    <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <Icon className="h-7 w-7" />
      </span>

      <h2 className="mt-5 text-lg font-semibold text-slate-950 dark:text-slate-50">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        {message}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        {filtered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </button>
        )}

        {!filtered && (
          <button
            type="button"
            onClick={onAddTransaction}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        )}
      </div>
    </section>
  );
}
