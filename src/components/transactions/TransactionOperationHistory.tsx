"use client";

import {
  Clock3,
  History,
  Pencil,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { OptimisticTransactionOperation } from "@/lib/transactions/transactionOptimisticState";

type Props = {
  open: boolean;
  operations: OptimisticTransactionOperation[];
  onClose: () => void;
  onUndo: (
    operation: OptimisticTransactionOperation
  ) => void;
};

export function TransactionOperationHistory({
  open,
  operations,
  onClose,
  onUndo,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close transaction operation history"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-slate-500" />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Session History
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Recent transaction actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and undo recent edits or deletions.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-5">
          {operations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center dark:border-slate-800">
              <Clock3 className="mx-auto h-7 w-7 text-slate-400" />

              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                No recent actions
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Transaction edits and deletions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {operations.map((operation) => {
                const Icon =
                  operation.type === "EDIT"
                    ? Pencil
                    : Trash2;

                return (
                  <article
                    key={operation.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-start gap-3">
                      <span className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        <Icon className="h-4 w-4" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                          {operation.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(
                            operation.createdAt
                          ).toLocaleString("en-AU")}
                        </p>

                        {operation.type === "EDIT" ? (
                          <p className="mt-2 text-xs text-slate-500">
                            {operation.before.symbol} ·{" "}
                            {operation.before.type} ·{" "}
                            {operation.before.date}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-slate-500">
                            {operation.removed.length} transaction
                            {operation.removed.length === 1
                              ? ""
                              : "s"}{" "}
                            removed
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onUndo(operation)}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Undo
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
