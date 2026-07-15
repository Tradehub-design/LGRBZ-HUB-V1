"use client";

import {
  useMemo,
} from "react";
import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  Coins,
  Database,
  Gauge,
  RefreshCcw,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  useLiveMarketQuotes,
} from "@/hooks/useLiveMarketQuotes";
import {
  calculateLiveDividendValuation,
  normaliseLiveDividendEvent,
  normaliseLiveDividendHolding,
} from "@/lib/market-data/client/liveDividendValuation";

type DashboardLiveDividendPanelProps = {
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
      maximumFractionDigits: 0,
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
    return "No payment scheduled";
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

function metricCard(): string {
  return [
    "rounded-xl",
    "border",
    "border-slate-800",
    "bg-slate-950/45",
    "p-4",
  ].join(" ");
}

export function DashboardLiveDividendPanel({
  holdings,
  events = [],
}: DashboardLiveDividendPanelProps) {
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Live Dividend Intelligence
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Dashboard Dividend Recalculation
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          No dividend holdings are currently available for live recalculation.
        </p>
      </section>
    );
  }

  const totals =
    valuation.totals;

  const topIncomeHoldings =
    [...valuation.holdings]
      .sort(
        (
          left,
          right
        ) =>
          right.incomeWeight -
          left.incomeWeight
      )
      .slice(
        0,
        5
      );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Live Dividend Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Dashboard Dividend Recalculation
            </h2>

            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              Forward income, portfolio yield, yield on cost and upcoming cashflow
              are recalculated against current market prices and actual quantities.
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
              void live.refresh();
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

            Refresh income
          </button>
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 xl:grid-cols-6">
        <div className={metricCard()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Forward annual income
            </span>

            <Coins className="h-4 w-4 text-emerald-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {money(
              totals.forwardAnnualIncome
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {money(
              totals.monthlyRunRate
            )}{" "}
            monthly run rate
          </p>
        </div>

        <div className={metricCard()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Forward yield
            </span>

            <TrendingUp className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {percent(
              totals.forwardPortfolioYield
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Live market-value basis
          </p>
        </div>

        <div className={metricCard()}>
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
            Transaction cost basis
          </p>
        </div>

        <div className={metricCard()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Next 30 days
            </span>

            <CalendarDays className="h-4 w-4 text-sky-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {money(
              totals.nextThirtyDayIncome
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {money(
              totals.nextNinetyDayIncome
            )}{" "}
            next 90 days
          </p>
        </div>

        <div className={metricCard()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Pricing coverage
            </span>

            <Database className="h-4 w-4 text-amber-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {totals.pricingCoveragePercent.toFixed(
              0
            )}
            %
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Dividend rate{" "}
            {totals.dividendRateCoveragePercent.toFixed(
              0
            )}
            %
          </p>
        </div>

        <div className={metricCard()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Quote quality
            </span>

            <Gauge className="h-4 w-4 text-rose-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {totals.averageQuoteQualityScore.toFixed(
              0
            )}
            /100
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {totals.staleHoldingCount} stale ·{" "}
            {totals.delayedHoldingCount} delayed
          </p>
        </div>
      </div>

      {valuation.warnings.length >
      0 ? (
        <div className="border-b border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

            <div>
              <p className="text-xs font-semibold text-amber-200">
                Dividend income quality warnings
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

      <div className="grid gap-4 p-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Largest income contributors
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Projected annual income by holding
              </p>
            </div>

            <Coins className="h-4 w-4 text-emerald-300" />
          </div>

          <div className="mt-4 space-y-3">
            {topIncomeHoldings.map(
              (
                holding
              ) => (
                <div
                  key={holding.symbol}
                  className="rounded-lg border border-slate-800 bg-slate-900/35 p-3"
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

                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {money(
                          holding.annualIncome,
                          holding.currency
                        )}
                      </p>

                      <p className="mt-0.5 text-[11px] text-emerald-300">
                        {percent(
                          holding.forwardYield
                        )}{" "}
                        forward
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
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

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Income weight{" "}
                      {holding.incomeWeight.toFixed(
                        1
                      )}
                      %
                    </span>

                    <span>
                      YOC{" "}
                      {percent(
                        holding.yieldOnCost
                      )}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Next payment
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Earliest upcoming dividend cashflow
              </p>
            </div>

            <Clock3 className="h-4 w-4 text-sky-300" />
          </div>

          <div className="mt-4 rounded-lg border border-sky-400/20 bg-sky-400/5 p-4">
            <p className="text-2xl font-semibold text-white">
              {money(
                valuation.nextPayment
                  ?.calculatedGrossPayment,
                valuation.nextPayment
                  ?.currency ||
                  "AUD"
              )}
            </p>

            <p className="mt-2 text-sm font-semibold text-sky-200">
              {valuation.nextPayment
                ?.symbol ||
                "No scheduled payment"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {dateLabel(
                valuation.nextPayment
                  ?.paymentDate
              )}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-sky-400/10 pt-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Per share
                </p>

                <p className="mt-1 text-xs font-semibold text-white">
                  {money(
                    valuation.nextPayment
                      ?.dividendPerShare,
                    valuation.nextPayment
                      ?.currency ||
                      "AUD"
                  )}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Quantity
                </p>

                <p className="mt-1 text-xs font-semibold text-white">
                  {valuation.nextPayment
                    ?.resolvedQuantity
                    .toLocaleString(
                      "en-AU"
                    ) ||
                    "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Income status
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Dividend event confidence
              </p>
            </div>

            <Gauge className="h-4 w-4 text-violet-300" />
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                label:
                  "Announced",
                value:
                  totals.announcedIncome,
              },
              {
                label:
                  "Expected",
                value:
                  totals.expectedIncome,
              },
              {
                label:
                  "Forecast",
                value:
                  totals.forecastIncome,
              },
              {
                label:
                  "Paid",
                value:
                  totals.paidIncome,
              },
            ].map(
              (
                row
              ) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/35 px-3 py-2.5"
                >
                  <span className="text-xs text-slate-400">
                    {row.label}
                  </span>

                  <span className="text-xs font-semibold text-white">
                    {money(
                      row.value
                    )}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
