"use client";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  CalendarDays,
  Coins,
  Layers3,
  PieChart,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  useUnifiedPortfolioDashboard,
} from "@/core/portfolio-engine/client/useUnifiedPortfolioDashboard";

import {
  selectDashboardReconciliation,
} from "@/core/portfolio-engine/client/dashboard-selectors";

import type {
  DashboardDataStatus,
  DashboardHoldingRow,
} from "@/core/portfolio-engine/dashboard/contracts";

function money(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function percent(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

function dateLabel(
  value: string | null,
): string {
  if (!value) {
    return "—";
  }

  const timestamp =
    Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(
    new Date(timestamp),
  );
}

function statusPresentation(
  status: DashboardDataStatus,
): {
  title: string;
  description: string;
  className: string;
} {
  switch (status) {
    case "READY":
      return {
        title:
          "Portfolio data is reconciled.",

        description:
          "Dashboard, holdings, allocation, pricing and dividends are reading the same Portfolio Engine outputs.",

        className:
          "border-emerald-500/25 bg-emerald-500/5",
      };

    case "DEGRADED":
      return {
        title:
          "Portfolio data is available with fallbacks.",

        description:
          "At least one quote, dividend provider or classification is using a retained or fallback source.",

        className:
          "border-amber-500/25 bg-amber-500/5",
      };

    case "ERROR":
      return {
        title:
          "Portfolio reconciliation requires attention.",

        description:
          "One or more canonical totals do not currently reconcile.",

        className:
          "border-rose-500/25 bg-rose-500/5",
      };

    case "EMPTY":
      return {
        title:
          "No open portfolio positions.",

        description:
          "Add posted transactions to populate the Portfolio Engine.",

        className:
          "border-white/10 bg-white/[0.03]",
      };

    case "LOADING":
      return {
        title:
          "Loading the unified Portfolio Engine…",

        description:
          "Holdings, market prices and dividend intelligence are being resolved.",

        className:
          "border-cyan-500/25 bg-cyan-500/5",
      };
  }
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  valueClassName = "text-white",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  valueClassName?: string;
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div className="flex items-center gap-2 text-cyan-300">
        <span className="[&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>

        <p className="text-xs uppercase tracking-[0.17em]">
          {label}
        </p>
      </div>

      <p
        className={`mt-3 text-2xl font-bold ${valueClassName}`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </section>
  );
}

function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function HoldingReturn({
  holding,
}: {
  holding: DashboardHoldingRow;
}) {
  const positive =
    holding.totalReturnAud >= 0;

  return (
    <span
      className={
        positive
          ? "text-emerald-300"
          : "text-rose-300"
      }
    >
      {money(
        holding.totalReturnAud,
      )}{" "}
      (
      {percent(
        holding.totalReturnPercent,
      )}
      )
    </span>
  );
}

export default function DashboardPage() {
  const {
    dashboard,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = useUnifiedPortfolioDashboard();

  const totals =
    dashboard.totals;

  const performance =
    dashboard.performance;

  const dividends =
    dashboard.dividendsSummary;

  const pricing =
    dashboard.pricing;

  const concentration =
    dashboard.concentration;

  const reconciliation =
    selectDashboardReconciliation(
      dashboard,
    );

  const viewState =
    statusPresentation(
      loading
        ? "LOADING"
        : status,
    );

  const busy =
    loading ||
    refreshing;

  const totalReturnPositive =
    totals.totalReturnAud >= 0;

  const unrealisedPositive =
    totals.unrealisedGainAud >= 0;

  const realisedPositive =
    totals.realisedGainAud >= 0;

  async function refreshDashboard() {
    await forceRefresh();
  }

  return (
    <main className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Portfolio Command Centre
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Dashboard
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            One reconciled view of holdings, market valuation, performance,
            allocation and income.
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void refreshDashboard();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={
              busy
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />

          {busy
            ? "Refreshing…"
            : "Refresh portfolio"}
        </button>
      </header>

      <section
        className={`rounded-2xl border px-5 py-4 ${viewState.className}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {viewState.title}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {viewState.description}
            </p>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p>
              Reconciled:{" "}
              <span
                className={
                  reconciliation.valid
                    ? "text-emerald-300"
                    : "text-rose-300"
                }
              >
                {reconciliation.valid
                  ? "yes"
                  : "no"}
              </span>
            </p>

            <p className="mt-1">
              Pricing coverage:{" "}
              {pricing.pricingCoveragePercent.toFixed(1)}%
            </p>

            <p className="mt-1">
              Snapshot:{" "}
              {dashboard.dashboardSnapshotId}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Wallet />}
          label="Portfolio Value"
          value={money(
            totals.portfolioValueAud,
          )}
          detail={`${money(
            totals.securitiesMarketValueAud,
          )} securities · ${money(
            totals.cashBalanceAud,
          )} cash`}
        />

        <MetricCard
          icon={
            totalReturnPositive
              ? <TrendingUp />
              : <TrendingDown />
          }
          label="Total Return"
          value={`${money(
            totals.totalReturnAud,
          )} (${percent(
            totals.totalReturnPercent,
          )})`}
          detail="Realised + unrealised + received income"
          valueClassName={
            totalReturnPositive
              ? "text-emerald-300"
              : "text-rose-300"
          }
        />

        <MetricCard
          icon={<Activity />}
          label="Unrealised P/L"
          value={money(
            totals.unrealisedGainAud,
          )}
          detail={`Against ${money(
            totals.openCostBaseAud,
          )} open cost base`}
          valueClassName={
            unrealisedPositive
              ? "text-emerald-300"
              : "text-rose-300"
          }
        />

        <MetricCard
          icon={<Coins />}
          label="Forward Income"
          value={money(
            dividends.forwardTwelveMonthIncomeAud,
          )}
          detail={`${money(
            dividends.monthlyForwardIncomeAud,
          )} average per month`}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<TrendingUp />}
          label="Realised P/L"
          value={money(
            totals.realisedGainAud,
          )}
          detail={`${money(
            performance.realisedProceedsAud,
          )} realised proceeds`}
          valueClassName={
            realisedPositive
              ? "text-emerald-300"
              : "text-rose-300"
          }
        />

        <MetricCard
          icon={<PieChart />}
          label="Dividend Yield"
          value={percent(
            dividends.portfolioDividendYieldPercent,
          )}
          detail={`Yield on cost ${percent(
            dividends.portfolioYieldOnCostPercent,
          )}`}
        />

        <MetricCard
          icon={<ShieldCheck />}
          label="Pricing Coverage"
          value={`${pricing.pricingCoveragePercent.toFixed(
            1,
          )}%`}
          detail={`${pricing.liveCount} live · ${pricing.cachedCount} cached · ${pricing.transactionFallbackCount} transaction fallback`}
        />

        <MetricCard
          icon={<Layers3 />}
          label="Open Holdings"
          value={String(
            concentration.holdingCount,
          )}
          detail={`${concentration.sectorCount} sectors · ${concentration.countryCount} countries`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Panel
          title="Largest Holdings"
          description="Canonical market values and weights from the Portfolio Engine."
          action={
            <Link
              href="/holdings"
              className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              View holdings
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="px-3 py-2">
                    Holding
                  </th>

                  <th className="px-3 py-2 text-right">
                    Market Value
                  </th>

                  <th className="px-3 py-2 text-right">
                    Weight
                  </th>

                  <th className="px-3 py-2 text-right">
                    Total Return
                  </th>

                  <th className="px-3 py-2">
                    Source
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard.topHoldings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-slate-400"
                    >
                      No open holdings are available.
                    </td>
                  </tr>
                ) : (
                  dashboard.topHoldings
                    .slice(0, 8)
                    .map(
                      (holding) => (
                        <tr
                          key={holding.holdingId}
                          className="border-t border-white/10 text-slate-200"
                        >
                          <td className="px-3 py-3">
                            <p className="font-semibold text-white">
                              {holding.ticker}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {holding.name}
                            </p>
                          </td>

                          <td className="px-3 py-3 text-right">
                            {money(
                              holding.marketValueAud,
                            )}
                          </td>

                          <td className="px-3 py-3 text-right">
                            {percent(
                              holding.portfolioWeightPercent,
                            )}
                          </td>

                          <td className="px-3 py-3 text-right">
                            <HoldingReturn
                              holding={holding}
                            />
                          </td>

                          <td className="px-3 py-3">
                            {holding.quoteSource}
                          </td>
                        </tr>
                      ),
                    )
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Portfolio Concentration"
          description="Largest exposures from canonical allocation weights."
          action={
            <Link
              href="/portfolio-allocation"
              className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              View allocation
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="mt-5 space-y-5">
            {[
              {
                label:
                  "Largest holding",

                value:
                  concentration
                    .largestHoldingWeightPercent,
              },

              {
                label:
                  "Top five holdings",

                value:
                  concentration
                    .topFiveWeightPercent,
              },

              {
                label:
                  "Largest sector",

                value:
                  concentration
                    .largestSectorWeightPercent,
              },

              {
                label:
                  "Largest country",

                value:
                  concentration
                    .largestCountryWeightPercent,
              },

              {
                label:
                  "Largest platform",

                value:
                  concentration
                    .largestPlatformWeightPercent,
              },
            ].map(
              (row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-400">
                      {row.label}
                    </p>

                    <p className="text-sm font-semibold text-white">
                      {percent(
                        row.value,
                      )}
                    </p>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width:
                          `${Math.min(
                            100,
                            Math.max(
                              0,
                              row.value,
                            ),
                          )}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Performance Summary"
          description="Canonical realised, unrealised and income components."
          action={
            <Link
              href="/performance-attribution"
              className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              Performance
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Profitable holdings
              </p>

              <p className="mt-1 text-xl font-semibold text-emerald-300">
                {performance.profitableHoldingCount}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Losing holdings
              </p>

              <p className="mt-1 text-xl font-semibold text-rose-300">
                {performance.losingHoldingCount}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Best performer
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {performance.bestHolding?.ticker ??
                  "—"}
              </p>

              <p className="mt-1 text-xs text-emerald-300">
                {percent(
                  performance.bestHolding
                    ?.totalReturnPercent ??
                    null,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Worst performer
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {performance.worstHolding?.ticker ??
                  "—"}
              </p>

              <p className="mt-1 text-xs text-rose-300">
                {percent(
                  performance.worstHolding
                    ?.totalReturnPercent ??
                    null,
                )}
              </p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Dividend Outlook"
          description="Forward income from the canonical Dividend Snapshot."
          action={
            <Link
              href="/dividend-forecast"
              className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              Dividend forecast
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Announced income
              </p>

              <p className="mt-1 text-xl font-semibold text-cyan-300">
                {money(
                  dividends.announcedForwardIncomeAud,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Forecast income
              </p>

              <p className="mt-1 text-xl font-semibold text-amber-300">
                {money(
                  dividends.forecastForwardIncomeAud,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Franking credits
              </p>

              <p className="mt-1 text-xl font-semibold text-emerald-300">
                {money(
                  dividends.projectedFrankingCreditsAud,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Next payment
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {dividends.nextDividendEvent
                  ?.displaySymbol ??
                  "—"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {dateLabel(
                  dividends.nextDividendEvent
                    ?.paymentDate ??
                    null,
                )}
              </p>
            </div>
          </div>
        </Panel>
      </div>

      {dashboard.dataQuality.issues.length > 0 ? (
        <Panel
          title="Data Quality"
          description="Canonical reconciliation and provider notices."
        >
          <div className="mt-4 space-y-2">
            {dashboard.dataQuality.issues
              .slice(0, 10)
              .map(
                (issue, index) => (
                  <div
                    key={`${issue.code}-${issue.field}-${index}`}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-slate-200">
                        {issue.message}
                      </p>

                      <span
                        className={
                          issue.severity === "error"
                            ? "text-xs font-medium text-rose-300"
                            : "text-xs font-medium text-amber-300"
                        }
                      >
                        {issue.severity}
                      </span>
                    </div>
                  </div>
                ),
              )}
          </div>
        </Panel>
      ) : null}

      <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            href:
              "/holdings",

            title:
              "Holdings",

            detail:
              "Positions and valuation",
          },

          {
            href:
              "/portfolio-allocation",

            title:
              "Allocation",

            detail:
              "Exposure and concentration",
          },

          {
            href:
              "/dividends",

            title:
              "Dividends",

            detail:
              "Historical and upcoming income",
          },

          {
            href:
              "/live-prices",

            title:
              "Live Prices",

            detail:
              "Quote sources and coverage",
          },
        ].map(
          (item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.detail}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-300" />
              </div>
            </Link>
          ),
        )}
      </nav>
    </main>
  );
}
