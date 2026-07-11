"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import {
  TransactionSortKey,
} from "@/lib/transactions/professionalTransactions";
import {
  createTransactionSortRule,
  moveTransactionSortRule,
  removeTransactionSortRule,
  TransactionSortDirection,
  TransactionSortRule,
} from "@/lib/transactions/transactionMultiSort";

type Props = {
  open: boolean;
  rules: TransactionSortRule[];
  onClose: () => void;
  onChange: (
    rules: TransactionSortRule[]
  ) => void;
};

const sortOptions: Array<{
  key: TransactionSortKey;
  label: string;
}> = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "symbol",
    label: "Symbol",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
  {
    key: "price",
    label: "Price",
  },
  {
    key: "fees",
    label: "Fees",
  },
  {
    key: "total",
    label: "Total",
  },
];

function labelForKey(
  key: TransactionSortKey
) {
  return (
    sortOptions.find(
      (option) =>
        option.key === key
    )?.label ?? key
  );
}

export function TransactionMultiSortPanel({
  open,
  rules,
  onClose,
  onChange,
}: Props) {
  if (!open) {
    return null;
  }

  const available =
    sortOptions.filter(
      (option) =>
        !rules.some(
          (rule) =>
            rule.key === option.key
        )
    );

  const addRule = () => {
    const next =
      available[0];

    if (!next) {
      return;
    }

    onChange([
      ...rules,
      createTransactionSortRule(
        next.key,
        "desc"
      ),
    ]);
  };

  const updateKey = (
    id: string,
    key: TransactionSortKey
  ) => {
    onChange(
      rules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              key,
            }
          : rule
      )
    );
  };

  const updateDirection = (
    id: string,
    direction: TransactionSortDirection
  ) => {
    onChange(
      rules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              direction,
            }
          : rule
      )
    );
  };

  return (
    <div className="fixed inset-0 z-[75]">
      <button
        type="button"
        aria-label="Close multi-column sorting"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-500" />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Multi-Column Sorting
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Build a professional sort order
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Rules are applied from top to bottom and saved in this browser.
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
          {rules.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
              <ArrowUpDown className="mx-auto h-7 w-7 text-slate-400" />

              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                No sort rules configured
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Add a rule to sort transactions by multiple fields.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map(
                (
                  rule,
                  index
                ) => {
                  const keysUsedByOthers =
                    new Set(
                      rules
                        .filter(
                          (entry) =>
                            entry.id !==
                            rule.id
                        )
                        .map(
                          (entry) =>
                            entry.key
                        )
                    );

                  return (
                    <article
                      key={rule.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          {index + 1}
                        </span>

                        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                          <select
                            value={
                              rule.key
                            }
                            onChange={(
                              event
                            ) =>
                              updateKey(
                                rule.id,
                                event.target
                                  .value as TransactionSortKey
                              )
                            }
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                          >
                            {sortOptions.map(
                              (
                                option
                              ) => (
                                <option
                                  key={
                                    option.key
                                  }
                                  value={
                                    option.key
                                  }
                                  disabled={
                                    keysUsedByOthers.has(
                                      option.key
                                    )
                                  }
                                >
                                  {
                                    option.label
                                  }
                                </option>
                              )
                            )}
                          </select>

                          <select
                            value={
                              rule.direction
                            }
                            onChange={(
                              event
                            ) =>
                              updateDirection(
                                rule.id,
                                event.target
                                  .value as TransactionSortDirection
                              )
                            }
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                          >
                            <option value="asc">
                              Ascending
                            </option>

                            <option value="desc">
                              Descending
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-900">
                        <p className="text-xs text-slate-500">
                          Then sort by{" "}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {labelForKey(
                              rule.key
                            )}
                          </span>{" "}
                          {rule.direction ===
                          "asc"
                            ? "ascending"
                            : "descending"}
                        </p>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            disabled={
                              index ===
                              0
                            }
                            onClick={() =>
                              onChange(
                                moveTransactionSortRule(
                                  rules,
                                  rule.id,
                                  "up"
                                )
                              )
                            }
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-900"
                            title="Move rule up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={
                              index ===
                              rules.length -
                                1
                            }
                            onClick={() =>
                              onChange(
                                moveTransactionSortRule(
                                  rules,
                                  rule.id,
                                  "down"
                                )
                              )
                            }
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:hover:bg-slate-900"
                            title="Move rule down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onChange(
                                removeTransactionSortRule(
                                  rules,
                                  rule.id
                                )
                              )
                            }
                            className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                            title="Remove rule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}

          <button
            type="button"
            disabled={
              available.length ===
              0
            }
            onClick={addRule}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Plus className="h-4 w-4" />
            Add Sort Rule
          </button>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() =>
              onChange([])
            }
            disabled={
              rules.length === 0
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Sorting
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            Apply
          </button>
        </footer>
      </aside>
    </div>
  );
}
