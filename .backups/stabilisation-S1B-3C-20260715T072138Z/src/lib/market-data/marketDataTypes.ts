import type {
  MarketDataProvider as LegacyMarketDataProvider,
  MarketDataProviderHealth as LegacyMarketDataProviderHealth,
  MarketDataProviderResult as LegacyMarketDataProviderResult,
  MarketQuote as LegacyMarketQuote,
  MarketQuoteBatch as LegacyMarketQuoteBatch,
  NormalisedMarketSymbol as LegacyNormalisedMarketSymbol,
  QuoteApiResponse as LegacyQuoteApiResponse,
  QuoteCacheEntry as LegacyQuoteCacheEntry,
  QuoteConfidence as LegacyQuoteConfidence,
  QuoteFreshnessStatus as LegacyQuoteFreshnessStatus,
  QuoteRequestSecurity as LegacyQuoteRequestSecurity,
} from "./compatibility/legacyMarketDataCompatibility";

export type MarketDataAssetType =
  | "EQUITY"
  | "ETF"
  | "FUND"
  | "INDEX"
  | "FOREX"
  | "CRYPTO"
  | "COMMODITY"
  | "UNKNOWN";

export type MarketDataRegion =
  | "AU"
  | "US"
  | "CA"
  | "GB"
  | "NZ"
  | "EU"
  | "HK"
  | "JP"
  | "GLOBAL"
  | "UNKNOWN";

export type MarketDataExchange =
  | "ASX"
  | "NASDAQ"
  | "NYSE"
  | "NYSE_ARCA"
  | "AMEX"
  | "TSX"
  | "LSE"
  | "NZX"
  | "HKEX"
  | "TSE"
  | "CRYPTO"
  | "FOREX"
  | "OTC"
  | "UNKNOWN";

export type MarketDataProviderId =
  | "YAHOO_FINANCE"
  | "ALPHA_VANTAGE"
  | "FINNHUB"
  | "TWELVE_DATA"
  | "POLYGON"
  | "MARKETSTACK"
  | "STOOQ"
  | "COINGECKO"
  | "MANUAL"
  | "CACHE"
  | "UNKNOWN";

export type MarketDataCapability =
  | "QUOTE"
  | "QUOTE_BATCH"
  | "HISTORICAL_PRICE"
  | "INTRADAY_PRICE"
  | "DIVIDENDS"
  | "COMPANY_PROFILE"
  | "EXCHANGE_STATUS"
  | "FOREX_RATE"
  | "CRYPTO_QUOTE";

export type MarketDataLatencyClass =
  | "REAL_TIME"
  | "DELAYED"
  | "END_OF_DAY"
  | "INDICATIVE"
  | "UNKNOWN";

export type QuoteFreshness =
  | "FRESH"
  | "ACCEPTABLE"
  | "DELAYED"
  | "STALE"
  | "EXPIRED"
  | "UNKNOWN";

export type QuoteTradingStatus =
  | "OPEN"
  | "CLOSED"
  | "PRE_MARKET"
  | "AFTER_HOURS"
  | "HALTED"
  | "UNKNOWN";

export type QuoteQualityGrade =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F";

export type ProviderCircuitState =
  | "CLOSED"
  | "OPEN"
  | "HALF_OPEN";

export type ProviderOperationalState =
  | "HEALTHY"
  | "DEGRADED"
  | "UNHEALTHY"
  | "DISABLED"
  | "UNKNOWN";

export type ProviderCapabilityConfig = {
  capability: MarketDataCapability;
  supported: boolean;
  latencyClass: MarketDataLatencyClass;
  notes?: string;
};

export type MarketDataProviderDefinition = {
  id: MarketDataProviderId;
  name: string;
  enabled: boolean;
  priority: number;

  capabilities: ProviderCapabilityConfig[];

  assetTypes: MarketDataAssetType[];
  regions: MarketDataRegion[];
  exchanges: MarketDataExchange[];

  supportsBatch: boolean;
  maxBatchSize: number | null;

  requiresApiKey: boolean;
  environmentKey: string | null;

  defaultTimeoutMs: number;
  maxRetries: number;

  rateLimitPerMinute: number | null;
  rateLimitPerDay: number | null;

  staleAfterSeconds: number;
  expireAfterSeconds: number;

  website?: string;
  notes?: string;
};

export type MarketDataSymbol = {
  raw: string;
  canonical: string;
  display: string;
  providerSymbol: string;

  assetType: MarketDataAssetType;
  region: MarketDataRegion;
  exchange: MarketDataExchange;
  currency: string | null;
};

export type RawMarketQuote = {
  symbol: string;

  price?: number | null;
  previousClose?: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;

  change?: number | null;
  changePercent?: number | null;

  volume?: number | null;
  marketCap?: number | null;

  currency?: string | null;
  exchange?: string | null;

  timestamp?: string | number | Date | null;
  receivedAt?: string | number | Date | null;

  latencyClass?: MarketDataLatencyClass | null;
  tradingStatus?: QuoteTradingStatus | null;

  provider?: MarketDataProviderId | null;
  source?: string | null;

  isDelayed?: boolean | null;
  isIndicative?: boolean | null;
};

