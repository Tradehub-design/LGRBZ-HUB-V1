"use client";

import { Download, Tags, Trash2, X } from "lucide-react";

type Props = {
  selectedCount: number;
  onClear: () => void;
  onExportSelected: () => void;
  onBulkDelete: () => void;
  onBulkTag?: () => void;
};

export function TransactionBulkActionBar({
  selectedCount,
  onClear,
  onExportSelected,
  onBulkDelete,
  onBulkTag,
}: Props) {
  if (selectedCount <= 0) return null;

  return (
    <div className="sticky top-3 z-20 rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-white shadow-xl dark:border-slate-700 dark:bg-slate-100 dark:text-slate-950">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">
            {selectedCount.toLocaleString("en-AU")} transaction
            {selectedCount === 1 ? "" : "s"} selected
          </p>
          <p className="text-xs text-slate-300 dark:text-slate-600">
            Bulk actions apply only to selected rows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExportSelected}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
          >
            <Download className="h-4 w-4" />
            Export Selected
          </button>

          <button
            type="button"
            onClick={onBulkTag}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
          >
            <Tags className="h-4 w-4" />
            Tag
          </button>

          <button
            type="button"
            onClick={onBulkDelete}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15 dark:bg-slate-950/10 dark:hover:bg-slate-950/15"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
