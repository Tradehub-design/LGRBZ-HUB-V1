"use client";

import {
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import type {
  DividendEvent,
} from "@/lib/dividend-data";
import type {
  DividendCentreFilter,
} from "./dividendCentreTypes";
import {
  countDividendStatuses,
} from "./resolveDividendCentreData";

type Props = {
  filter:
    DividendCentreFilter;
  events:
    DividendEvent[];
  refreshing?: boolean;
  onFilterChange: (
    filter:
      DividendCentreFilter
  ) => void;
  onRefresh?: () => void;
  onExport: () => void;
};

const filters:
  DividendCentreFilter[] = [
    "ALL",
    "ANNOUNCED",
    "FORECAST",
    "RECEIVED",
  ];

export function DividendCentreToolbar({
  filter,
  events,
  refreshing = false,
  onFilterChange,
  onRefresh,
  onExport,
}: Props) {
  const counts =
    countDividendStatuses(
      events
    );

  return (
    <section className="sticky top-3 z-40 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <Filter className="h-4 w-4" />
          </span>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Dividend Event Filters
            </p>

            <p className="text-xs text-slate-500">
              Confirmed and estimated events remain clearly separated.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map(
            (item) => {
              const active =
                item === filter;

              const label =
                item === "ALL"
                  ? "All"
                  : item
                      .toLowerCase()
                      .replace(
                        /^\w/,
                        (
                          character
                        ) =>
                          character.toUpperCase()
                      );

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    onFilterChange(
                      item
                    )
                  }
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  {label}{" "}
                  <span className="opacity-70">
                    {counts[item]}
                  </span>
                </button>
              );
            }
          )}

          {onRefresh && (
            <button
              type="button"
              disabled={
                refreshing
              }
              onClick={
                onRefresh
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
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

          <button
            type="button"
            onClick={
              onExport
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </section>
  );
}
