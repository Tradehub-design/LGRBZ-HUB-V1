"use client";

import {
  Grid2X2,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  TableProperties,
} from "lucide-react";
import {
  WatchlistFilters,
  WatchlistViewMode,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  filters: WatchlistFilters;
  exchanges: string[];
  sectors: string[];
  viewMode: WatchlistViewMode;
  onFiltersChange: (
    filters: WatchlistFilters
  ) => void;
  onViewModeChange: (
    viewMode: WatchlistViewMode
  ) => void;
  onAddSecurity: () => void;
};

export function WatchlistToolbar({
  filters,
  exchanges,
  sectors,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onAddSecurity,
}: Props) {
  const update = (
    patch: Partial<WatchlistFilters>
  ) => {
    onFiltersChange({
      ...filters,
      ...patch,
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />

            <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Watchlist Controls
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Search, filter and change the watchlist presentation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 p-1 dark:border-slate-800">
            <button
              type="button"
              onClick={() =>
                onViewModeChange(
                  "table"
                )
              }
              className={`rounded-lg p-2 ${
                viewMode === "table"
                  ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
              title="Table view"
            >
              <TableProperties className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                onViewModeChange(
                  "cards"
                )
              }
              className={`rounded-lg p-2 ${
                viewMode === "cards"
                  ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
              title="Card view"
            >
              <Grid2X2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                onViewModeChange(
                  "compact"
                )
              }
              className={`rounded-lg p-2 ${
                viewMode === "compact"
                  ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
              title="Compact view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onAddSecurity}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
          >
            <Plus className="h-4 w-4" />
            Add Security
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <label className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={filters.search}
            onChange={(event) =>
              update({
                search:
                  event.target.value,
              })
            }
            placeholder="Search symbol, company, sector, tag or note..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>

        <select
          value={filters.exchange}
          onChange={(event) =>
            update({
              exchange:
                event.target.value,
            })
          }
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="ALL">
            All Exchanges
          </option>

          {exchanges.map(
            (exchange) => (
              <option
                key={exchange}
                value={exchange}
              >
                {exchange}
              </option>
            )
          )}
        </select>

        <select
          value={filters.sector}
          onChange={(event) =>
            update({
              sector:
                event.target.value,
            })
          }
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="ALL">
            All Sectors
          </option>

          {sectors.map(
            (sector) => (
              <option
                key={sector}
                value={sector}
              >
                {sector}
              </option>
            )
          )}
        </select>
      </div>
    </section>
  );
}
