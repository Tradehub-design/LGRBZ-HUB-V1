"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  Filter,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type {
  DividendEventConfidence,
  DividendEventStatus,
} from "@/lib/dividend-data";
import type {
  DividendTimelineRow,
} from "./dividendCentreTypes";
import {
  daysUntilDividend,
  dividendStatusClasses,
  formatDividendDate,
  formatDividendMoney,
  formatDividendNumber,
} from "./dividendCentreFormatters";

type Props = {
  rows: DividendTimelineRow[];
  title?: string;
  description?: string;
};

type StatusFilter =
  | "ALL"
  | DividendEventStatus;

type DateFilter =
  | "ALL"
  | "UPCOMING"
  | "30_DAYS"
  | "90_DAYS"
  | "THIS_YEAR"
  | "HISTORICAL";

type SortColumn =
  | "symbol"
  | "status"
  | "eventDate"
  | "exDate"
  | "paymentDate"
  | "eligibleQuantity"
  | "dividendPerShare"
  | "expectedCash"
  | "frankingCredit"
  | "confidence";

type SortDirection =
  | "asc"
  | "desc";

type SortState = {
  column: SortColumn;
  direction: SortDirection;
};

const PAGE_SIZE_OPTIONS = [
  10,
  20,
  50,
];

const STATUS_FILTERS:
  StatusFilter[] = [
    "ALL",
    "ANNOUNCED",
    "FORECAST",
    "RECEIVED",
    "CANCELLED",
    "UNKNOWN",
  ];

const DATE_FILTERS: Array<{
  value: DateFilter;
  label: string;
}> = [
  {
    value:
      "ALL",
    label:
      "All dates",
  },
  {
    value:
      "UPCOMING",
    label:
      "Upcoming",
  },
  {
    value:
      "30_DAYS",
    label:
      "Next 30 days",
  },
  {
    value:
      "90_DAYS",
    label:
      "Next 90 days",
  },
  {
    value:
      "THIS_YEAR",
    label:
      "This year",
  },
  {
    value:
      "HISTORICAL",
    label:
      "Historical",
  },
];

function startOfToday(): Date {
  const now =
    new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
}

function endOfToday(): Date {
  const today =
    startOfToday();

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );
}

