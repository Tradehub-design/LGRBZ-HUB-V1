"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  defaultWatchlistFilters,
} from "@/lib/watchlist/watchlistDefaults";
import {
  calculateWatchlistSummary,
  filterWatchlistSecurities,
  getWatchlistFilterOptions,
  sortWatchlistSecurities,
} from "@/lib/watchlist/watchlistEngine";
import {
  WatchlistFilters,
  WatchlistSortKey,
  WatchlistViewMode,
} from "@/lib/watchlist/watchlistTypes";
import {
  useWatchlistState,
} from "@/hooks/useWatchlistState";
import {
  WatchlistStarterTable,
} from "./WatchlistStarterTable";
import {
  WatchlistSummaryCards,
} from "./WatchlistSummaryCards";
import {
  WatchlistToolbar,
} from "./WatchlistToolbar";

export function ProfessionalWatchlistWorkspace() {
  const {
    state,
    loading,
    updateState,
  } = useWatchlistState();

  const [
    filters,
    setFilters,
  ] =
    useState<WatchlistFilters>(
      defaultWatchlistFilters
    );

  const activeGroup =
    state?.groups.find(
      (group) =>
        group.id ===
        state.activeGroupId
    );

  const activeSecurities =
    useMemo(() => {
      if (
        !state ||
        !activeGroup
      ) {
        return [];
      }

      const allowed =
        new Set(
          activeGroup.securityIds
        );

      return state.securities.filter(
        (security) =>
          allowed.has(
            security.id
          )
      );
    }, [
      state,
      activeGroup,
    ]);

  const options =
    useMemo(
      () =>
        getWatchlistFilterOptions(
          activeSecurities
        ),
      [activeSecurities]
    );

  const filtered =
    useMemo(
      () =>
        filterWatchlistSecurities(
          activeSecurities,
          filters
        ),
      [
        activeSecurities,
        filters,
      ]
    );

  const sorted =
    useMemo(
      () =>
        state
          ? sortWatchlistSecurities(
              filtered,
              state.sortKey,
              state.sortDirection
            )
          : [],
      [
        filtered,
        state,
      ]
    );

  const summary =
    useMemo(
      () =>
        calculateWatchlistSummary(
          filtered
        ),
      [filtered]
    );

  const handleSort = (
    key: WatchlistSortKey
  ) => {
    if (!state) {
      return;
    }

    updateState({
      ...state,
      sortKey: key,
      sortDirection:
        state.sortKey === key &&
        state.sortDirection ===
          "asc"
          ? "desc"
          : "asc",
    });
  };

  const changeViewMode = (
    viewMode: WatchlistViewMode
  ) => {
    if (!state) {
      return;
    }

    updateState({
      ...state,
      viewMode,
    });
  };

  if (
    loading ||
    !state
  ) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900"
            />
          ))}
        </div>

        <div className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />

        <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WatchlistSummaryCards
        summary={summary}
      />

      <WatchlistToolbar
        filters={filters}
        exchanges={
          options.exchanges
        }
        sectors={
          options.sectors
        }
        viewMode={
          state.viewMode
        }
        onFiltersChange={
          setFilters
        }
        onViewModeChange={
          changeViewMode
        }
        onAddSecurity={() =>
          window.alert(
            "Professional Add Security workflow arrives in Watchlist Bash 2."
          )
        }
      />

      <WatchlistStarterTable
        securities={sorted}
        sortKey={
          state.sortKey
        }
        sortDirection={
          state.sortDirection
        }
        onSort={
          handleSort
        }
      />
    </div>
  );
}
