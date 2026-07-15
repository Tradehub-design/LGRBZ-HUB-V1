"use client";

import {
  Filter,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import type {
  HoldingsTableFilters,
} from "@/lib/holdings-professional/holdingsTableModels";

type HoldingsFilterBarProps = {
  filters:
    HoldingsTableFilters;

  availableSectors:
    string[];

  availableCountries:
    string[];

  activeFilterCount:
    number;

  onChange:
    (
      filters:
        HoldingsTableFilters
    ) => void;

  onClear: () => void;
};

function toggleValue(
  values: string[],
  value: string
): string[] {
  return values.includes(
    value
  )
    ? values.filter(
        item =>
          item !== value
      )
    : [
        ...values,
        value,
      ];
}

export function HoldingsFilterBar({
  filters,
  availableSectors,
  availableCountries,
  activeFilterCount,
  onChange,
  onClear,
}: HoldingsFilterBarProps) {
  return (
    <section className="border-b border-slate-800 bg-slate-950/20 p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

          <input
            type="search"
            value={filters.search}
            onChange={event => {
              onChange({
                ...filters,

                search:
                  event.target.value,
              });
            }}
            placeholder="Search ticker, company, sector, industry or country"
            className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2 xl:flex">
          <select
            value={filters.performance}
            onChange={event => {
              onChange({
                ...filters,

                performance:
                  event.target
                    .value as HoldingsTableFilters["performance"],
              });
            }}
            className="h-11 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-xs font-medium text-slate-300 outline-none focus:border-cyan-400/40"
          >
            <option value="ALL">
              All performance
            </option>

            <option value="PROFITABLE">
              Profitable
            </option>

            <option value="LOSING">
              Below cost
            </option>

            <option value="FLAT">
              Flat
            </option>

            <option value="OUTPERFORMERS">
              Return ≥ 10%
            </option>

            <option value="UNDERPERFORMERS">
              Return ≤ -10%
            </option>
          </select>

          <select
            value={filters.income}
            onChange={event => {
              onChange({
                ...filters,

                income:
                  event.target
                    .value as HoldingsTableFilters["income"],
              });
            }}
            className="h-11 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-xs font-medium text-slate-300 outline-none focus:border-cyan-400/40"
          >
            <option value="ALL">
              All income
            </option>

            <option value="DIVIDEND">
              Dividend holdings
            </option>

            <option value="NO_DIVIDEND">
              No dividend
            </option>

            <option value="HIGH_YIELD">
              Yield ≥ 4%
            </option>
          </select>

          <select
            value={filters.quote}
            onChange={event => {
              onChange({
                ...filters,

                quote:
                  event.target
                    .value as HoldingsTableFilters["quote"],
              });
            }}
            className="h-11 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-xs font-medium text-slate-300 outline-none focus:border-cyan-400/40"
          >
            <option value="ALL">
              All quote states
            </option>

            <option value="PRICED">
              Priced
            </option>

            <option value="LIVE">
              Live
            </option>

            <option value="DELAYED">
              Delayed
            </option>

            <option value="STALE">
              Stale
            </option>

            <option value="ESTIMATED">
              Estimated
            </option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-cyan-300" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Sectors
            </p>
          </div>

          <div className="flex max-h-20 flex-wrap gap-2 overflow-y-auto">
            {availableSectors.map(
              sector => {
                const selected =
                  filters.sectors.includes(
                    sector
                  );

                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...filters,

                        sectors:
                          toggleValue(
                            filters.sectors,
                            sector
                          ),
                      });
                    }}
                    className={[
                      "inline-flex",
                      "items-center",
                      "gap-1",
                      "rounded-full",
                      "border",
                      "px-2.5",
                      "py-1",
                      "text-[10px]",
                      "font-semibold",
                      "transition",
                      selected
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                        : "border-slate-700 bg-slate-900/50 text-slate-500 hover:text-slate-300",
                    ].join(" ")}
                  >
                    {sector}

                    {selected ? (
                      <X className="h-3 w-3" />
                    ) : null}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
            Countries
          </p>

          <div className="flex max-h-20 flex-wrap gap-2 overflow-y-auto">
            {availableCountries.map(
              country => {
                const selected =
                  filters.countries.includes(
                    country
                  );

                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...filters,

                        countries:
                          toggleValue(
                            filters.countries,
                            country
                          ),
                      });
                    }}
                    className={[
                      "inline-flex",
                      "items-center",
                      "gap-1",
                      "rounded-full",
                      "border",
                      "px-2.5",
                      "py-1",
                      "text-[10px]",
                      "font-semibold",
                      "transition",
                      selected
                        ? "border-violet-400/30 bg-violet-400/10 text-violet-200"
                        : "border-slate-700 bg-slate-900/50 text-slate-500 hover:text-slate-300",
                    ].join(" ")}
                  >
                    {country}

                    {selected ? (
                      <X className="h-3 w-3" />
                    ) : null}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {activeFilterCount > 0 ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3 py-2">
          <p className="text-xs text-cyan-200">
            {activeFilterCount} active filter
            {activeFilterCount ===
            1
              ? ""
              : "s"}
          </p>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />

            Clear all
          </button>
        </div>
      ) : null}
    </section>
  );
}
