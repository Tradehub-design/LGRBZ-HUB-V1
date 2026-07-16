import type {
  DividendEligibility,
  DividendEvent,
  DividendEventConfidence,
  DividendEventStatus,
  DividendFrequency,
  DividendHoldingSummary,
  DividendPortfolioSummary,
  DividendProviderId,
  MonthlyDividendForecast,
} from "@/lib/dividend-data";

import type {
  CurrencyCode,
  PortfolioSnapshot,
  QuoteSource,
} from "../contracts";

export const PORTFOLIO_DIVIDEND_SCHEMA_VERSION =
  1 as const;

export type PortfolioDividendSchemaVersion =
  typeof PORTFOLIO_DIVIDEND_SCHEMA_VERSION;

export type PortfolioDividendDataStatus =
  | "IDLE"
  | "LOADING"
  | "READY"
  | "DEGRADED"
  | "ERROR"
  | "EMPTY";

export type PortfolioDividendSource =
  | DividendProviderId
  | "PORTFOLIO_ENGINE"
  | "RETAINED";

export type PortfolioDividendEvent = {
  id: string;

  securityId: string | null;
  holdingId: string | null;

  symbol: string;
  displaySymbol: string;
  providerSymbol: string;

  market: string;
  currency: string;

  exDate: string | null;
  declarationDate: string | null;
  recordDate: string | null;
  paymentDate: string | null;

  dividendPerShare: number | null;
  eligibleQuantity: number;

  expectedCashLocal: number | null;
  expectedCashAud: number | null;

  frankingPercentage: number | null;
  frankingCreditAud: number;
  grossedUpIncomeAud: number;

  withholdingTaxAud: number;
  estimatedTaxAud: number;

  status: DividendEventStatus;
  confidence: DividendEventConfidence;
  frequency: DividendFrequency;

  provider: PortfolioDividendSource;

  isHistorical: boolean;
  isUpcoming: boolean;
  isForecast: boolean;
  isAnnounced: boolean;
  isReceived: boolean;
  isSpecial: boolean;

  sourceUpdatedAt: string | null;
  receivedAt: string;

  note: string | null;
};

export type PortfolioDividendHoldingSummary = {
  holdingId: string;
  securityId: string;

  symbol: string;
  displaySymbol: string;

  quantity: number;

  marketValueAud: number;
  costBaseAud: number;

  trailingTwelveMonthIncomeAud: number;
  forwardTwelveMonthIncomeAud: number;

  announcedIncomeAud: number;
  forecastIncomeAud: number;
  receivedIncomeAud: number;

  annualisedDividendPerShare: number;

  dividendYieldPercent: number | null;
  yieldOnCostPercent: number | null;

  nextExDate: string | null;
  nextPaymentDate: string | null;

  projectedFrankingCreditsAud: number;
  estimatedWithholdingTaxAud: number;

  eventCount: number;

  quoteSource: QuoteSource;
};

export type PortfolioDividendMonth = {
  month: string;
  label: string;

  announcedIncomeAud: number;
  forecastIncomeAud: number;
  receivedIncomeAud: number;

  totalIncomeAud: number;
  frankingCreditsAud: number;
  estimatedTaxAud: number;

  eventCount: number;
};

export type PortfolioDividendTotals = {
  trailingTwelveMonthIncomeAud: number;
  forwardTwelveMonthIncomeAud: number;

  announcedForwardIncomeAud: number;
  forecastForwardIncomeAud: number;

  receivedCurrentFinancialYearAud: number;

  monthlyForwardIncomeAud: number;

  projectedFrankingCreditsAud: number;
  estimatedWithholdingTaxAud: number;
  estimatedTaxAud: number;

  portfolioDividendYieldPercent: number | null;
  portfolioYieldOnCostPercent: number | null;

  securitiesMarketValueAud: number;
  openCostBaseAud: number;

  eventCount: number;
  historicalEventCount: number;
  upcomingEventCount: number;
  announcedEventCount: number;
  forecastEventCount: number;
  receivedEventCount: number;

  holdingCount: number;
  incomeHoldingCount: number;
};

export type PortfolioDividendDataQuality = {
  status: PortfolioDividendDataStatus;

  providerCount: number;
  unresolvedSymbolCount: number;

  retainedResponseUsed: boolean;

  hasProviderData: boolean;
  hasForecastData: boolean;
  hasHistoricalData: boolean;

  warnings: string[];
  errors: string[];
};

export type PortfolioDividendSnapshot = {
  schemaVersion:
    PortfolioDividendSchemaVersion;

  snapshotId: string;

  generatedAt: string;
  portfolioSnapshotId: string;
  portfolioGeneratedAt: string;

  baseCurrency: CurrencyCode;

  events: PortfolioDividendEvent[];

  historicalEvents:
    PortfolioDividendEvent[];

  upcomingEvents:
    PortfolioDividendEvent[];

  announcedEvents:
    PortfolioDividendEvent[];

  forecastEvents:
    PortfolioDividendEvent[];

  receivedEvents:
    PortfolioDividendEvent[];

  holdingSummaries:
    PortfolioDividendHoldingSummary[];

  monthlyForecast:
    PortfolioDividendMonth[];

  totals:
    PortfolioDividendTotals;

  nextEvent:
    PortfolioDividendEvent | null;

  providersUsed:
    PortfolioDividendSource[];

  unresolvedSymbols: string[];

  dataQuality:
    PortfolioDividendDataQuality;
};

export type PortfolioDividendBuildInput = {
  portfolio:
    PortfolioSnapshot;

  events:
    DividendEvent[];

  eligibility:
    DividendEligibility[];

  providerSummary:
    DividendPortfolioSummary;

  providersUsed:
    DividendProviderId[];

  unresolvedSymbols:
    string[];

  generatedAt?: string;

  retainedResponseUsed?: boolean;

  warnings?: string[];

  errors?: string[];
};

export type PortfolioDividendApiPayload = {
  securities:
    Array<{
      symbol: string;
      exchange?: string | null;
      currency?: string | null;
    }>;

  holdings:
    Array<{
      id?: string;
      symbol: string;
      exchange?: string | null;
      currency?: string | null;

      quantity: number;
      averageCost?: number | null;
      currentPrice?: number | null;

      openedAt?: string | null;
      closedAt?: string | null;

      account?: string | null;
      broker?: string | null;
    }>;

  transactions:
    Array<{
      id?: string;
      symbol: string;
      type: string | null;
      date: string;

      quantity?: number | null;
      amount?: number | null;
      dividendPerShare?: number | null;
      currency?: string | null;

      note?: string | null;
    }>;

  startDate: string;
  endDate: string;
  baseCurrency: CurrencyCode;
  forceRefresh: boolean;
};

export type PortfolioDividendApiResult = {
  ok: boolean;

  events: DividendEvent[];
  eligibility: DividendEligibility[];

  summary: DividendPortfolioSummary;

  providersUsed: DividendProviderId[];
  unresolvedSymbols: string[];

  message?: string;
};

export type PortfolioDividendEngineState = {
  portfolio:
    PortfolioSnapshot;

  dividendSnapshot:
    PortfolioDividendSnapshot;

  status:
    PortfolioDividendDataStatus;

  loading: boolean;
  refreshing: boolean;

  error: string | null;

  lastSuccessfulAt: string | null;

  refresh:
    () => Promise<void>;

  forceRefresh:
    () => Promise<void>;
};

export type ExistingDividendHoldingSummary =
  DividendHoldingSummary;

export type ExistingMonthlyDividendForecast =
  MonthlyDividendForecast;
