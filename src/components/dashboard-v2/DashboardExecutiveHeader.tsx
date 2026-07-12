"use client";

import {
  Activity,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  dashboardFormatDateTime,
} from "./dashboardV2Formatters";

type Props = {
  title?: string;
  subtitle?: string;
  asOf?: string | null;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;
  onRefresh?: () => void;
};

export function DashboardExecutiveHeader({
  title =
    "Portfolio Dashboard",
  subtitle =
    "Executive overview of portfolio value, performance, risk, income and activity.",
  asOf,
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
}: Props) {
  return (
    <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_32%)]" />

        <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                <Activity className="h-3.5 w-3.5" />
                Executive Overview
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Ledger-driven
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {subtitle}
            </p>

            <p className="mt-3 text-xs text-slate-500">
              Data as of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {loading
                  ? "Loading..."
                  : dashboardFormatDateTime(
                      asOf
                    )}
              </span>
            </p>

            {error && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                disabled={
                  refreshing
                }
                onClick={
                  onRefresh
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />

                {refreshing
                  ? "Refreshing"
                  : "Refresh"}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
