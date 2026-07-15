"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  Globe2,
  Landmark,
  LineChart,
  PieChart as PieChartIcon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  DividendEvent,
  DividendHoldingSummary,
  DividendIntelligenceResponse,
  DividendProviderId,
  MonthlyDividendForecast,
} from "@/lib/dividend-data";
import {
  formatDividendMoney,
  formatDividendPercent,
} from "./dividendCentreFormatters";

type Props = {
  data: DividendIntelligenceResponse;
  loading?: boolean;
};

type AnalyticsView =
  | "INCOME"
  | "HOLDINGS"
  | "MARKETS"
  | "SOURCES";

type MarketBucket = {
  key: string;
  label: string;
  country: string;
  income: number;
  eventCount: number;
};

type ProviderBucket = {
  provider: DividendProviderId;
  label: string;
  income: number;
  eventCount: number;
};

type TooltipPayloadItem = {
  name?: string;
  value?: number;
  dataKey?: string;
  payload?: Record<
    string,
    unknown
  >;
  color?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  currency: string;
};

const PIE_COLOURS = [
  "#0f766e",
  "#2563eb",
  "#7c3aed",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#4f46e5",
  "#65a30d",
];

function providerLabel(
  provider: DividendProviderId
): string {
  if (
    provider ===
    "ledger"
  ) {
    return "Portfolio Ledger";
  }

  if (
    provider ===
    "forecast"
  ) {
    return "Forecast Engine";
  }

  if (
    provider ===
    "manual"
  ) {
    return "Manual Data";
  }

  if (
    provider ===
    "twelve-data"
  ) {
    return "Twelve Data";
  }

  if (
    provider ===
    "alpha-vantage"
  ) {
    return "Alpha Vantage";
  }

  if (
    provider ===
    "finnhub"
  ) {
    return "Finnhub";
  }

  return "Unavailable";
}

function eventDate(
  event: DividendEvent
): string | null {
  return (
    event.paymentDate ||
    event.exDate ||
    event.recordDate ||
    event.declarationDate
  );
}

function eventIncome(
  event: DividendEvent,
  eligibility:
    DividendIntelligenceResponse["eligibility"]
): number {
  const matched =
    eligibility.find(
      (
        item
      ) =>
        item.symbol ===
          event.symbol &&
        (
          item.exDate ||
          ""
        ) ===
          (
            event.exDate ||
            ""
          ) &&
        (
          item.paymentDate ||
          ""
        ) ===
          (
            event.paymentDate ||
            ""
          )
    );

  if (
    matched?.expectedCash !==
      null &&
    matched?.expectedCash !==
      undefined
  ) {
    return matched.expectedCash;
  }

  return 0;
}

function marketForSymbol(
  symbol: string,
  exchange?: string
): {
  key: string;
  label: string;
  country: string;
} {
  const normalized =
    symbol
      .trim()
      .toUpperCase();

  const normalizedExchange =
    (
      exchange ||
      ""
    )
      .trim()
      .toUpperCase();

  if (
    normalized.endsWith(
      ".AX"
    ) ||
    normalizedExchange ===
      "ASX"
  ) {
    return {
      key:
        "AU",
      label:
        "Australia",
      country:
        "Australia",
    };
  }

  if (
    normalized.endsWith(
      ".L"
    ) ||
    normalizedExchange ===
      "LSE"
  ) {
    return {
      key:
        "GB",
      label:
        "United Kingdom",
      country:
        "United Kingdom",
    };
  }

  if (
    normalized.endsWith(
      ".TO"
    ) ||
    normalizedExchange ===
      "TSX"
  ) {
    return {
      key:
        "CA",
      label:
        "Canada",
      country:
        "Canada",
    };
  }

  if (
    normalized.endsWith(
      ".NZ"
    ) ||
    normalizedExchange ===
      "NZX"
  ) {
    return {
      key:
        "NZ",
      label:
        "New Zealand",
      country:
        "New Zealand",
    };
  }

  if (
    normalized.endsWith(
      ".HK"
    ) ||
    normalizedExchange ===
      "HKEX"
  ) {
    return {
      key:
        "HK",
      label:
        "Hong Kong",
      country:
        "Hong Kong",
    };
  }

  if (
    normalizedExchange ===
      "NASDAQ" ||
    normalizedExchange ===
      "NYSE" ||
    normalizedExchange ===
      "US" ||
    !normalized.includes(
      "."
    )
  ) {
    return {
      key:
        "US",
      label:
        "United States",
      country:
        "United States",
    };
  }

  return {
    key:
      normalizedExchange ||
      "OTHER",
    label:
      normalizedExchange ||
      "Other",
    country:
      "Other",
  };
}

