"use client";

import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import {
  WatchlistGroup,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  open: boolean;
  group: WatchlistGroup | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function WatchlistGroupDeleteDialog({
  open,
  group,
  onCancel,
  onConfirm,
}: Props) {
  if (
    !open ||
    !group
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[85]">
      <button
        type="button"
        aria-label="Cancel deleting watchlist"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-red-200 bg-white p-5 shadow-2xl dark:border-red-900 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-red-100 p-2 text-red-700 dark:bg-red-950 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
                Delete {group.name}?
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Securities remain available in other watchlists. This only removes the selected watchlist group.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:border-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            {group.securityIds.length} securities
          </p>

          <p className="mt-1 text-xs text-slate-500">
            The securities themselves will not be deleted.
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
