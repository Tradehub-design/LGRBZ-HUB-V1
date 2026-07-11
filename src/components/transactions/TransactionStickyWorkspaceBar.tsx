"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  ChevronUp,
  Download,
  Filter,
  Keyboard,
  Rows3,
  Search,
  Settings2,
  X,
} from "lucide-react";
import { TransactionDensity } from "@/lib/transactions/transactionTablePreferences";

type Props = {
  visible: boolean;
  filteredCount: number;
  totalCount: number;
  selectedCount: number;
  page: number;
  totalPages: number;
  density: TransactionDensity;
  onFocusSearch: () => void;
  onOpenAdvancedFilters: () => void;
  onOpenViewSettings: () => void;
  onExport: () => void;
  onClearSelection: () => void;
  onSelectVisible: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onScrollTop: () => void;
  onOpenShortcuts: () => void;
};

export function TransactionStickyWorkspaceBar({
  visible,
  filteredCount,
  totalCount,
  selectedCount,
  page,
  totalPages,
  density,
  onFocusSearch,
  onOpenAdvancedFilters,
  onOpenViewSettings,
  onExport,
  onClearSelection,
  onSelectVisible,
  onPreviousPage,
  onNextPage,
  onScrollTop,
  onOpenShortcuts,
}: Props) {
  return (
    <div
      className={`fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 transition-all duration-200 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="rounded-2xl border border-slate-700 bg-slate-950/95 p-2 text-white shadow-2xl backdrop-blur-xl dark:border-slate-300 dark:bg-slate-100/95 dark:text-slate-950">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="rounded-xl bg-white/10 px-3 py-2 dark:bg-slate-950/10">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-300 dark:text-slate-600">
                Results
              </p>
              <p className="text-sm font-semibold">
                {filteredCount.toLocaleString("en-AU")} /{" "}
                {totalCount.toLocaleString("en-AU")}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-3 py-2 dark:bg-slate-950/10">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-300 dark:text-slate-600">
                Page
              </p>
              <p className="text-sm font-semibold">
                {page} / {totalPages}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-3 py-2 dark:bg-slate-950/10">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-300 dark:text-slate-600">
                Density
              </p>
              <p className="text-sm font-semibold capitalize">{density}</p>
            </div>

            {selectedCount > 0 && (
              <div className="rounded-xl bg-blue-500 px-3 py-2 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">
                  Selected
                </p>
                <p className="text-sm font-semibold">
                  {selectedCount.toLocaleString("en-AU")}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={onFocusSearch}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-xs font-semibold hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Focus search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              type="button"
              onClick={onOpenAdvancedFilters}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-xs font-semibold hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Open advanced filters"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <button
              type="button"
              onClick={onOpenViewSettings}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-xs font-semibold hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Open table view settings"
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </button>

            <button
              type="button"
              onClick={onSelectVisible}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-xs font-semibold hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Select current page"
            >
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Select Page</span>
            </button>

            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-xs font-semibold hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Export filtered transactions"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              type="button"
              onClick={onPreviousPage}
              disabled={page <= 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onNextPage}
              disabled={page >= totalPages}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onOpenShortcuts}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Keyboard shortcuts"
            >
              <Keyboard className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onScrollTop}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
              title="Scroll to top"
            >
              <ChevronUp className="h-4 w-4" />
            </button>

            {selectedCount > 0 && (
              <button
                type="button"
                onClick={onClearSelection}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <span className="hidden items-center gap-1 rounded-xl bg-white/10 px-2 py-2 text-[10px] font-semibold text-slate-300 dark:bg-slate-950/10 dark:text-slate-600 lg:inline-flex">
              <Rows3 className="h-3.5 w-3.5" />
              J / K navigate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
