"use client";

import {
  ArrowRightLeft,
  Download,
  Tags,
  Trash2,
  X,
} from "lucide-react";

type Props = {
  selectedCount: number;
  onClear: () => void;
  onTransfer: () => void;
  onTag: () => void;
  onExport: () => void;
  onDelete: () => void;
};

export function WatchlistBulkActionBar({
  selectedCount,
  onClear,
  onTransfer,
  onTag,
  onExport,
  onDelete,
}: Props) {
  if (
    selectedCount ===
    0
  ) {
    return null;
  }

  return (
    <div className="sticky top-20 z-40 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-950">
            {selectedCount}
          </span>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Securit
              {selectedCount ===
              1
                ? "y"
                : "ies"}{" "}
              selected
            </p>

            <p className="text-xs text-slate-500">
              Apply an action to the selected rows.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={
              onTransfer
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Move / Copy
          </button>

          <button
            type="button"
            onClick={
              onTag
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Tags className="h-4 w-4" />
            Tag
          </button>

          <button
            type="button"
            onClick={
              onExport
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            type="button"
            onClick={
              onDelete
            }
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <button
            type="button"
            onClick={
              onClear
            }
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            title="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
