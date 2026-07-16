import type {
  PortfolioReportBuildInput,
  PortfolioReportSnapshot,
} from "./contracts";

export function buildPortfolioReportSnapshot(
  input:
    PortfolioReportBuildInput,
): PortfolioReportSnapshot {
  const dashboard =
    input.analytics.dashboard;

  return {
    generatedAt:
      input.generatedAt ??
      input.analytics.generatedAt,

    portfolioSnapshotId:
      dashboard.portfolioSnapshotId,

    dashboardSnapshotId:
      dashboard.dashboardSnapshotId,

    analyticsSnapshotId:
      input.analytics
        .analyticsSnapshotId,

    dividendSnapshotId:
      dashboard.dividendSnapshotId,

    summary: {
      portfolioValueAud:
        dashboard.totals
          .portfolioValueAud,

      securitiesMarketValueAud:
        dashboard.totals
          .securitiesMarketValueAud,

      cashBalanceAud:
        dashboard.totals
          .cashBalanceAud,

      openCostBaseAud:
        dashboard.totals
          .openCostBaseAud,

      realisedGainAud:
        dashboard.totals
          .realisedGainAud,

      unrealisedGainAud:
        dashboard.totals
          .unrealisedGainAud,

      totalIncomeAud:
        dashboard.totals
          .totalIncomeAud,

      totalReturnAud:
        dashboard.totals
          .totalReturnAud,

      totalReturnPercent:
        dashboard.totals
          .totalReturnPercent,

      forwardDividendIncomeAud:
        dashboard.dividendsSummary
          .forwardTwelveMonthIncomeAud,

      dividendYieldPercent:
        dashboard.dividendsSummary
          .portfolioDividendYieldPercent,

      holdingCount:
        dashboard.holdings.length,

      transactionCount:
        dashboard.portfolio
          .transactions.length,
    },

    analytics:
      input.analytics,

    tax:
      input.tax,
  };
}