function parseDate(
  value: string | null
): Date | null {
  if (!value) {
    return null;
  }

  const date =
    new Date(
      `${value.slice(
        0,
        10
      )}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}

function eventDate(
  row: DividendTimelineRow
): string | null {
  return (
    row.paymentDate ||
    row.date ||
    row.exDate
  );
}

function compareNullableNumbers(
  left: number | null,
  right: number | null
): number {
  if (
    left === null &&
    right === null
  ) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  return left - right;
}

function compareNullableStrings(
  left: string | null,
  right: string | null
): number {
  if (
    left === null &&
    right === null
  ) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  return left.localeCompare(
    right
  );
}

function statusLabel(
  status: DividendEventStatus
): string {
  if (
    status ===
    "ANNOUNCED"
  ) {
    return "Announced";
  }

  if (
    status ===
    "FORECAST"
  ) {
    return "Forecast";
  }

  if (
    status ===
    "RECEIVED"
  ) {
    return "Received";
  }

  if (
    status ===
    "CANCELLED"
  ) {
    return "Cancelled";
  }

  return "Unknown";
}

function confidenceLabel(
  confidence: string
): string {
  return confidence
    .toLowerCase()
    .replace(
      /_/g,
      " "
    )
    .replace(
      /^\w/,
      (
        character
      ) =>
        character.toUpperCase()
    );
}

function confidenceClasses(
  confidence:
    DividendEventConfidence |
    string
): string {
  if (
    confidence ===
    "CONFIRMED"
  ) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
  }

  if (
    confidence ===
    "HIGH"
  ) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
  }

  if (
    confidence ===
    "MEDIUM"
  ) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";
  }

  if (
    confidence ===
    "LOW"
  ) {
    return "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300";
  }

  return "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300";
}

function eventDateLabel(
  row: DividendTimelineRow
): string {
  if (
    row.paymentDate
  ) {
    return "Payment";
  }

  if (
    row.exDate
  ) {
    return "Ex-date";
  }

  return "Event";
}

function dateFilterMatches(
  row: DividendTimelineRow,
  filter: DateFilter
): boolean {
  if (
    filter ===
    "ALL"
  ) {
    return true;
  }

  const value =
    parseDate(
      eventDate(
        row
      )
    );

  if (!value) {
    return false;
  }

  const today =
    startOfToday();

  const todayEnd =
    endOfToday();

  if (
    filter ===
    "UPCOMING"
  ) {
    return (
      value.getTime() >=
      today.getTime()
    );
  }

  if (
    filter ===
    "30_DAYS"
  ) {
    const end =
      new Date(
        today
      );

    end.setDate(
      end.getDate() +
      30
    );

    return (
      value.getTime() >=
        today.getTime() &&
      value.getTime() <=
        end.getTime()
    );
  }

  if (
    filter ===
    "90_DAYS"
  ) {
    const end =
      new Date(
        today
      );

    end.setDate(
      end.getDate() +
      90
    );

    return (
      value.getTime() >=
        today.getTime() &&
      value.getTime() <=
        end.getTime()
    );
  }

  if (
    filter ===
    "THIS_YEAR"
  ) {
    return (
      value.getFullYear() ===
      today.getFullYear()
    );
  }

  if (
    filter ===
    "HISTORICAL"
  ) {
    return (
      value.getTime() <
      todayEnd.getTime()
    );
  }

  return true;
}

function sortRows(
  rows: DividendTimelineRow[],
  sort: SortState
): DividendTimelineRow[] {
  const output =
    [...rows];

  output.sort(
    (
      left,
      right
    ) => {
      let comparison =
        0;

      if (
        sort.column ===
        "symbol"
      ) {
        comparison =
          left.displaySymbol.localeCompare(
            right.displaySymbol
          );
      }

      if (
        sort.column ===
        "status"
      ) {
        comparison =
          left.status.localeCompare(
            right.status
          );
      }

      if (
        sort.column ===
        "eventDate"
      ) {
        comparison =
          compareNullableStrings(
            eventDate(
              left
            ),
            eventDate(
              right
            )
          );
      }

      if (
        sort.column ===
        "exDate"
      ) {
        comparison =
          compareNullableStrings(
            left.exDate,
            right.exDate
          );
      }

      if (
        sort.column ===
        "paymentDate"
      ) {
        comparison =
          compareNullableStrings(
            left.paymentDate,
            right.paymentDate
          );
      }

      if (
        sort.column ===
        "eligibleQuantity"
      ) {
        comparison =
          left.eligibleQuantity -
          right.eligibleQuantity;
      }

      if (
        sort.column ===
        "dividendPerShare"
      ) {
        comparison =
          compareNullableNumbers(
            left.dividendPerShare,
            right.dividendPerShare
          );
      }

      if (
        sort.column ===
        "expectedCash"
      ) {
        comparison =
          compareNullableNumbers(
            left.amount,
            right.amount
          );
      }

      if (
        sort.column ===
        "frankingCredit"
      ) {
        comparison =
          left.frankingCredit -
          right.frankingCredit;
      }

      if (
        sort.column ===
        "confidence"
      ) {
        comparison =
          left.confidence.localeCompare(
            right.confidence
          );
      }

      return sort.direction ===
        "asc"
        ? comparison
        : comparison *
            -1;
    }
  );

  return output;
}

function escapeCsv(
  value: unknown
): string {
  const text =
    String(
      value ??
      ""
    );

  return `"${text.replace(
    /"/g,
    '""'
  )}"`;
}

