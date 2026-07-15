"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CloudOff,
  Database,
  Eye,
  EyeOff,
  Gauge,
  RefreshCcw,
  Server,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import {
  useLiveMarketQuotes,
} from "@/hooks/useLiveMarketQuotes";
import type {
  LiveQuoteStoreEntry,
} from "@/lib/market-data/client/liveQuoteClientTypes";
import {
  liveQuoteDisplayTimestamp,
} from "@/lib/market-data/client/liveQuoteStatus";
import type {
  MarketDataExchange,
  NormalisedMarketQuote,
} from "@/lib/market-data/marketDataTypes";
import {
  LiveQuoteStatusBadge,
} from "./LiveQuoteStatusBadge";
import {
  QuoteQualityMeter,
} from "./QuoteQualityMeter";

export type LiveQuoteIntegrationItem = {
  symbol: string;

  name?: string;

  quantity?: number | null;
  costBasis?: number | null;
  existingMarketValue?: number | null;

  targetPrice?: number | null;

  theme?: string | null;
  sector?: string | null;

  exchange?: MarketDataExchange;

  original?: unknown;
};

type LiveQuoteIntegrationPanelProps = {
  title: string;
  description: string;

  eyebrow?:
    string;

  items:
    LiveQuoteIntegrationItem[];

  mode:
    "HOLDINGS" |
    "WATCHLIST";

  emptyMessage:
    string;

  maximumVisibleRows?:
    number;
};

function formatMoney(
  value:
    number |
    null |
    undefined,
  currency =
    "AUD"
): string {
  if (
    value ===
      null ||
    value ===
      undefined ||
    !Number.isFinite(
      value
    )
  ) {
    return "—";
  }

  try {
    return new Intl.NumberFormat(
      "en-AU",
      {
        style:
          "currency",

        currency,

        maximumFractionDigits:
          Math.abs(
            value
          ) <
          100
            ? 2
            : 0,
      }
    ).format(
      value
    );
  } catch {
    return `${currency} ${value.toFixed(
      2
    )}`;
  }
}

function formatPercent(
  value:
    number |
    null |
    undefined
): string {
  if (
    value ===
      null ||
    value ===
      undefined ||
    !Number.isFinite(
      value
    )
  ) {
    return "—";
  }

  const prefix =
    value >
    0
      ? "+"
      : "";

  return `${prefix}${value.toFixed(
    2
  )}%`;
}

function inferCurrency(
  quote:
    NormalisedMarketQuote |
    null
): string {
  return (
    quote?.currency ||
    "AUD"
  );
}

function entryBySymbol(
  entries:
    Array<
      LiveQuoteStoreEntry |
      null
    >,
  symbol:
    string
): LiveQuoteStoreEntry | null {
  const canonical =
    symbol
      .trim()
      .toUpperCase();

  return (
    entries.find(
      (
        entry
      ) =>
        entry?.symbol ===
        canonical
    ) ||
    null
  );
}

function changeTone(
  value:
    number |
    null |
    undefined
): string {
  if (
    value ===
      null ||
    value ===
      undefined ||
    value ===
      0
  ) {
    return "text-slate-300";
  }

  return value >
    0
    ? "text-emerald-300"
    : "text-rose-300";
}

function metricCardClass():
  string {
  return [
    "rounded-xl",
    "border",
    "border-slate-800",
    "bg-slate-950/40",
    "p-4",
  ].join(
    " "
  );
}

