import type {
  AllocationDimension,
  PortfolioHolding,
  PortfolioSnapshot,
  QuoteSource,
  ValidationIssue,
} from "../contracts";

import type {
  PortfolioDividendEvent,
  PortfolioDividendSnapshot,
} from "../dividends/contracts";

export const PORTFOLIO_DASHBOARD_SCHEMA_VERSION =
  1 as const;

export type PortfolioDashboardSchemaVersion =
  typeof PORTFOLIO_DASHBOARD_SCHEMA_VERSION;

export type DashboardDataStatus =
  | "LOADING"
  | "READY"
  | "DEGRADED"
  | "ERROR"
  | "EMPTY";

export type DashboardMetric = {
  value: number;
  formattedCurrency: "AUD";
};

export type DashboardPercentageMetric = {
  value: number | null;
};

export type DashboardHoldingRow = {
  holdingId: string;
  securityId: string;

  ticker: string;
  name: string;

  market: string;
  sector: string;
  industry: string;
  country: string;
  strategy: string;

  quantity: number;

  averageCostAud: number;
  costBaseAud: number;

  marketPriceAud: number;
  marketValueAud: number;

  realisedGainAud: number;
  unrealisedGainAud: number;
  unrealisedGainPercent: number | null;

  totalIncomeAud: number;
  totalReturnAud: number;
  totalReturnPercent: number | null;

  portfolioWeightPercent: number;

  quoteSource: QuoteSource;
  quoteProvider: string;
  quotedAt: string | null;
};

export type DashboardAllocationRow = {
  dimension: AllocationDimension;
  key: string;
  label: string;

  marketValueAud: number;
  costBaseAud: number;

  unrealisedGainAud: number;
  realisedGainAud: number;

  weightPercent: number;
  holdingCount: number;
};

export type DashboardPerformanceSummary = {
  realisedGainAud: number;
  unrealisedGainAud: number;

  totalIncomeAud: number;
  totalReturnAud: number;
  totalReturnPercent: number | null;

  openCostBaseAud: number;
  disposedCostBaseAud: number;

  realisedProceedsAud: number;

  profitableHoldingCount: number;
  losingHoldingCount: number;
  flatHoldingCount: number;

  bestHolding: DashboardHoldingRow | null;
  worstHolding: DashboardHoldingRow | null;
};

export type DashboardDividendSummary = {
  trailingTwelveMonthIncomeAud: number;
  forwardTwelveMonthIncomeAud: number;

  announcedForwardIncomeAud: number;
  forecastForwardIncomeAud: number;

  receivedCurrentFinancialYearAud: number;
  monthlyForwardIncomeAud: number;

  portfolioDividendYieldPercent: number | null;
  portfolioYieldOnCostPercent: number | null;

  projectedFrankingCreditsAud: number;
  estimatedWithholdingTaxAud: number;
  estimatedTaxAud: number;

  nextDividendEvent: PortfolioDividendEvent | null;

  upcomingEventCount: number;
  receivedEventCount: number;
  incomeHoldingCount: number;
};

export type DashboardPricingSummary = {
  openHoldingCount: number;
  pricedHoldingCount: number;

  liveCount: number;
  cachedCount: number;
  previousCloseCount: number;
  transactionFallbackCount: number;
  unavailableCount: number;
  retainedCount: number;

  pricingCoveragePercent: number;
};

export type DashboardConcentrationSummary = {
  largestHoldingWeightPercent: number;
  topFiveWeightPercent: number;

  largestSectorWeightPercent: number;
  largestCountryWeightPercent: number;
  largestPlatformWeightPercent: number;

  holdingCount: number;
  sectorCount: number;
  countryCount: number;
  platformCount: number;
};

export type DashboardDataQuality = {
  status: DashboardDataStatus;

  portfolioErrorCount: number;
  portfolioWarningCount: number;

  dividendErrorCount: number;
  dividendWarningCount: number;

  reconciliationErrorCount: number;

  issues: ValidationIssue[];

  retainedMarketQuotesUsed: boolean;
  retainedDividendResponseUsed: boolean;

  unresolvedDividendSymbols: string[];
};

export type PortfolioDashboardSnapshot = {
  schemaVersion: PortfolioDashboardSchemaVersion;

  dashboardSnapshotId: string;
  generatedAt: string;

  portfolioSnapshotId: string;
  dividendSnapshotId: string;

  portfolio: PortfolioSnapshot;
  dividends: PortfolioDividendSnapshot;

  totals: {
    securitiesMarketValueAud: number;
    cashBalanceAud: number;
    portfolioValueAud: number;

    openCostBaseAud: number;

    realisedGainAud: number;
    unrealisedGainAud: number;

    totalIncomeAud: number;
    totalReturnAud: number;
    totalReturnPercent: number | null;

    netContributionsAud: number;
  };

  holdings: DashboardHoldingRow[];

  topHoldings: DashboardHoldingRow[];

  allocation: {
    security: DashboardAllocationRow[];
    assetClass: DashboardAllocationRow[];
    sector: DashboardAllocationRow[];
    industry: DashboardAllocationRow[];
    country: DashboardAllocationRow[];
    currency: DashboardAllocationRow[];
    platform: DashboardAllocationRow[];
    account: DashboardAllocationRow[];
    strategy: DashboardAllocationRow[];
  };

  performance: DashboardPerformanceSummary;
  dividendsSummary: DashboardDividendSummary;
  pricing: DashboardPricingSummary;
  concentration: DashboardConcentrationSummary;

  dataQuality: DashboardDataQuality;
};

export type PortfolioDashboardBuildInput = {
  portfolio: PortfolioSnapshot;
  dividends: PortfolioDividendSnapshot;

  generatedAt?: string;

  additionalIssues?: ValidationIssue[];
};

export type UnifiedPortfolioDashboardState = {
  dashboard: PortfolioDashboardSnapshot;

  portfolio: PortfolioSnapshot;
  dividends: PortfolioDividendSnapshot;

  status: DashboardDataStatus;

  loading: boolean;
  refreshing: boolean;

  refresh: () => Promise<void>;
  forceRefresh: () => Promise<void>;
};
