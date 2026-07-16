"use client";

import {
  BarChart3,
  Coins,
  Layers3,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  HorizontalBarChart,
} from "@/components/workspace/portfolio-charts";

import {
  MetricTile,
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

import {
  usePortfolioIntelligence,
} from "@/core/portfolio-engine/client/usePortfolioIntelligence";

import type {
  AnalyticsHoldingRank,
  AnalyticsPerformanceBucket,
} from "@/core/portfolio-engine/analytics/contracts";

import {
  formatMoney,
  formatPercent,
} from "@/lib/portfolio-engine/format";

function contributionClass(
  value: number,
): string {
  if (value > 0) {
    return "text-emerald-300";
  }

  if (value < 0) {
    return "text-rose-300";
  }

  return "text-slate-300";
}

function contributionTone(
  value: number,
): "emerald" | "rose" | "amber" {
  if (value > 0) {
    return "emerald";
  }

  if (value < 0) {
    return "rose";
  }

  return "amber";
}

function HoldingTable({
  title,
  description,
  holdings,
  emptyMessage,
}: {
  title: string;
  description: string;
  holdings: AnalyticsHoldingRank[];
  emptyMessage: string;
}) {
  return (
    <WorkspacePanel title={title}>
      <p className="-mt-1 mb-4 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <div className="overflow-x-auto rounded-xl border border-[#173047]">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-[#0b1e30] text-slate-400">
            <tr>
              <th className="px-3 py-3">
                Rank
              </th>

              <th className="px-3 py-3">
                Holding
              </th>

              <th className="px-3 py-3">
                Sector
              </th>

              <th className="px-3 py-3 text-right">
                Market Value
              </th>

              <th className="px-3 py-3 text-right">
                Weight
              </th>

              <th className="px-3 py-3 text-right">
                Realised
              </th>

              <th className="px-3 py-3 text-right">
                Unrealised
              </th>

              <th className="px-3 py-3 text-right">
                Income
              </th>

              <th className="px-3 py-3 text-right">
                Total Return
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {holdings.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-8 text-center text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              holdings.map(
                (holding) => (
                  <tr
                    key={holding.holdingId}
                    className="text-slate-300 hover:bg-slate-800/40"
                  >
                    <td className="px-3 py-3 text-slate-500">
                      {holding.rank}
                    </td>

                    <td className="px-3 py-3">
                      <p className="font-semibold text-white">
                        {holding.ticker}
                      </p>

                      <p className="mt-0.5 max-w-48 truncate text-[11px] text-slate-500">
                        {holding.name}
                      </p>
                    </td>

                    <td className="px-3 py-3 text-slate-400">
                      {holding.sector ||
                        "Unclassified"}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {formatMoney(
                        holding.marketValueAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {formatPercent(
                        holding.portfolioWeightPercent,
                      )}
                    </td>

                    <td
                      className={`px-3 py-3 text-right ${contributionClass(
                        holding.realisedGainAud,
                      )}`}
                    >
                      {formatMoney(
                        holding.realisedGainAud,
                      )}
                    </td>

                    <td
                      className={`px-3 py-3 text-right ${contributionClass(
                        holding.unrealisedGainAud,
                      )}`}
                    >
                      {formatMoney(
                        holding.unrealisedGainAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right text-cyan-300">
                      {formatMoney(
                        holding.incomeAud,
                      )}
                    </td>

                    <td
                      className={`px-3 py-3 text-right font-semibold ${contributionClass(
                        holding.totalReturnAud,
                      )}`}
                    >
                      {formatMoney(
                        holding.totalReturnAud,
                      )}

                      <span className="ml-1 text-[11px]">
                        (
                        {formatPercent(
                          holding.totalReturnPercent ??
                            0,
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
    </WorkspacePanel>
  );
}

function PerformanceBucketTable({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: AnalyticsPerformanceBucket[];
}) {
  return (
    <WorkspacePanel title={title}>
      <p className="-mt-1 mb-4 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
            No performance groups are available.
          </p>
        ) : (
          rows.slice(0, 12).map(
            (row) => (
              <div
                key={row.key}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
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
                      {formatPercent(
                        row.portfolioWeightPercent,
                      )}{" "}
                      portfolio weight
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold ${contributionClass(
                        row.totalReturnAud,
                      )}`}
                    >
                      {formatMoney(
                        row.totalReturnAud,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatPercent(
                        row.totalReturnPercent ??
                          0,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                  <p className="text-slate-500">
                    Realised{" "}
                    <span
                      className={contributionClass(
                        row.realisedGainAud,
                      )}
                    >
                      {formatMoney(
                        row.realisedGainAud,
                      )}
                    </span>
                  </p>

                  <p className="text-slate-500">
                    Unrealised{" "}
                    <span
                      className={contributionClass(
                        row.unrealisedGainAud,
                      )}
                    >
                      {formatMoney(
                        row.unrealisedGainAud,
                      )}
                    </span>
                  </p>

                  <p className="text-slate-500">
                    Income{" "}
                    <span className="text-cyan-300">
                      {formatMoney(
                        row.incomeAud,
                      )}
                    </span>
                  </p>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </WorkspacePanel>
  );
}

export default function AnalyticsPage() {
  const {
    analytics,
    reconciliation,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = usePortfolioIntelligence();

  const busy =
    loading ||
    refreshing;

  const maximumContribution =
    Math.max(
      1,
      ...analytics.holdings.map(
        (holding) =>
          Math.abs(
            holding.totalReturnAud,
          ),
      ),
    );

  async function refreshAnalytics() {
    await forceRefresh();
  }

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Intelligence"
        title="Analytics"
        description="Holding, allocation, contribution and income analytics generated from the same canonical Portfolio Engine snapshot used by the dashboard."
        actions={
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                void refreshAnalytics();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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

            <WorkspaceLink href="/performance-attribution">
              Attribution
            </WorkspaceLink>

            <WorkspaceLink href="/reports">
              Reports
            </WorkspaceLink>
          </>
        }
      />

      <WorkspacePanel title="Analytics Reconciliation">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {reconciliation.valid
                ? "Analytics reconcile with canonical portfolio totals."
                : `${reconciliation.issues.length} analytics reconciliation issue${
                    reconciliation.issues.length === 1
                      ? ""
                      : "s"
                  } detected.`}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Engine status: {status}. Snapshot:{" "}
              {analytics.analyticsSnapshotId}.
            </p>
          </div>

          <p
            className={
              reconciliation.valid
                ? "text-sm font-semibold text-emerald-300"
                : "text-sm font-semibold text-rose-300"
            }
          >
            {reconciliation.valid
              ? "Reconciled"
              : "Review required"}
          </p>
        </div>
      </WorkspacePanel>

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile
          label="Portfolio Value"
          value={formatMoney(
            analytics.totals
              .portfolioValueAud,
          )}
          helper={`${formatMoney(
            analytics.totals
              .securitiesMarketValueAud,
          )} securities`}
        />

        <MetricTile
          label="Total Return"
          value={formatMoney(
            analytics.totals
              .totalReturnAud,
          )}
          helper={formatPercent(
            analytics.totals
              .totalReturnPercent ??
              0,
          )}
        />

        <MetricTile
          label="Realised P/L"
          value={formatMoney(
            analytics.totals
              .realisedGainAud,
          )}
        />

        <MetricTile
          label="Unrealised P/L"
          value={formatMoney(
            analytics.totals
              .unrealisedGainAud,
          )}
        />

        <MetricTile
          label="Received Income"
          value={formatMoney(
            analytics.totals
              .totalIncomeAud,
          )}
        />
      </WorkspaceGrid>

      <WorkspaceGrid columns="xl:grid-cols-4">
        <MetricTile
          label="Forward Income"
          value={formatMoney(
            analytics.income
              .forwardTwelveMonthIncomeAud,
          )}
          helper={`${formatMoney(
            analytics.income
              .monthlyForwardIncomeAud,
          )} monthly average`}
        />

        <MetricTile
          label="Dividend Yield"
          value={formatPercent(
            analytics.income
              .dividendYieldPercent ??
              0,
          )}
          helper={`Yield on cost ${formatPercent(
            analytics.income
              .yieldOnCostPercent ??
              0,
          )}`}
        />

        <MetricTile
          label="Winners"
          value={String(
            analytics.contribution
              .positiveHoldingCount,
          )}
          helper={formatMoney(
            analytics.contribution
              .positiveContributionAud,
          )}
        />

        <MetricTile
          label="Detractors"
          value={String(
            analytics.contribution
              .negativeHoldingCount,
          )}
          helper={formatMoney(
            analytics.contribution
              .negativeContributionAud,
          )}
        />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <WorkspacePanel title="Return Contribution">
          <div className="space-y-4">
            {analytics.holdings
              .slice(0, 10)
              .map(
                (holding) => (
                  <ProgressRow
                    key={holding.holdingId}
                    label={holding.ticker}
                    value={formatMoney(
                      holding.totalReturnAud,
                    )}
                    percent={
                      (
                        Math.abs(
                          holding.totalReturnAud,
                        ) /
                        maximumContribution
                      ) *
                      100
                    }
                    tone={contributionTone(
                      holding.totalReturnAud,
                    )}
                  />
                ),
              )}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Contribution Chart">
          <HorizontalBarChart
            data={
              analytics.holdings
                .slice(0, 12)
                .map(
                  (holding) => ({
                    label:
                      holding.ticker,

                    value:
                      holding.totalReturnAud,
                  }),
                )
            }
          />
        </WorkspacePanel>
      </section>

      <HoldingTable
        title="Holding Performance"
        description="Realised, unrealised and income contribution from canonical holding outputs."
        holdings={analytics.holdings}
        emptyMessage="No open holding analytics are available."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <HoldingTable
          title="Top Contributors"
          description="Open holdings ranked by total canonical contribution."
          holdings={analytics.winners.slice(
            0,
            10,
          )}
          emptyMessage="No positive contributors are available."
        />

        <HoldingTable
          title="Largest Detractors"
          description="Open holdings with negative total canonical contribution."
          holdings={analytics.losers.slice(
            0,
            10,
          )}
          emptyMessage="No negative contributors are available."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <PerformanceBucketTable
          title="Sector Performance"
          description="Performance grouped by canonical sector classification."
          rows={
            analytics.performanceBySector
          }
        />

        <PerformanceBucketTable
          title="Strategy Performance"
          description="Performance grouped by canonical strategy classification."
          rows={
            analytics.performanceByStrategy
          }
        />

        <PerformanceBucketTable
          title="Country Performance"
          description="Performance grouped by canonical country classification."
          rows={
            analytics.performanceByCountry
          }
        />

        <PerformanceBucketTable
          title="Industry Performance"
          description="Performance grouped by canonical industry classification."
          rows={
            analytics.performanceByIndustry
          }
        />
      </section>

      <WorkspacePanel title="Income Analytics">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-cyan-300">
              <Coins className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wide">
                Announced
              </p>
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatMoney(
                analytics.income
                  .announcedIncomeAud,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-amber-300">
              <BarChart3 className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wide">
                Forecast
              </p>
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatMoney(
                analytics.income
                  .forecastIncomeAud,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-emerald-300">
              <WalletCards className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wide">
                Franking
              </p>
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatMoney(
                analytics.income
                  .projectedFrankingCreditsAud,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-violet-300">
              <Layers3 className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wide">
                Withholding
              </p>
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatMoney(
                analytics.income
                  .estimatedWithholdingTaxAud,
              )}
            </p>
          </div>
        </div>
      </WorkspacePanel>

      <WorkspacePanel title="Portfolio Breadth">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <TrendingUp className="h-5 w-5 text-emerald-300" />

            <p className="mt-3 text-xs text-slate-500">
              Positive holdings
            </p>

            <p className="mt-1 text-2xl font-semibold text-white">
              {
                analytics.contribution
                  .positiveHoldingCount
              }
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <TrendingDown className="h-5 w-5 text-rose-300" />

            <p className="mt-3 text-xs text-slate-500">
              Negative holdings
            </p>

            <p className="mt-1 text-2xl font-semibold text-white">
              {
                analytics.contribution
                  .negativeHoldingCount
              }
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <Layers3 className="h-5 w-5 text-cyan-300" />

            <p className="mt-3 text-xs text-slate-500">
              Open holdings
            </p>

            <p className="mt-1 text-2xl font-semibold text-white">
              {
                analytics.totals
                  .openHoldingCount
              }
            </p>
          </div>
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