function exportRows(
  rows: DividendTimelineRow[]
): void {
  const headers = [
    "Symbol",
    "Status",
    "Confidence",
    "Event Date",
    "Ex-Dividend Date",
    "Payment Date",
    "Eligible Quantity",
    "Dividend Per Share",
    "Expected Cash",
    "Franking Credit",
    "Currency",
  ];

  const body =
    rows.map(
      (row) => [
        row.displaySymbol,
        statusLabel(
          row.status
        ),
        confidenceLabel(
          row.confidence
        ),
        eventDate(
          row
        ) ||
          "",
        row.exDate ||
          "",
        row.paymentDate ||
          "",
        row.eligibleQuantity,
        row.dividendPerShare ??
          "",
        row.amount ??
          "",
        row.frankingCredit,
        row.currency,
      ]
    );

  const csv =
    [
      headers,
      ...body,
    ]
      .map(
        (row) =>
          row
            .map(
              escapeCsv
            )
            .join(
              ","
            )
      )
      .join(
        "\n"
      );

  const blob =
    new Blob(
      [
        `\uFEFF${csv}`,
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
    `lgrbz-dividend-payments-${new Date()
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

type SortButtonProps = {
  column: SortColumn;
  label: string;
  sort: SortState;
  onSort: (
    column:
      SortColumn
  ) => void;
  align?: "left" | "right";
};

function SortButton({
  column,
  label,
  sort,
  onSort,
  align = "left",
}: SortButtonProps) {
  const active =
    sort.column ===
    column;

  return (
    <button
      type="button"
      onClick={() =>
        onSort(
          column
        )
      }
      className={`inline-flex w-full items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 transition hover:text-slate-900 dark:hover:text-slate-100 ${
        align ===
        "right"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {label}

      {!active && (
        <ArrowUpDown className="h-3.5 w-3.5" />
      )}

      {active &&
        sort.direction ===
          "asc" && (
          <ArrowUp className="h-3.5 w-3.5" />
        )}

      {active &&
        sort.direction ===
          "desc" && (
          <ArrowDown className="h-3.5 w-3.5" />
        )}
    </button>
  );
}

function EventStatusBadge({
  status,
}: {
  status:
    DividendEventStatus;
}) {
  const Icon =
    status ===
    "ANNOUNCED"
      ? Landmark
      : status ===
          "FORECAST"
        ? Sparkles
        : status ===
            "RECEIVED"
          ? ShieldCheck
          : Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${dividendStatusClasses(
        status
      )}`}
    >
      <Icon className="h-3 w-3" />

      {statusLabel(
        status
      )}
    </span>
  );
}

function ConfidenceBadge({
  confidence,
}: {
  confidence: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${confidenceClasses(
        confidence
      )}`}
    >
      {confidenceLabel(
        confidence
      )}
    </span>
  );
}

