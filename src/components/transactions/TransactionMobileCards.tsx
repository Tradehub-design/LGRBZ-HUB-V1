"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  formatMoney,
  formatNumber,
  NormalisedTransaction,
} from "@/lib/transactions/professionalTransactions";

type Props = {
  rows: NormalisedTransaction[];
  selectedIds: Set<string>;
  focusedId: string | null;
  onToggleRow: (id: string) => void;
  onFocusRow: (id: string) => void;
  onContextMenu?: (
    event: React.MouseEvent<HTMLElement>,
    row: NormalisedTransaction
  ) => void;
  onEdit: (row: NormalisedTransaction) => void;
  onDelete: (row: NormalisedTransaction) => void;
};

export function TransactionMobileCards({
  rows,
  selectedIds,
  focusedId,
  onToggleRow,
  onFocusRow,
  onContextMenu,
  onEdit,
  onDelete,
}: Props) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        No transactions match the current filters.
      </div>
    );
  }

  return (
    <div className="space-y-3 lg:hidden">
      {rows.map((row) => {
        const isFocused = focusedId === row.id;
        const isSelected = selectedIds.has(row.id);

        return (
          <article
            key={row.id}
            id={`transaction-mobile-row-${row.id}`}
            tabIndex={isFocused ? 0 : -1}
            onClick={() => onFocusRow(row.id)}
            onFocus={() => onFocusRow(row.id)}
            onContextMenu={(event) => {
              onFocusRow(row.id);
              onContextMenu?.(
                event,
                row
              );
            }}
            className={`rounded-2xl border bg-white p-4 shadow-sm outline-none transition dark:bg-slate-950 ${
              isFocused
                ? "border-blue-500 ring-2 ring-blue-500/30"
                : isSelected
                  ? "border-slate-400 bg-slate-50 dark:border-slate-600 dark:bg-slate-900"
                  : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onClick={(event) => event.stopPropagation()}
                  onChange={() => onToggleRow(row.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">
                      {row.symbol}
                    </h3>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {row.type}
                    </span>
                  </div>

                  {row.name && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {row.name}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-slate-500">
                    {row.date} · {row.broker || "No broker"}
                  </p>
                </div>
              </div>

              <p className="text-right text-base font-semibold text-slate-950 dark:text-slate-50">
                {formatMoney(row.total, row.currency)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900">
              <div>
                <p className="text-slate-500">Qty</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {formatNumber(row.quantity, 4)}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Price</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {formatMoney(row.price, row.currency)}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Fees</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {formatMoney(row.fees, row.currency)}
                </p>
              </div>
            </div>

            {row.notes && (
              <p className="mt-3 line-clamp-2 text-xs text-slate-500">
                {row.notes}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(row);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:text-slate-200"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(row);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-900"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
