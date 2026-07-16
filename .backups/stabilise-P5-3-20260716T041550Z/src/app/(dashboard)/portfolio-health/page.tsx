"use client";

import {
  HeartPulse,
  RefreshCw,
  Shield,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  HealthRing,
} from "@/components/workspace/health-ring";

import {
  InsightFeed,
} from "@/components/workspace/insight-feed";

import {
  PremiumStatCard,
} from "@/components/workspace/premium-stat-card";

import {
  RiskRadar,
} from "@/components/workspace/risk-radar";

import {
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

import {
  useUnifiedPortfolioDashboard,
} from "@/core/portfolio-engine/client/useUnifiedPortfolioDashboard";

import {
  selectDashboardReconciliation,
  selectPortfolioHealth,
} from "@/core/portfolio-engine/client/dashboard-selectors";

import {
  formatMoney,
  formatPercent,
} from "@/lib/portfolio-engine/format";

export default function PortfolioHealthPage() {
  const {
    dashboard,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = useUnifiedPortfolioDashboard();

  const health =
    selectPortfolioHealth(
      dashboard,
    );

  const reconciliation =
    selectDashboardReconciliation(
      dashboard,
    );

  const busy =
    loading ||
    refreshing;

  async function refreshHealth() {
    await forceRefresh();
  }

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Intelligence"
        title="Portfolio Health"
        description="Portfolio health derived from canonical diversification, concentration, liquidity, pricing and data-quality measurements."
        actions={
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                void refreshHealth();
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
                : "Refresh health"}
            </button>

            <WorkspaceLink href="/portfolio-allocation">
              Allocation
            </WorkspaceLink>

            <WorkspaceLink href="/performance-attribution">
              Performance
            </WorkspaceLink>
          </>
        }
      />

      <WorkspacePanel title="Canonical Health Status">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {reconciliation.valid
                ? "Portfolio Health is using reconciled Portfolio Engine data."
                : `${reconciliation.issues.length} reconciliation issue${
                    reconciliation.issues.length === 1
                      ? ""
                      : "s"
                  } affect the health assessment.`}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Engine status: {status}. Pricing coverage:{" "}
              {formatPercent(
                dashboard.pricing
                  .pricingCoveragePercent,
              )}.
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

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard
          icon={<HeartPulse />}
          label="Health Score"
          value={`${health.score.toFixed(
            0,
          )}/100`}
          helper={health.rating}
          tone={
            health.score >= 70
              ? "green"
              : health.score >= 50
                ? "amber"
                : "rose"
          }
        />

        <PremiumStatCard
          icon={<Shield />}
          label="Risk Score"
          value={`${health.riskScore.toFixed(
            0,
          )}/100`}
          helper={`${formatPercent(
            health.largestHoldingPercent,
          )} largest holding`}
          tone={
            health.riskScore <= 30
              ? "green"
              : health.riskScore <= 50
                ? "amber"
                : "rose"
          }
        />

        <PremiumStatCard
          icon={<Wallet />}
          label="Cash"
          value={formatMoney(
            dashboard.totals
              .cashBalanceAud,
            2,
          )}
          helper={formatPercent(
            health.cashPercent,
          )}
          tone="blue"
        />

        <PremiumStatCard
          icon={<TrendingUp />}
          label="Total Return"
          value={formatMoney(
            dashboard.totals
              .totalReturnAud,
            2,
          )}
          helper={formatPercent(
            dashboard.totals
              .totalReturnPercent ??
              0,
          )}
          tone={
            dashboard.totals
              .totalReturnAud >= 0
              ? "purple"
              : "rose"
          }
        />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <WorkspacePanel title="Health Ring">
          <HealthRing
            score={health.score}
          />
        </WorkspacePanel>

        <WorkspacePanel title="Risk Radar">
          <RiskRadar
            largestHoldingPercent={
              health.largestHoldingPercent
            }
            largestSectorPercent={
              health.largestSectorPercent
            }
            largestCountryPercent={
              health.largestCountryPercent
            }
            highRiskPercent={
              health.topFivePercent
            }
            cashPercent={
              health.cashPercent
            }
          />
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Health Breakdown">
          <div className="space-y-4">
            <ProgressRow
              label="Diversification"
              value={`${health.diversificationScore.toFixed(
                0,
              )}/100`}
              percent={
                health.diversificationScore
              }
              tone="emerald"
            />

            <ProgressRow
              label="Concentration Control"
              value={`${health.concentrationScore.toFixed(
                0,
              )}/100`}
              percent={
                health.concentrationScore
              }
              tone="sky"
            />

            <ProgressRow
              label="Liquidity"
              value={`${health.liquidityScore.toFixed(
                0,
              )}/100`}
              percent={
                health.liquidityScore
              }
              tone="violet"
            />

            <ProgressRow
              label="Pricing Reliability"
              value={`${health.pricingScore.toFixed(
                0,
              )}/100`}
              percent={
                health.pricingScore
              }
              tone="amber"
            />

            <ProgressRow
              label="Data Quality"
              value={`${health.dataQualityScore.toFixed(
                0,
              )}/100`}
              percent={
                health.dataQualityScore
              }
              tone="rose"
            />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Recommendations">
          <InsightFeed
            insights={
              health.recommendations.map(
                (item) => ({
                  id:
                    item.id,

                  title:
                    item.title,

                  detail:
                    item.detail,

                  category:
                    item.category,
                }),
              )
            }
          />
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
