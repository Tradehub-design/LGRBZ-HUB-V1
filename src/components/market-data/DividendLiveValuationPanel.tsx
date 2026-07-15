"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Coins,
  Database,
  Gauge,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";
import {
  useLiveMarketQuotes,
} from "@/hooks/useLiveMarketQuotes";
import {
  calculateLiveDividendValuation,
  normaliseLiveDividendEvent,
  normaliseLiveDividendHolding,
} from "@/lib/market-data/client/liveDividendValuation";
import {
  LiveQuoteStatusBadge,
} from "./LiveQuoteStatusBadge";
import {
  QuoteQualityMeter,
} from "./QuoteQualityMeter";

type DividendLiveValuationPanelProps = {
  holdings: readonly unknown[];

  events?: readonly unknown[];
};

function money(
  value: number | null | undefined,
  currency = "AUD"
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits:
        Math.abs(value) <
        100
          ? 2
          : 0,
    }
  ).format(value);
}

function percent(
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(
    2
  )}%`;
}

function dateLabel(
  value: string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

export function DividendLiveValuationPanel({
  holdings,
  events = [],
}: DividendLiveValuationPanelProps) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(
      false
    );

  const normalisedHoldings =
    useMemo(
      () =>
        holdings
          .map(
            normaliseLiveDividendHolding
          )
          .filter(
            (
              holding
            ): holding is NonNullable<
              ReturnType<
                typeof normaliseLiveDividendHolding
              >
            > =>
              Boolean(
                holding
              )
          ),
      [holdings]
    );

  const normalisedEvents =
    useMemo(
      () =>
        events
          .map(
            (
              event,
              index
            ) =>
              normaliseLiveDividendEvent(
                event,
                index
              )
          )
          .filter(
            (
              event
            ): event is NonNullable<
              ReturnType<
                typeof normaliseLiveDividendEvent
              >
            > =>
              Boolean(
                event
              )
          ),
      [events]
    );

  const symbols =
    useMemo(
      () =>
        normalisedHoldings.map(
          (
            holding
          ) =>
            holding.symbol
        ),
      [normalisedHoldings]
    );

  const live =
    useLiveMarketQuotes(
      symbols,
      {
        enabled:
          symbols.length >
          0,

        refreshOnMount: true,
        refreshWhenVisible: true,
        refreshWhenOnline: true,

        pauseWhenHidden: true,
        pauseWhenOffline: true,

        allowDelayed: true,
        allowIndicative: false,
        allowStale: true,
        allowExpiredFallback: true,

        minimumQualityScore: 40,
        maximumProviderAttempts: 4,

        marketOpenIntervalMs: 120_000,
        marketClosedIntervalMs: 900_000,
        backgroundIntervalMs: 300_000,

        concurrency: 6,
        timeoutMs: 10_000,
      }
    );

  const valuation =
    useMemo(
      () =>
        calculateLiveDividendValuation({
          holdings:
            normalisedHoldings,

          events:
            normalisedEvents,

          quoteBySymbol:
            live.quoteBySymbol,
        }),
      [
        live.quoteBySymbol,
        normalisedEvents,
        normalisedHoldings,
      ]
    );

  if (
    normalisedHoldings.length ===
    0
  ) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Live Dividend Valuation
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Dividend Income Recalculation
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          No holdings were available for live dividend valuation.
        </p>
      </section>
    );
  }

  const totals =
    valuation.totals;

  const rows =
    expanded
      ? valuation.holdings
      : valuation.holdings.slice(
          0,
          12
        );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Live Dividend Valuation
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Dividend Income Recalculation
            </h2>

            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              Current prices are applied to actual holdings to recalculate
              forward yield, yield on cost, projected income and payment value.
            </p>
          </div>

          <button
            type="button"
            disabled={
              live.loading ||
              live.refreshing ||
              !live.online
            }
            onClick={() => {
              void live.forceRefresh();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw
              className={[
                "h-3.5",
                "w-3.5",
                live.loading ||
                live.refreshing
                  ? "animate-spin"
                  : "",
              ].join(" ")}
            />

            Refresh dividend pricing
          </button>
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 xl:grid-cols-6">
        {[
          {
            label:
              "Forward income",
            value:
              money(
                totals.forwardAnnualIncome
              ),
            detail:
              `${money(
                totals.monthlyRunRate
              )} per month`,
            icon:
              Coins,
          },
          {
            label:
              "Forward yield",
            value:
              percent(
                totals.forwardPortfolioYield
              ),
            detail:
              "Live price basis",
            icon:
              TrendingUp,
          },
          {
            label:
              "Yield on cost",
            value:
              percent(
                totals.portfolioYieldOnCost
              ),
            detail:
              "Ledger cost basis",
            icon:
              Gauge,
          },
          {
            label:
              "Next 90 days",
            value:
              money(
                totals.nextNinetyDayIncome
              ),
            detail:
              `${money(
                totals.nextThirtyDayIncome
              )} next 30 days`,
            icon:
              CalendarDays,
          },
          {
            label:
              "Price coverage",
            value:
              `${totals.pricingCoveragePercent.toFixed(
                0
              )}%`,
            detail:
              `${totals.unpricedHoldingCount} unpriced`,
            icon:
              Database,
          },
          {
            label:
              "Income concentration",
            value:
              `${totals.topFiveIncomeWeight.toFixed(
                1
              )}%`,
            detail:
              `${totals.largestIncomeWeight.toFixed(
                1
              )}% largest`,
            icon:
              AlertTriangle,
          },
        ].map(
          (
            metric
          ) => {
            const Icon =
              metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-800 bg-slate-950/45 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {metric.label}
                  </span>

                  <Icon className="h-4 w-4 text-emerald-300" />
                </div>

                <p className="mt-2 text-xl font-semibold text-white">
                  {metric.value}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  {metric.detail}
                </p>
              </div>
            );
          }
        )}
      </div>

      {valuation.warnings.length >
      0 ? (
        <div className="border-b border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

            <div>
              <p className="text-xs font-semibold text-amber-200">
                Live dividend data attention required
              </p>

              {valuation.warnings.map(
                (
                  warning
                ) => (
                  <p
                    key={warning}
                    className="mt-0.5 text-[11px] text-amber-100/70"
                  >
                    {warning}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1180px] border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50">
              {[
                "Holding",
                "Live price",
                "Annual DPS",
                "Annual income",
                "Forward yield",
                "Yield on cost",
                "Next payment",
                "Next pay date",
                "Income weight",
                "Quote status",
                "Quality",
              ].map(
                (
                  heading
                ) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map(
              (
                holding
              ) => {
                const entry =
                  live.entries.find(
                    (
                      candidate
                    ) =>
                      candidate?.symbol ===
                      holding.symbol
                  ) ||
                  null;

                return (
                  <tr
                    key={holding.symbol}
                    className="border-b border-slate-800/80 transition hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">
                        {holding.symbol}
                      </p>

                      <p className="mt-0.5 max-w-[190px] truncate text-xs text-slate-500">
                        {holding.name}
                      </p>
                    </td>

                    <td className="px-4 py-3 font-semibold tabular-nums text-white">
                      {money(
                        holding.livePrice,
                        holding.currency
                      )}
                    </td>

                    <td className="px-4 py-3 tabular-nums text-slate-300">
                      {money(
                        holding.annualDividendPerShare,
                        holding.currency
                      )}
                    </td>

                    <td className="px-4 py-3 font-semibold tabular-nums text-white">
                      {money(
                        holding.annualIncome,
                        holding.currency
                      )}
                    </td>

                    <td className="px-4 py-3 font-semibold tabular-nums text-emerald-300">
                      {percent(
                        holding.forwardYield
                      )}
                    </td>

                    <td className="px-4 py-3 font-semibold tabular-nums text-cyan-300">
                      {percent(
                        holding.yieldOnCost
                      )}
                    </td>

                    <td className="px-4 py-3 font-semibold tabular-nums text-white">
                      {money(
                        holding.nextPaymentValue,
                        holding.currency
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-300">
                      {dateLabel(
                        holding.nextPaymentDate
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">
                        {holding.incomeWeight.toFixed(
                          1
                        )}
                        %
                      </p>

                      <div className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{
                            width: `${Math.min(
                              100,
                              holding.incomeWeight
                            )}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <LiveQuoteStatusBadge
                        compact
                        entry={entry}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <QuoteQualityMeter
                        compact
                        qualityScore={
                          holding.quoteQualityScore
                        }
                        confidenceScore={
                          holding.quoteConfidenceScore
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

      <div className="space-y-3 p-4 lg:hidden">
        {rows.map(
          (
            holding
          ) => (
            <article
              key={holding.symbol}
              className="rounded-xl border border-slate-800 bg-slate-950/45 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {holding.symbol}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {holding.name}
                  </p>
                </div>

                <span className="text-sm font-semibold text-emerald-300">
                  {percent(
                    holding.forwardYield
                  )}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Annual income
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {money(
                      holding.annualIncome,
                      holding.currency
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Yield on cost
                  </p>

                  <p className="mt-1 font-semibold text-cyan-300">
                    {percent(
                      holding.yieldOnCost
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Live price
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {money(
                      holding.livePrice,
                      holding.currency
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Next payment
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {money(
                      holding.nextPaymentValue,
                      holding.currency
                    )}
                  </p>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      {valuation.holdings.length >
      12 ? (
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500">
            Showing{" "}
            {rows.length} of{" "}
            {valuation.holdings.length} holdings
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300"
          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}

            {expanded
              ? "Show less"
              : "Show all"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
