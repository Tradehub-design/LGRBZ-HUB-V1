"use client";

import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import {
  formatMoney,
  NormalisedTransaction,
} from "@/lib/transactions/professionalTransactions";

type Props = {
  open: boolean;
  transactions: NormalisedTransaction[];
  deleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function TransactionDeleteDialog({
  open,
  transactions,
  deleting = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!open || transactions.length === 0) {
    return null;
  }

  const totalValue = transactions.reduce(
    (sum, transaction) =>
      sum + Math.abs(transaction.total || 0),
    0
  );

  const single = transactions.length === 1;
  const primary = transactions[0];

  return (
    <div className="fixed inset-0 z-[75]">
      <button
        type="button"
        aria-label="Cancel transaction deletion"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={deleting ? undefined : onCancel}
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-red-200 bg-white shadow-2xl dark:border-red-900 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-red-100 px-5 py-4 dark:border-red-950">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-red-100 p-2 text-red-700 dark:bg-red-950 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                Destructive Action
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                {single
                  ? "Delete transaction?"
                  : `Delete ${transactions.length} transactions?`}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The transaction ledger will be updated immediately.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-5 py-5">
          {single && primary ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-950 dark:text-slate-50">
                    {primary.symbol}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {primary.type} · {primary.date}
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {formatMoney(
                    primary.total,
                    primary.currency
                  )}
                </p>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-slate-500">Quantity</dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                    {primary.quantity}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Broker</dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                    {primary.broker || "—"}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                  Selected transactions
                </p>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                  {transactions.length}
                </span>
              </div>

              <div className="mt-3 max-h-48 space-y-2 overflow-auto">
                {transactions.slice(0, 20).map(
                  (transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 dark:bg-slate-950"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {transaction.symbol} ·{" "}
                          {transaction.type}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {transaction.date}
                        </p>
                      </div>

                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {formatMoney(
                          transaction.total,
                          transaction.currency
                        )}
                      </p>
                    </div>
                  )
                )}

                {transactions.length > 20 && (
                  <p className="px-2 pt-1 text-xs text-slate-500">
                    And {transactions.length - 20} more…
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
              Total affected value
            </p>

            <p className="mt-1 text-xl font-semibold text-red-700 dark:text-red-300">
              {formatMoney(
                totalValue,
                primary?.currency || "AUD"
              )}
            </p>

            <p className="mt-2 text-xs leading-5 text-red-700 dark:text-red-300">
              You will have a temporary undo option after deletion.
            </p>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            {deleting
              ? "Deleting..."
              : single
                ? "Delete Transaction"
                : `Delete ${transactions.length} Transactions`}
          </button>
        </footer>
      </div>
    </div>
  );
}
