"use client";

import {
  RefreshCw,
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
  useUnifiedPortfolioDashboard,
} from "@/core/portfolio-engine/client/useUnifiedPortfolioDashboard";

import {
  selectDashboardReconciliation,
  selectPerformanceAttribution,
} from "@/core/portfolio-engine/client/dashboard-selectors";

import {
  formatMoney,
  formatPercent,
} from "@/lib/portfolio-engine/format";

function contributionTone(
  amountAud: number,
): "sky" | "emerald" | "rose" | "amber" {
  if (amountAud > 0) {
    return "emerald";
  }

  if (amountAud < 0) {
    return "rose";
  }

  return "amber";
}

export default function PerformanceAttributionPage() {
  const {
    dashboard,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = useUnifiedPortfolioDashboard();

  const attribution =
    selectPerformanceAttribution(
      dashboard,
    );

  const reconciliation =
    selectDashboardReconciliation(
      dashboard,
    );

  const totalMagnitude =
    Math.max(
      1,
      ...attribution.components.map(
        (component) =>
          Math.abs(
            component.amountAud,
          ),
      ),
    );

  const busy =
    loading ||
    refreshing;

  async function refreshAttribution() {
    await forceRefresh();
  }

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Attribution Engine"
        title="Performance Attribution"
        description="Canonical return drivers from realised performance, unrealised performance, received income and recorded transaction fees."
        actions={
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                void refreshAttribution();
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
                : "Refresh attribution"}
            </button>

            <WorkspaceLink href="/analytics">
              Analytics
            </WorkspaceLink>

            <WorkspaceLink href="/reports">
              Reports
            </WorkspaceLink>
          </>
        }
      />

      <WorkspacePanel title="Attribution Reconciliation">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {attribution.reconciled &&
              reconciliation.valid
                ? "Performance attribution reconciles with canonical total return."
                : "Performance attribution requires reconciliation review."}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Engine status: {status}. Difference:{" "}
              {formatMoney(
                attribution
                  .reconciliationDifferenceAud,
              )}.
            </p>
          </div>

          <p
            className={
              attribution.reconciled &&
              reconciliation.valid
                ? "text-sm font-semibold text-emerald-300"
                : "text-sm font-semibold text-rose-300"
            }
          >
            {attribution.reconciled &&
            reconciliation.valid
              ? "Reconciled"
              : "Review required"}
          </p>
        </div>
      </WorkspacePanel>

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile
          label="Total Return"
          value={formatMoney(
            attribution.totalReturnAud,
          )}
          helper={formatPercent(
            attribution.totalReturnPercent ??
            0,
          )}
        />

        <MetricTile
          label="Realised P/L"
          value={formatMoney(
            attribution.realisedGainAud,
          )}
        />

        <MetricTile
          label="Unrealised P/L"
          value={formatMoney(
            attribution.unrealisedGainAud,
          )}
        />

        <MetricTile
          label="Received Income"
          value={formatMoney(
            attribution.incomeAud,
          )}
        />

        <MetricTile
          label="Recorded Fees"
          value={formatMoney(
            attribution.feesAud,
          )}
        />
      </WorkspaceGrid>

      <WorkspacePanel title="Attribution Chart">
        <HorizontalBarChart
          data={
            attribution.components.map(
              (component) => ({
                label:
                  component.label,

                value:
                  component.amountAud,
              }),
            )
          }
        />
      </WorkspacePanel>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <WorkspacePanel title="Return Drivers">
          <div className="space-y-4">
            {attribution.components.map(
              (component) => (
                <ProgressRow
                  key={
                    component.id
                  }
                  label={
                    component.label
                  }
                  value={formatMoney(
                    component.amountAud,
                  )}
                  percent={
                    (
                      Math.abs(
                        component.amountAud,
                      ) /
                      totalMagnitude
                    ) *
                    100
                  }
                  tone={contributionTone(
                    component.amountAud,
                  )}
                />
              ),
            )}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Top Holding Contributors">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">
                    Holding
                  </th>

                  <th className="px-3 py-3">
                    Sector
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
                    Contribution
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {attribution.holdings.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-slate-400"
                    >
                      No open holding attribution is available.
                    </td>
                  </tr>
                ) : (
                  attribution.holdings
                    .slice(0, 12)
                    .map(
                      (holding) => (
                        <tr
                          key={
                            holding.holdingId
                          }
                          className="text-slate-300 hover:bg-slate-800/40"
                        >
                          <td className="px-3 py-3 font-semibold text-white">
                            {holding.ticker}
                          </td>

                          <td className="px-3 py-3 text-slate-400">
                            {holding.sector ||
                              "Unclassified"}
                          </td>

                          <td className="px-3 py-3 text-right">
                            {formatMoney(
                              holding.realisedGainAud,
                            )}
                          </td>

                          <td className="px-3 py-3 text-right">
                            {formatMoney(
                              holding.unrealisedGainAud,
                            )}
                          </td>

                          <td className="px-3 py-3 text-right">
                            {formatMoney(
                              holding.incomeAud,
                            )}
                          </td>

                          <td
                            className={
                              holding.totalContributionAud >=
                              0
                                ? "px-3 py-3 text-right font-semibold text-emerald-300"
                                : "px-3 py-3 text-right font-semibold text-rose-300"
                            }
                          >
                            {formatMoney(
                              holding.totalContributionAud,
                            )}
                          </td>
                        </tr>
                      ),
                    )
                )}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Sector Attribution">
          <div className="space-y-3">
            {attribution.sectors
              .slice(0, 10)
              .map(
                (sector) => (
                  <div
                    key={
                      sector.key
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">
                          {sector.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {sector.holdingCount} holdings ·{" "}
                          {formatPercent(
                            sector.portfolioWeightPercent,
                          )}{" "}
                          weight
                        </p>
                      </div>

                      <p
                        className={
                          sector.totalContributionAud >=
                          0
                            ? "font-semibold text-emerald-300"
                            : "font-semibold text-rose-300"
                        }
                      >
                        {formatMoney(
                          sector.totalContributionAud,
                        )}
                      </p>
                    </div>
                  </div>
                ),
              )}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Strategy Attribution">
          <div className="space-y-3">
            {attribution.strategies
              .slice(0, 10)
              .map(
                (strategy) => (
                  <div
                    key={
                      strategy.key
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">
                          {strategy.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {strategy.holdingCount} holdings ·{" "}
                          {formatPercent(
                            strategy.portfolioWeightPercent,
                          )}{" "}
                          weight
                        </p>
                      </div>

                      <p
                        className={
                          strategy.totalContributionAud >=
                          0
                            ? "font-semibold text-emerald-300"
                            : "font-semibold text-rose-300"
                        }
                      >
                        {formatMoney(
                          strategy.totalContributionAud,
                        )}
                      </p>
                    </div>
                  </div>
                ),
              )}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
