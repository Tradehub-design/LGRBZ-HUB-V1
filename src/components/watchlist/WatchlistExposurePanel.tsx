"use client";

import {
  Globe2,
  Layers3,
  Network,
  WalletCards,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import {
  createExposureRows,
} from "@/lib/watchlist/watchlistIntelligence";
import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  securities: WatchlistSecurity[];
};

type ExposureMode =
  | "sector"
  | "industry"
  | "exchange"
  | "currency";

const modes: Array<{
  id: ExposureMode;
  label: string;
  icon:
    typeof Layers3;
}> = [
  {
    id: "sector",
    label: "Sector",
    icon: Layers3,
  },
  {
    id: "industry",
    label: "Industry",
    icon: Network,
  },
  {
    id: "exchange",
    label: "Exchange",
    icon: Globe2,
  },
  {
    id: "currency",
    label: "Currency",
    icon: WalletCards,
  },
];

export function WatchlistExposurePanel({
  securities,
}: Props) {
  const [
    mode,
    setMode,
  ] =
    useState<ExposureMode>(
      "sector"
    );

  const rows =
    useMemo(
      () =>
        createExposureRows(
          securities,
          mode
        ),
      [
        securities,
        mode,
      ]
    );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Watchlist Exposure
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
            Concentration overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Understand where research attention is concentrated.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {modes.map(
            (entry) => {
              const Icon =
                entry.icon;

              const active =
                mode ===
                entry.id;

              return (
                <button
                  key={
                    entry.id
                  }
                  type="button"
                  onClick={() =>
                    setMode(
                      entry.id
                    )
                  }
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {entry.label}
                </button>
              );
            }
          )}
        </div>
      </div>

      {rows.length ===
      0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500 dark:border-slate-700">
          Add securities to calculate exposure.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {rows
            .slice(0, 8)
            .map(
              (row) => (
                <article
                  key={
                    row.key
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {row.label}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {row.count} securit
                        {row.count ===
                        1
                          ? "y"
                          : "ies"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
                        {row.percentage.toFixed(
                          1
                        )}
                        %
                      </p>

                      <p
                        className={`text-xs font-semibold ${
                          row.averageChangePercent >
                          0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : row.averageChangePercent <
                                0
                              ? "text-red-600 dark:text-red-400"
                              : "text-slate-500"
                        }`}
                      >
                        {row.averageChangePercent >
                        0
                          ? "+"
                          : ""}
                        {row.averageChangePercent.toFixed(
                          2
                        )}
                        % avg
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                    <div
                      className="h-full rounded-full bg-slate-700 dark:bg-slate-300"
                      style={{
                        width: `${Math.max(
                          2,
                          row.percentage
                        )}%`,
                      }}
                    />
                  </div>
                </article>
              )
            )}
        </div>
      )}
    </section>
  );
}