function monthLabel(
  value: string
): string {
  const date =
    new Date(
      `${value.slice(
        0,
        7
      )}-01T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-AU",
    {
      month:
        "short",
      year:
        "2-digit",
    }
  );
}

function compactNumber(
  value: number
): string {
  return new Intl.NumberFormat(
    "en-AU",
    {
      notation:
        "compact",
      maximumFractionDigits:
        1,
    }
  ).format(
    value
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: ChartTooltipProps) {
  if (
    !active ||
    !payload ||
    payload.length ===
      0
  ) {
    return null;
  }

  return (
    <div className="min-w-44 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      {label !==
        undefined && (
        <p className="mb-2 text-xs font-bold text-slate-900 dark:text-slate-100">
          {String(
            label
          )}
        </p>
      )}

      <div className="space-y-1.5">
        {payload.map(
          (
            item,
            index
          ) => (
            <div
              key={`${item.dataKey || item.name || "value"}-${index}`}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <span className="inline-flex items-center gap-2 text-slate-500">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      item.color ||
                      "#64748b",
                  }}
                />

                {item.name ||
                  item.dataKey ||
                  "Value"}
              </span>

              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatDividendMoney(
                  Number(
                    item.value ||
                    0
                  ),
                  currency
                )}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <section className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <div className="h-5 w-52 rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-100 dark:bg-slate-900" />
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length:
            4,
        }).map(
          (
            _,
            index
          ) => (
            <div
              key={
                index
              }
              className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-900"
            />
          )
        )}
      </div>

      <div className="grid gap-4 p-5 pt-0 xl:grid-cols-2">
        <div className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-900" />

        <div className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-900" />
      </div>
    </section>
  );
}

function InsightCard({
  label,
  value,
  detail,
  icon: Icon,
  tone =
    "slate",
}: {
  label: string;
  value: string;
  detail: string;
  icon:
    React.ComponentType<{
      className?: string;
    }>;
  tone?:
    | "slate"
    | "emerald"
    | "amber"
    | "violet";
}) {
  const tones = {
    slate:
      "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
    emerald:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    amber:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    violet:
      "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-bold text-slate-950 dark:text-slate-50">
            {value}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {detail}
          </p>
        </div>

        <span className={`shrink-0 rounded-xl p-2.5 ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

function EmptyAnalyticsState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-14 text-center dark:border-slate-700 dark:bg-slate-900/30">
      <BarChart3 className="mx-auto h-8 w-8 text-slate-400" />

      <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-slate-50">
        Not enough dividend data for analytics
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        Analytics appear when the portfolio contains historical receipts, announced events or forecast dividend income.
      </p>
    </div>
  );
}

