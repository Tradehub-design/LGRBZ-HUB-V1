"use client";

import {
  Tags,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  WatchlistBulkTagDraft,
} from "@/lib/watchlist/watchlistBulkActions";

type Props = {
  open: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (
    draft: WatchlistBulkTagDraft
  ) => void;
};

export function WatchlistBulkTagDialog({
  open,
  selectedCount,
  onClose,
  onConfirm,
}: Props) {
  const [
    draft,
    setDraft,
  ] =
    useState<WatchlistBulkTagDraft>({
      action: "ADD",
      tag: "",
    });

  useEffect(() => {
    if (open) {
      setDraft({
        action: "ADD",
        tag: "",
      });
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95]">
      <button
        type="button"
        aria-label="Close bulk tag editor"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <Tags className="h-5 w-5" />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Bulk Tagging
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                Update {selectedCount} securit
                {selectedCount ===
                1
                  ? "y"
                  : "ies"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:border-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Action
            </span>

            <select
              value={
                draft.action
              }
              onChange={(
                event
              ) =>
                setDraft(
                  (current) => ({
                    ...current,
                    action:
                      event.target
                        .value as WatchlistBulkTagDraft["action"],
                  })
                )
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="ADD">
                Add tag
              </option>

              <option value="REMOVE">
                Remove tag
              </option>

              <option value="REPLACE">
                Replace all tags
              </option>
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tag
            </span>

            <input
              value={
                draft.tag
              }
              onChange={(
                event
              ) =>
                setDraft(
                  (current) => ({
                    ...current,
                    tag:
                      event.target.value,
                  })
                )
              }
              placeholder="e.g. Income, Core, Research"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              !draft.tag.trim()
            }
            onClick={() =>
              onConfirm(
                draft
              )
            }
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950"
          >
            Apply Tag
          </button>
        </div>
      </div>
    </div>
  );
}
