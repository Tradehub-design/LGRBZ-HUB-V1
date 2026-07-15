"use client";

import {
  useMemo,
} from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Database,
  Gauge,
  PieChart,
  RefreshCcw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  useLiveMarketQuotes,
} from "@/hooks/useLiveMarketQuotes";
import {
  calculatePortfolioLiveRecalculation,
  normalisePortfolioLivePosition,
} from "@/lib/market-data/client/portfolioLiveRecalculation";
import {
  LiveQuoteStatusBadge,
} from "./LiveQuoteStatusBadge";
import {
  QuoteQualityMeter,
} from "./QuoteQualityMeter";

type DashboardLivePortfolioPanelProps = {
  holdings: readonly unknown[];
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

  return `${value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

function tone(
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    value === 0
  ) {
    return "text-slate-200";
  }

  return value > 0
    ? "text-emerald-300"
    : "text-rose-300";
}

function cardClass(): string {
  return [
    "rounded-xl",
    "border",
    "border-slate-800",
    "bg-slate-950/45",
    "p-4",
  ].join(" ");
}

export function DashboardLivePortfolioPanel({
  holdings,
}: DashboardLivePortfolioPanelProps) {
  const positions = useMemo(
    () =>
      holdings
        .map(
          normalisePortfolioLivePosition
        )
        .filter(
          (
            position
          ): position is NonNullable<
            ReturnType<
              typeof normalisePortfolioLivePosition
            >
          > =>
            Boolean(position)
        ),
    [holdings]
  );

  const symbols = useMemo(
    () =>
      positions.map(
        (
          position
        ) =>
          position.symbol
      ),
    [positions]
  );

  const live = useLiveMarketQuotes(
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

      marketOpenIntervalMs: 60_000,
      marketClosedIntervalMs: 900_000,
      backgroundIntervalMs: 300_000,

      minimumRefreshGapMs: 2_500,

      concurrency: 6,
      timeoutMs: 10_000,
    }
  );

  const calculation = useMemo(
    () =>
      calculatePortfolioLiveRecalculation({
        positions,
        quoteBySymbol:
          live.quoteBySymbol,
      }),
    [
      live.quoteBySymbol,
      positions,
    ]
  );

  if (positions.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Live Portfolio Intelligence
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Dashboard Live Recalculation
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          No open positions are currently available for live dashboard recalculation.
        </p>
      </section>
    );
  }

  const totals =
    calculation.totals;

  const largestPositions =
    [...calculation.positions]
      .sort(
        (
          left,
          right
        ) =>
          right.portfolioWeight -
          left.portfolioWeight
      )
      .slice(
        0,
        5
      );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Live Portfolio Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Dashboard Live Recalculation
            </h2>

            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              Live provider prices recalculate portfolio value, daily movement,
              gain/loss, concentration and pricing quality without changing the
              underlying transaction ledger.
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
                "font-semibold",
                live.online
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-400/20 bg-rose-400/10 text-rose-200",
              ].join(" ")}
            >
              {live.online ? (
                <Wifi className="h-3.5 w-3.5" />
              ) : (
                <WifiOff className="h-3.5 w-3.5" />
              )}

              {live.online
                ? "Market data online"
                : "Market data offline"}
            </span>

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
              className="inline-flex items-center gap-2 rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50"
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

              Refresh dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 xl:grid-cols-6">
        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Live portfolio value
            </span>

            <BarChart3 className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {money(
              totals.liveMarketValue
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {totals.pricedPositionCount} priced positions
          </p>
        </div>

        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Unrealised P/L
            </span>

            {totals.unrealisedGainLoss >=
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
              tone(
                totals.unrealisedGainLoss
              ),
            ].join(" ")}
          >
            {money(
              totals.unrealisedGainLoss
            )}
          </p>

          <p
            className={[
              "mt-1",
              "text-[11px]",
              tone(
                totals.unrealisedGainLossPercent
              ),
            ].join(" ")}
          >
            {percent(
              totals.unrealisedGainLossPercent
            )}
          </p>
        </div>

        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Daily movement
            </span>

            {totals.dailyValueChange >=
            0 ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-300" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-rose-300" />
            )}
          </div>

          <p
            className={[
              "mt-2",
              "text-xl",
              "font-semibold",
              tone(
                totals.dailyValueChange
              ),
            ].join(" ")}
          >
            {money(
              totals.dailyValueChange
            )}
          </p>

          <p
            className={[
              "mt-1",
              "text-[11px]",
              tone(
                totals.dailyChangePercent
              ),
            ].join(" ")}
          >
            {percent(
              totals.dailyChangePercent
            )}
          </p>
        </div>

        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Pricing coverage
            </span>

            <Database className="h-4 w-4 text-sky-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {totals.pricingCoveragePercent.toFixed(
              0
            )}
            %
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {totals.unpricedPositionCount} unpriced
          </p>
        </div>

        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Quote quality
            </span>

            <Gauge className="h-4 w-4 text-violet-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {totals.averageQualityScore.toFixed(
              0
            )}
            /100
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Confidence{" "}
            {totals.averageConfidenceScore.toFixed(
              0
            )}
            /100
          </p>
        </div>

        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Top-five weight
            </span>

            <PieChart className="h-4 w-4 text-amber-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {totals.topFiveWeight.toFixed(
              1
            )}
            %
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Largest{" "}
            {totals.topHoldingWeight.toFixed(
              1
            )}
            %
          </p>
        </div>
      </div>

      {calculation.warnings.length >
      0 ? (
        <div className="border-b border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

            <div>
              <p className="text-xs font-semibold text-amber-200">
                Live pricing attention required
              </p>

              <div className="mt-1 space-y-0.5">
                {calculation.warnings.map(
                  (
                    warning
                  ) => (
                    <p
                      key={warning}
                      className="text-[11px] text-amber-100/70"
                    >
                      {warning}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 p-4 xl:grid-cols-[1.35fr_1fr_1fr]">
        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Largest live positions
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Current weight using live-priced market value
              </p>
            </div>

            <ShieldCheck className="h-4 w-4 text-cyan-300" />
          </div>

          <div className="mt-4 space-y-3">
            {largestPositions.map(
              (
                position
              ) => (
                <div
                  key={position.symbol}
                  className="rounded-lg border border-slate-800 bg-slate-950/50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">
                        {position.symbol}
                      </p>

                      <p className="mt-0.5 max-w-[230px] truncate text-xs text-slate-500">
                        {position.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {position.portfolioWeight.toFixed(
                          2
                        )}
                        %
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {money(
                          position.liveMarketValue,
                          position.currency
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width: `${Math.min(
                          100,
                          position.portfolioWeight
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <LiveQuoteStatusBadge
                      compact
                      showProvider={false}
                      entry={
                        live.entries.find(
                          (
                            entry
                          ) =>
                            entry?.symbol ===
                            position.symbol
                        ) ||
                        null
                      }
                    />

                    <span
                      className={[
                        "text-xs",
                        "font-semibold",
                        tone(
                          position.dailyChangePercent
                        ),
                      ].join(" ")}
                    >
                      {percent(
                        position.dailyChangePercent
                      )}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Daily movers
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Best and worst live move
              </p>
            </div>

            <Activity className="h-4 w-4 text-sky-300" />
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                Best mover
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {calculation.bestDailyMover
                      ?.symbol ||
                      "—"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {calculation.bestDailyMover
                      ?.name ||
                      "No quote available"}
                  </p>
                </div>

                <span className="font-semibold text-emerald-300">
                  {percent(
                    calculation.bestDailyMover
                      ?.dailyChangePercent
                  )}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-rose-400/20 bg-rose-400/5 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                Worst mover
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {calculation.worstDailyMover
                      ?.symbol ||
                      "—"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {calculation.worstDailyMover
                      ?.name ||
                      "No quote available"}
                  </p>
                </div>

                <span className="font-semibold text-rose-300">
                  {percent(
                    calculation.worstDailyMover
                      ?.dailyChangePercent
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass()}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Pricing reliability
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Provider and freshness quality
              </p>
            </div>

            <Clock3 className="h-4 w-4 text-violet-300" />
          </div>

          <div className="mt-4">
            <QuoteQualityMeter
              qualityScore={
                totals.averageQualityScore
              }
              confidenceScore={
                totals.averageConfidenceScore
              }
            />
          </div>

          <div className="mt-4 space-y-2">
            {calculation.providerDistribution
              .slice(
                0,
                4
              )
              .map(
                (
                  provider
                ) => (
                  <div
                    key={provider.provider}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-slate-400">
                      {provider.provider.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                    <span className="font-semibold text-white">
                      {provider.positionCount} ·{" "}
                      {provider.weight.toFixed(
                        0
                      )}
                      %
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
