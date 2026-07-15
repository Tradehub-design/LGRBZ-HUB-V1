"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Coins,
  Database,
  Gauge,
  RefreshCcw,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  useLiveMarketQuotes,
} from "@/hooks/useLiveMarketQuotes";
import {
  calculateLiveDividendSynchronisation,
  normaliseLiveDividendEvent,
  normaliseLiveDividendHolding,
} from "@/lib/market-data/client/liveDividendSynchronisation";

type LiveDividendSummaryPanelProps = {
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

  try {
    return new Intl.NumberFormat(
      "en-AU",
      {
        style: "currency",
        currency,
        maximumFractionDigits:
          Math.abs(value) < 100
            ? 2
            : 0,
      }
    ).format(value);
  } catch {
    return `${currency} ${value.toFixed(
      2
    )}`;
  }
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

function scoreTone(
  score: number
): string {
  if (score >= 80) {
    return "text-emerald-300";
  }

  if (score >= 60) {
    return "text-sky-300";
  }

  if (score >= 40) {
    return "text-amber-300";
  }

  return "text-rose-300";
}

function eventStatusClass(
  status: string
): string {
  if (status === "ANNOUNCED") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "EXPECTED") {
    return "border-sky-400/20 bg-sky-400/10 text-sky-200";
  }

  if (status === "FORECAST") {
    return "border-violet-400/20 bg-violet-400/10 text-violet-200";
  }

  if (status === "PAID") {
    return "border-slate-600 bg-slate-800 text-slate-300";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-200";
}

function dateLabel(
  value: string | null
): string {
  if (!value) {
    return "Date unavailable";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
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

export function LiveDividendSummaryPanel({
  holdings: rawHoldings,
  events: rawEvents = [],
}: LiveDividendSummaryPanelProps) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(false);

  const holdings =
    useMemo(
      () =>
        rawHoldings
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
              Boolean(holding)
          ),
      [rawHoldings]
    );

  const events =
    useMemo(
      () =>
        rawEvents
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
              Boolean(event)
          ),
      [rawEvents]
    );

  const symbols =
    useMemo(
      () =>
        Array.from(
          new Set(
            holdings.map(
              (
                holding
              ) =>
                holding.symbol
            )
          )
        ),
      [holdings]
    );

  const live =
    useLiveMarketQuotes(
      symbols,
      {
        enabled:
          symbols.length > 0,

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

        minimumRefreshGapMs: 2_500,

        concurrency: 6,
        timeoutMs: 10_000,
      }
    );

  const result =
    useMemo(
      () =>
        calculateLiveDividendSynchronisation({
          holdings,
          events,
          quoteBySymbol:
            live.quoteBySymbol,
        }),
      [
        events,
        holdings,
        live.quoteBySymbol,
      ]
    );

  const totals =
    result.totals;

  const visibleHoldings =
    expanded
      ? result.holdings
      : result.holdings.slice(
          0,
          8
        );

  if (holdings.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Live Dividend Intelligence
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Dividend Synchronisation
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          No open holdings are currently available for live dividend calculations.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Live Dividend Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Dividend Synchronisation
            </h2>

            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              Current prices now recalculate portfolio yield, forward income,
              yield on cost, payment values, income concentration and forecast
              confidence.
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

            Refresh dividend data
          </button>
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Annual income
            </span>

            <Coins className="h-4 w-4 text-emerald-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {money(
              totals.projectedAnnualIncome
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {money(
              totals.projectedMonthlyIncome
            )}{" "}
            monthly
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Current yield
            </span>

            <Gauge className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {percent(
              totals.currentPortfolioYield
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Based on live-priced value
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Yield on cost
            </span>

            <WalletCards className="h-4 w-4 text-violet-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {percent(
              totals.portfolioYieldOnCost
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Against transaction cost basis
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Next 30 days
            </span>

            <CalendarDays className="h-4 w-4 text-sky-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {money(
              totals.incomeNext30Days
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {money(
              totals.incomeNext90Days
            )}{" "}
            next 90 days
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Forecast confidence
            </span>

            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          </div>

          <p
            className={[
              "mt-2",
              "text-xl",
              "font-semibold",
              scoreTone(
                totals.averageForecastConfidence
              ),
            ].join(" ")}
          >
            {totals.averageForecastConfidence.toFixed(
              0
            )}
            /100
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Data completeness adjusted
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Dividend health
            </span>

            <ShieldAlert className="h-4 w-4 text-amber-300" />
          </div>

          <p
            className={[
              "mt-2",
              "text-xl",
              "font-semibold",
              scoreTone(
                totals.dividendHealthScore
              ),
            ].join(" ")}
          >
            {totals.dividendHealthScore.toFixed(
              0
            )}
            /100
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {totals.dividendCutCount} cuts ·{" "}
            {totals.suspendedHoldingCount} suspended
          </p>
        </div>
      </div>

      {result.nextDividend ? (
        <div className="border-b border-slate-800 bg-emerald-400/5 px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-emerald-300" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Next dividend
                </p>

                <p className="mt-1 font-semibold text-white">
                  {result.nextDividend.symbol} ·{" "}
                  {result.nextDividend.name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Payment{" "}
                  {dateLabel(
                    result.nextDividend.paymentDate
                  )}{" "}
                  · Ex-dividend{" "}
                  {dateLabel(
                    result.nextDividend.exDividendDate
                  )}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-lg font-semibold text-emerald-200">
                {money(
                  result.nextDividend.projectedNetAmount,
                  result.nextDividend.currency
                )}
              </p>

              <p className="text-[11px] text-slate-500">
                {result.nextDividend.confidenceScore.toFixed(
                  0
                )}
                % confidence
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {result.warnings.length > 0 ? (
        <div className="border-b border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

            <div>
              <p className="text-xs font-semibold text-amber-200">
                Dividend data attention required
              </p>

              {result.warnings.map(
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

      <div className="grid gap-4 p-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/45">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">
                Income by holding
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Live yield, yield on cost and projected income
              </p>
            </div>

            <Database className="h-4 w-4 text-cyan-300" />
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Holding
                  </th>

                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Live yield
                  </th>

                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Yield on cost
                  </th>

                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Annual income
                  </th>

                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Contribution
                  </th>

                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Confidence
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleHoldings.map(
                  (
                    holding
                  ) => (
                    <tr
                      key={holding.symbol}
                      className="border-b border-slate-800/80"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">
                          {holding.symbol}
                        </p>

                        <p className="mt-0.5 max-w-[210px] truncate text-xs text-slate-500">
                          {holding.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {holding.dividendFrequency.replaceAll(
                            "_",
                            " "
                          )}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <p className="font-semibold text-white">
                          {percent(
                            holding.currentYield
                          )}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-600">
                          {money(
                            holding.livePrice,
                            holding.currency
                          )}{" "}
                          price
                        </p>
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-slate-300">
                        {percent(
                          holding.yieldOnCost
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <p className="font-semibold text-emerald-200">
                          {money(
                            holding.annualIncome,
                            holding.currency
                          )}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-600">
                          {money(
                            holding.monthlyIncome,
                            holding.currency
                          )}{" "}
                          monthly
                        </p>
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-slate-300">
                        {percent(
                          holding.incomeContributionPercent
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <span
                          className={[
                            "font-semibold",
                            scoreTone(
                              holding.confidenceScore
                            ),
                          ].join(" ")}
                        >
                          {holding.confidenceScore.toFixed(
                            0
                          )}
                          /100
                        </span>

                        {holding.dividendCut ? (
                          <p className="mt-0.5 text-[10px] font-semibold text-rose-300">
                            Possible cut
                          </p>
                        ) : holding.dividendIncrease ? (
                          <p className="mt-0.5 text-[10px] font-semibold text-emerald-300">
                            Increased
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {visibleHoldings.map(
              (
                holding
              ) => (
                <article
                  key={holding.symbol}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">
                        {holding.symbol}
                      </p>

                      <p className="text-xs text-slate-500">
                        {holding.name}
                      </p>
                    </div>

                    <span
                      className={[
                        "text-xs",
                        "font-semibold",
                        scoreTone(
                          holding.confidenceScore
                        ),
                      ].join(" ")}
                    >
                      {holding.confidenceScore.toFixed(
                        0
                      )}
                      /100
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Current yield
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {percent(
                          holding.currentYield
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Yield on cost
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {percent(
                          holding.yieldOnCost
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Annual income
                      </p>

                      <p className="mt-1 font-semibold text-emerald-200">
                        {money(
                          holding.annualIncome,
                          holding.currency
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Contribution
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {percent(
                          holding.incomeContributionPercent
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          {result.holdings.length > 8 ? (
            <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
              <p className="text-xs text-slate-500">
                Showing{" "}
                {visibleHoldings.length} of{" "}
                {result.holdings.length}
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
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Monthly income forecast
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Confirmed and projected payments
                </p>
              </div>

              <CalendarDays className="h-4 w-4 text-emerald-300" />
            </div>

            <div className="mt-4 space-y-3">
              {result.monthlyIncome
                .slice(
                  0,
                  8
                )
                .map(
                  (
                    month
                  ) => (
                    <div
                      key={month.monthKey}
                      className="rounded-lg border border-slate-800 bg-slate-900/40 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-300">
                            {month.label}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            {month.paymentCount} payments ·{" "}
                            {month.symbolCount} holdings
                          </p>
                        </div>

                        <p className="font-semibold text-emerald-200">
                          {money(
                            month.totalAmount
                          )}
                        </p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {month.announcedAmount > 0 ? (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-200">
                            Announced{" "}
                            {money(
                              month.announcedAmount
                            )}
                          </span>
                        ) : null}

                        {month.expectedAmount > 0 ? (
                          <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2 py-0.5 text-[9px] font-semibold text-sky-200">
                            Expected{" "}
                            {money(
                              month.expectedAmount
                            )}
                          </span>
                        ) : null}

                        {month.forecastAmount > 0 ? (
                          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[9px] font-semibold text-violet-200">
                            Forecast{" "}
                            {money(
                              month.forecastAmount
                            )}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )
                )}

              {result.monthlyIncome.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Future payment dates are not currently available.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Upcoming payments
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Calendar cash-flow synchronisation
                </p>
              </div>

              <Clock3 className="h-4 w-4 text-sky-300" />
            </div>

            <div className="mt-4 space-y-3">
              {result.calendar
                .filter(
                  (
                    event
                  ) =>
                    event.daysUntilPayment ===
                      null ||
                    event.daysUntilPayment >=
                      0
                )
                .slice(
                  0,
                  8
                )
                .map(
                  (
                    event
                  ) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-slate-800 bg-slate-900/40 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">
                              {event.symbol}
                            </p>

                            <span
                              className={[
                                "rounded-full",
                                "border",
                                "px-2",
                                "py-0.5",
                                "text-[9px]",
                                "font-semibold",
                                eventStatusClass(
                                  event.status
                                ),
                              ].join(" ")}
                            >
                              {event.status}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-slate-500">
                            {dateLabel(
                              event.paymentDate
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            Ex-dividend{" "}
                            {dateLabel(
                              event.exDividendDate
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-emerald-200">
                            {money(
                              event.projectedNetAmount,
                              event.currency
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            {event.confidenceScore.toFixed(
                              0
                            )}
                            % confidence
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}

              {result.calendar.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No upcoming dividend events are currently available.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
