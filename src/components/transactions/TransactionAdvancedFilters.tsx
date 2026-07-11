"use client";

import {
  CalendarDays,
  Check,
  Filter,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import {
  TransactionFilterState,
  TransactionType,
} from "@/lib/transactions/professionalTransactions";
import { countActiveTransactionFilters } from "@/lib/transactions/transactionPreferences";

type Props = {
  open: boolean;
  filters: TransactionFilterState;
  symbols: string[];
  onClose: () => void;
  onFiltersChange: (filters: TransactionFilterState) => void;
  onReset: () => void;
};

const transactionTypes: Array<"ALL" | TransactionType> = [
  "ALL",
  "BUY",
  "SELL",
  "DIVIDEND",
  "TRANSFER",
  "FEE",
  "OTHER",
];

export function TransactionAdvancedFilters({
  open,
  filters,
  symbols,
  onClose,
  onFiltersChange,
  onReset,
}: Props) {
  if (!open) return null;

  const activeCount = countActiveTransactionFilters(filters);

  const update = (patch: Partial<TransactionFilterState>) => {
    onFiltersChange({
      ...filters,
      ...patch,
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close advanced transaction filters"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Advanced Filters
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Refine transaction results
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {activeCount} active filter{activeCount === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto px-5 py-5">
          <div className="space-y-5">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search
              </span>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={filters.search}
                  onChange={(event) =>
                    update({ search: event.target.value })
                  }
                  placeholder="Symbol, company, broker or notes"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Transaction Type
              </span>

              <select
                value={filters.type}
                onChange={(event) =>
                  update({
                    type: event.target.value as
                      | "ALL"
                      | TransactionType,
                  })
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "ALL" ? "All transaction types" : type}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Symbol
              </span>

              <select
                value={filters.symbol}
                onChange={(event) =>
                  update({ symbol: event.target.value })
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="ALL">All symbols</option>
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date Range
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-500">From</span>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(event) =>
                      update({ dateFrom: event.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs text-slate-500">To</span>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(event) =>
                      update({ dateTo: event.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Current filter summary
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {activeCount === 0 ? (
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm dark:bg-slate-950">
                    No active filters
                  </span>
                ) : (
                  <>
                    {filters.search && (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                        Search: {filters.search}
                      </span>
                    )}

                    {filters.type !== "ALL" && (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                        Type: {filters.type}
                      </span>
                    )}

                    {filters.symbol !== "ALL" && (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                        Symbol: {filters.symbol}
                      </span>
                    )}

                    {filters.dateFrom && (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                        From: {filters.dateFrom}
                      </span>
                    )}

                    {filters.dateTo && (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                        To: {filters.dateTo}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            <Check className="h-4 w-4" />
            Apply Filters
          </button>
        </footer>
      </aside>
    </div>
  );
}
