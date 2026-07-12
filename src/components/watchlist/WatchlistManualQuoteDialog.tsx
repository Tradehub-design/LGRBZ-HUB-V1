"use client";

import {
  DollarSign,
  Save,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultWatchlistManualQuoteDraft,
  validateManualWatchlistQuote,
  WatchlistManualQuoteDraft,
} from "@/lib/watchlist/watchlistQuotes";
import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  open: boolean;
  security: WatchlistSecurity | null;
  onClose: () => void;
  onSave: (
    security: WatchlistSecurity,
    draft: WatchlistManualQuoteDraft
  ) => void;
};

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-800";

export function WatchlistManualQuoteDialog({
  open,
  security,
  onClose,
  onSave,
}: Props) {
  const [
    draft,
    setDraft,
  ] =
    useState<WatchlistManualQuoteDraft>(
      defaultWatchlistManualQuoteDraft
    );

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  useEffect(() => {
    if (
      !open ||
      !security
    ) {
      return;
    }

    setDraft({
      price:
        security.price > 0
          ? String(
              security.price
            )
          : "",
      previousClose:
        security.previousClose >
        0
          ? String(
              security.previousClose
            )
          : "",
      dayHigh:
        security.dayHigh > 0
          ? String(
              security.dayHigh
            )
          : "",
      dayLow:
        security.dayLow > 0
          ? String(
              security.dayLow
            )
          : "",
      volume:
        security.volume > 0
          ? String(
              security.volume
            )
          : "",
      quotedAt:
        new Date()
          .toISOString()
          .slice(0, 16),
    });

    setSubmitted(false);
  }, [
    open,
    security,
  ]);

  const validation =
    useMemo(
      () =>
        validateManualWatchlistQuote(
          draft
        ),
      [draft]
    );

  if (
    !open ||
    !security
  ) {
    return null;
  }

  const update = (
    patch: Partial<WatchlistManualQuoteDraft>
  ) => {
    setDraft(
      (current) => ({
        ...current,
        ...patch,
      })
    );
  };

  const submit = () => {
    setSubmitted(true);

    if (
      !validation.valid
    ) {
      return;
    }

    onSave(
      security,
      draft
    );
  };

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close manual quote editor"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <DollarSign className="h-5 w-5" />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Manual Quote
              </p>

              <h2 className="mt-1 text-base font-semibold text-slate-950 dark:text-slate-50">
                Update {security.symbol}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Save a verified price without changing the transaction ledger.
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Current Price
            </span>

            <input
              value={
                draft.price
              }
              onChange={(
                event
              ) =>
                update({
                  price:
                    event.target.value,
                })
              }
              type="number"
              min="0"
              step="0.0001"
              className={inputClass}
            />

            {submitted &&
              validation.errors
                .price && (
                <span className="block text-xs font-medium text-red-600">
                  {
                    validation
                      .errors.price
                  }
                </span>
              )}
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Previous Close
            </span>

            <input
              value={
                draft.previousClose
              }
              onChange={(
                event
              ) =>
                update({
                  previousClose:
                    event.target.value,
                })
              }
              type="number"
              min="0"
              step="0.0001"
              className={inputClass}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Day High
            </span>

            <input
              value={
                draft.dayHigh
              }
              onChange={(
                event
              ) =>
                update({
                  dayHigh:
                    event.target.value,
                })
              }
              type="number"
              min="0"
              step="0.0001"
              className={inputClass}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Day Low
            </span>

            <input
              value={
                draft.dayLow
              }
              onChange={(
                event
              ) =>
                update({
                  dayLow:
                    event.target.value,
                })
              }
              type="number"
              min="0"
              step="0.0001"
              className={inputClass}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Volume
            </span>

            <input
              value={
                draft.volume
              }
              onChange={(
                event
              ) =>
                update({
                  volume:
                    event.target.value,
                })
              }
              type="number"
              min="0"
              step="1"
              className={inputClass}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quote Time
            </span>

            <input
              value={
                draft.quotedAt
              }
              onChange={(
                event
              ) =>
                update({
                  quotedAt:
                    event.target.value,
                })
              }
              type="datetime-local"
              className={inputClass}
            />
          </label>
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
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            <Save className="h-4 w-4" />
            Save Quote
          </button>
        </div>
      </div>
    </div>
  );
}
