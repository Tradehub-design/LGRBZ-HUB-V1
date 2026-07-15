"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  Building2,
  CircleDollarSign,
  Database,
  Gauge,
  Globe2,
  Layers3,
  PieChart,
  RefreshCcw,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import {
  useLiveMarketQuotes,
} from "@/hooks/useLiveMarketQuotes";
import {
  calculatePortfolioLiveRecalculation,
  normalisePortfolioLivePosition,
  type PortfolioLiveAllocationBucket,
} from "@/lib/market-data/client/portfolioLiveRecalculation";

type PortfolioAllocationLivePanelProps = {
  holdings: readonly unknown[];
};

type AllocationView =
  | "SECTOR"
  | "INDUSTRY"
  | "CURRENCY"
  | "EXCHANGE"
  | "ACCOUNT"
  | "BROKER";

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

function tone(
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    value === 0
  ) {
    return "text-slate-300";
  }

  return value > 0
    ? "text-emerald-300"
    : "text-rose-300";
}

function viewIcon(
  view: AllocationView
) {
  if (view === "SECTOR") {
    return Layers3;
  }

  if (view === "INDUSTRY") {
    return Building2;
  }

  if (view === "CURRENCY") {
    return CircleDollarSign;
  }

  if (view === "EXCHANGE") {
    return Globe2;
  }

  if (view === "ACCOUNT") {
    return WalletCards;
  }

  return Database;
}

function allocationForView(
  view: AllocationView,
  calculation: ReturnType<
    typeof calculatePortfolioLiveRecalculation
  >
): PortfolioLiveAllocationBucket[] {
  if (view === "SECTOR") {
    return calculation.sectorAllocation;
  }

  if (view === "INDUSTRY") {
    return calculation.industryAllocation;
  }

  if (view === "CURRENCY") {
    return calculation.currencyAllocation;
  }

  if (view === "EXCHANGE") {
    return calculation.exchangeAllocation;
  }

  if (view === "ACCOUNT") {
    return calculation.accountAllocation;
  }

  return calculation.brokerAllocation;
}

