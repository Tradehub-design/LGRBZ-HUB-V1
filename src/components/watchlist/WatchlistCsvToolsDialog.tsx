"use client";

import {
  Download,
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
} from "react";
import {
  parseWatchlistCsv,
  WatchlistCsvImportResult,
} from "@/lib/watchlist/watchlistCsv";
import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  open: boolean;
  securities: WatchlistSecurity[];
  onClose: () => void;
  onImport: (
    result: WatchlistCsvImportResult
  ) => void;
  onExportAll: () => void;
};

export function WatchlistCsvToolsDialog({
  open,
  securities,
  onClose,
  onImport,
  onExportAll,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [
    result,
    setResult,
  ] =
    useState<WatchlistCsvImportResult | null>(
      null
    );

  if (!open) {
    return null;
  }

  const readFile = async (
    file: File
  ) => {
    const text =
      await file.text();

    setResult(
      parseWatchlistCsv(
        text
      )
    );
  };

  return (
    <div className="fixed inset-0 z-[95]">
      <button
        type="button"
        aria-label="Close CSV tools"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <FileSpreadsheet className="h-5 w-5" />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Watchlist Data
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                CSV import and export
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Import research candidates or export the current Watchlist.
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
          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="rounded-2xl border border-dashed border-slate-300 p-6 text-left hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            <Upload className="h-6 w-6 text-slate-500" />

            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Import CSV
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Required column: symbol. Other supported fields include price, target price, sector and rating.
            </p>
          </button>

          <button
            type="button"
            onClick={
              onExportAll
            }
            className="rounded-2xl border border-slate-200 p-6 text-left hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <Download className="h-6 w-6 text-slate-500" />

            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Export Watchlist
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Export {securities.length} securit
              {securities.length ===
              1
                ? "y"
                : "ies"}{" "}
              in a portable CSV format.
            </p>
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(
            event
          ) => {
            const file =
              event.target.files?.[0];

            if (file) {
              void readFile(
                file
              );
            }

            event.target.value =
              "";
          }}
        />

        {result && (
          <div className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">
                  Rows
                </p>

                <p className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
                  {
                    result.totalRows
                  }
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Valid
                </p>

                <p className="mt-1 text-lg font-bold text-emerald-600">
                  {
                    result.validRows
                  }
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Errors
                </p>

                <p className="mt-1 text-lg font-bold text-red-600">
                  {
                    result.errors.length
                  }
                </p>
              </div>
            </div>

            {result.errors.length >
              0 && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
                {result.errors
                  .slice(0, 8)
                  .map(
                    (
                      error
                    ) => (
                      <p
                        key={
                          error
                        }
                      >
                        {error}
                      </p>
                    )
                  )}
              </div>
            )}

            {result.warnings.length >
              0 && (
              <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                {result.warnings.map(
                  (
                    warning
                  ) => (
                    <p
                      key={
                        warning
                      }
                    >
                      {warning}
                    </p>
                  )
                )}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={
                  result.validRows ===
                  0
                }
                onClick={() =>
                  onImport(
                    result
                  )
                }
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950"
              >
                Import {
                  result.validRows
                } Securit
                {result.validRows ===
                1
                  ? "y"
                  : "ies"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
