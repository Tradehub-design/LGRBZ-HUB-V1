"use client";

import {
  Bookmark,
  FileSpreadsheet,
  Keyboard,
  MousePointer2,
} from "lucide-react";

type Props = {
  selectedCount: number;
  onOpenSavedViews: () => void;
  onOpenCsvTools: () => void;
  onSelectAll: () => void;
};

export function WatchlistProductivityToolbar({
  selectedCount,
  onOpenSavedViews,
  onOpenCsvTools,
  onSelectAll,
}: Props) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Keyboard className="h-4 w-4" />

        <span>
          Shortcuts:{" "}
          <strong>
            Ctrl/Cmd + A
          </strong>{" "}
          select visible,{" "}
          <strong>
            Esc
          </strong>{" "}
          clear selection
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={
            onSelectAll
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <MousePointer2 className="h-4 w-4" />
          Select Visible
          {selectedCount >
            0 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-900">
              {selectedCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={
            onOpenSavedViews
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <Bookmark className="h-4 w-4" />
          Saved Views
        </button>

        <button
          type="button"
          onClick={
            onOpenCsvTools
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <FileSpreadsheet className="h-4 w-4" />
          CSV Tools
        </button>
      </div>
    </section>
  );
}
