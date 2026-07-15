"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BriefcaseBusiness,
  Download,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type {
  HoldingsVisualPosition,
  HoldingsVisualSnapshot,
} from "@/lib/holdings-professional/holdingsVisualModels";
import {
  createHoldingsTableResult,
  exportHoldingsCsv,
} from "@/lib/holdings-professional/holdingsTableEngine";
import {
  defaultHoldingsColumns,
} from "@/lib/holdings-professional/holdingsTableModels";
import type {
  HoldingsColumnKey,
  HoldingsSortKey,
  HoldingsTableFilters,
} from "@/lib/holdings-professional/holdingsTableModels";
import {
  HoldingsColumnMenu,
} from "./HoldingsColumnMenu";
import {
  HoldingsFilterBar,
} from "./HoldingsFilterBar";
import {
  HoldingsMobileCard,
} from "./HoldingsMobileCard";
import {
  HoldingsTablePagination,
} from "./HoldingsTablePagination";

type InstitutionalHoldingsTableProps = {
  snapshot:
    HoldingsVisualSnapshot;
};

const initialFilters:
  HoldingsTableFilters = {
    search: "",

    sectors: [],
    countries: [],

    performance:
      "ALL",

    income:
      "ALL",

    quote:
      "ALL",
  };

function money(
  value: number,
  currency = "AUD",
  digits = 0
): string {
  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits:
        digits,
    }
  ).format(value);
}

