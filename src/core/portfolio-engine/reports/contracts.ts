import type {
  PortfolioAnalyticsSnapshot,
} from "../analytics/contracts";

import type {
  PortfolioTaxSnapshot,
} from "../tax/contracts";

export type PortfolioReportSnapshot = {
  generatedAt: string;

  portfolioSnapshotId: string;
  dashboardSnapshotId: string;
  analyticsSnapshotId: string;
  dividendSnapshotId: string;

  summary: {
    portfolioValueAud: number;
    securitiesMarketValueAud: number;
    cashBalanceAud: number;

    openCostBaseAud: number;

    realisedGainAud: number;
    unrealisedGainAud: number;
    totalIncomeAud: number;

    totalReturnAud: number;
    totalReturnPercent: number | null;

    forwardDividendIncomeAud: number;
    dividendYieldPercent: number | null;

    holdingCount: number;
    transactionCount: number;
  };

  analytics:
    PortfolioAnalyticsSnapshot;

  tax:
    PortfolioTaxSnapshot;
};

export type PortfolioReportBuildInput = {
  analytics:
    PortfolioAnalyticsSnapshot;

  tax:
    PortfolioTaxSnapshot;

  generatedAt?: string;
};
