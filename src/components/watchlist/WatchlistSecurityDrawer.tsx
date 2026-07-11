"use client";

import {
  Building2,
  CircleDollarSign,
  Globe2,
  Layers3,
  Save,
  Tag,
  Target,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultWatchlistSecurityDraft,
  validateWatchlistSecurityDraft,
  WatchlistSecurityDraft,
  watchlistSecurityToDraft,
} from "@/lib/watchlist/watchlistSecurityEditor";
import {
  WatchlistGroup,
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  open: boolean;
  securities: WatchlistSecurity[];
  groups: WatchlistGroup[];
  activeGroupId: string;
  editingSecurity: WatchlistSecurity | null;
  onClose: () => void;
  onSave: (
    draft: WatchlistSecurityDraft,
    groupId: string,
    editingSecurity: WatchlistSecurity | null
  ) => void;
};

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-800";

export function WatchlistSecurityDrawer({
  open,
  securities,
  groups,
  activeGroupId,
  editingSecurity,
  onClose,
  onSave,
}: Props) {
  const [
    draft,
    setDraft,
  ] =
    useState<WatchlistSecurityDraft>(
      defaultWatchlistSecurityDraft
    );

  const [
    groupId,
    setGroupId,
  ] =
    useState(
      activeGroupId
    );

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraft(
      editingSecurity
        ? watchlistSecurityToDraft(
            editingSecurity
          )
        : {
            ...defaultWatchlistSecurityDraft,
          }
    );

    setGroupId(
      activeGroupId
    );

    setSubmitted(false);
  }, [
    open,
    editingSecurity,
    activeGroupId,
  ]);

  const validation =
    useMemo(
      () =>
        validateWatchlistSecurityDraft(
          draft,
          securities,
          editingSecurity?.id
        ),
      [
        draft,
        securities,
        editingSecurity,
      ]
    );

  if (!open) {
    return null;
  }

  const update = (
    patch: Partial<WatchlistSecurityDraft>
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
      draft,
      groupId,
      editingSecurity
    );
  };

  const error = (
    field:
      keyof WatchlistSecurityDraft
  ) =>
    submitted
      ? validation.errors[
          field
        ]
      : undefined;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close watchlist security editor"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {editingSecurity
                ? "Edit Security"
                : "Add Security"}
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              {editingSecurity
                ? `${editingSecurity.symbol} watchlist details`
                : "Add a security to the watchlist"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure identity, classification, research notes and target price.
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Symbol
              </span>

              <input
                value={
                  draft.symbol
                }
                onChange={(
                  event
                ) =>
                  update({
                    symbol:
                      event.target.value.toUpperCase(),
                  })
                }
                maxLength={20}
                placeholder="CBA"
                className={inputClass}
              />

              {error(
                "symbol"
              ) && (
                <span className="block text-xs font-medium text-red-600 dark:text-red-400">
                  {
                    error(
                      "symbol"
                    )
                  }
                </span>
              )}
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Exchange
              </span>

              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={
                    draft.exchange
                  }
                  onChange={(
                    event
                  ) =>
                    update({
                      exchange:
                        event.target.value.toUpperCase(),
                    })
                  }
                  maxLength={12}
                  placeholder="ASX"
                  className={`${inputClass} pl-9`}
                />
              </div>

              {error(
                "exchange"
              ) && (
                <span className="block text-xs font-medium text-red-600 dark:text-red-400">
                  {
                    error(
                      "exchange"
                    )
                  }
                </span>
              )}
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company or Security Name
              </span>

              <input
                value={
                  draft.name
                }
                onChange={(
                  event
                ) =>
                  update({
                    name:
                      event.target.value,
                  })
                }
                placeholder="Commonwealth Bank of Australia"
                className={inputClass}
              />

              {error(
                "name"
              ) && (
                <span className="block text-xs font-medium text-red-600 dark:text-red-400">
                  {
                    error(
                      "name"
                    )
                  }
                </span>
              )}
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Currency
              </span>

              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={
                    draft.currency
                  }
                  onChange={(
                    event
                  ) =>
                    update({
                      currency:
                        event.target.value.toUpperCase(),
                    })
                  }
                  maxLength={3}
                  placeholder="AUD"
                  className={`${inputClass} pl-9`}
                />
              </div>

              {error(
                "currency"
              ) && (
                <span className="block text-xs font-medium text-red-600 dark:text-red-400">
                  {
                    error(
                      "currency"
                    )
                  }
                </span>
              )}
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Target Price
              </span>

              <div className="relative">
                <Target className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={
                    draft.targetPrice
                  }
                  onChange={(
                    event
                  ) =>
                    update({
                      targetPrice:
                        event.target.value,
                    })
                  }
                  inputMode="decimal"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`${inputClass} pl-9`}
                />
              </div>

              {error(
                "targetPrice"
              ) && (
                <span className="block text-xs font-medium text-red-600 dark:text-red-400">
                  {
                    error(
                      "targetPrice"
                    )
                  }
                </span>
              )}
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sector
              </span>

              <div className="relative">
                <Layers3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={
                    draft.sector
                  }
                  onChange={(
                    event
                  ) =>
                    update({
                      sector:
                        event.target.value,
                    })
                  }
                  placeholder="Financials"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Industry
              </span>

              <input
                value={
                  draft.industry
                }
                onChange={(
                  event
                ) =>
                  update({
                    industry:
                      event.target.value,
                  })
                }
                placeholder="Banks"
                className={inputClass}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Analyst Rating
              </span>

              <div className="relative">
                <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={
                    draft.analystRating
                  }
                  onChange={(
                    event
                  ) =>
                    update({
                      analystRating:
                        event.target.value,
                    })
                  }
                  className={`${inputClass} pl-9`}
                >
                  <option>
                    Unrated
                  </option>
                  <option>
                    Strong Buy
                  </option>
                  <option>
                    Buy
                  </option>
                  <option>
                    Hold
                  </option>
                  <option>
                    Sell
                  </option>
                  <option>
                    Strong Sell
                  </option>
                </select>
              </div>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Watchlist
              </span>

              <select
                value={
                  groupId
                }
                onChange={(
                  event
                ) =>
                  setGroupId(
                    event.target.value
                  )
                }
                disabled={
                  Boolean(
                    editingSecurity
                  )
                }
                className={inputClass}
              >
                {groups.map(
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

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tags
              </span>

              <div className="relative">
                <Tag className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <input
                  value={
                    draft.tags
                  }
                  onChange={(
                    event
                  ) =>
                    update({
                      tags:
                        event.target.value,
                    })
                  }
                  placeholder="Growth, Income, Research"
                  className={`${inputClass} pl-9`}
                />
              </div>

              <span className="block text-xs text-slate-500">
                Separate tags with commas.
              </span>

              {error(
                "tags"
              ) && (
                <span className="block text-xs font-medium text-red-600 dark:text-red-400">
                  {
                    error(
                      "tags"
                    )
                  }
                </span>
              )}
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Research Notes
              </span>

              <textarea
                value={
                  draft.note
                }
                onChange={(
                  event
                ) =>
                  update({
                    note:
                      event.target.value,
                  })
                }
                rows={6}
                maxLength={2000}
                placeholder="Investment thesis, valuation notes, risks or catalysts..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-800"
              />

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {
                    draft.note
                      .length
                  }{" "}
                  / 2,000
                </span>

                {error(
                  "note"
                ) && (
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    {
                      error(
                        "note"
                      )
                    }
                  </span>
                )}
              </div>
            </label>
          </div>
        </div>

        <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            <Save className="h-4 w-4" />
            {editingSecurity
              ? "Save Changes"
              : "Add Security"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
