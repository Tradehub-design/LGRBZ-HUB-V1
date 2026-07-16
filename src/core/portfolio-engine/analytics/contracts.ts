import type {
  DashboardAllocationRow,
  DashboardHoldingRow,
  PortfolioDashboardSnapshot,
} from "../dashboard/contracts";

import type {
  PerformanceAttributionSnapshot,
} from "../dashboard/attribution";

export const PORTFOLIO_ANALYTICS_SCHEMA_VERSION =
  1 as const;

export type PortfolioAnalyticsSchemaVersion =
  typeof PORTFOLIO_ANALYTICS_SCHEMA_VERSION;

export type AnalyticsPerformanceBucket = {
  key: string;
  label: string;

  marketValueAud: number;
  costBaseAud: number;

  realisedGainAud: number;
  unrealisedGainAud: number;
  incomeAud: number;

  totalReturnAud: number;
  totalReturnPercent: number | null;

  portfolioWeightPercent: number;
  holdingCount: number;
};

export type AnalyticsHoldingRank = {
  rank: number;

  holdingId: string;
  ticker: string;
  name: string;

  sector: string;
  industry: string;
  country: string;
  strategy: string;

  marketValueAud: number;
  portfolioWeightPercent: number;

  realisedGainAud: number;
  unrealisedGainAud: number;
  incomeAud: number;

  totalReturnAud: number;
  totalReturnPercent: number | null;
};

export type AnalyticsContributionSummary = {
  positiveContributionAud: number;
  negativeContributionAud: number;
  netContributionAud: number;

  positiveHoldingCount: number;
  negativeHoldingCount: number;
  flatHoldingCount: number;

  topContributor: AnalyticsHoldingRank | null;
  largestDetractor: AnalyticsHoldingRank | null;
};

export type AnalyticsIncomeSummary = {
  receivedIncomeAud: number;
  trailingTwelveMonthIncomeAud: number;
  forwardTwelveMonthIncomeAud: number;
  monthlyForwardIncomeAud: number;

  announcedIncomeAud: number;
  forecastIncomeAud: number;

  dividendYieldPercent: number | null;
  yieldOnCostPercent: number | null;

  projectedFrankingCreditsAud: number;
  estimatedWithholdingTaxAud: number;
};

export type PortfolioAnalyticsSnapshot = {
  schemaVersion:
    PortfolioAnalyticsSchemaVersion;

  analyticsSnapshotId: string;
  generatedAt: string;

  dashboardSnapshotId: string;
  portfolioSnapshotId: string;
  dividendSnapshotId: string;

  dashboard:
    PortfolioDashboardSnapshot;

  attribution:
    PerformanceAttributionSnapshot;

  holdings:
    AnalyticsHoldingRank[];

  winners:
    AnalyticsHoldingRank[];

  losers:
    AnalyticsHoldingRank[];

  contribution:
    AnalyticsContributionSummary;

  allocation: {
    security:
      DashboardAllocationRow[];

    sector:
      DashboardAllocationRow[];

    industry:
      DashboardAllocationRow[];

    country:
      DashboardAllocationRow[];

    currency:
      DashboardAllocationRow[];

    platform:
      DashboardAllocationRow[];

    strategy:
      DashboardAllocationRow[];

    assetClass:
      DashboardAllocationRow[];
  };

  performanceBySector:
    AnalyticsPerformanceBucket[];

  performanceByIndustry:
    AnalyticsPerformanceBucket[];

  performanceByCountry:
    AnalyticsPerformanceBucket[];

  performanceByStrategy:
    AnalyticsPerformanceBucket[];

  performanceByPlatform:
    AnalyticsPerformanceBucket[];

  income:
    AnalyticsIncomeSummary;

  totals: {
    portfolioValueAud: number;
    securitiesMarketValueAud: number;
    cashBalanceAud: number;

    openCostBaseAud: number;

    realisedGainAud: number;
    unrealisedGainAud: number;
    totalIncomeAud: number;

    totalReturnAud: number;
    totalReturnPercent: number | null;

    transactionCount: number;
    openHoldingCount: number;
  };
};

export type PortfolioAnalyticsBuildInput = {
  dashboard:
    PortfolioDashboardSnapshot;

  generatedAt?: string;
};

export type AnalyticsDashboardHolding =
  DashboardHoldingRow;
