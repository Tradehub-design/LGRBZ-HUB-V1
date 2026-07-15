"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type HoldingsTablePaginationProps = {
  page: number;
  totalPages: number;

  pageSize: number;

  startIndex: number;
  endIndex: number;
  filteredRows: number;

  onPageChange:
    (
      page: number
    ) => void;

  onPageSizeChange:
    (
      pageSize: number
    ) => void;
};

export function HoldingsTablePagination({
  page,
  totalPages,
  pageSize,
  startIndex,
  endIndex,
  filteredRows,
  onPageChange,
  onPageSizeChange,
}: HoldingsTablePaginationProps) {
  return (
    <footer className="flex flex-col gap-3 border-t border-slate-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>
          Showing{" "}
          <strong className="text-slate-300">
            {startIndex}
          </strong>
          –
          <strong className="text-slate-300">
            {endIndex}
          </strong>{" "}
          of{" "}
          <strong className="text-slate-300">
            {filteredRows}
          </strong>
        </span>

        <label className="inline-flex items-center gap-2">
          Rows

          <select
            value={pageSize}
            onChange={event => {
              onPageSizeChange(
                Number(
                  event.target.value
                )
              );
            }}
            className="rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-xs text-slate-300 outline-none"
          >
            {[
              10,
              20,
              50,
              100,
            ].map(
              size => (
                <option
                  key={size}
                  value={size}
                >
                  {size}
                </option>
              )
            )}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => {
            onPageChange(
              1
            );
          }}
          aria-label="First page"
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => {
            onPageChange(
              page -
              1
            );
          }}
          aria-label="Previous page"
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="min-w-24 text-center text-xs text-slate-500">
          Page{" "}
          <strong className="text-white">
            {page}
          </strong>{" "}
          of{" "}
          <strong className="text-white">
            {totalPages}
          </strong>
        </span>

        <button
          type="button"
          disabled={
            page >=
            totalPages
          }
          onClick={() => {
            onPageChange(
              page +
              1
            );
          }}
          aria-label="Next page"
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          disabled={
            page >=
            totalPages
          }
          onClick={() => {
            onPageChange(
              totalPages
            );
          }}
          aria-label="Last page"
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
