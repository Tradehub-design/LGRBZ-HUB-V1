"use client";

import {
  CalendarDays,
  Check,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addWatchlistCatalyst,
  createWatchlistCatalyst,
  defaultWatchlistCatalystDraft,
  loadWatchlistCatalysts,
  removeWatchlistCatalyst,
  saveWatchlistCatalysts,
  toggleWatchlistCatalyst,
  upcomingWatchlistCatalysts,
  WatchlistCatalystDraft,
  WatchlistCatalystStore,
} from "@/lib/watchlist/watchlistIntelligence";
import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  securities: WatchlistSecurity[];
};

function formatDate(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(
    "en-AU",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export function WatchlistCatalystPanel({
  securities,
}: Props) {
  const [
    store,
    setStore,
  ] =
    useState<WatchlistCatalystStore>({
      version: 1,
      catalysts: [],
    });

  const [
    editorOpen,
    setEditorOpen,
  ] = useState(false);

  const [
    draft,
    setDraft,
  ] =
    useState<WatchlistCatalystDraft>(
      defaultWatchlistCatalystDraft
    );

  useEffect(() => {
    setStore(
      loadWatchlistCatalysts()
    );
  }, []);

  const upcoming =
    useMemo(
      () =>
        upcomingWatchlistCatalysts(
          store,
          6
        ),
      [store]
    );

  const persist = (
    next: WatchlistCatalystStore
  ) => {
    setStore(next);

    saveWatchlistCatalysts(
      next
    );
  };

  const openEditor = () => {
    setDraft({
      ...defaultWatchlistCatalystDraft,
      securityId:
        securities[0]?.id ??
        "",
      date:
        new Date()
          .toISOString()
          .slice(0, 10),
    });

    setEditorOpen(true);
  };

  const save = () => {
    if (
      !draft.securityId ||
      !draft.title.trim() ||
      !draft.date
    ) {
      return;
    }

    persist(
      addWatchlistCatalyst(
        store,
        createWatchlistCatalyst(
          draft,
          securities
        )
      )
    );

    setEditorOpen(false);
  };

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Research Calendar
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Upcoming catalysts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track earnings, dividends, results and company events.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openEditor
            }
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {upcoming.length ===
        0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
            <CalendarDays className="mx-auto h-7 w-7 text-slate-400" />

            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              No upcoming catalysts
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Add an earnings date, dividend event or research milestone.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {upcoming.map(
              (catalyst) => (
                <article
                  key={
                    catalyst.id
                  }
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <button
                    type="button"
                    onClick={() =>
                      persist(
                        toggleWatchlistCatalyst(
                          store,
                          catalyst.id
                        )
                      )
                    }
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    title="Mark complete"
                  >
                    <Check className="h-4 w-4" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-950 dark:text-slate-50">
                        {
                          catalyst.symbol
                        }
                      </span>

                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {
                          catalyst.type
                        }
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {
                        catalyst.title
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(
                        catalyst.date
                      )}
                    </p>

                    {catalyst.note && (
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {
                          catalyst.note
                        }
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      persist(
                        removeWatchlistCatalyst(
                          store,
                          catalyst.id
                        )
                      )
                    }
                    className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                    title="Delete catalyst"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {editorOpen && (
        <div className="fixed inset-0 z-[95]">
          <button
            type="button"
            aria-label="Close catalyst editor"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() =>
              setEditorOpen(
                false
              )
            }
          />

          <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Research Catalyst
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                  Add upcoming event
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditorOpen(
                    false
                  )
                }
                className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:border-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Security
                </span>

                <select
                  value={
                    draft.securityId
                  }
                  onChange={(
                    event
                  ) =>
                    setDraft(
                      (
                        current
                      ) => ({
                        ...current,
                        securityId:
                          event.target.value,
                      })
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  {securities.map(
                    (security) => (
                      <option
                        key={
                          security.id
                        }
                        value={
                          security.id
                        }
                      >
                        {
                          security.symbol
                        }{" "}
                        —{" "}
                        {
                          security.name
                        }
                      </option>
                    )
                  )}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Event Type
                  </span>

                  <select
                    value={
                      draft.type
                    }
                    onChange={(
                      event
                    ) =>
                      setDraft(
                        (
                          current
                        ) => ({
                          ...current,
                          type:
                            event.target
                              .value as WatchlistCatalystDraft["type"],
                        })
                      )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="EARNINGS">
                      Earnings
                    </option>
                    <option value="DIVIDEND">
                      Dividend
                    </option>
                    <option value="RESULTS">
                      Results
                    </option>
                    <option value="AGM">
                      AGM
                    </option>
                    <option value="PRODUCT">
                      Product
                    </option>
                    <option value="REGULATORY">
                      Regulatory
                    </option>
                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </span>

                  <input
                    type="date"
                    value={
                      draft.date
                    }
                    onChange={(
                      event
                    ) =>
                      setDraft(
                        (
                          current
                        ) => ({
                          ...current,
                          date:
                            event.target.value,
                        })
                      )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Title
                </span>

                <input
                  value={
                    draft.title
                  }
                  onChange={(
                    event
                  ) =>
                    setDraft(
                      (
                        current
                      ) => ({
                        ...current,
                        title:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="e.g. FY26 half-year results"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes
                </span>

                <textarea
                  value={
                    draft.note
                  }
                  onChange={(
                    event
                  ) =>
                    setDraft(
                      (
                        current
                      ) => ({
                        ...current,
                        note:
                          event.target.value,
                      })
                    )
                  }
                  rows={4}
                  placeholder="Questions, expectations or actions..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditorOpen(
                    false
                  )
                }
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                disabled={
                  !draft.securityId ||
                  !draft.title.trim() ||
                  !draft.date
                }
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950"
              >
                Save Catalyst
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