function percent(
  value: number | null,
  positivePrefix = true
): string {
  if (value === null) {
    return "—";
  }

  return `${positivePrefix && value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

function tone(
  value: number | null
): string {
  if (
    value === null ||
    value === 0
  ) {
    return "text-slate-300";
  }

  return value > 0
    ? "text-emerald-300"
    : "text-rose-300";
}

function quoteClass(
  status: string
): string {
  const value =
    status.toUpperCase();

  if (
    value.includes(
      "LIVE"
    ) ||
    value.includes(
      "FRESH"
    ) ||
    value.includes(
      "PRICED"
    )
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (
    value.includes(
      "DELAY"
    ) ||
    value.includes(
      "STALE"
    )
  ) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  return "border-slate-700 bg-slate-800 text-slate-400";
}

function downloadCsv(
  rows:
    readonly HoldingsVisualPosition[]
): void {
  const csv =
    exportHoldingsCsv(
      rows
    );

  const blob =
    new Blob(
      [
        csv,
      ],
      {
        type:
          "text/csv;charset=utf-8",
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const anchor =
    document.createElement(
      "a"
    );

  anchor.href =
    url;

  anchor.download =
    `lgrbz-holdings-${new Date()
      .toISOString()
      .slice(
        0,
        10
      )}.csv`;

  document.body.appendChild(
    anchor
  );

  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(
    url
  );
}

function SortButton({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;

  sortKey:
    HoldingsSortKey;

  activeKey:
    HoldingsSortKey;

  direction:
    "ASC" |
    "DESC";

  onSort:
    (
      key:
        HoldingsSortKey
    ) => void;
}) {
  const active =
    activeKey ===
    sortKey;

  const Icon =
    !active
      ? ArrowUpDown
      : direction ===
          "ASC"
        ? ArrowUp
        : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => {
        onSort(
          sortKey
        );
      }}
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 transition hover:text-slate-300"
    >
      {label}

      <Icon
        className={[
          "h-3",
          "w-3",
          active
            ? "text-cyan-300"
            : "",
        ].join(" ")}
      />
    </button>
  );
}

export function InstitutionalHoldingsTable({
  snapshot,
}: InstitutionalHoldingsTableProps) {
  const [
    filters,
    setFilters,
  ] =
    useState<HoldingsTableFilters>(
      initialFilters
    );

  const [
    sortKey,
    setSortKey,
  ] =
    useState<HoldingsSortKey>(
      "MARKET_VALUE"
    );

  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<
      "ASC" |
      "DESC"
    >(
      "DESC"
    );

  const [
    page,
    setPage,
  ] =
    useState(
      1
    );

  const [
    pageSize,
    setPageSize,
  ] =
    useState(
      20
    );

  const [
    visibleColumns,
    setVisibleColumns,
  ] =
    useState<
      HoldingsColumnKey[]
    >(
      defaultHoldingsColumns
    );

  const result =
    useMemo(
      () =>
        createHoldingsTableResult({
          positions:
            snapshot.positions,

          filters,

          sortKey,
          sortDirection,

          page,
          pageSize,
        }),
      [
        filters,
        page,
        pageSize,
        snapshot.positions,
        sortDirection,
        sortKey,
      ]
    );

  useEffect(
    () => {
      if (
        page !==
        result.page
      ) {
        setPage(
          result.page
        );
      }
    },
    [
      page,
      result.page,
    ]
  );

  const isVisible =
    (
      column:
        HoldingsColumnKey
    ): boolean =>
      visibleColumns.includes(
        column
      );

  const handleSort =
    (
      key:
        HoldingsSortKey
    ): void => {
      if (
        key ===
        sortKey
      ) {
        setSortDirection(
          current =>
            current ===
            "ASC"
              ? "DESC"
              : "ASC"
        );

        return;
      }

      setSortKey(
        key
      );

      setSortDirection(
        "DESC"
      );
    };

  return (
    <section
      id="institutional-holdings-table"
      className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522]"
    >
      <header className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Institutional Position Ledger
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Professional Holdings Table
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Search, filter, sort, export and open detailed position intelligence.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/45 px-3 py-2">
            <p className="text-[9px] uppercase tracking-wider text-slate-700">
              Results
            </p>

            <p className="mt-0.5 text-sm font-semibold text-white">
              {result.filteredRows}
            </p>
          </div>

          <HoldingsColumnMenu
            visibleColumns={
              visibleColumns
            }
            onChange={
              setVisibleColumns
            }
          />

          <button
            type="button"
            onClick={() => {
              downloadCsv(
                result.allFilteredRows
              );
            }}
            disabled={
              result.filteredRows ===
              0
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />

            Export CSV
          </button>
        </div>
      </header>

      <HoldingsFilterBar
        filters={
          filters
        }
        availableSectors={
          result.availableSectors
        }
        availableCountries={
          result.availableCountries
        }
        activeFilterCount={
          result.activeFilterCount
        }
        onChange={
          nextFilters => {
            setFilters(
              nextFilters
            );

            setPage(
              1
            );
          }
        }
        onClear={() => {
          setFilters(
            initialFilters
          );

          setPage(
            1
          );
        }}
      />

      <div className="hidden max-h-[760px] overflow-auto lg:block">
        <table className="w-full min-w-[1500px] border-collapse">
          <thead className="sticky top-0 z-20 bg-[#071522]/95 shadow-[0_1px_0_rgba(51,65,85,0.8)] backdrop-blur-xl">
            <tr>
              {isVisible(
                "RANK"
              ) ? (
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Rank
                </th>
              ) : null}

              {isVisible(
                "HOLDING"
              ) ? (
                <th className="px-4 py-3 text-left">
                  <SortButton
                    label="Holding"
                    sortKey="SYMBOL"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "QUANTITY"
              ) ? (
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Quantity
                </th>
              ) : null}

              {isVisible(
                "MARKET_VALUE"
              ) ? (
                <th className="px-4 py-3 text-right">
                  <SortButton
                    label="Market value"
                    sortKey="MARKET_VALUE"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "WEIGHT"
              ) ? (
                <th className="px-4 py-3 text-right">
                  <SortButton
                    label="Weight"
                    sortKey="WEIGHT"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "DAILY_CHANGE"
              ) ? (
                <th className="px-4 py-3 text-right">
                  <SortButton
                    label="Today"
                    sortKey="DAILY_CHANGE"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "TOTAL_RETURN"
              ) ? (
                <th className="px-4 py-3 text-right">
                  <SortButton
                    label="Total return"
                    sortKey="TOTAL_RETURN"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "GAIN_LOSS"
              ) ? (
                <th className="px-4 py-3 text-right">
                  <SortButton
                    label="Gain/loss"
                    sortKey="GAIN_LOSS"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "DIVIDEND_YIELD"
              ) ? (
                <th className="px-4 py-3 text-right">
                  <SortButton
                    label="Dividend yield"
                    sortKey="DIVIDEND_YIELD"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "ANNUAL_INCOME"
              ) ? (
                <th className="px-4 py-3 text-right">
                  <SortButton
                    label="Annual income"
                    sortKey="ANNUAL_INCOME"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "SECTOR"
              ) ? (
                <th className="px-4 py-3 text-left">
                  <SortButton
                    label="Sector"
                    sortKey="SECTOR"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "COUNTRY"
              ) ? (
                <th className="px-4 py-3 text-left">
                  <SortButton
                    label="Country"
                    sortKey="COUNTRY"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}

              {isVisible(
                "QUOTE_STATUS"
              ) ? (
                <th className="px-4 py-3 text-right">
                  <SortButton
                    label="Quote"
                    sortKey="QUOTE_QUALITY"
                    activeKey={
                      sortKey
                    }
                    direction={
                      sortDirection
                    }
                    onSort={
                      handleSort
                    }
                  />
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {result.rows.map(
              (
                position,
                pageIndex
              ) => {
                const absoluteRank =
                  (
                    result.page -
                    1
                  ) *
                  result.pageSize +
                  pageIndex +
                  1;

                const ReturnIcon =
                  (
                    position.gainLossPercent ||
                    0
                  ) >= 0
                    ? TrendingUp
                    : TrendingDown;

                return (
                  <tr
                    key={position.symbol}
                    className="border-b border-slate-800/80 transition hover:bg-slate-900/45"
                  >
                    {isVisible(
                      "RANK"
                    ) ? (
                      <td className="px-4 py-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-slate-500">
                          {absoluteRank}
                        </span>
                      </td>
                    ) : null}

                    {isVisible(
                      "HOLDING"
                    ) ? (
                      <td className="px-4 py-4">
                        <div className="min-w-[220px]">
                          <Link
                            href={`/holdings?symbol=${encodeURIComponent(
                              position.symbol
                            )}`}
                            className="font-semibold text-white transition hover:text-cyan-300"
                          >
                            {position.symbol}
                          </Link>

                          <p className="mt-0.5 max-w-[240px] truncate text-xs text-slate-500">
                            {position.name}
                          </p>

                          <p className="mt-1 max-w-[240px] truncate text-[10px] text-slate-700">
                            {position.industry}
                          </p>
                        </div>
                      </td>
                    ) : null}

                    {isVisible(
                      "QUANTITY"
                    ) ? (
                      <td className="px-4 py-4 text-right text-sm text-slate-300">
                        {position.quantity.toLocaleString(
                          "en-AU",
                          {
                            maximumFractionDigits:
                              4,
                          }
                        )}
                      </td>
                    ) : null}

                    {isVisible(
                      "MARKET_VALUE"
                    ) ? (
                      <td className="px-4 py-4 text-right">
                        <p className="font-semibold text-white">
                          {money(
                            position.marketValue,
                            position.currency
                          )}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-700">
                          Cost{" "}
                          {money(
                            position.costBasis,
                            position.currency
                          )}
                        </p>
                      </td>
                    ) : null}

                    {isVisible(
                      "WEIGHT"
                    ) ? (
                      <td className="px-4 py-4 text-right">
                        <p className="font-semibold text-white">
                          {percent(
                            position.portfolioWeight,
                            false
                          )}
                        </p>

                        <div className="mt-2 ml-auto h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-400"
                            style={{
                              width: `${Math.min(
                                100,
                                position.portfolioWeight
                              )}%`,
                            }}
                          />
                        </div>
                      </td>
                    ) : null}

                    {isVisible(
                      "DAILY_CHANGE"
                    ) ? (
                      <td className="px-4 py-4 text-right">
                        <p
                          className={[
                            "font-semibold",
                            tone(
                              position.dailyChangePercent
                            ),
                          ].join(" ")}
                        >
                          {percent(
                            position.dailyChangePercent
                          )}
                        </p>

                        <p
                          className={[
                            "mt-0.5",
                            "text-[10px]",
                            tone(
                              position.dailyChange
                            ),
                          ].join(" ")}
                        >
                          {money(
                            position.dailyChange,
                            position.currency
                          )}
                        </p>
                      </td>
                    ) : null}

                    {isVisible(
                      "TOTAL_RETURN"
                    ) ? (
                      <td className="px-4 py-4 text-right">
                        <p
                          className={[
                            "inline-flex",
                            "items-center",
                            "justify-end",
                            "gap-1",
                            "font-semibold",
                            tone(
                              position.gainLossPercent
                            ),
                          ].join(" ")}
                        >
                          <ReturnIcon className="h-3.5 w-3.5" />

                          {percent(
                            position.gainLossPercent
                          )}
                        </p>
                      </td>
                    ) : null}

                    {isVisible(
                      "GAIN_LOSS"
                    ) ? (
                      <td
                        className={[
                          "px-4",
                          "py-4",
                          "text-right",
                          "font-semibold",
                          tone(
                            position.gainLoss
                          ),
                        ].join(" ")}
                      >
                        {money(
                          position.gainLoss,
                          position.currency
                        )}
                      </td>
                    ) : null}

                    {isVisible(
                      "DIVIDEND_YIELD"
                    ) ? (
                      <td className="px-4 py-4 text-right font-semibold text-emerald-200">
                        {percent(
                          position.dividendYield,
                          false
                        )}
                      </td>
                    ) : null}

                    {isVisible(
                      "ANNUAL_INCOME"
                    ) ? (
                      <td className="px-4 py-4 text-right font-semibold text-emerald-200">
                        {money(
                          position.annualIncome,
                          position.currency
                        )}
                      </td>
                    ) : null}

                    {isVisible(
                      "SECTOR"
                    ) ? (
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-violet-400/15 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold text-violet-200">
                          {position.sector}
                        </span>
                      </td>
                    ) : null}

                    {isVisible(
                      "COUNTRY"
                    ) ? (
                      <td className="px-4 py-4 text-xs text-slate-400">
                        {position.country}
                      </td>
                    ) : null}

                    {isVisible(
                      "QUOTE_STATUS"
                    ) ? (
                      <td className="px-4 py-4 text-right">
                        <span
                          className={[
                            "inline-flex",
                            "rounded-full",
                            "border",
                            "px-2",
                            "py-0.5",
                            "text-[9px]",
                            "font-semibold",
                            quoteClass(
                              position.quoteStatus
                            ),
                          ].join(" ")}
                        >
                          {position.quoteStatus}
                        </span>

                        {position.quoteQuality !==
                        null ? (
                          <p className="mt-1 text-[10px] text-slate-700">
                            {position.quoteQuality.toFixed(
                              0
                            )}
                            /100
                          </p>
                        ) : null}
                      </td>
                    ) : null}
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {result.rows.map(
          (
            position,
            pageIndex
          ) => (
            <HoldingsMobileCard
              key={position.symbol}
              position={
                position
              }
              rank={
                (
                  result.page -
                  1
                ) *
                result.pageSize +
                pageIndex +
                1
              }
            />
          )
        )}
      </div>

      {result.filteredRows ===
      0 ? (
        <div className="border-t border-slate-800 p-8 text-center">
          <SlidersHorizontal className="mx-auto h-8 w-8 text-slate-700" />

          <p className="mt-3 text-sm font-medium text-slate-300">
            No holdings match the selected filters
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Clear one or more filters to restore positions.
          </p>

          <button
            type="button"
            onClick={() => {
              setFilters(
                initialFilters
              );

              setPage(
                1
              );
            }}
            className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      <HoldingsTablePagination
        page={
          result.page
        }
        totalPages={
          result.totalPages
        }
        pageSize={
          result.pageSize
        }
        startIndex={
          result.startIndex
        }
        endIndex={
          result.endIndex
        }
        filteredRows={
          result.filteredRows
        }
        onPageChange={
          setPage
        }
        onPageSizeChange={
          nextPageSize => {
            setPageSize(
              nextPageSize
            );

            setPage(
              1
            );
          }
        }
      />
    </section>
  );
}
