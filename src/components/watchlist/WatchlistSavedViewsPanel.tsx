"use client";

import {
  Bookmark,
  Check,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  addWatchlistSavedView,
  createWatchlistSavedView,
  loadWatchlistSavedViews,
  removeWatchlistSavedView,
  saveWatchlistSavedViews,
  setActiveWatchlistSavedView,
  WatchlistSavedView,
  WatchlistSavedViewStore,
  WatchlistViewSnapshot,
} from "@/lib/watchlist/watchlistSavedViews";

type Props = {
  open: boolean;
  snapshot: WatchlistViewSnapshot;
  onClose: () => void;
  onApply: (
    view: WatchlistSavedView
  ) => void;
};

export function WatchlistSavedViewsPanel({
  open,
  snapshot,
  onClose,
  onApply,
}: Props) {
  const [
    store,
    setStore,
  ] =
    useState<WatchlistSavedViewStore>({
      version: 1,
      views: [],
      activeViewId: null,
    });

  const [
    name,
    setName,
  ] =
    useState("");

  useEffect(() => {
    if (open) {
      setStore(
        loadWatchlistSavedViews()
      );
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const persist = (
    next: WatchlistSavedViewStore
  ) => {
    setStore(next);

    saveWatchlistSavedViews(
      next
    );
  };

  const saveCurrent = () => {
    if (
      !name.trim()
    ) {
      return;
    }

    const view =
      createWatchlistSavedView(
        name,
        snapshot
      );

    persist(
      addWatchlistSavedView(
        store,
        view
      )
    );

    setName("");
  };

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close saved views"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <Bookmark className="h-4 w-4" />

              <p className="text-xs font-semibold uppercase tracking-wide">
                Saved Views
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Professional Watchlist views
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Save filters, sorting and display preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:border-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(
                event
              ) =>
                setName(
                  event.target.value
                )
              }
              placeholder="View name"
              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />

            <button
              type="button"
              disabled={
                !name.trim()
              }
              onClick={
                saveCurrent
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950"
            >
              <Plus className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {store.views.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-14 text-center dark:border-slate-700">
              <Bookmark className="mx-auto h-7 w-7 text-slate-400" />

              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                No saved views
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Configure the Watchlist and save the current setup.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {store.views.map(
                (view) => {
                  const active =
                    store.activeViewId ===
                    view.id;

                  return (
                    <article
                      key={
                        view.id
                      }
                      className={`rounded-2xl border p-4 ${
                        active
                          ? "border-slate-950 bg-slate-50 dark:border-slate-100 dark:bg-slate-900"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left"
                          onClick={() => {
                            persist(
                              setActiveWatchlistSavedView(
                                store,
                                view.id
                              )
                            );

                            onApply(
                              view
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                              {
                                view.name
                              }
                            </p>

                            {active && (
                              <Check className="h-4 w-4 text-emerald-600" />
                            )}
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            Sort:{" "}
                            {
                              view.sortKey
                            }{" "}
                            {
                              view.sortDirection
                            }{" "}
                            · View:{" "}
                            {
                              view.viewMode
                            }
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            persist(
                              removeWatchlistSavedView(
                                store,
                                view.id
                              )
                            )
                          }
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
