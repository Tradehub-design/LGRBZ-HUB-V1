"use client";

import {
  Database,
  Filter,
  Search,
} from "lucide-react";

type Props = {
  filteredCount: number;
  totalCount: number;
  search?: string;
  activeFilterCount?: number;
};

export function TransactionResultStatus({
  filteredCount,
  totalCount,
  search = "",
  activeFilterCount = 0,
}: Props) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Database className="h-4 w-4" />

          <span>
            <strong className="text-slate-900 dark:text-slate-100">
              {filteredCount.toLocaleString(
                "en-AU"
              )}
            </strong>{" "}
            of{" "}
            {totalCount.toLocaleString(
              "en-AU"
            )}{" "}
            transactions
          </span>
        </div>

        {search && (
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <Search className="h-3.5 w-3.5" />
            “{search}”
          </div>
        )}

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <Filter className="h-3.5 w-3.5" />
            {activeFilterCount} filter
            {activeFilterCount === 1
              ? ""
              : "s"}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Results update automatically
      </p>
    </section>
  );
}
