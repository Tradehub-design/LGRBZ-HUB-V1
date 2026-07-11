"use client";

import {
  Bookmark,
  Columns3,
  Download,
  Filter,
  History,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  TransactionFilterState,
  TransactionType,
} from "@/lib/transactions/professionalTransactions";
import {
  areTransactionFiltersActive,
  countActiveTransactionFilters,
} from "@/lib/transactions/transactionPreferences";
import { TransactionDensity } from "@/lib/transactions/transactionTablePreferences";

type Props = {
  filters: TransactionFilterState;
  symbols: string[];
  selectedCount: number;
  density: TransactionDensity;
  operationCount?: number;
  onFiltersChange: (
    filters: TransactionFilterState
  ) => void;
  onExportCsv: () => void;
  onClearSelection?: () => void;
  onOpenAdvancedFilters?: () => void;
  onOpenPresets?: () => void;
  onOpenViewSettings?: () => void;
  onOpenHistory?: () => void;
  onResetFilters?: () => void;
};

const types: Array<"ALL" | TransactionType> = [
  "ALL",
  "BUY",
  "SELL",
  "DIVIDEND",
  "TRANSFER",
  "FEE",
  "OTHER",
];

export function TransactionToolbar({
  filters,
  symbols,
  selectedCount,
  density,
  operationCount = 0,
  onFiltersChange,
  onExportCsv,
  onClearSelection,
  onOpenAdvancedFilters,
  onOpenPresets,
  onOpenViewSettings,
  onOpenHistory,
  onResetFilters,
}: Props) {
  const update = (
    patch: Partial<TransactionFilterState>
  ) => {
    onFiltersChange({
      ...filters,
      ...patch,
    });
  };

  const activeCount =
    countActiveTransactionFilters(filters);
  const hasActiveFilters =
    areTransactionFiltersActive(filters);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />

            <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Transaction Controls
            </h2>

            {activeCount > 0 && (
              <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
                {activeCount} active
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {density}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Search, filter, save views, customise columns and export.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <History className="h-4 w-4" />
            History
            {operationCount > 0 && (
              <span className="rounded-full bg-slate-950 px-1.5 py-0.5 text-[10px] text-white dark:bg-slate-100 dark:text-slate-950">
                {operationCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenPresets}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Bookmark className="h-4 w-4" />
            Saved Views
          </button>

          <button
            type="button"
            onClick={onOpenAdvancedFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Filter className="h-4 w-4" />
            Advanced
          </button>

          <button
            type="button"
            onClick={onOpenViewSettings}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Columns3 className="h-4 w-4" />
            Columns
          </button>

          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onClearSelection}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Clear {selectedCount} selected
            </button>
          )}

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <label className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={filters.search}
            onChange={(event) =>
              update({
                search: event.target.value,
              })
            }
            placeholder="Search symbol, company, broker or notes..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>

        <select
          value={filters.type}
          onChange={(event) =>
            update({
              type: event.target.value as
                | "ALL"
                | TransactionType,
            })
          }
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type === "ALL"
                ? "All Types"
                : type}
            </option>
          ))}
        </select>

        <select
          value={filters.symbol}
          onChange={(event) =>
            update({
              symbol: event.target.value,
            })
          }
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="ALL">
            All Symbols
          </option>

          {symbols.map((symbol) => (
            <option
              key={symbol}
              value={symbol}
            >
              {symbol}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) =>
              update({
                dateFrom: event.target.value,
              })
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />

          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) =>
              update({
                dateTo: event.target.value,
              })
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>
    </section>
  );
}
