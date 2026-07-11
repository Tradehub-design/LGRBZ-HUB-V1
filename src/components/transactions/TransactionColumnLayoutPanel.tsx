"use client";

import {
  Check,
  Columns3,
  GripVertical,
  Lock,
  RotateCcw,
  Unlock,
  X,
} from "lucide-react";
import {
  defaultTransactionColumnLayout,
  moveTransactionColumn,
  TransactionColumnLayout,
} from "@/lib/transactions/transactionColumnLayout";
import {
  TransactionColumnKey,
  transactionColumnDefinitions,
} from "@/lib/transactions/transactionTablePreferences";

type Props = {
  open: boolean;
  layout: TransactionColumnLayout;
  onClose: () => void;
  onChange: (
    layout: TransactionColumnLayout
  ) => void;
};

export function TransactionColumnLayoutPanel({
  open,
  layout,
  onClose,
  onChange,
}: Props) {
  if (!open) {
    return null;
  }

  const definitionMap =
    new Map(
      transactionColumnDefinitions.map(
        (definition) => [
          definition.key,
          definition,
        ]
      )
    );

  const update = (
    patch: Partial<TransactionColumnLayout>
  ) => {
    onChange({
      ...layout,
      ...patch,
    });
  };

  const reset = () => {
    onChange({
      ...defaultTransactionColumnLayout,
      order: [
        ...defaultTransactionColumnLayout.order,
      ],
      widths: {
        ...defaultTransactionColumnLayout.widths,
      },
    });
  };

  const moveUp = (
    key: TransactionColumnKey
  ) => {
    const index =
      layout.order.indexOf(
        key
      );

    if (
      index <= 0
    ) {
      return;
    }

    const target =
      layout.order[
        index - 1
      ];

    update({
      order:
        moveTransactionColumn(
          layout.order,
          key,
          target
        ),
    });
  };

  const moveDown = (
    key: TransactionColumnKey
  ) => {
    const index =
      layout.order.indexOf(
        key
      );

    if (
      index < 0 ||
      index >=
        layout.order.length -
          1
    ) {
      return;
    }

    const next = [
      ...layout.order,
    ];

    const target =
      next[
        index + 1
      ];

    const targetIndex =
      next.indexOf(
        target
      );

    next.splice(
      index,
      1
    );

    next.splice(
      targetIndex,
      0,
      key
    );

    update({
      order: next,
    });
  };

  return (
    <div className="fixed inset-0 z-[75]">
      <button
        type="button"
        aria-label="Close transaction column layout"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Columns3 className="h-4 w-4 text-slate-500" />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Column Layout
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Arrange the transaction table
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Reorder columns, reset widths and control frozen columns.
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
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Frozen columns
            </h3>

            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() =>
                  update({
                    freezeSelection:
                      !layout.freezeSelection,
                  })
                }
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 text-left dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  {layout.freezeSelection ? (
                    <Lock className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Unlock className="h-4 w-4 text-slate-500" />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Selection column
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Keep row selection visible while scrolling.
                    </p>
                  </div>
                </div>

                {layout.freezeSelection && (
                  <Check className="h-4 w-4 text-emerald-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  update({
                    freezeSymbol:
                      !layout.freezeSymbol,
                  })
                }
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 text-left dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  {layout.freezeSymbol ? (
                    <Lock className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Unlock className="h-4 w-4 text-slate-500" />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Symbol column
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Keep the transaction symbol visible horizontally.
                    </p>
                  </div>
                </div>

                {layout.freezeSymbol && (
                  <Check className="h-4 w-4 text-emerald-600" />
                )}
              </button>
            </div>
          </section>

          <section className="mt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Column order
              </h3>

              <span className="text-xs text-slate-500">
                Use arrows to move
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {layout.order.map(
                (
                  key,
                  index
                ) => {
                  const definition =
                    definitionMap.get(
                      key
                    );

                  return (
                    <article
                      key={key}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {definition?.label ??
                            key}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Width:{" "}
                          {Math.round(
                            layout.widths[
                              key
                            ] ?? 0
                          )}
                          px
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={
                            index === 0
                          }
                          onClick={() =>
                            moveUp(key)
                          }
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                            layout.order
                              .length -
                              1
                          }
                          onClick={() =>
                            moveDown(key)
                          }
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                          ↓
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Layout
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            Done
          </button>
        </footer>
      </aside>
    </div>
  );
}
