"use client";

import { Keyboard, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const shortcuts = [
  {
    keys: ["Ctrl/Cmd", "F"],
    label: "Focus transaction search",
  },
  {
    keys: ["Ctrl/Cmd", "Shift", "F"],
    label: "Open advanced filters",
  },
  {
    keys: ["Ctrl/Cmd", "Shift", "S"],
    label: "Open saved views",
  },
  {
    keys: ["Ctrl/Cmd", "Shift", "C"],
    label: "Open column settings",
  },
  {
    keys: ["Ctrl/Cmd", "E"],
    label: "Export filtered transactions",
  },
  {
    keys: ["Ctrl/Cmd", "A"],
    label: "Select all rows on current page",
  },
  {
    keys: ["J / ↓"],
    label: "Move focus to next transaction",
  },
  {
    keys: ["K / ↑"],
    label: "Move focus to previous transaction",
  },
  {
    keys: ["Home"],
    label: "Move focus to first visible transaction",
  },
  {
    keys: ["End"],
    label: "Move focus to last visible transaction",
  },
  {
    keys: ["Space"],
    label: "Toggle focused transaction selection",
  },
  {
    keys: ["Enter"],
    label: "Edit focused transaction",
  },
  {
    keys: ["Delete"],
    label: "Delete focused transaction",
  },
  {
    keys: ["Page Up"],
    label: "Previous transaction page",
  },
  {
    keys: ["Page Down"],
    label: "Next transaction page",
  },
  {
    keys: ["Esc"],
    label: "Close overlays or clear selection",
  },
];

export function TransactionKeyboardHelp({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close keyboard shortcuts"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 flex max-h-[88vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Keyboard Navigation
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Transaction workspace shortcuts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Navigate large transaction ledgers without leaving the keyboard.
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
          <div className="grid gap-3 sm:grid-cols-2">
            {shortcuts.map((shortcut) => (
              <article
                key={`${shortcut.keys.join("-")}-${shortcut.label}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="flex flex-wrap gap-1.5">
                  {shortcut.keys.map((key) => (
                    <kbd
                      key={key}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {shortcut.label}
                </p>
              </article>
            ))}
          </div>
        </div>

        <footer className="flex justify-end border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