export function PortfolioAllocationLivePanel({
  holdings,
}: PortfolioAllocationLivePanelProps) {
  const [
    view,
    setView,
  ] =
    useState<AllocationView>(
      "SECTOR"
    );

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

      marketOpenIntervalMs: 90_000,
      marketClosedIntervalMs: 900_000,
      backgroundIntervalMs: 300_000,

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

  const allocation =
    allocationForView(
      view,
      calculation
    );

  const ViewIcon =
    viewIcon(view);

  if (positions.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Live Allocation Intelligence
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Portfolio Allocation Live Recalculation
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          No open positions are currently available for live allocation.
        </p>
      </section>
    );
  }

  const totals =
    calculation.totals;

  const concentrationLevel =
    totals.topFiveWeight >= 80
      ? "High"
      : totals.topFiveWeight >= 60
        ? "Moderate"
        : "Balanced";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="border-b border-slate-800 bg-gradient-to-r from-violet-500/10 via-cyan-500/5 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Live Allocation Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Portfolio Allocation Live Recalculation
            </h2>

            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              Position weights and allocation groups update from current
              provider prices while the transaction ledger remains the source
              of truth for quantity and cost basis.
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
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
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

            Recalculate allocation
          </button>
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Live market value
            </span>

            <PieChart className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {money(
              totals.liveMarketValue
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Weighting denominator
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
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

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Largest holding
            </span>

            <ShieldAlert className="h-4 w-4 text-amber-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {totals.topHoldingWeight.toFixed(
              1
            )}
            %
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Single-position concentration
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Top-five concentration
            </span>

            <Gauge className="h-4 w-4 text-violet-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {totals.topFiveWeight.toFixed(
              1
            )}
            %
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {concentrationLevel}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Quote quality
            </span>

            <Gauge className="h-4 w-4 text-emerald-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {totals.averageQualityScore.toFixed(
              0
            )}
            /100
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {totals.stalePositionCount} stale ·{" "}
            {totals.delayedPositionCount} delayed
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
                Allocation quality warnings
              </p>

              {calculation.warnings.map(
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

      <div className="border-b border-slate-800 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              "SECTOR",
              "INDUSTRY",
              "CURRENCY",
              "EXCHANGE",
              "ACCOUNT",
              "BROKER",
            ] as AllocationView[]
          ).map(
            (
              option
            ) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setView(option);
                }}
                className={[
                  "whitespace-nowrap",
                  "rounded-lg",
                  "border",
                  "px-3",
                  "py-2",
                  "text-xs",
                  "font-semibold",
                  "transition",
                  view === option
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-slate-800 bg-slate-950/45 text-slate-400 hover:border-slate-700 hover:text-white",
                ].join(" ")}
              >
                {option.charAt(0)}
                {option
                  .slice(1)
                  .toLowerCase()}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid gap-4 p-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-950/45">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <ViewIcon className="h-4 w-4 text-cyan-300" />

              <div>
                <p className="text-sm font-semibold text-white">
                  Live {view.toLowerCase()} allocation
                </p>

                <p className="text-[11px] text-slate-500">
                  Current live market-value weights
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-500">
              {allocation.length} groups
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {allocation.map(
              (
                bucket,
                index
              ) => (
                <div
                  key={bucket.key}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-[10px] font-bold text-slate-400">
                          {index + 1}
                        </span>

                        <p className="truncate font-semibold text-white">
                          {bucket.label}
                        </p>
                      </div>

                      <p className="mt-1 pl-8 text-[11px] text-slate-500">
                        {bucket.pricedPositionCount} of{" "}
                        {bucket.positionCount} positions priced
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {percent(
                          bucket.weight
                        )}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {money(
                          bucket.liveMarketValue
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
                      style={{
                        width: `${Math.min(
                          100,
                          bucket.weight
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-slate-500">
                      Cost{" "}
                      {money(
                        bucket.costBasis
                      )}
                    </span>

                    <span
                      className={[
                        "font-semibold",
                        tone(
                          bucket.unrealisedGainLoss
                        ),
                      ].join(" ")}
                    >
                      P/L{" "}
                      {money(
                        bucket.unrealisedGainLoss
                      )}{" "}
                      ·{" "}
                      {bucket.unrealisedGainLossPercent ===
                      null
                        ? "—"
                        : `${
                            bucket.unrealisedGainLossPercent >
                            0
                              ? "+"
                              : ""
                          }${bucket.unrealisedGainLossPercent.toFixed(
                            2
                          )}%`}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Live concentration
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Largest position weights
                </p>
              </div>

              <ShieldAlert className="h-4 w-4 text-amber-300" />
            </div>

            <div className="mt-4 space-y-3">
              {[...calculation.positions]
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
                  8
                )
                .map(
                  (
                    position
                  ) => (
                    <div
                      key={position.symbol}
                    >
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-medium text-slate-300">
                          {position.symbol}
                        </span>

                        <span className="font-semibold text-white">
                          {position.portfolioWeight.toFixed(
                            2
                          )}
                          %
                        </span>
                      </div>

                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={[
                            "h-full",
                            "rounded-full",
                            position.portfolioWeight >
                            25
                              ? "bg-rose-400"
                              : position.portfolioWeight >
                                  15
                                ? "bg-amber-400"
                                : "bg-cyan-400",
                          ].join(" ")}
                          style={{
                            width: `${Math.min(
                              100,
                              position.portfolioWeight
                            )}%`,
                          }}
                        />
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
                  Provider distribution
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Live-priced value by source
                </p>
              </div>

              <Database className="h-4 w-4 text-sky-300" />
            </div>

            <div className="mt-4 space-y-3">
              {calculation.providerDistribution.map(
                (
                  provider
                ) => (
                  <div
                    key={provider.provider}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-300">
                        {provider.provider.replaceAll(
                          "_",
                          " "
                        )}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        {provider.positionCount} positions
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-white">
                        {provider.weight.toFixed(
                          1
                        )}
                        %
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        {money(
                          provider.marketValue
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
