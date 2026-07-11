"use client";

import {
  FolderPlus,
  Save,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultWatchlistGroupDraft,
  groupToDraft,
  validateWatchlistGroupDraft,
  WatchlistGroupDraft,
  watchlistGroupColours,
} from "@/lib/watchlist/watchlistGroups";
import {
  WatchlistGroup,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  open: boolean;
  groups: WatchlistGroup[];
  editingGroup: WatchlistGroup | null;
  onClose: () => void;
  onSave: (
    draft: WatchlistGroupDraft,
    editingGroup: WatchlistGroup | null
  ) => void;
};

const colourClasses:
  Record<string, string> = {
    slate:
      "bg-slate-500",
    blue:
      "bg-blue-500",
    emerald:
      "bg-emerald-500",
    amber:
      "bg-amber-500",
    rose:
      "bg-rose-500",
    violet:
      "bg-violet-500",
    cyan:
      "bg-cyan-500",
  };

export function WatchlistGroupDialog({
  open,
  groups,
  editingGroup,
  onClose,
  onSave,
}: Props) {
  const [
    draft,
    setDraft,
  ] =
    useState<WatchlistGroupDraft>(
      defaultWatchlistGroupDraft
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
      editingGroup
        ? groupToDraft(
            editingGroup
          )
        : {
            ...defaultWatchlistGroupDraft,
          }
    );

    setSubmitted(false);
  }, [
    open,
    editingGroup,
  ]);

  const validation =
    useMemo(
      () =>
        validateWatchlistGroupDraft(
          draft,
          groups,
          editingGroup?.id
        ),
      [
        draft,
        groups,
        editingGroup,
      ]
    );

  if (!open) {
    return null;
  }

  const submit = () => {
    setSubmitted(true);

    if (
      !validation.valid
    ) {
      return;
    }

    onSave(
      draft,
      editingGroup
    );
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close watchlist editor"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <FolderPlus className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
                {editingGroup
                  ? "Edit watchlist"
                  : "Create watchlist"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Organise securities into focused research groups.
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

        <div className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Watchlist Name
            </span>

            <input
              value={
                draft.name
              }
              onChange={(
                event
              ) =>
                setDraft(
                  (
                    current
                  ) => ({
                    ...current,
                    name:
                      event.target
                        .value,
                  })
                )
              }
              maxLength={80}
              placeholder="High Conviction"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />

            {submitted &&
              validation.errors
                .name && (
                <span className="block text-xs font-medium text-red-600 dark:text-red-400">
                  {
                    validation
                      .errors
                      .name
                  }
                </span>
              )}
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </span>

            <textarea
              value={
                draft.description
              }
              onChange={(
                event
              ) =>
                setDraft(
                  (
                    current
                  ) => ({
                    ...current,
                    description:
                      event.target
                        .value,
                  })
                )
              }
              rows={4}
              maxLength={300}
              placeholder="Securities requiring deeper research."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />

            {submitted &&
              validation.errors
                .description && (
                <span className="block text-xs font-medium text-red-600 dark:text-red-400">
                  {
                    validation
                      .errors
                      .description
                  }
                </span>
              )}
          </label>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Colour
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {watchlistGroupColours.map(
                (colour) => (
                  <button
                    key={colour}
                    type="button"
                    onClick={() =>
                      setDraft(
                        (
                          current
                        ) => ({
                          ...current,
                          colour,
                        })
                      )
                    }
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${
                      draft.colour ===
                      colour
                        ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                        : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${colourClasses[colour]}`}
                    />

                    {colour}
                  </button>
                )
              )}
            </div>
          </div>
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
            {editingGroup
              ? "Save Changes"
              : "Create Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
