"use client";

import {
  BarChart3,
  CircleDollarSign,
  Globe2,
  Layers3,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  usePortfolioIntelligence,
} from "@/core/portfolio-engine/client/usePortfolioIntelligence";

import {
  selectAnalyticsCountryPerformance,
  selectAnalyticsLosers,
  selectAnalyticsReconciliation,
  selectAnalyticsSectorPerformance,
  selectAnalyticsStrategyPerformance,
  selectAnalyticsWinners,
} from "@/core/portfolio-engine/client/intelligence-selectors";

import type {
  AnalyticsHoldingRank,
  AnalyticsPerformanceBucket,
} from "@/core/portfolio-engine/analytics/contracts";

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

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  tone?:
    | "neutral"
    | "positive"
    | "negative";
}) {
  const valueClassName =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
        ? "text-rose-300"
        : "text-white";

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
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

      {children}
    </section>
  );
}

function HoldingTable({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: AnalyticsHoldingRank[];
}) {
  return (
    <Panel
      title={title}
      description={description}
    >
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-3 py-2">
                Holding
              </th>

              <th className="px-3 py-2">
                Sector
              </th>

              <th className="px-3 py-2 text-right">
                Market Value
              </th>

              <th className="px-3 py-2 text-right">
                Weight
              </th>

              <th className="px-3 py-2 text-right">
                Realised
              </th>

              <th className="px-3 py-2 text-right">
                Unrealised
              </th>

              <th className="px-3 py-2 text-right">
                Income
              </th>

              <th className="px-3 py-2 text-right">
                Total Return
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-slate-400"
                >
                  No matching holding records are available.
                </td>
              </tr>
            ) : (
              rows.map(
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

                    <td className="px-3 py-3">
                      {holding.sector ||
                        "Unclassified"}
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

                    <td
                      className={
                        holding.realisedGainAud >= 0
                          ? "px-3 py-3 text-right text-emerald-300"
                          : "px-3 py-3 text-right text-rose-300"
                      }
                    >
                      {money(
                        holding.realisedGainAud,
                      )}
                    </td>

                    <td
                      className={
                        holding.unrealisedGainAud >= 0
                          ? "px-3 py-3 text-right text-emerald-300"
                          : "px-3 py-3 text-right text-rose-300"
                      }
                    >
                      {money(
                        holding.unrealisedGainAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right text-cyan-300">
                      {money(
                        holding.incomeAud,
                      )}
                    </td>

                    <td
                      className={
                        holding.totalReturnAud >= 0
                          ? "px-3 py-3 text-right font-semibold text-emerald-300"
                          : "px-3 py-3 text-right font-semibold text-rose-300"
                      }
                    >
                      {money(
                        holding.totalReturnAud,
                      )}

                      <span className="ml-1 text-[11px]">
                        (
                        {percent(
                          holding.totalReturnPercent,
                        )}
                        )
                      </span>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function PerformanceBuckets({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: AnalyticsPerformanceBucket[];
}) {
  const maximumMagnitude =
    Math.max(
      1,
      ...rows.map(
        (row) =>
          Math.abs(
            row.totalReturnAud,
          ),
      ),
    );

  return (
    <Panel
      title={title}
      description={description}
    >
      <div className="mt-5 space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
            No performance groups are available.
          </p>
        ) : (
          rows.slice(0, 12).map(
            (row) => {
              const width =
                (
                  Math.abs(
                    row.totalReturnAud,
                  ) /
                  maximumMagnitude
                ) *
                100;

              return (
                <div
                  key={row.key}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">
                        {row.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {row.holdingCount} holding
                        {row.holdingCount === 1
                          ? ""
                          : "s"}{" "}
                        ·{" "}
                        {percent(
                          row.portfolioWeightPercent,
                        )}{" "}
                        weight
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={
                          row.totalReturnAud >= 0
                            ? "font-semibold text-emerald-300"
                            : "font-semibold text-rose-300"
                        }
                      >
                        {money(
                          row.totalReturnAud,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {percent(
                          row.totalReturnPercent,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={
                        row.totalReturnAud >= 0
                          ? "h-full rounded-full bg-emerald-400"
                          : "h-full rounded-full bg-rose-400"
                      }
                      style={{
                        width:
                          `${Math.min(
                            100,
                            Math.max(
                              0,
                              width,
                            ),
                          )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500 sm:grid-cols-4">
                    <p>
                      Value:{" "}
                      <span className="text-slate-300">
                        {money(
                          row.marketValueAud,
                        )}
                      </span>
                    </p>

                    <p>
                      Realised:{" "}
                      <span className="text-slate-300">
                        {money(
                          row.realisedGainAud,
                        )}
                      </span>
                    </p>

                    <p>
                      Unrealised:{" "}
                      <span className="text-slate-300">
                        {money(
                          row.unrealisedGainAud,
                        )}
                      </span>
                    </p>

                    <p>
                      Income:{" "}
                      <span className="text-slate-300">
                        {money(
                          row.incomeAud,
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              );
            },
          )
        )}
      </div>
    </Panel>
  );
}

export default function AnalyticsPage() {
  const {
    analytics,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = usePortfolioIntelligence();

  const reconciliation =
    selectAnalyticsReconciliation(
      analytics,
    );

  const winners =
    selectAnalyticsWinners(
      analytics,
    );

  const losers =
    selectAnalyticsLosers(
      analytics,
    );

  const sectorPerformance =
    selectAnalyticsSectorPerformance(
      analytics,
    );

  const countryPerformance =
    selectAnalyticsCountryPerformance(
      analytics,
    );

  const strategyPerformance =
    selectAnalyticsStrategyPerformance(
      analytics,
    );

  const busy =
    loading ||
    refreshing;

  async function refreshAnalytics() {
    await forceRefresh();
  }

  return (
    <main className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Portfolio Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Analytics
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Holding, sector, country, strategy and income analytics generated
            from the unified Portfolio Engine.
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void refreshAnalytics();
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
            : "Refresh analytics"}
        </button>
      </header>

      <section
        className={
          reconciliation.valid &&
          status === "READY"
            ? "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4"
            : status === "ERROR"
              ? "rounded-2xl border border-rose-500/25 bg-rose-500/5 px-5 py-4"
              : "rounded-2xl border border-amber-500/25 bg-amber-500/5 px-5 py-4"
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {reconciliation.valid
                ? "Analytics reconcile with canonical holdings and total return."
                : `${reconciliation.issues.length} analytics reconciliation issue${
                    reconciliation.issues.length === 1
                      ? ""
                      : "s"
                  } detected.`}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Status: {status}. Holdings:{" "}
              {analytics.totals.openHoldingCount}. Transactions:{" "}
              {analytics.totals.transactionCount}.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Snapshot:{" "}
            {analytics.analyticsSnapshotId}
          </p>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<WalletCards />}
          label="Portfolio Value"
          value={money(
            analytics.totals.portfolioValueAud,
          )}
          detail={`${money(
            analytics.totals.securitiesMarketValueAud,
          )} securities · ${money(
            analytics.totals.cashBalanceAud,
          )} cash`}
        />

        <MetricCard
          icon={
            analytics.totals.totalReturnAud >= 0
              ? <TrendingUp />
              : <TrendingDown />
          }
          label="Total Return"
          value={`${money(
            analytics.totals.totalReturnAud,
          )} (${percent(
            analytics.totals.totalReturnPercent,
          )})`}
          detail="Realised + unrealised + received income"
          tone={
            analytics.totals.totalReturnAud >= 0
              ? "positive"
              : "negative"
          }
        />

        <MetricCard
          icon={<CircleDollarSign />}
          label="Forward Income"
          value={money(
            analytics.income.forwardTwelveMonthIncomeAud,
          )}
          detail={`${money(
            analytics.income.monthlyForwardIncomeAud,
          )} average monthly income`}
        />

        <MetricCard
          icon={<BarChart3 />}
          label="Contribution"
          value={money(
            analytics.contribution.netContributionAud,
          )}
          detail={`${analytics.contribution.positiveHoldingCount} positive · ${analytics.contribution.negativeHoldingCount} negative`}
          tone={
            analytics.contribution.netContributionAud >= 0
              ? "positive"
              : "negative"
          }
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<TrendingUp />}
          label="Realised P/L"
          value={money(
            analytics.totals.realisedGainAud,
          )}
          detail="Canonical disposed-position result"
          tone={
            analytics.totals.realisedGainAud >= 0
              ? "positive"
              : "negative"
          }
        />

        <MetricCard
          icon={<Layers3 />}
          label="Unrealised P/L"
          value={money(
            analytics.totals.unrealisedGainAud,
          )}
          detail={`Against ${money(
            analytics.totals.openCostBaseAud,
          )} open cost base`}
          tone={
            analytics.totals.unrealisedGainAud >= 0
              ? "positive"
              : "negative"
          }
        />

        <MetricCard
          icon={<CircleDollarSign />}
          label="Received Income"
          value={money(
            analytics.totals.totalIncomeAud,
          )}
          detail={`${money(
            analytics.income.receivedIncomeAud,
          )} recorded in the current financial year`}
        />

        <MetricCard
          icon={<Globe2 />}
          label="Dividend Yield"
          value={percent(
            analytics.income.dividendYieldPercent,
          )}
          detail={`Yield on cost ${percent(
            analytics.income.yieldOnCostPercent,
          )}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <HoldingTable
          title="Top Contributors"
          description="Open holdings ranked by canonical total return contribution."
          rows={winners.slice(0, 10)}
        />

        <HoldingTable
          title="Largest Detractors"
          description="Open holdings with negative canonical return contribution."
          rows={losers.slice(0, 10)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PerformanceBuckets
          title="Sector Performance"
          description="Return components aggregated from canonical holding classifications."
          rows={sectorPerformance}
        />

        <PerformanceBuckets
          title="Country Performance"
          description="Return components aggregated by canonical country classification."
          rows={countryPerformance}
        />
      </div>

      <PerformanceBuckets
        title="Strategy Performance"
        description="Return components aggregated by the strategy assigned to each canonical holding."
        rows={strategyPerformance}
      />

      <Panel
        title="Income Analytics"
        description="Historical and forecast income from the canonical Dividend Snapshot."
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label:
                "Trailing 12 Months",

              value:
                analytics.income
                  .trailingTwelveMonthIncomeAud,
            },

            {
              label:
                "Announced Forward",

              value:
                analytics.income
                  .announcedIncomeAud,
            },

            {
              label:
                "Forecast Forward",

              value:
                analytics.income
                  .forecastIncomeAud,
            },

            {
              label:
                "Franking Credits",

              value:
                analytics.income
                  .projectedFrankingCreditsAud,
            },
          ].map(
            (item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-xs text-slate-500">
                  {item.label}
                </p>

                <p className="mt-2 text-xl font-semibold text-white">
                  {money(
                    item.value,
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      </Panel>
    </main>
  );
}
