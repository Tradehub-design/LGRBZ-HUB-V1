"use client";

import {
  AlertTriangle,
  Database,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function TransactionsError({
  error,
  reset,
}: Props) {
  useEffect(() => {
    console.error(
      "Professional Transactions route error:",
      error
    );
  }, [error]);

  const openLegacyView = () => {
    try {
      window.localStorage.setItem(
        "lgrbz.transactions.route-view.v1",
        "legacy"
      );
    } catch {
      // Recovery must continue even when storage is unavailable.
    }

    window.location.reload();
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <main className="space-y-5">
      <section
        className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm dark:border-red-900 dark:bg-slate-950"
        role="alert"
      >
        <div className="border-b border-red-100 bg-red-50 px-6 py-6 dark:border-red-950 dark:bg-red-950/30">
          <div className="flex items-start gap-4">
            <span className="rounded-2xl bg-red-100 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">
              <AlertTriangle className="h-6 w-6" />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600 dark:text-red-400">
                Transactions Recovery
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-red-950 dark:text-red-100">
                The Transactions workspace encountered an error
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-red-700 dark:text-red-300">
                Your transaction ledger has not been cleared. Retry the professional workspace, reload the route, or return to the preserved existing ledger tools.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-slate-500" />

              <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Ledger protection
              </h2>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              This recovery screen does not delete, overwrite or re-import transaction data. It only changes which Transactions interface is opened.
            </p>

            {error.message && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Error details
                </p>

                <p className="mt-2 break-words text-xs leading-5 text-slate-700 dark:text-slate-300">
                  {error.message}
                </p>

                {error.digest && (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Reference: {error.digest}
                  </p>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-slate-500" />

              <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Recovery actions
              </h2>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={reset}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Workspace
              </button>

              <button
                type="button"
                onClick={reloadPage}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <RotateCcw className="h-4 w-4" />
                Reload Transactions
              </button>

              <button
                type="button"
                onClick={openLegacyView}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50"
              >
                <Database className="h-4 w-4" />
                Open Existing Ledger Tools
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
