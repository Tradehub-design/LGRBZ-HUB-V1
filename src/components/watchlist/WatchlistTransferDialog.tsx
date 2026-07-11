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
  WatchlistGroup,
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type TransferMode =
  | "COPY"
  | "MOVE";

type Props = {
  open: boolean;
  security: WatchlistSecurity | null;
  groups: WatchlistGroup[];
  sourceGroupId: string;
  onClose: () => void;
  onConfirm: (
    targetGroupId: string,
    mode: TransferMode
  ) => void;
};

export function WatchlistTransferDialog({
  open,
  security,
  groups,
  sourceGroupId,
  onClose,
  onConfirm,
}: Props) {
  const availableGroups =
    groups.filter(
      (group) =>
        group.id !==
        sourceGroupId
    );

  const [
    targetGroupId,
    setTargetGroupId,
  ] = useState("");

  const [
    mode,
    setMode,
  ] =
    useState<TransferMode>(
      "COPY"
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    setTargetGroupId(
      availableGroups[0]?.id ??
        ""
    );

    setMode("COPY");
  }, [
    open,
    availableGroups,
  ]);

  if (
    !open ||
    !security
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close watchlist transfer"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <ArrowRightLeft className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
                Move or copy {security.symbol}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select another watchlist destination.
              </p>
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

        {availableGroups.length ===
        0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
            Create another watchlist before moving or copying securities.
          </div>
        ) : (
          <>
            <div className="mt-5 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Destination
                </span>

                <select
                  value={
                    targetGroupId
                  }
                  onChange={(
                    event
                  ) =>
                    setTargetGroupId(
                      event.target
                        .value
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  {availableGroups.map(
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

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setMode(
                      "COPY"
                    )
                  }
                  className={`rounded-2xl border p-4 text-left ${
                    mode === "COPY"
                      ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Copy className="h-4 w-4" />

                  <p className="mt-2 text-sm font-semibold">
                    Copy
                  </p>

                  <p className="mt-1 text-xs opacity-70">
                    Keep it in both watchlists.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMode(
                      "MOVE"
                    )
                  }
                  className={`rounded-2xl border p-4 text-left ${
                    mode === "MOVE"
                      ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <MoveRight className="h-4 w-4" />

                  <p className="mt-2 text-sm font-semibold">
                    Move
                  </p>

                  <p className="mt-1 text-xs opacity-70">
                    Remove it from the current watchlist.
                  </p>
                </button>
              </div>
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
                  !targetGroupId
                }
                onClick={() =>
                  onConfirm(
                    targetGroupId,
                    mode
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-950"
              >
                <ArrowRightLeft className="h-4 w-4" />
                {mode === "COPY"
                  ? "Copy Security"
                  : "Move Security"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
