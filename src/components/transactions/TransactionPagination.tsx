"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  start: number;
  end: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function TransactionPagination({
  page,
  pageSize,
  totalRows,
  totalPages,
  start,
  end,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <p className="text-slate-500">
        Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{totalRows ? start + 1 : 0}</span> to{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{end}</span> of{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{totalRows}</span>
      </p>

      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        <span className="min-w-24 text-center text-sm text-slate-600 dark:text-slate-300">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
