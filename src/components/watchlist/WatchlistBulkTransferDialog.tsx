"use client";

import {
  ArrowRightLeft,
  Copy,
  MoveRight,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  WatchlistBulkTransferDraft,
} from "@/lib/watchlist/watchlistBulkActions";
import {
  WatchlistGroup,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  open: boolean;
  selectedCount: number;
  groups: WatchlistGroup[];
  activeGroupId: string;
  onClose: () => void;
  onConfirm: (
    draft: WatchlistBulkTransferDraft
  ) => void;
};

export function WatchlistBulkTransferDialog({
  open,
  selectedCount,
  groups,
  activeGroupId,
  onClose,
  onConfirm,
}: Props) {
  const [
    draft,
    setDraft,
  ] =
    useState<WatchlistBulkTransferDraft>({
      mode: "MOVE",
      targetGroupId: "",
    });

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraft({
      mode: "MOVE",
      targetGroupId:
        groups.find(
          (group) =>
            group.id !==
            activeGroupId
        )?.id ??
        groups[0]?.id ??
        "",
    });
  }, [
    open,
    groups,
    activeGroupId,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95]">
      <button
        type="button"
        aria-label="Close bulk transfer"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <ArrowRightLeft className="h-5 w-5" />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Bulk Transfer
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                Move or copy {selectedCount} securit
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setDraft(
                (current) => ({
                  ...current,
                  mode: "MOVE",
                })
              )
            }
            className={`rounded-2xl border p-4 text-left ${
              draft.mode ===
              "MOVE"
                ? "border-slate-950 bg-slate-50 dark:border-slate-100 dark:bg-slate-900"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <MoveRight className="h-5 w-5 text-slate-500" />

            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Move
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Remove from current lists and add to the destination.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setDraft(
                (current) => ({
                  ...current,
                  mode: "COPY",
                })
              )
            }
            className={`rounded-2xl border p-4 text-left ${
              draft.mode ===
              "COPY"
                ? "border-slate-950 bg-slate-50 dark:border-slate-100 dark:bg-slate-900"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <Copy className="h-5 w-5 text-slate-500" />

            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Copy
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Keep current memberships and add to another list.
            </p>
          </button>
        </div>

        <label className="mt-5 block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Destination Watchlist
          </span>

          <select
            value={
              draft.targetGroupId
            }
            onChange={(
              event
            ) =>
              setDraft(
                (current) => ({
                  ...current,
                  targetGroupId:
                    event.target.value,
                })
              )
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          >
            {groups.map(
              (group) => (
                <option
                  key={
                    group.id
                  }
                  value={
                    group.id
                  }
                >
                  {group.name}
                </option>
              )
            )}
          </select>
        </label>

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
              !draft.targetGroupId
            }
            onClick={() =>
              onConfirm(
                draft
              )
            }
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950"
          >
            {draft.mode ===
            "MOVE"
              ? "Move Selected"
              : "Copy Selected"}
          </button>
        </div>
      </div>
    </div>
  );
}