export function LiveQuoteIntegrationPanel({
  title,
  description,
  eyebrow =
    "Live Market Intelligence",
  items,
  mode,
  emptyMessage,
  maximumVisibleRows =
    12,
}: LiveQuoteIntegrationPanelProps) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(
      false
    );

  const symbols =
    useMemo(
      () =>
        Array.from(
          new Set(
            items
              .map(
                (
                  item
                ) =>
                  item.symbol
                    .trim()
                    .toUpperCase()
              )
              .filter(
                Boolean
              )
          )
        ),
      [
        items,
      ]
    );

  const live =
    useLiveMarketQuotes(
      symbols,
      {
        enabled:
          symbols.length >
          0,

        refreshOnMount:
          true,

        refreshWhenVisible:
          true,

        refreshWhenOnline:
          true,

        pauseWhenHidden:
          true,

        pauseWhenOffline:
          true,

        allowDelayed:
          true,

        allowIndicative:
          false,

        allowStale:
          true,

        allowExpiredFallback:
          true,

        compareProviders:
          false,

        minimumQualityScore:
          40,

        maximumProviderAttempts:
          4,

        marketOpenIntervalMs:
          mode ===
          "WATCHLIST"
            ? 45_000
            : 60_000,

        marketClosedIntervalMs:
          900_000,

        backgroundIntervalMs:
          300_000,

        minimumRefreshGapMs:
          2_500,

        concurrency:
          6,

        timeoutMs:
          10_000,
      }
    );

  const rows =
    useMemo(
      () =>
        items.map(
          (
            item
          ) => {
            const symbol =
              item.symbol
                .trim()
                .toUpperCase();

            const entry =
              entryBySymbol(
                live.entries,
                symbol
              );

            const quote =
              entry?.quote ||
              null;

            const quantity =
              item.quantity ||
              0;

            const liveMarketValue =
              quote &&
              quantity
                ? quote.price *
                  quantity
                : null;

            const costBasis =
              item.costBasis ??
              null;

            const gainLoss =
              liveMarketValue !==
                null &&
              costBasis !==
                null
                ? liveMarketValue -
                  costBasis
                : null;

            const gainLossPercent =
              gainLoss !==
                null &&
              costBasis !==
                null &&
              costBasis !==
                0
                ? (
                    gainLoss /
                    costBasis
                  ) *
                  100
                : null;

            const targetUpside =
              quote &&
              item.targetPrice &&
              quote.price !==
                0
                ? (
                    (
                      item.targetPrice -
                      quote.price
                    ) /
                    quote.price
                  ) *
                  100
                : null;

            return {
              item,
              symbol,
              entry,
              quote,
              quantity,
              liveMarketValue,
              costBasis,
              gainLoss,
              gainLossPercent,
              targetUpside,
            };
          }
        ),
      [
        items,
        live.entries,
      ]
    );

  const pricedRows =
    rows.filter(
      (
        row
      ) =>
        Boolean(
          row.quote
        )
    );

  const staleRows =
    rows.filter(
      (
        row
      ) =>
        Boolean(
          row.quote?.isStale ||
          row.quote?.isExpired
        )
    );

  const delayedRows =
    rows.filter(
      (
        row
      ) =>
        Boolean(
          row.quote?.isDelayed
        )
    );

  const realTimeRows =
    rows.filter(
      (
        row
      ) =>
        Boolean(
          row.quote &&
          row.quote
            .latencyClass ===
            "REAL_TIME" &&
          !row.quote
            .isDelayed &&
          !row.quote
            .isStale &&
          !row.quote
            .isExpired
        )
    );

  const totalLiveValue =
    rows.reduce(
      (
        total,
        row
      ) =>
        total +
        (
          row.liveMarketValue ||
          0
        ),
      0
    );

  const totalCostBasis =
    rows.reduce(
      (
        total,
        row
      ) =>
        total +
        (
          row.costBasis ||
          0
        ),
      0
    );

  const totalGainLoss =
    totalLiveValue -
    totalCostBasis;

  const totalGainLossPercent =
    totalCostBasis >
    0
      ? (
          totalGainLoss /
          totalCostBasis
        ) *
        100
      : null;

  const coverage =
    rows.length >
    0
      ? (
          pricedRows.length /
          rows.length
        ) *
        100
      : 100;

  const averageQuality =
    pricedRows.length >
    0
      ? pricedRows.reduce(
          (
            total,
            row
          ) =>
            total +
            (
              row.quote
                ?.qualityScore ||
              0
            ),
          0
        ) /
        pricedRows.length
      : 0;

  const visibleRows =
    expanded
      ? rows
      : rows.slice(
          0,
          maximumVisibleRows
        );

  if (
    items.length ===
    0
  ) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="border-b border-slate-800 bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-transparent p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex min-h-40 items-center justify-center p-6 text-center">
          <div>
            <Database className="mx-auto h-8 w-8 text-slate-600" />

            <p className="mt-3 text-sm font-medium text-slate-300">
              {emptyMessage}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Live prices begin automatically when symbols are available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="border-b border-slate-800 bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-transparent p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                {eyebrow}
              </p>

              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {mode}
              </span>
            </div>

            <h2 className="mt-2 text-xl font-semibold text-white">
              {title}
            </h2>

            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "inline-flex",
                "items-center",
                "gap-1.5",
                "rounded-lg",
                "border",
                "px-2.5",
                "py-2",
                "text-xs",
                "font-medium",
                live.online
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-400/20 bg-rose-400/10 text-rose-200",
              ].join(
                " "
              )}
            >
              {live.online ? (
                <Wifi className="h-3.5 w-3.5" />
              ) : (
                <WifiOff className="h-3.5 w-3.5" />
              )}

              {live.online
                ? "Online"
                : "Offline"}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-2 text-xs font-medium text-slate-300">
              {live.visible ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}

              {live.visible
                ? "Active"
                : "Paused"}
            </span>

            <button
              type="button"
              disabled={
                live.refreshing ||
                live.loading ||
                !live.online
              }
              onClick={() => {
                void live.refresh();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw
                className={[
                  "h-3.5",
                  "w-3.5",
                  live.refreshing ||
                  live.loading
                    ? "animate-spin"
                    : "",
                ].join(
                  " "
                )}
              />

              Refresh
            </button>

            <button
              type="button"
              disabled={
                live.refreshing ||
                live.loading ||
                !live.online
              }
              onClick={() => {
                void live.forceRefresh();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap className="h-3.5 w-3.5" />

              Force refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className={metricCardClass()}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-400">
              Pricing coverage
            </span>

            <Database className="h-4 w-4 text-sky-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {coverage.toFixed(
              0
            )}
            %
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {pricedRows.length} of{" "}
            {rows.length} symbols priced
          </p>
        </div>

        <div className={metricCardClass()}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-400">
              Real-time quotes
            </span>

            <Activity className="h-4 w-4 text-emerald-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {realTimeRows.length}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {delayedRows.length} delayed ·{" "}
            {staleRows.length} stale
          </p>
        </div>

        <div className={metricCardClass()}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-400">
              Average quality
            </span>

            <Gauge className="h-4 w-4 text-violet-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {pricedRows.length >
            0
              ? averageQuality.toFixed(
                  0
                )
              : "—"}
            {pricedRows.length >
            0
              ? "/100"
              : ""}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Provider reliability score
          </p>
        </div>

        {mode ===
        "HOLDINGS" ? (
          <>
            <div className={metricCardClass()}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-400">
                  Live market value
                </span>

                <Server className="h-4 w-4 text-cyan-300" />
              </div>

              <p className="mt-2 text-xl font-semibold text-white">
                {formatMoney(
                  totalLiveValue
                )}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Live-priced positions only
              </p>
            </div>

            <div className={metricCardClass()}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-400">
                  Live unrealised P/L
                </span>

                {totalGainLoss >=
                0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-300" />
                )}
              </div>

              <p
                className={[
                  "mt-2",
                  "text-xl",
                  "font-semibold",
                  changeTone(
                    totalGainLoss
                  ),
                ].join(
                  " "
                )}
              >
                {formatMoney(
                  totalGainLoss
                )}
              </p>

              <p
                className={[
                  "mt-1",
                  "text-[11px]",
                  changeTone(
                    totalGainLossPercent
                  ),
                ].join(
                  " "
                )}
              >
                {formatPercent(
                  totalGainLossPercent
                )}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={metricCardClass()}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-400">
                  Positive today
                </span>

                <TrendingUp className="h-4 w-4 text-emerald-300" />
              </div>

              <p className="mt-2 text-xl font-semibold text-white">
                {
                  pricedRows.filter(
                    (
                      row
                    ) =>
                      (
                        row.quote
                          ?.changePercent ||
                        0
                      ) >
                      0
                  ).length
                }
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Symbols trading higher
              </p>
            </div>

            <div className={metricCardClass()}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-400">
                  Target opportunities
                </span>

                <ShieldCheck className="h-4 w-4 text-violet-300" />
              </div>

              <p className="mt-2 text-xl font-semibold text-white">
                {
                  rows.filter(
                    (
                      row
                    ) =>
                      (
                        row.targetUpside ||
                        0
                      ) >
                      10
                  ).length
                }
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                More than 10% below target
              </p>
            </div>
          </>
        )}
      </div>

      {!live.online ? (
        <div className="flex items-start gap-3 border-b border-rose-400/20 bg-rose-400/5 px-4 py-3">
          <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />

          <div>
            <p className="text-xs font-semibold text-rose-200">
              Live refresh is paused while offline
            </p>

            <p className="mt-0.5 text-[11px] text-rose-200/70">
              Previously loaded quotes remain visible and refresh automatically when the connection returns.
            </p>
          </div>
        </div>
      ) : null}

      {staleRows.length >
      0 ? (
        <div className="flex items-start gap-3 border-b border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

          <div>
            <p className="text-xs font-semibold text-amber-200">
              {staleRows.length} quote
              {staleRows.length ===
              1
                ? ""
                : "s"}{" "}
              require attention
            </p>

            <p className="mt-0.5 text-[11px] text-amber-200/70">
              Stale or expired prices are clearly marked and excluded from live-quality classification.
            </p>
          </div>
        </div>
      ) : null}

      {live.errorCount >
      0 ? (
        <div className="flex items-start gap-3 border-b border-rose-400/20 bg-rose-400/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />

          <div>
            <p className="text-xs font-semibold text-rose-200">
              {live.errorCount} pricing request
              {live.errorCount ===
              1
                ? ""
                : "s"}{" "}
              failed
            </p>

            <p className="mt-0.5 text-[11px] text-rose-200/70">
              Existing prices remain available where possible. Provider fallback will retry automatically.
            </p>
          </div>
        </div>
      ) : null}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1050px] border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-left">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Asset
              </th>

              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Price
              </th>

              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Change
              </th>

              {mode ===
              "HOLDINGS" ? (
                <>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Live value
                  </th>

                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Live P/L
                  </th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Target
                  </th>

                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Target upside
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Theme
                  </th>
                </>
              )}

              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Quote status
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Quality
              </th>

              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Updated
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map(
              (
                row
              ) => {
                const currency =
                  inferCurrency(
                    row.quote
                  );

                return (
                  <tr
                    key={row.symbol}
                    className="border-b border-slate-800/80 transition hover:bg-slate-900/45"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-cyan-200">
                          {row.symbol
                            .replace(
                              ".AX",
                              ""
                            )
                            .slice(
                              0,
                              4
                            )}
                        </div>

                        <div>
                          <p className="font-semibold text-white">
                            {row.symbol}
                          </p>

                          <p className="max-w-[210px] truncate text-xs text-slate-500">
                            {row.item.name ||
                              row.item.sector ||
                              "Market security"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <p className="font-semibold tabular-nums text-white">
                        {formatMoney(
                          row.quote
                            ?.price,
                          currency
                        )}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {row.quote
                          ?.exchange ||
                          row.item.exchange ||
                          "Exchange pending"}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <p
                        className={[
                          "font-semibold",
                          "tabular-nums",
                          changeTone(
                            row.quote
                              ?.changePercent
                          ),
                        ].join(
                          " "
                        )}
                      >
                        {formatPercent(
                          row.quote
                            ?.changePercent
                        )}
                      </p>

                      <p
                        className={[
                          "mt-0.5",
                          "text-[11px]",
                          "tabular-nums",
                          changeTone(
                            row.quote
                              ?.change
                          ),
                        ].join(
                          " "
                        )}
                      >
                        {row.quote
                          ?.change ===
                          null ||
                        row.quote
                          ?.change ===
                          undefined
                          ? "—"
                          : formatMoney(
                              row.quote
                                .change,
                              currency
                            )}
                      </p>
                    </td>

                    {mode ===
                    "HOLDINGS" ? (
                      <>
                        <td className="px-4 py-3 text-right text-sm tabular-nums text-slate-300">
                          {row.quantity
                            ? row.quantity.toLocaleString(
                                "en-AU",
                                {
                                  maximumFractionDigits:
                                    6,
                                }
                              )
                            : "—"}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <p className="font-semibold tabular-nums text-white">
                            {formatMoney(
                              row.liveMarketValue,
                              currency
                            )}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Cost{" "}
                            {formatMoney(
                              row.costBasis,
                              currency
                            )}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <p
                            className={[
                              "font-semibold",
                              "tabular-nums",
                              changeTone(
                                row.gainLoss
                              ),
                            ].join(
                              " "
                            )}
                          >
                            {formatMoney(
                              row.gainLoss,
                              currency
                            )}
                          </p>

                          <p
                            className={[
                              "mt-0.5",
                              "text-[11px]",
                              "tabular-nums",
                              changeTone(
                                row.gainLossPercent
                              ),
                            ].join(
                              " "
                            )}
                          >
                            {formatPercent(
                              row.gainLossPercent
                            )}
                          </p>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-300">
                          {formatMoney(
                            row.item.targetPrice,
                            currency
                          )}
                        </td>

                        <td
                          className={[
                            "px-4",
                            "py-3",
                            "text-right",
                            "font-semibold",
                            "tabular-nums",
                            changeTone(
                              row.targetUpside
                            ),
                          ].join(
                            " "
                          )}
                        >
                          {formatPercent(
                            row.targetUpside
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                            {row.item.theme ||
                              row.item.sector ||
                              "General"}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="px-4 py-3">
                      <LiveQuoteStatusBadge
                        entry={row.entry}
                        compact
                      />

                      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                        {row.quote
                          ?.marketState ||
                          "UNKNOWN"}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <QuoteQualityMeter
                        compact
                        qualityScore={
                          row.quote
                            ?.qualityScore
                        }
                        confidenceScore={
                          row.quote
                            ?.confidenceScore
                        }
                      />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <p className="text-xs text-slate-300">
                        {liveQuoteDisplayTimestamp(
                          row.quote
                        )}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        {row.quote
                          ? `${row.quote.ageSeconds}s old`
                          : "Waiting for quote"}
                      </p>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {visibleRows.map(
          (
            row
          ) => {
            const currency =
              inferCurrency(
                row.quote
              );

            return (
              <article
                key={row.symbol}
                className="rounded-xl border border-slate-800 bg-slate-950/45 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-cyan-200">
                      {row.symbol
                        .replace(
                          ".AX",
                          ""
                        )
                        .slice(
                          0,
                          4
                        )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-white">
                        {row.symbol}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {row.item.name ||
                          row.item.theme ||
                          row.item.sector ||
                          "Market security"}
                      </p>
                    </div>
                  </div>

                  <LiveQuoteStatusBadge
                    entry={row.entry}
                    compact
                    showProvider={false}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      Price
                    </p>

                    <p className="mt-1 font-semibold tabular-nums text-white">
                      {formatMoney(
                        row.quote
                          ?.price,
                        currency
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      Change
                    </p>

                    <p
                      className={[
                        "mt-1",
                        "font-semibold",
                        "tabular-nums",
                        changeTone(
                          row.quote
                            ?.changePercent
                        ),
                      ].join(
                        " "
                      )}
                    >
                      {formatPercent(
                        row.quote
                          ?.changePercent
                      )}
                    </p>
                  </div>

                  {mode ===
                  "HOLDINGS" ? (
                    <>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                          Live value
                        </p>

                        <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                          {formatMoney(
                            row.liveMarketValue,
                            currency
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                          Live P/L
                        </p>

                        <p
                          className={[
                            "mt-1",
                            "text-sm",
                            "font-semibold",
                            "tabular-nums",
                            changeTone(
                              row.gainLoss
                            ),
                          ].join(
                            " "
                          )}
                        >
                          {formatMoney(
                            row.gainLoss,
                            currency
                          )}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                          Target
                        </p>

                        <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                          {formatMoney(
                            row.item.targetPrice,
                            currency
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                          Target upside
                        </p>

                        <p
                          className={[
                            "mt-1",
                            "text-sm",
                            "font-semibold",
                            "tabular-nums",
                            changeTone(
                              row.targetUpside
                            ),
                          ].join(
                            " "
                          )}
                        >
                          {formatPercent(
                            row.targetUpside
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 border-t border-slate-800 pt-3">
                  <QuoteQualityMeter
                    compact
                    qualityScore={
                      row.quote
                        ?.qualityScore
                    }
                    confidenceScore={
                      row.quote
                        ?.confidenceScore
                    }
                  />

                  <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-600">
                    <span>
                      {row.quote
                        ?.provider
                        ?.replaceAll(
                          "_",
                          " "
                        ) ||
                        "Provider pending"}
                    </span>

                    <span>
                      {liveQuoteDisplayTimestamp(
                        row.quote
                      )}
                    </span>
                  </div>
                </div>
              </article>
            );
          }
        )}
      </div>

      {rows.length >
      maximumVisibleRows ? (
        <div className="flex items-center justify-between gap-3 border-t border-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500">
            Showing{" "}
            {visibleRows.length} of{" "}
            {rows.length} symbols
          </p>

          <button
            type="button"
            onClick={() => {
              setExpanded(
                (
                  current
                ) =>
                  !current
              );
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            {expanded
              ? "Show less"
              : "Show all"}
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-slate-800 bg-slate-950/30 px-4 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />

            {pricedRows.length} priced
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-amber-400" />

            {delayedRows.length} delayed
          </span>

          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />

            {staleRows.length} stale
          </span>
        </div>

        <span>
          Automatic polling adapts to market hours and page visibility.
        </span>
      </div>
    </section>
  );
}
