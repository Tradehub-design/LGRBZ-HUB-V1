"use client";

import {
  Download,
  Plus,
  RefreshCw,
  Settings2,
  WalletCards,
} from "lucide-react";
import {
  holdingsV2FormatDateTime,
} from "@/lib/holdings-v2/holdingsV2Formatters";

type Props = {
  asOf?: string | null;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
};

export function HoldingsV2Header({
  asOf,
  loading = false,
  refreshing = false,
  onRefresh,
  onAdd,
  onExport,
  onSettings,
}: Props) {
  return (
    <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_35%)]" />

        <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
              <WalletCards className="h-3.5 w-3.5" />
              Portfolio Positions
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">
              Holdings
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Professional position management with current value, cost base, performance, allocation and income analysis.
            </p>

            <p className="mt-3 text-xs text-slate-500">
              Data as of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {loading
                  ? "Loading..."
                  : holdingsV2FormatDateTime(
                      asOf
                    )}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                disabled={
                  refreshing
                }
                onClick={
                  onRefresh
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />
                Refresh
              </button>
            )}

            {onExport && (
              <button
                type="button"
                onClick={
                  onExport
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            )}

            {onSettings && (
              <button
                type="button"
                onClick={
                  onSettings
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <Settings2 className="h-4 w-4" />
                View
              </button>
            )}

            {onAdd && (
              <button
                type="button"
                onClick={
                  onAdd
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
