"use client";

import {
  Calculator,
  CheckCircle2,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  NormalisedTransaction,
  TransactionType,
} from "@/lib/transactions/professionalTransactions";
import {
  hasTransactionChanged,
  recalculateTransactionTotal,
  sanitiseEditableTransaction,
  validateTransaction,
} from "@/lib/transactions/transactionValidation";
import { TransactionChangeSummary } from "./TransactionChangeSummary";
import { TransactionEditField } from "./TransactionEditField";
import { TransactionUnsavedChangesDialog } from "./TransactionUnsavedChangesDialog";
import { TransactionValidationPanel } from "./TransactionValidationPanel";

type Props = {
  transaction: NormalisedTransaction | null;
  open: boolean;
  saving?: boolean;
  onClose: () => void;
  onSave?: (
    transaction: NormalisedTransaction
  ) => void | Promise<void>;
};

const transactionTypes: TransactionType[] = [
  "BUY",
  "SELL",
  "DIVIDEND",
  "TRANSFER",
  "FEE",
  "OTHER",
];

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600 dark:focus:ring-slate-800";

const errorInputClass =
  "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-700 dark:focus:ring-red-950";

export function TransactionEditDrawer({
  transaction,
  open,
  saving = false,
  onClose,
  onSave,
}: Props) {
  const [original, setOriginal] =
    useState<NormalisedTransaction | null>(
      transaction
    );

  const [draft, setDraft] =
    useState<NormalisedTransaction | null>(
      transaction
    );

  const [
    confirmCloseOpen,
    setConfirmCloseOpen,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  useEffect(() => {
    setOriginal(transaction);
    setDraft(transaction);
    setSubmitted(false);
    setConfirmCloseOpen(false);
  }, [transaction]);

  const validation = useMemo(
    () =>
      draft
        ? validateTransaction(draft)
        : {
            valid: false,
            errors: {},
            warnings: [],
          },
    [draft]
  );

  const dirty = useMemo(() => {
    if (!original || !draft) return false;

    return hasTransactionChanged(
      original,
      draft
    );
  }, [original, draft]);

  useEffect(() => {
    if (!open || !dirty) return;

    const onBeforeUnload = (
      event: BeforeUnloadEvent
    ) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      onBeforeUnload
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        onBeforeUnload
      );
  }, [open, dirty]);

  if (!open || !draft || !original) {
    return null;
  }

  const update = <
    K extends keyof NormalisedTransaction
  >(
    key: K,
    value: NormalisedTransaction[K]
  ) => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const requestClose = () => {
    if (saving) return;

    if (dirty) {
      setConfirmCloseOpen(true);
      return;
    }

    onClose();
  };

  const discardChanges = () => {
    setConfirmCloseOpen(false);
    setDraft(original);
    setSubmitted(false);
    onClose();
  };

  const resetDraft = () => {
    setDraft(original);
    setSubmitted(false);
  };

  const calculateTotal = () => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        total: Number(
          recalculateTransactionTotal(
            current
          ).toFixed(2)
        ),
      };
    });
  };

  const save = async () => {
    if (!draft || saving) return;

    setSubmitted(true);

    const cleaned =
      sanitiseEditableTransaction(
        draft
      );

    const cleanedValidation =
      validateTransaction(cleaned);

    if (!cleanedValidation.valid) {
      setDraft(cleaned);
      return;
    }

    await onSave?.(cleaned);

    setOriginal(cleaned);
    setDraft(cleaned);
    setSubmitted(false);
    setConfirmCloseOpen(false);
    onClose();
  };

  const fieldError = (
    field: keyof typeof validation.errors
  ) =>
    submitted
      ? validation.errors[field]
      : undefined;

  return (
    <>
      <div className="fixed inset-0 z-50">
        <button
          type="button"
          aria-label="Close transaction editor overlay"
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          onClick={requestClose}
        />

        <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
          <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Transaction Editor
                </p>

                {dirty ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                    Unsaved changes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Saved
                  </span>
                )}
              </div>

              <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                {draft.symbol ||
                  "Transaction"}{" "}
                · {draft.type}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Edit transaction details while preserving the existing ledger workflow.
              </p>
            </div>

            <button
              type="button"
              onClick={requestClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-auto">
            <div className="grid gap-5 px-5 py-5 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-w-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TransactionEditField
                    label="Date"
                    required
                    error={fieldError(
                      "date"
                    )}
                  >
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(event) =>
                        update(
                          "date",
                          event.target.value
                        )
                      }
                      className={`${inputClass} ${
                        fieldError("date")
                          ? errorInputClass
                          : ""
                      }`}
                    />
                  </TransactionEditField>

                  <TransactionEditField
                    label="Type"
                    required
                    error={fieldError(
                      "type"
                    )}
                  >
                    <select
                      value={draft.type}
                      onChange={(event) =>
                        update(
                          "type",
                          event.target
                            .value as TransactionType
                        )
                      }
                      className={`${inputClass} ${
                        fieldError("type")
                          ? errorInputClass
                          : ""
                      }`}
                    >
                      {transactionTypes.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}
                    </select>
                  </TransactionEditField>

                  <TransactionEditField
                    label="Symbol"
                    required
                    error={fieldError(
                      "symbol"
                    )}
                    hint="Ticker or security code"
                  >
                    <input
                      value={draft.symbol}
                      onChange={(event) =>
                        update(
                          "symbol",
                          event.target.value.toUpperCase()
                        )
                      }
                      maxLength={20}
                      className={`${inputClass} ${
                        fieldError(
                          "symbol"
                        )
                          ? errorInputClass
                          : ""
                      }`}
                    />
                  </TransactionEditField>

                  <TransactionEditField
                    label="Company Name"
                  >
                    <input
                      value={
                        draft.name ?? ""
                      }
                      onChange={(event) =>
                        update(
                          "name",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </TransactionEditField>

                  <TransactionEditField
                    label="Quantity"
                    required={
                      draft.type ===
                        "BUY" ||
                      draft.type ===
                        "SELL"
                    }
                    error={fieldError(
                      "quantity"
                    )}
                  >
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.0001"
                      min="0"
                      value={draft.quantity}
                      onChange={(event) =>
                        update(
                          "quantity",
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      className={`${inputClass} ${
                        fieldError(
                          "quantity"
                        )
                          ? errorInputClass
                          : ""
                      }`}
                    />
                  </TransactionEditField>

                  <TransactionEditField
                    label="Price"
                    required={
                      draft.type ===
                        "BUY" ||
                      draft.type ===
                        "SELL"
                    }
                    error={fieldError(
                      "price"
                    )}
                  >
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.0001"
                      min="0"
                      value={draft.price}
                      onChange={(event) =>
                        update(
                          "price",
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      className={`${inputClass} ${
                        fieldError("price")
                          ? errorInputClass
                          : ""
                      }`}
                    />
                  </TransactionEditField>

                  <TransactionEditField
                    label="Fees"
                    error={fieldError(
                      "fees"
                    )}
                  >
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={draft.fees}
                      onChange={(event) =>
                        update(
                          "fees",
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      className={`${inputClass} ${
                        fieldError("fees")
                          ? errorInputClass
                          : ""
                      }`}
                    />
                  </TransactionEditField>

                  <TransactionEditField
                    label="Total"
                    required
                    error={fieldError(
                      "total"
                    )}
                  >
                    <div className="flex gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        value={draft.total}
                        onChange={(
                          event
                        ) =>
                          update(
                            "total",
                            Number(
                              event
                                .target
                                .value
                            )
                          )
                        }
                        className={`${inputClass} ${
                          fieldError(
                            "total"
                          )
                            ? errorInputClass
                            : ""
                        }`}
                      />

                      <button
                        type="button"
                        onClick={
                          calculateTotal
                        }
                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                        title="Recalculate total"
                      >
                        <Calculator className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          Calculate
                        </span>
                      </button>
                    </div>
                  </TransactionEditField>

                  <TransactionEditField
                    label="Currency"
                    required
                    error={fieldError(
                      "currency"
                    )}
                    hint="Three-letter currency code"
                  >
                    <input
                      value={
                        draft.currency ??
                        "AUD"
                      }
                      onChange={(event) =>
                        update(
                          "currency",
                          event.target.value.toUpperCase()
                        )
                      }
                      maxLength={3}
                      className={`${inputClass} ${
                        fieldError(
                          "currency"
                        )
                          ? errorInputClass
                          : ""
                      }`}
                    />
                  </TransactionEditField>

                  <TransactionEditField
                    label="Broker"
                    error={fieldError(
                      "broker"
                    )}
                  >
                    <input
                      value={
                        draft.broker ?? ""
                      }
                      onChange={(event) =>
                        update(
                          "broker",
                          event.target.value
                        )
                      }
                      maxLength={120}
                      className={`${inputClass} ${
                        fieldError(
                          "broker"
                        )
                          ? errorInputClass
                          : ""
                      }`}
                    />
                  </TransactionEditField>
                </div>

                <div className="mt-4">
                  <TransactionEditField
                    label="Notes"
                    error={fieldError(
                      "notes"
                    )}
                    hint={`${
                      draft.notes?.length ??
                      0
                    } / 2,000 characters`}
                  >
                    <textarea
                      value={
                        draft.notes ?? ""
                      }
                      onChange={(event) =>
                        update(
                          "notes",
                          event.target.value
                        )
                      }
                      rows={6}
                      maxLength={2000}
                      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600 dark:focus:ring-slate-800 ${
                        fieldError(
                          "notes"
                        )
                          ? errorInputClass
                          : ""
                      }`}
                    />
                  </TransactionEditField>
                </div>

                <div className="mt-5">
                  <TransactionValidationPanel
                    result={validation}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className="sticky top-0 space-y-4">
                  <TransactionChangeSummary
                    original={original}
                    draft={draft}
                  />

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                      Edit status
                    </p>

                    <dl className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-slate-500">
                          Changes
                        </dt>

                        <dd className="font-semibold text-slate-900 dark:text-slate-100">
                          {dirty
                            ? "Pending"
                            : "None"}
                        </dd>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-slate-500">
                          Validation
                        </dt>

                        <dd
                          className={`font-semibold ${
                            validation.valid
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {validation.valid
                            ? "Valid"
                            : "Needs attention"}
                        </dd>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-slate-500">
                          Warnings
                        </dt>

                        <dd className="font-semibold text-slate-900 dark:text-slate-100">
                          {
                            validation
                              .warnings
                              .length
                          }
                        </dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      onClick={resetDraft}
                      disabled={
                        !dirty || saving
                      }
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              {dirty
                ? "Changes will not affect the ledger until saved."
                : "No unsaved changes."}
            </p>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={requestClose}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={resetDraft}
                disabled={
                  !dirty || saving
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>

              <button
                type="button"
                onClick={save}
                disabled={
                  saving || !dirty
                }
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              >
                <Save className="h-4 w-4" />
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </footer>
        </aside>
      </div>

      <TransactionUnsavedChangesDialog
        open={confirmCloseOpen}
        saving={saving}
        onCancel={() =>
          setConfirmCloseOpen(false)
        }
        onDiscard={discardChanges}
        onSave={save}
      />
    </>
  );
}
