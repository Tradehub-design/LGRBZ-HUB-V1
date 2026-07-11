"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  X,
} from "lucide-react";
import {
  TransactionSortRule,
} from "@/lib/transactions/transactionMultiSort";

type Props = {
  rules: TransactionSortRule[];
  onOpen: () => void;
  onRemove: (
    id: string
  ) => void;
  onClear: () => void;
};

const labels = {
  date: "Date",
  symbol: "Symbol",
  type: "Type",
  quantity: "Quantity",
  price: "Price",
  fees: "Fees",
  total: "Total",
};

export function TransactionSortStatus({
  rules,
  onOpen,
  onRemove,
  onClear,
}: Props) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <ArrowUpDown className="h-4 w-4" />
          Multi-Sort
        </button>

        {rules.length === 0 ? (
          <span className="text-xs text-slate-500">
            No multi-column sort rules
          </span>
        ) : (
          rules.map(
            (
              rule,
              index
            ) => {
              const Icon =
                rule.direction ===
                "asc"
                  ? ArrowUp
                  : ArrowDown;

              return (
                <span
                  key={rule.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  <span className="text-[10px] font-semibold text-slate-400">
                    {index + 1}
                  </span>

                  {
                    labels[
                      rule.key
                    ]
                  }

                  <Icon className="h-3.5 w-3.5" />

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(
                        rule.id
                      )
                    }
                    className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    aria-label={`Remove ${labels[rule.key]} sort rule`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            }
          )
        )}
      </div>

      {rules.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          Clear all
        </button>
      )}
    </section>
  );
}
