"use client";

import {
  Check,
  Columns3,
  GripHorizontal,
  RotateCcw,
  X,
} from "lucide-react";
import {
  defaultTransactionTablePreferences,
  TransactionColumnKey,
  TransactionColumnVisibility,
  TransactionDensity,
  TransactionTablePreferences,
  transactionColumnDefinitions,
} from "@/lib/transactions/transactionTablePreferences";

type Props = {
  open: boolean;
  preferences: TransactionTablePreferences;
  onClose: () => void;
  onChange: (preferences: TransactionTablePreferences) => void;
};

export function TransactionViewSettings({
  open,
  preferences,
  onClose,
  onChange,
}: Props) {
  if (!open) return null;

  const setDensity = (density: TransactionDensity) => {
    onChange({
      ...preferences,
      density,
    });
  };

  const toggleColumn = (key: TransactionColumnKey) => {
    const definition = transactionColumnDefinitions.find(
      (column) => column.key === key
    );

    if (definition?.required) return;

    const nextVisibility: TransactionColumnVisibility = {
      ...preferences.columnVisibility,
      [key]: !preferences.columnVisibility[key],
    };

    onChange({
      ...preferences,
      columnVisibility: nextVisibility,
    });
  };

  const reset = () => {
    onChange({
      density: defaultTransactionTablePreferences.density,
      columnVisibility: {
        ...defaultTransactionTablePreferences.columnVisibility,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close transaction view settings"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 flex max-h-[85vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Columns3 className="h-4 w-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Table View Settings
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Customise transaction display
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose table density and visible columns.
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

        <div className="flex-1 overflow-auto px-5 py-5">
          <section>
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Row density
              </h3>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDensity("comfortable")}
                className={`rounded-2xl border p-4 text-left transition ${
                  preferences.density === "comfortable"
                    ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    Comfortable
                  </span>

                  {preferences.density === "comfortable" && (
                    <Check className="h-4 w-4" />
                  )}
                </div>

                <p
                  className={`mt-2 text-xs ${
                    preferences.density === "comfortable"
                      ? "text-slate-300 dark:text-slate-600"
                      : "text-slate-500"
                  }`}
                >
                  More spacing for easier scanning and editing.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDensity("compact")}
                className={`rounded-2xl border p-4 text-left transition ${
                  preferences.density === "compact"
                    ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    Compact
                  </span>

                  {preferences.density === "compact" && (
                    <Check className="h-4 w-4" />
                  )}
                </div>

                <p
                  className={`mt-2 text-xs ${
                    preferences.density === "compact"
                      ? "text-slate-300 dark:text-slate-600"
                      : "text-slate-500"
                  }`}
                >
                  Higher information density for large ledgers.
                </p>
              </button>
            </div>
          </section>

          <section className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Columns3 className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                  Visible columns
                </h3>
              </div>

              <span className="text-xs text-slate-500">
                Required columns stay visible
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {transactionColumnDefinitions.map((column) => {
                const checked =
                  preferences.columnVisibility[column.key];

                return (
                  <button
                    key={column.key}
                    type="button"
                    disabled={column.required}
                    onClick={() => toggleColumn(column.key)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        {column.label}
                      </p>

                      {column.required && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          Required for transaction management
                        </p>
                      )}
                    </div>

                    <span
                      className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${
                        checked
                          ? "justify-end bg-slate-950 dark:bg-slate-100"
                          : "justify-start bg-slate-200 dark:bg-slate-800"
                      }`}
                    >
                      <span
                        className={`h-5 w-5 rounded-full shadow-sm ${
                          checked
                            ? "bg-white dark:bg-slate-950"
                            : "bg-white dark:bg-slate-600"
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
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
            Reset View
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
