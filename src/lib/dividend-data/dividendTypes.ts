import type {
  MarketDataProviderId,
  NormalisedMarketSymbol,
  QuoteRequestSecurity,
} from "@/lib/market-data";

export type DividendProviderId =
  | Extract<
      MarketDataProviderId,
      | "twelve-data"
      | "finnhub"
      | "alpha-vantage"
    >
  | "ledger"
  | "forecast"
  | "manual"
  | "unavailable";

export type DividendEventStatus =
  | "ANNOUNCED"
  | "FORECAST"
  | "RECEIVED"
  | "CANCELLED"
  | "UNKNOWN";

export type DividendEventConfidence =
  | "CONFIRMED"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "NONE";

export type DividendFrequency =
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUAL"
  | "ANNUAL"
  | "IRREGULAR"
  | "UNKNOWN";

export type DividendEvent = {
  id: string;

  symbol: string;
  providerSymbol: string;
  displaySymbol: string;
  exchange: string;
  currency: string;

  exDate: string | null;
  declarationDate: string | null;
  recordDate: string | null;
  paymentDate: string | null;

  dividendPerShare: number | null;
  adjustedDividendPerShare: number | null;

  status: DividendEventStatus;
  confidence: DividendEventConfidence;
  provider: DividendProviderId;

  frequency: DividendFrequency;
  isSpecial: boolean;

  frankingPercentage: number | null;
  taxRate: number | null;

  sourceUpdatedAt: string | null;
  receivedAt: string;

  note: string | null;
};

export type DividendHolding = {
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
};

export type DividendTransaction = {
  id?: string;
  symbol: string;

  type:
    | string
    | null;

  date: string;

  quantity?: number | null;
  amount?: number | null;
  dividendPerShare?: number | null;
  currency?: string | null;

  note?: string | null;
};

export type DividendEligibility = {
  holdingId: string | null;
  symbol: string;

  eligibleQuantity: number;

  exDate: string | null;
  paymentDate: string | null;

  dividendPerShare: number | null;

  expectedCash: number | null;
  frankingCredit: number | null;
  grossedUpIncome: number | null;

  currency: string;

  status: DividendEventStatus;
  confidence: DividendEventConfidence;
};

export type DividendHoldingSummary = {
  symbol: string;
  displaySymbol: string;
  currency: string;

  quantity: number;

  trailingTwelveMonthIncome: number;
  forwardTwelveMonthIncome: number;

  announcedIncome: number;
  forecastIncome: number;
  receivedIncome: number;

  annualisedDividendPerShare: number;
  forwardYield: number | null;
  yieldOnCost: number | null;

  nextExDate: string | null;
  nextPaymentDate: string | null;

  frankingCredits: number;

  eventCount: number;
};

export type MonthlyDividendForecast = {
  month: string;
  label: string;

  announcedIncome: number;
  forecastIncome: number;
  receivedIncome: number;

  totalIncome: number;
  frankingCredits: number;

  eventCount: number;
};

export type DividendPortfolioSummary = {
  currency: string;

  trailingTwelveMonthIncome: number;
  forwardTwelveMonthIncome: number;

  announcedForwardIncome: number;
  forecastForwardIncome: number;

  receivedCurrentFinancialYear: number;

  projectedFrankingCredits: number;

  portfolioDividendYield: number | null;
  portfolioYieldOnCost: number | null;

  nextEvent: DividendEligibility | null;

  monthlyForecast: MonthlyDividendForecast[];
  holdingSummaries: DividendHoldingSummary[];

  eventCount: number;
  announcedEventCount: number;
  forecastEventCount: number;
  receivedEventCount: number;

  generatedAt: string;
};

export type DividendProviderResult = {
  provider: DividendProviderId;
  symbol: NormalisedMarketSymbol;

  events: DividendEvent[];

  requestedAt: string;
  completedAt: string;
  durationMs: number;

  error: string | null;
};

export type DividendDataProvider = {
  id: DividendProviderId;
  name: string;

  isConfigured: () => boolean;

  getDividends: (
    symbol: NormalisedMarketSymbol,
    startDate: string,
    endDate: string
  ) => Promise<DividendProviderResult>;
};

export type DividendIntelligenceRequest = {
  securities?: QuoteRequestSecurity[];
  holdings?: DividendHolding[];
  transactions?: DividendTransaction[];

  startDate?: string;
  endDate?: string;

  baseCurrency?: string;

  forceRefresh?: boolean;
};

export type DividendIntelligenceResponse = {
  ok: boolean;

  events: DividendEvent[];
  eligibility: DividendEligibility[];
  summary: DividendPortfolioSummary;

  providersUsed: DividendProviderId[];
  unresolvedSymbols: string[];

  message?: string;
};