export function DividendAnalyticsDashboard({
  data,
  loading = false,
}: Props) {
  const [
    view,
    setView,
  ] =
    useState<AnalyticsView>(
      "INCOME"
    );

  const currency =
    data.summary.currency ||
    "AUD";

  const monthlyData =
    useMemo(
      () =>
        data.summary.monthlyForecast.map(
          (
            month:
              MonthlyDividendForecast
          ) => ({
            month:
              month.month,
            label:
              monthLabel(
                month.month
              ),
            announced:
              month.announcedIncome,
            forecast:
              month.forecastIncome,
            received:
              month.receivedIncome,
            total:
              month.totalIncome,
            franking:
              month.frankingCredits,
            eventCount:
              month.eventCount,
          })
        ),
      [
        data.summary.monthlyForecast,
      ]
    );

  const holdingData =
    useMemo(
      () =>
        [...data.summary.holdingSummaries]
          .sort(
            (
              left:
                DividendHoldingSummary,
              right:
                DividendHoldingSummary
            ) =>
              right.forwardTwelveMonthIncome -
              left.forwardTwelveMonthIncome
          )
          .slice(
            0,
            10
          )
          .map(
            (
              holding:
                DividendHoldingSummary
            ) => ({
              symbol:
                holding.displaySymbol,
              forward:
                holding.forwardTwelveMonthIncome,
              trailing:
                holding.trailingTwelveMonthIncome,
              announced:
                holding.announcedIncome,
              forecast:
                holding.forecastIncome,
              received:
                holding.receivedIncome,
              yield:
                holding.forwardYield,
              yieldOnCost:
                holding.yieldOnCost,
            })
          ),
      [
        data.summary.holdingSummaries,
      ]
    );

  const marketData =
    useMemo(
      () => {
        const buckets =
          new Map<
            string,
            MarketBucket
          >();

        for (
          const event of
          data.events
        ) {
          const date =
            eventDate(
              event
            );

          if (!date) {
            continue;
          }

          const market =
            marketForSymbol(
              event.symbol,
              event.exchange
            );

          const current =
            buckets.get(
              market.key
            ) || {
              key:
                market.key,
              label:
                market.label,
              country:
                market.country,
              income:
                0,
              eventCount:
                0,
            };

          current.income +=
            eventIncome(
              event,
              data.eligibility
            );

          current.eventCount +=
            1;

          buckets.set(
            market.key,
            current
          );
        }

        return Array.from(
          buckets.values()
        )
          .sort(
            (
              left,
              right
            ) =>
              right.income -
              left.income
          );
      },
      [
        data.events,
        data.eligibility,
      ]
    );

  const providerData =
    useMemo(
      () => {
        const buckets =
          new Map<
            DividendProviderId,
            ProviderBucket
          >();

        for (
          const event of
          data.events
        ) {
          const current =
            buckets.get(
              event.provider
            ) || {
              provider:
                event.provider,
              label:
                providerLabel(
                  event.provider
                ),
              income:
                0,
              eventCount:
                0,
            };

          current.income +=
            eventIncome(
              event,
              data.eligibility
            );

          current.eventCount +=
            1;

          buckets.set(
            event.provider,
            current
          );
        }

        return Array.from(
          buckets.values()
        )
          .sort(
            (
              left,
              right
            ) =>
              right.income -
              left.income
          );
      },
      [
        data.events,
        data.eligibility,
      ]
    );

  const forwardIncome =
    data.summary.forwardTwelveMonthIncome;

  const forecastReliance =
    forwardIncome >
    0
      ? (
          data.summary.forecastForwardIncome /
          forwardIncome
        ) *
        100
      : 0;

  const largestHolding =
    holdingData[0] ||
    null;

  const largestHoldingShare =
    largestHolding &&
    forwardIncome >
      0
      ? (
          largestHolding.forward /
          forwardIncome
        ) *
        100
      : 0;

  const activeIncomeMonths =
    monthlyData.filter(
      (
        month
      ) =>
        month.total >
        0
    ).length;

  const consistency =
    monthlyData.length >
    0
      ? (
          activeIncomeMonths /
          monthlyData.length
        ) *
        100
      : 0;

  const confirmedShare =
    forwardIncome >
    0
      ? (
          data.summary.announcedForwardIncome /
          forwardIncome
        ) *
        100
      : 0;

  const hasAnalytics =
    monthlyData.length >
      0 ||
    holdingData.length >
      0 ||
    marketData.length >
      0 ||
    providerData.length >
      0;

  if (
    loading
  ) {
    return (
      <AnalyticsSkeleton />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/40 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="shrink-0 rounded-xl bg-sky-100 p-2.5 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
              <BarChart3 className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                Income Analytics
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
                Dividend Portfolio Intelligence
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                Analyse income timing, concentration, market exposure and the reliability of your forward dividend forecast.
              </p>
            </div>
          </div>

          <div className="inline-flex max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            {[
              {
                value:
                  "INCOME" as const,
                label:
                  "Income",
                icon:
                  LineChart,
              },
              {
                value:
                  "HOLDINGS" as const,
                label:
                  "Holdings",
                icon:
                  WalletCards,
              },
              {
                value:
                  "MARKETS" as const,
                label:
                  "Markets",
                icon:
                  Globe2,
              },
              {
                value:
                  "SOURCES" as const,
                label:
                  "Sources",
                icon:
                  ShieldCheck,
              },
            ].map(
              (
                option
              ) => {
                const Icon =
                  option.icon;

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      setView(
                        option.value
                      )
                    }
                    className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                      view ===
                      option.value
                        ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />

                    {option.label}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
        <InsightCard
          label="Confirmed Share"
          value={formatDividendPercent(
            confirmedShare
          )}
          detail="Forward income supported by announced dividend events."
          icon={CheckCircle2}
          tone="emerald"
        />

        <InsightCard
          label="Forecast Reliance"
          value={formatDividendPercent(
            forecastReliance
          )}
          detail={
            forecastReliance >
            50
              ? "More than half of forward income currently relies on estimates."
              : "Most forward income is supported by confirmed or announced events."
          }
          icon={
            forecastReliance >
            50
              ? AlertTriangle
              : ShieldCheck
          }
          tone={
            forecastReliance >
            50
              ? "amber"
              : "emerald"
          }
        />

        <InsightCard
          label="Income Consistency"
          value={formatDividendPercent(
            consistency
          )}
          detail={`${activeIncomeMonths} of ${monthlyData.length} forecast months contain dividend income.`}
          icon={CalendarRange}
          tone="violet"
        />

        <InsightCard
          label="Largest Contributor"
          value={
            largestHolding
              ? largestHolding.symbol
              : "—"
          }
          detail={
            largestHolding
              ? `${formatDividendMoney(
                  largestHolding.forward,
                  currency
                )} · ${formatDividendPercent(
                  largestHoldingShare
                )} of forward income.`
              : "No holding contribution is available."
          }
          icon={TrendingUp}
          tone="slate"
        />
      </div>

      <div className="px-4 pb-5 sm:px-5">
        {!hasAnalytics ? (
          <EmptyAnalyticsState />
        ) : (
          <>
            {view ===
              "INCOME" && (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.5fr)]">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                        Monthly Income
                      </p>

                      <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50">
                        Received, Announced and Forecast
                      </h3>
                    </div>

                    <span className="rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                      <LineChart className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-5 h-[340px] w-full">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <AreaChart
                        data={
                          monthlyData
                        }
                        margin={{
                          top:
                            8,
                          right:
                            8,
                          left:
                            0,
                          bottom:
                            0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="receivedDividendGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#059669"
                              stopOpacity={0.35}
                            />

                            <stop
                              offset="95%"
                              stopColor="#059669"
                              stopOpacity={0}
                            />
                          </linearGradient>

                          <linearGradient
                            id="announcedDividendGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#2563eb"
                              stopOpacity={0.3}
                            />

                            <stop
                              offset="95%"
                              stopColor="#2563eb"
                              stopOpacity={0}
                            />
                          </linearGradient>

                          <linearGradient
                            id="forecastDividendGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#d97706"
                              stopOpacity={0.3}
                            />

                            <stop
                              offset="95%"
                              stopColor="#d97706"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />

                        <XAxis
                          dataKey="label"
                          tick={{
                            fontSize:
                              11,
                            fill:
                              "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          tickFormatter={
                            compactNumber
                          }
                          tick={{
                            fontSize:
                              11,
                            fill:
                              "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                          width={48}
                        />

                        <Tooltip
                          content={
                            <ChartTooltip
                              currency={
                                currency
                              }
                            />
                          }
                        />

                        <Legend
                          wrapperStyle={{
                            fontSize:
                              11,
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="received"
                          name="Received"
                          stroke="#059669"
                          fill="url(#receivedDividendGradient)"
                          strokeWidth={2}
                          activeDot={{
                            r:
                              4,
                          }}
                          animationDuration={700}
                        />

                        <Area
                          type="monotone"
                          dataKey="announced"
                          name="Announced"
                          stroke="#2563eb"
                          fill="url(#announcedDividendGradient)"
                          strokeWidth={2}
                          activeDot={{
                            r:
                              4,
                          }}
                          animationDuration={850}
                        />

                        <Area
                          type="monotone"
                          dataKey="forecast"
                          name="Forecast"
                          stroke="#d97706"
                          fill="url(#forecastDividendGradient)"
                          strokeWidth={2}
                          strokeDasharray="5 4"
                          activeDot={{
                            r:
                              4,
                          }}
                          animationDuration={1000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                        Income Status
                      </p>

                      <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50">
                        Forward Income Composition
                      </h3>
                    </div>

                    <span className="rounded-xl bg-violet-100 p-2 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                      <PieChartIcon className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-5 h-[250px]">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name:
                                "Announced",
                              value:
                                data.summary.announcedForwardIncome,
                            },
                            {
                              name:
                                "Forecast",
                              value:
                                data.summary.forecastForwardIncome,
                            },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={58}
                          outerRadius={88}
                          paddingAngle={4}
                          animationDuration={800}
                        >
                          <Cell fill="#2563eb" />

                          <Cell fill="#d97706" />
                        </Pie>

                        <Tooltip
                          content={
                            <ChartTooltip
                              currency={
                                currency
                              }
                            />
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500">
                        Announced
                      </p>

                      <p className="mt-1 text-sm font-bold text-blue-700 dark:text-blue-300">
                        {formatDividendMoney(
                          data.summary.announcedForwardIncome,
                          currency
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-amber-500">
                        Forecast
                      </p>

                      <p className="mt-1 text-sm font-bold text-amber-700 dark:text-amber-300">
                        {formatDividendMoney(
                          data.summary.forecastForwardIncome,
                          currency
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {view ===
              "HOLDINGS" && (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                        Holding Contribution
                      </p>

                      <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50">
                        Forward Income by Security
                      </h3>
                    </div>

                    <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <WalletCards className="h-4 w-4" />
                    </span>
                  </div>

                  {holdingData.length ===
                  0 ? (
                    <div className="mt-5">
                      <EmptyAnalyticsState />
                    </div>
                  ) : (
                    <div className="mt-5 h-[380px]">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <BarChart
                          data={
                            holdingData
                          }
                          layout="vertical"
                          margin={{
                            top:
                              0,
                            right:
                              12,
                            bottom:
                              0,
                            left:
                              12,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="#e2e8f0"
                          />

                          <XAxis
                            type="number"
                            tickFormatter={
                              compactNumber
                            }
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize:
                                11,
                              fill:
                                "#64748b",
                            }}
                          />

                          <YAxis
                            type="category"
                            dataKey="symbol"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize:
                                11,
                              fill:
                                "#475569",
                              fontWeight:
                                600,
                            }}
                            width={72}
                          />

                          <Tooltip
                            content={
                              <ChartTooltip
                                currency={
                                  currency
                                }
                              />
                            }
                          />

                          <Legend
                            wrapperStyle={{
                              fontSize:
                                11,
                            }}
                          />

                          <Bar
                            dataKey="announced"
                            name="Announced"
                            stackId="income"
                            fill="#2563eb"
                            radius={[
                              4,
                              0,
                              0,
                              4,
                            ]}
                            animationDuration={700}
                          />

                          <Bar
                            dataKey="forecast"
                            name="Forecast"
                            stackId="income"
                            fill="#d97706"
                            radius={[
                              0,
                              4,
                              4,
                              0,
                            ]}
                            animationDuration={900}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                    Concentration Review
                  </p>

                  <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50">
                    Largest Income Positions
                  </h3>

                  <div className="mt-4 space-y-3">
                    {holdingData
                      .slice(
                        0,
                        6
                      )
                      .map(
                        (
                          holding,
                          index
                        ) => {
                          const share =
                            forwardIncome >
                            0
                              ? (
                                  holding.forward /
                                  forwardIncome
                                ) *
                                100
                              : 0;

                          return (
                            <div
                              key={
                                holding.symbol
                              }
                              className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-950">
                                    {index +
                                      1}
                                  </span>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-slate-950 dark:text-slate-50">
                                      {holding.symbol}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                      {formatDividendPercent(
                                        share
                                      )}{" "}
                                      of forward income
                                    </p>
                                  </div>
                                </div>

                                <p className="shrink-0 text-sm font-bold text-slate-950 dark:text-slate-50">
                                  {formatDividendMoney(
                                    holding.forward,
                                    currency
                                  )}
                                </p>
                              </div>

                              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                                <div
                                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                                  style={{
                                    width:
                                      `${Math.min(
                                        100,
                                        Math.max(
                                          0,
                                          share
                                        )
                                      )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        }
                      )}

                    {holdingData.length ===
                      0 && (
                      <EmptyAnalyticsState />
                    )}
                  </div>
                </article>
              </div>
            )}

            {view ===
              "MARKETS" && (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                        Country Exposure
                      </p>

                      <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50">
                        Dividend Income by Market
                      </h3>
                    </div>

                    <span className="rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                      <Globe2 className="h-4 w-4" />
                    </span>
                  </div>

                  {marketData.length ===
                  0 ? (
                    <div className="mt-5">
                      <EmptyAnalyticsState />
                    </div>
                  ) : (
                    <div className="mt-5 h-[320px]">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <PieChart>
                          <Pie
                            data={
                              marketData
                            }
                            dataKey="income"
                            nameKey="label"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            animationDuration={900}
                          >
                            {marketData.map(
                              (
                                item,
                                index
                              ) => (
                                <Cell
                                  key={
                                    item.key
                                  }
                                  fill={
                                    PIE_COLOURS[
                                      index %
                                      PIE_COLOURS.length
                                    ]
                                  }
                                />
                              )
                            )}
                          </Pie>

                          <Tooltip
                            content={
                              <ChartTooltip
                                currency={
                                  currency
                                }
                              />
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                    Market Breakdown
                  </p>

                  <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50">
                    Income and Event Distribution
                  </h3>

                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-[minmax(0,1fr)_100px_120px] bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:bg-slate-900">
                      <span>
                        Market
                      </span>

                      <span className="text-right">
                        Events
                      </span>

                      <span className="text-right">
                        Income
                      </span>
                    </div>

                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {marketData.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={
                              item.key
                            }
                            className="grid grid-cols-[minmax(0,1fr)_100px_120px] items-center px-3 py-3 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    PIE_COLOURS[
                                      index %
                                      PIE_COLOURS.length
                                    ],
                                }}
                              />

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                                  {item.label}
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-500">
                                  {item.country}
                                </p>
                              </div>
                            </div>

                            <span className="text-right font-semibold text-slate-600 dark:text-slate-300">
                              {item.eventCount}
                            </span>

                            <span className="text-right font-bold text-slate-950 dark:text-slate-50">
                              {formatDividendMoney(
                                item.income,
                                currency
                              )}
                            </span>
                          </div>
                        )
                      )}

                      {marketData.length ===
                        0 && (
                        <div className="p-6 text-center text-sm text-slate-500">
                          No market data is available.
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            )}

            {view ===
              "SOURCES" && (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                        Provider Analysis
                      </p>

                      <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50">
                        Dividend Income by Source
                      </h3>
                    </div>

                    <span className="rounded-xl bg-violet-100 p-2 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                  </div>

                  {providerData.length ===
                  0 ? (
                    <div className="mt-5">
                      <EmptyAnalyticsState />
                    </div>
                  ) : (
                    <div className="mt-5 h-[340px]">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <BarChart
                          data={
                            providerData
                          }
                          margin={{
                            top:
                              8,
                            right:
                              8,
                            bottom:
                              36,
                            left:
                              0,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                          />

                          <XAxis
                            dataKey="label"
                            angle={-20}
                            textAnchor="end"
                            interval={0}
                            tick={{
                              fontSize:
                                10,
                              fill:
                                "#64748b",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <YAxis
                            tickFormatter={
                              compactNumber
                            }
                            tick={{
                              fontSize:
                                11,
                              fill:
                                "#64748b",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <Tooltip
                            content={
                              <ChartTooltip
                                currency={
                                  currency
                                }
                              />
                            }
                          />

                          <Bar
                            dataKey="income"
                            name="Income"
                            fill="#7c3aed"
                            radius={[
                              6,
                              6,
                              0,
                              0,
                            ]}
                            animationDuration={900}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                    Source Quality
                  </p>

                  <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50">
                    Event Coverage
                  </h3>

                  <div className="mt-4 space-y-3">
                    {providerData.map(
                      (
                        provider,
                        index
                      ) => {
                        const totalEvents =
                          Math.max(
                            1,
                            data.events.length
                          );

                        const eventShare =
                          (
                            provider.eventCount /
                            totalEvents
                          ) *
                          100;

                        return (
                          <div
                            key={
                              provider.provider
                            }
                            className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <span
                                  className="h-3 w-3 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor:
                                      PIE_COLOURS[
                                        index %
                                        PIE_COLOURS.length
                                      ],
                                  }}
                                />

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-slate-950 dark:text-slate-50">
                                    {provider.label}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-slate-500">
                                    {provider.eventCount} event
                                    {provider.eventCount ===
                                    1
                                      ? ""
                                      : "s"}
                                  </p>
                                </div>
                              </div>

                              <p className="shrink-0 text-sm font-bold text-slate-950 dark:text-slate-50">
                                {formatDividendMoney(
                                  provider.income,
                                  currency
                                )}
                              </p>
                            </div>

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width:
                                    `${Math.min(
                                      100,
                                      eventShare
                                    )}%`,
                                  backgroundColor:
                                    PIE_COLOURS[
                                      index %
                                      PIE_COLOURS.length
                                    ],
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}

                    {providerData.length ===
                      0 && (
                      <EmptyAnalyticsState />
                    )}
                  </div>
                </article>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
