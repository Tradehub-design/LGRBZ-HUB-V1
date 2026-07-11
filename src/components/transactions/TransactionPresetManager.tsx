"use client";

import {
  Bookmark,
  Check,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TransactionFilterState } from "@/lib/transactions/professionalTransactions";
import {
  createTransactionFilterPreset,
  loadTransactionFilterPresets,
  saveTransactionFilterPresets,
  SavedTransactionPreset,
} from "@/lib/transactions/transactionPreferences";

type Props = {
  open: boolean;
  filters: TransactionFilterState;
  onClose: () => void;
  onApplyPreset: (filters: TransactionFilterState) => void;
};

export function TransactionPresetManager({
  open,
  filters,
  onClose,
  onApplyPreset,
}: Props) {
  const [presets, setPresets] = useState<SavedTransactionPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    if (!open) return;
    setPresets(loadTransactionFilterPresets());
  }, [open]);

  if (!open) return null;

  const persist = (next: SavedTransactionPreset[]) => {
    setPresets(next);
    saveTransactionFilterPresets(next);
  };

  const createPreset = () => {
    const name = newPresetName.trim();
    if (!name) return;

    const preset = createTransactionFilterPreset(name, filters);
    persist([preset, ...presets]);
    setNewPresetName("");
  };

  const deletePreset = (id: string) => {
    const preset = presets.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Delete saved filter preset "${preset?.name ?? "Saved Filter"}"?`
    );

    if (!confirmed) return;

    persist(presets.filter((item) => item.id !== id));
  };

  const beginRename = (preset: SavedTransactionPreset) => {
    setEditingId(preset.id);
    setEditingName(preset.name);
  };

  const saveRename = () => {
    if (!editingId) return;

    const name = editingName.trim();
    if (!name) return;

    persist(
      presets.map((preset) =>
        preset.id === editingId
          ? {
              ...preset,
              name,
            }
          : preset
      )
    );

    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close transaction preset manager"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 flex max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Saved Filter Presets
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Save and reuse transaction views
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Presets are stored locally in this browser.
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
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Save current filters
              </h3>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={newPresetName}
                onChange={(event) =>
                  setNewPresetName(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") createPreset();
                }}
                placeholder="Preset name, e.g. FY26 dividends"
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />

              <button
                type="button"
                onClick={createPreset}
                disabled={!newPresetName.trim()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-950"
              >
                <Save className="h-4 w-4" />
                Save Preset
              </button>
            </div>
          </section>

          <section className="mt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Available presets
              </h3>

              <span className="text-xs text-slate-500">
                {presets.length} saved
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {presets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center dark:border-slate-800">
                  <Bookmark className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    No saved presets yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Configure your filters and save the current view.
                  </p>
                </div>
              ) : (
                presets.map((preset) => (
                  <article
                    key={preset.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        {editingId === preset.id ? (
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                              value={editingName}
                              onChange={(event) =>
                                setEditingName(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") saveRename();
                                if (event.key === "Escape") {
                                  setEditingId(null);
                                  setEditingName("");
                                }
                              }}
                              autoFocus
                              className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                            />

                            <button
                              type="button"
                              onClick={saveRename}
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-950"
                            >
                              <Check className="h-4 w-4" />
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                              {preset.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Saved{" "}
                              {new Date(
                                preset.createdAt
                              ).toLocaleString("en-AU")}
                            </p>
                          </>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {preset.filters.search && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              Search: {preset.filters.search}
                            </span>
                          )}

                          {preset.filters.type !== "ALL" && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              Type: {preset.filters.type}
                            </span>
                          )}

                          {preset.filters.symbol !== "ALL" && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              Symbol: {preset.filters.symbol}
                            </span>
                          )}

                          {preset.filters.dateFrom && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              From: {preset.filters.dateFrom}
                            </span>
                          )}

                          {preset.filters.dateTo && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              To: {preset.filters.dateTo}
                            </span>
                          )}

                          {!preset.filters.search &&
                            preset.filters.type === "ALL" &&
                            preset.filters.symbol === "ALL" &&
                            !preset.filters.dateFrom &&
                            !preset.filters.dateTo && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800">
                                All transactions
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onApplyPreset(preset.filters);
                            onClose();
                          }}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
                        >
                          <Check className="h-4 w-4" />
                          Apply
                        </button>

                        <button
                          type="button"
                          onClick={() => beginRename(preset)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          <Pencil className="h-4 w-4" />
                          Rename
                        </button>

                        <button
                          type="button"
                          onClick={() => deletePreset(preset.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