export type NormalisedMarketQuote = {
  symbol: string;
  canonicalSymbol: string;
  displaySymbol: string;

  price: number;
  previousClose: number | null;
  open: number | null;
  high: number | null;
  low: number | null;

  change: number | null;
  changePercent: number | null;

  volume: number | null;
  marketCap: number | null;

  currency: string | null;
  exchange: MarketDataExchange;

  quoteTimestamp: string;
  receivedAt: string;

  ageSeconds: number;
  freshness: QuoteFreshness;

  latencyClass: MarketDataLatencyClass;
  tradingStatus: QuoteTradingStatus;

  marketState:
    | "OPEN"
    | "PRE_MARKET"
    | "AFTER_HOURS"
    | "CLOSED"
    | "WEEKEND"
    | "HOLIDAY"
    | "UNKNOWN";

  marketTimezone: string | null;
  nextMarketOpenAt: string | null;
  nextMarketCloseAt: string | null;

  adaptiveCacheTtlSeconds: number | null;
  adaptiveStaleWhileRevalidateSeconds: number | null;

  freshnessLabel: string;
  freshnessExplanation: string;

  provider: MarketDataProviderId;
  source: string;

  qualityScore: number;
  qualityGrade: QuoteQualityGrade;
  confidenceScore: number;

  isUsable: boolean;
  isDelayed: boolean;
  isStale: boolean;
  isExpired: boolean;
  isIndicative: boolean;

  warnings: string[];
};

export type QuoteQualityThresholds = {
  freshSeconds: number;
  acceptableSeconds: number;
  delayedSeconds: number;
  staleSeconds: number;
  expiredSeconds: number;
};

export type QuoteQualityInput = {
  quote: RawMarketQuote;
  provider: MarketDataProviderDefinition;
  symbol?: MarketDataSymbol;
  now?: Date;
  thresholds?: Partial<QuoteQualityThresholds>;
};

export type ProviderRequestResult = {
  provider: MarketDataProviderId;
  successful: boolean;

  startedAt: string;
  finishedAt: string;

  latencyMs: number;

  symbolCount: number;
  successfulSymbolCount: number;
  failedSymbolCount: number;

  statusCode?: number | null;
  errorCode?: string | null;
  errorMessage?: string | null;

  rateLimited?: boolean;
  timedOut?: boolean;
};

export type ProviderHealthSnapshot = {
  provider: MarketDataProviderId;

  operationalState: ProviderOperationalState;
  circuitState: ProviderCircuitState;

  healthScore: number;

  requestCount: number;
  successCount: number;
  failureCount: number;

  successRate: number;
  failureRate: number;

  averageLatencyMs: number;
  latestLatencyMs: number | null;

  consecutiveFailures: number;
  consecutiveSuccesses: number;

  lastRequestAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;

  circuitOpenedAt: string | null;
  circuitRetryAt: string | null;

  rateLimited: boolean;
  timedOut: boolean;

  latestErrorCode: string | null;
  latestErrorMessage: string | null;
};

export type ProviderHealthStore = {
  generatedAt: string;
  providers: Record<string, ProviderHealthSnapshot>;
};

export type ProviderSelectionRequest = {
  capability: MarketDataCapability;
  assetType: MarketDataAssetType;
  region: MarketDataRegion;
  exchange: MarketDataExchange;

  symbols?: string[];

  allowDelayed?: boolean;
  allowIndicative?: boolean;
  allowDisabled?: boolean;

  requiredBatchSize?: number;

  providerPreference?: MarketDataProviderId[];
  excludedProviders?: MarketDataProviderId[];
};

export type ProviderSelectionCandidate = {
  provider: MarketDataProviderDefinition;
  health: ProviderHealthSnapshot;

  eligible: boolean;
  score: number;
  reasons: string[];
};

export type ProviderSelectionResult = {
  selected: ProviderSelectionCandidate | null;
  candidates: ProviderSelectionCandidate[];
  request: ProviderSelectionRequest;
  generatedAt: string;
};

export type MarketDataDiagnosticSummary = {
  generatedAt: string;

  providerCount: number;
  enabledProviderCount: number;
  healthyProviderCount: number;
  degradedProviderCount: number;
  unhealthyProviderCount: number;
  openCircuitCount: number;

  averageHealthScore: number;
  averageLatencyMs: number;

  quoteProviderCount: number;
  dividendProviderCount: number;
  batchProviderCount: number;

  configuredApiKeyCount: number;
  missingApiKeyCount: number;

  providers: Array<{
    id: MarketDataProviderId;
    name: string;
    enabled: boolean;
    priority: number;
    operationalState: ProviderOperationalState;
    circuitState: ProviderCircuitState;
    healthScore: number;
    averageLatencyMs: number;
    apiKeyConfigured: boolean;
    capabilities: MarketDataCapability[];
  }>;
};

// Legacy compatibility aliases added by Stabilisation Sprint S1A.
export type MarketDataProvider = LegacyMarketDataProvider;
export type MarketDataProviderHealth = LegacyMarketDataProviderHealth;
export type MarketDataProviderResult = LegacyMarketDataProviderResult;
export type MarketQuote = LegacyMarketQuote;
export type MarketQuoteBatch = LegacyMarketQuoteBatch;
export type NormalisedMarketSymbol = LegacyNormalisedMarketSymbol;
export type QuoteApiResponse = LegacyQuoteApiResponse;
export type QuoteCacheEntry = LegacyQuoteCacheEntry;
export type QuoteConfidence = LegacyQuoteConfidence;
export type QuoteFreshnessStatus = LegacyQuoteFreshnessStatus;
export type QuoteRequestSecurity = LegacyQuoteRequestSecurity;
