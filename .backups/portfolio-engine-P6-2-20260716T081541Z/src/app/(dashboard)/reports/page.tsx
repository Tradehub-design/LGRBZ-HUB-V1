"use client";

import {
  BarChart3,
  Coins,
  FileText,
  Layers3,
  ReceiptText,
  RefreshCw,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  MetricTile,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

import {
  usePortfolioIntelligence,
} from "@/core/portfolio-engine/client/usePortfolioIntelligence";

import {
  formatMoney,
  formatPercent,
} from "@/lib/portfolio-engine/format";

function valueClass(
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

function dateLabel(
  value: string,
): string {
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
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(timestamp),
  );
}

export default function ReportsPage() {
  const {
    reports,
    analytics,
    tax,
    reconciliation,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = usePortfolioIntelligence();

  const busy =
    loading ||
    refreshing;

  async function refreshReports() {
    await forceRefresh();
  }

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Intelligence"
        title="Reports"
        description="A single canonical reporting view of valuation, performance, allocation, income and tax records."
        actions={
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                void refreshReports();
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
                : "Refresh reports"}
            </button>

            <WorkspaceLink href="/analytics">
              Analytics
            </WorkspaceLink>

            <WorkspaceLink href="/tax">
              Tax Centre
            </WorkspaceLink>
          </>
        }
      />

      <WorkspacePanel title="Report Integrity">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {reconciliation.valid
                ? "Report data reconciles with canonical portfolio totals."
                : `${reconciliation.issues.length} report reconciliation issue${
                    reconciliation.issues.length === 1
                      ? ""
                      : "s"
                  } detected.`}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Engine status: {status}. Generated{" "}
              {dateLabel(
                reports.generatedAt,
              )}.
            </p>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p>
              Portfolio:{" "}
              {reports.portfolioSnapshotId}
            </p>

            <p className="mt-1">
              Analytics:{" "}
              {reports.analyticsSnapshotId}
            </p>
          </div>
        </div>
      </WorkspacePanel>

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile
          label="Portfolio Value"
          value={formatMoney(
            reports.summary
              .portfolioValueAud,
          )}
          helper={`${formatMoney(
            reports.summary
              .cashBalanceAud,
          )} cash`}
        />

        <MetricTile
          label="Market Value"
          value={formatMoney(
            reports.summary
              .securitiesMarketValueAud,
          )}
          helper={`${reports.summary.holdingCount} holdings`}
        />

        <MetricTile
          label="Open Cost Base"
          value={formatMoney(
            reports.summary
              .openCostBaseAud,
          )}
        />

        <MetricTile
          label="Total Return"
          value={formatMoney(
            reports.summary
              .totalReturnAud,
          )}
          helper={formatPercent(
            reports.summary
              .totalReturnPercent ??
              0,
          )}
        />

        <MetricTile
          label="Forward Income"
          value={formatMoney(
            reports.summary
              .forwardDividendIncomeAud,
          )}
          helper={formatPercent(
            reports.summary
              .dividendYieldPercent ??
              0,
          )}
        />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Portfolio Summary">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon:
                  <WalletCards className="h-4 w-4" />,

                label:
                  "Securities value",

                value:
                  formatMoney(
                    reports.summary
                      .securitiesMarketValueAud,
                  ),
              },

              {
                icon:
                  <Layers3 className="h-4 w-4" />,

                label:
                  "Open cost base",

                value:
                  formatMoney(
                    reports.summary
                      .openCostBaseAud,
                  ),
              },

              {
                icon:
                  <TrendingUp className="h-4 w-4" />,

                label:
                  "Realised P/L",

                value:
                  formatMoney(
                    reports.summary
                      .realisedGainAud,
                  ),

                amount:
                  reports.summary
                    .realisedGainAud,
              },

              {
                icon:
                  <BarChart3 className="h-4 w-4" />,

                label:
                  "Unrealised P/L",

                value:
                  formatMoney(
                    reports.summary
                      .unrealisedGainAud,
                  ),

                amount:
                  reports.summary
                    .unrealisedGainAud,
              },

              {
                icon:
                  <Coins className="h-4 w-4" />,

                label:
                  "Received income",

                value:
                  formatMoney(
                    reports.summary
                      .totalIncomeAud,
                  ),

                amount:
                  reports.summary
                    .totalIncomeAud,
              },

              {
                icon:
                  <ReceiptText className="h-4 w-4" />,

                label:
                  "Transactions",

                value:
                  String(
                    reports.summary
                      .transactionCount,
                  ),
              },
            ].map(
              (item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center gap-2 text-cyan-300">
                    {item.icon}

                    <p className="text-xs text-slate-500">
                      {item.label}
                    </p>
                  </div>

                  <p
                    className={`mt-2 text-xl font-semibold ${
                      typeof item.amount ===
                      "number"
                        ? valueClass(
                            item.amount,
                          )
                        : "text-white"
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              ),
            )}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Income Report">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Received FY
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {formatMoney(
                  analytics.income
                    .receivedIncomeAud,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Trailing 12 months
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {formatMoney(
                  analytics.income
                    .trailingTwelveMonthIncomeAud,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Announced forward
              </p>

              <p className="mt-2 text-xl font-semibold text-cyan-300">
                {formatMoney(
                  analytics.income
                    .announcedIncomeAud,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Forecast forward
              </p>

              <p className="mt-2 text-xl font-semibold text-amber-300">
                {formatMoney(
                  analytics.income
                    .forecastIncomeAud,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Franking credits
              </p>

              <p className="mt-2 text-xl font-semibold text-emerald-300">
                {formatMoney(
                  analytics.income
                    .projectedFrankingCreditsAud,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">
                Withholding tax
              </p>

              <p className="mt-2 text-xl font-semibold text-violet-300">
                {formatMoney(
                  analytics.income
                    .estimatedWithholdingTaxAud,
                )}
              </p>
            </div>
          </div>
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Top Contributors">
          <div className="space-y-3">
            {analytics.winners.length ===
            0 ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
                No positive holding contributors are available.
              </p>
            ) : (
              analytics.winners
                .slice(0, 10)
                .map(
                  (holding) => (
                    <div
                      key={holding.holdingId}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {holding.ticker}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {holding.sector} ·{" "}
                          {formatPercent(
                            holding.portfolioWeightPercent,
                          )}{" "}
                          weight
                        </p>
                      </div>

                      <p className="font-semibold text-emerald-300">
                        {formatMoney(
                          holding.totalReturnAud,
                        )}
                      </p>
                    </div>
                  ),
                )
            )}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Largest Detractors">
          <div className="space-y-3">
            {analytics.losers.length ===
            0 ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
                No negative holding contributors are available.
              </p>
            ) : (
              analytics.losers
                .slice(0, 10)
                .map(
                  (holding) => (
                    <div
                      key={holding.holdingId}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {holding.ticker}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {holding.sector} ·{" "}
                          {formatPercent(
                            holding.portfolioWeightPercent,
                          )}{" "}
                          weight
                        </p>
                      </div>

                      <p className="font-semibold text-rose-300">
                        {formatMoney(
                          holding.totalReturnAud,
                        )}
                      </p>
                    </div>
                  ),
                )
            )}
          </div>
        </WorkspacePanel>
      </section>

      <WorkspacePanel title="Tax Summary">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {tax.financialYear.label}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Posted transactions from{" "}
              {tax.financialYear.startDate.slice(
                0,
                10,
              )}{" "}
              to{" "}
              {tax.financialYear.endDate.slice(
                0,
                10,
              )}.
            </p>
          </div>

          <FileText className="h-5 w-5 text-cyan-300" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Net realised gain
            </p>

            <p
              className={`mt-2 text-xl font-semibold ${valueClass(
                tax.totals
                  .netRealisedCapitalGainAud,
              )}`}
            >
              {formatMoney(
                tax.totals
                  .netRealisedCapitalGainAud,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Dividend income
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatMoney(
                tax.totals
                  .dividendIncomeAud,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Transaction fees
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatMoney(
                tax.totals
                  .transactionFeesAud,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Gross taxable income
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatMoney(
                tax.totals
                  .grossTaxableIncomeAud,
              )}
            </p>
          </div>
        </div>
      </WorkspacePanel>

      <WorkspacePanel title="Report Sources">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label:
                "Portfolio Snapshot",

              value:
                reports.portfolioSnapshotId,
            },

            {
              label:
                "Dashboard Snapshot",

              value:
                reports.dashboardSnapshotId,
            },

            {
              label:
                "Analytics Snapshot",

              value:
                reports.analyticsSnapshotId,
            },

            {
              label:
                "Dividend Snapshot",

              value:
                reports.dividendSnapshotId,
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

                <p className="mt-2 break-all text-xs font-medium text-slate-200">
                  {item.value}
                </p>
              </div>
            ),
          )}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