function PageButton({
  label,
  disabled,
  active = false,
  onClick,
}: {
  label:
    React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={
        disabled
      }
      onClick={
        onClick
      }
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

export function DividendUpcomingPaymentsTable({
  rows,
  title =
    "Dividend Payments",
  description =
    "Search, filter and compare announced, forecast and received dividend events.",
}: Props) {
  const [
    query,
    setQuery,
  ] =
    useState(
      ""
    );

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "ALL"
    );

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState<DateFilter>(
      "ALL"
    );

  const [
    sort,
    setSort,
  ] =
    useState<SortState>({
      column:
        "eventDate",
      direction:
        "asc",
    });

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
      10
    );

  const filteredRows =
    useMemo(
      () => {
        const normalizedQuery =
          query
            .trim()
            .toLowerCase();

        const filtered =
          rows.filter(
            (row) => {
              if (
                statusFilter !==
                  "ALL" &&
                row.status !==
                  statusFilter
              ) {
                return false;
              }

              if (
                !dateFilterMatches(
                  row,
                  dateFilter
                )
              ) {
                return false;
              }

              if (
                !normalizedQuery
              ) {
                return true;
              }

              const searchText = [
                row.symbol,
                row.displaySymbol,
                row.status,
                row.confidence,
                row.currency,
                row.exDate ||
                  "",
                row.paymentDate ||
                  "",
              ]
                .join(
                  " "
                )
                .toLowerCase();

              return searchText.includes(
                normalizedQuery
              );
            }
          );

        return sortRows(
          filtered,
          sort
        );
      },
      [
        rows,
        query,
        statusFilter,
        dateFilter,
        sort,
      ]
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredRows.length /
        pageSize
      )
    );

  useEffect(
    () => {
      setPage(
        1
      );
    },
    [
      query,
      statusFilter,
      dateFilter,
      pageSize,
    ]
  );

  useEffect(
    () => {
      if (
        page >
        totalPages
      ) {
        setPage(
          totalPages
        );
      }
    },
    [
      page,
      totalPages,
    ]
  );

  const paginatedRows =
    useMemo(
      () => {
        const start =
          (
            page -
            1
          ) *
          pageSize;

        return filteredRows.slice(
          start,
          start +
            pageSize
        );
      },
      [
        filteredRows,
        page,
        pageSize,
      ]
    );

  const visibleExpectedCash =
    useMemo(
      () =>
        filteredRows.reduce(
          (
            total,
            row
          ) =>
            total +
            (
              row.amount ||
              0
            ),
          0
        ),
      [
        filteredRows,
      ]
    );

  const visibleFranking =
    useMemo(
      () =>
        filteredRows.reduce(
          (
            total,
            row
          ) =>
            total +
            row.frankingCredit,
          0
        ),
      [
        filteredRows,
      ]
    );

  const primaryCurrency =
    filteredRows[0]
      ?.currency ||
    rows[0]
      ?.currency ||
    "AUD";

  const activeFilterCount =
    (
      statusFilter ===
      "ALL"
        ? 0
        : 1
    ) +
    (
      dateFilter ===
      "ALL"
        ? 0
        : 1
    ) +
    (
      query.trim()
        ? 1
        : 0
    );

  const clearFilters =
    () => {
      setQuery(
        ""
      );

      setStatusFilter(
        "ALL"
      );

      setDateFilter(
        "ALL"
      );
    };

  const handleSort =
    (
      column:
        SortColumn
    ) => {
      setSort(
        (
          current
        ) => {
          if (
            current.column ===
            column
          ) {
            return {
              column,
              direction:
                current.direction ===
                  "asc"
                  ? "desc"
                  : "asc",
            };
          }

          return {
            column,
            direction:
              column ===
                "expectedCash" ||
              column ===
                "eligibleQuantity" ||
              column ===
                "dividendPerShare" ||
              column ===
                "frankingCredit"
                ? "desc"
                : "asc",
          };
        }
      );
    };

  const firstVisible =
    filteredRows.length ===
    0
      ? 0
      : (
          page -
          1
        ) *
          pageSize +
        1;

  const lastVisible =
    Math.min(
      page *
        pageSize,
      filteredRows.length
    );

  const pageNumbers =
    useMemo(
      () => {
        const values:
          number[] = [];

        const start =
          Math.max(
            1,
            page -
              2
          );

        const end =
          Math.min(
            totalPages,
            page +
              2
          );

        for (
          let value =
            start;
          value <=
          end;
          value +=
          1
        ) {
          values.push(
            value
          );
        }

        return values;
      },
      [
        page,
        totalPages,
      ]
    );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="shrink-0 rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CircleDollarSign className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                Income Schedule
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
                {title}
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                {description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Visible Events
              </p>

              <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50">
                {filteredRows.length.toLocaleString(
                  "en-AU"
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Expected Cash
              </p>

              <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50">
                {formatDividendMoney(
                  visibleExpectedCash,
                  primaryCurrency
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Franking
              </p>

              <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {formatDividendMoney(
                  visibleFranking,
                  primaryCurrency
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                exportRows(
                  filteredRows
                )
              }
              disabled={
                filteredRows.length ===
                0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <Download className="h-4 w-4" />
              Export View
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(240px,1fr)_220px_220px_auto]">
          <label className="relative block">
            <span className="sr-only">
              Search dividend payments
            </span>

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={
                query
              }
              onChange={(
                event
              ) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search symbol, status, confidence or date"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600 dark:focus:ring-slate-800"
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  setQuery(
                    ""
                  )
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          <label className="relative block">
            <span className="sr-only">
              Filter by status
            </span>

            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target.value as
                    StatusFilter
                )
              }
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
            >
              {STATUS_FILTERS.map(
                (
                  status
                ) => (
                  <option
                    key={
                      status
                    }
                    value={
                      status
                    }
                  >
                    {status ===
                    "ALL"
                      ? "All statuses"
                      : statusLabel(
                          status
                        )}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="relative block">
            <span className="sr-only">
              Filter by date
            </span>

            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={
                dateFilter
              }
              onChange={(
                event
              ) =>
                setDateFilter(
                  event.target.value as
                    DateFilter
                )
              }
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
            >
              {DATE_FILTERS.map(
                (
                  option
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </label>

          <button
            type="button"
            onClick={
              clearFilters
            }
            disabled={
              activeFilterCount ===
              0
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
            Clear
            {activeFilterCount >
              0 && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] dark:bg-slate-900">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {filteredRows.length ===
      0 ? (
        <div className="px-4 py-16 text-center sm:px-6">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900">
            <CircleDollarSign className="h-7 w-7" />
          </span>

          <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-slate-50">
            No matching dividend events
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Adjust the search or filters. Historical ledger transactions, announced payments and forecast events remain available when they match the selected view.
          </p>

          {activeFilterCount >
            0 && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto xl:block">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/60">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left">
                    <SortButton
                      column="symbol"
                      label="Security"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left">
                    <SortButton
                      column="status"
                      label="Status"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left">
                    <SortButton
                      column="eventDate"
                      label="Event Date"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left">
                    <SortButton
                      column="exDate"
                      label="Ex-Date"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left">
                    <SortButton
                      column="paymentDate"
                      label="Payment"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    <SortButton
                      column="eligibleQuantity"
                      label="Eligible"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                      align="right"
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    <SortButton
                      column="dividendPerShare"
                      label="Per Share"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                      align="right"
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    <SortButton
                      column="expectedCash"
                      label="Expected Cash"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                      align="right"
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    <SortButton
                      column="frankingCredit"
                      label="Franking"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                      align="right"
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left">
                    <SortButton
                      column="confidence"
                      label="Confidence"
                      sort={
                        sort
                      }
                      onSort={
                        handleSort
                      }
                    />
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {paginatedRows.map(
                  (
                    row
                  ) => {
                    const days =
                      daysUntilDividend(
                        eventDate(
                          row
                        )
                      );

                    return (
                      <tr
                        key={
                          row.id
                        }
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-950">
                              {row.displaySymbol.slice(
                                0,
                                4
                              )}
                            </span>

                            <div>
                              <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
                                {row.displaySymbol}
                              </p>

                              <p className="mt-0.5 text-[11px] text-slate-500">
                                {row.currency}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <EventStatusBadge
                            status={
                              row.status
                            }
                          />
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {formatDividendDate(
                              eventDate(
                                row
                              )
                            )}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {eventDateLabel(
                              row
                            )}
                            {days ===
                            null
                              ? ""
                              : days ===
                                  0
                                ? " · Today"
                                : days >
                                    0
                                  ? ` · In ${days} days`
                                  : ` · ${Math.abs(
                                      days
                                    )} days ago`}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatDividendDate(
                            row.exDate
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatDividendDate(
                            row.paymentDate
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {formatDividendNumber(
                            row.eligibleQuantity,
                            4
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-slate-700 dark:text-slate-200">
                          {formatDividendMoney(
                            row.dividendPerShare,
                            row.currency,
                            4
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right">
                          <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
                            {formatDividendMoney(
                              row.amount,
                              row.currency
                            )}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right">
                          <p
                            className={`text-sm font-semibold ${
                              row.frankingCredit >
                              0
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-slate-400"
                            }`}
                          >
                            {formatDividendMoney(
                              row.frankingCredit,
                              row.currency
                            )}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <ConfidenceBadge
                            confidence={
                              row.confidence
                            }
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 xl:hidden">
            {paginatedRows.map(
              (
                row
              ) => {
                const days =
                  daysUntilDividend(
                    eventDate(
                      row
                    )
                  );

                return (
                  <article
                    key={
                      row.id
                    }
                    className="p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-950">
                          {row.displaySymbol.slice(
                            0,
                            4
                          )}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-base font-bold text-slate-950 dark:text-slate-50">
                            {row.displaySymbol}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <EventStatusBadge
                              status={
                                row.status
                              }
                            />

                            <ConfidenceBadge
                              confidence={
                                row.confidence
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-base font-bold text-slate-950 dark:text-slate-50">
                          {formatDividendMoney(
                            row.amount,
                            row.currency
                          )}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          expected cash
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Event
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {formatDividendDate(
                            eventDate(
                              row
                            )
                          )}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          {days ===
                          null
                            ? eventDateLabel(
                                row
                              )
                            : days ===
                                0
                              ? "Today"
                              : days >
                                  0
                                ? `In ${days} days`
                                : `${Math.abs(
                                    days
                                  )} days ago`}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Ex-Date
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {formatDividendDate(
                            row.exDate
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Payment
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {formatDividendDate(
                            row.paymentDate
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Eligible
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {formatDividendNumber(
                            row.eligibleQuantity,
                            4
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Dividend Per Share
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {formatDividendMoney(
                            row.dividendPerShare,
                            row.currency,
                            4
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Franking Credit
                        </p>

                        <p
                          className={`mt-1 text-xs font-semibold ${
                            row.frankingCredit >
                            0
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-slate-500"
                          }`}
                        >
                          {formatDividendMoney(
                            row.frankingCredit,
                            row.currency
                          )}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Showing{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            {firstVisible}
          </strong>
          {" "}to{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            {lastVisible}
          </strong>
          {" "}of{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            {filteredRows.length}
          </strong>
          {" "}events
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 text-xs text-slate-500">
            Rows

            <select
              value={
                pageSize
              }
              onChange={(
                event
              ) =>
                setPageSize(
                  Number(
                    event.target.value
                  )
                )
              }
              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              {PAGE_SIZE_OPTIONS.map(
                (
                  value
                ) => (
                  <option
                    key={
                      value
                    }
                    value={
                      value
                    }
                  >
                    {value}
                  </option>
                )
              )}
            </select>
          </label>

          <div className="flex items-center gap-1">
            <PageButton
              label={
                <ChevronLeft className="h-4 w-4" />
              }
              disabled={
                page <=
                1
              }
              onClick={() =>
                setPage(
                  (
                    current
                  ) =>
                    Math.max(
                      1,
                      current -
                        1
                    )
                )
              }
            />

            {pageNumbers.map(
              (
                value
              ) => (
                <PageButton
                  key={
                    value
                  }
                  label={
                    value
                  }
                  active={
                    value ===
                    page
                  }
                  onClick={() =>
                    setPage(
                      value
                    )
                  }
                />
              )
            )}

            <PageButton
              label={
                <ChevronRight className="h-4 w-4" />
              }
              disabled={
                page >=
                totalPages
              }
              onClick={() =>
                setPage(
                  (
                    current
                  ) =>
                    Math.min(
                      totalPages,
                      current +
                        1
                    )
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
