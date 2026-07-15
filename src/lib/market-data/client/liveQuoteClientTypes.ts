import type {
  MarketDataExchange,
  MarketDataProviderId,
  NormalisedMarketQuote,
  QuoteFreshness,
  QuoteQualityGrade,
} from "../marketDataTypes";

export type LiveQuoteRequestState =
  | "IDLE"
  | "QUEUED"
  | "LOADING"
  | "REFRESHING"
  | "SUCCESS"
  | "PARTIAL"
  | "ERROR"
  | "OFFLINE"
  | "PAUSED";

export type LiveQuoteRefreshReason =
  | "INITIAL"
  | "POLL"
  | "MANUAL"
  | "FORCE"
  | "VISIBILITY"
  | "NETWORK_RESTORED"
  | "STALE"
  | "MARKET_OPEN"
  | "UNKNOWN";

export type LiveQuoteApiEnvelope<T> = {
  ok: boolean;
  generatedAt: string;

  data?: T;

  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type LiveQuoteSymbolOptions = {
  exchange?: MarketDataExchange;
  currency?: string | null;

  providers?: MarketDataProviderId[];

  allowDelayed?: boolean;
  allowIndicative?: boolean;
  allowStale?: boolean;
  allowExpiredFallback?: boolean;

  compareProviders?: boolean;
  minimumQualityScore?: number;
  maximumProviderAttempts?: number;

  timeoutMs?: number;
};

export type LiveQuotePollingOptions = {
  enabled?: boolean;

  intervalMs?: number;
  marketOpenIntervalMs?: number;
  marketClosedIntervalMs?: number;
  backgroundIntervalMs?: number;

  pauseWhenHidden?: boolean;
  pauseWhenOffline?: boolean;

  refreshWhenVisible?: boolean;
  refreshWhenOnline?: boolean;

  refreshOnMount?: boolean;

  minimumRefreshGapMs?: number;
};

export type LiveQuoteStoreEntry = {
  symbol: string;
  canonicalSymbol: string;

  quote: NormalisedMarketQuote | null;

  state: LiveQuoteRequestState;

  errorCode: string | null;
  errorMessage: string | null;

  requestedAt: string | null;
  receivedAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;

  nextRefreshAt: string | null;

  refreshReason: LiveQuoteRefreshReason;

  requestCount: number;
  successCount: number;
  failureCount: number;

  staleReadCount: number;

  activeRequestId: string | null;

  options: LiveQuoteSymbolOptions;

  warnings: string[];
};

export type LiveQuoteBatchResponse = {
  results: Array<{
    symbol: {
      raw: string;
      canonical: string;
      display: string;
      providerSymbol: string;
      exchange: MarketDataExchange;
      currency: string | null;
    };

    quote: NormalisedMarketQuote | null;

    successful: boolean;

    selectedProvider: MarketDataProviderId | null;

    warnings: string[];
  }>;

  quotes: NormalisedMarketQuote[];

  successfulSymbols: string[];
  failedSymbols: string[];

  requestedCount: number;
  successfulCount: number;
  failedCount: number;

  partial: boolean;
  generatedAt: string;
};

export type LiveQuoteSingleResponse = {
  symbol: {
    raw: string;
    canonical: string;
    display: string;
    providerSymbol: string;
    exchange: MarketDataExchange;
    currency: string | null;
  };

  quote: NormalisedMarketQuote | null;

  successful: boolean;

  selectedProvider: MarketDataProviderId | null;

  warnings: string[];

  generatedAt: string;
};

export type LiveQuoteFetchInput = {
  symbol: string;
  options?: LiveQuoteSymbolOptions;

  forceRefresh?: boolean;

  signal?: AbortSignal;
};

export type LiveQuoteBatchFetchInput = {
  symbols: string[];
  options?: LiveQuoteSymbolOptions;

  forceRefresh?: boolean;
  concurrency?: number;

  signal?: AbortSignal;
};

export type LiveQuoteFetchResult = {
  symbol: string;
  quote: NormalisedMarketQuote | null;

  successful: boolean;

  errorCode: string | null;
  errorMessage: string | null;

  warnings: string[];
};

export type LiveQuoteBatchFetchResult = {
  results: LiveQuoteFetchResult[];

  successfulSymbols: string[];
  failedSymbols: string[];

  successfulCount: number;
  failedCount: number;

  partial: boolean;
};

export type LiveQuoteStatusDescriptor = {
  label: string;
  shortLabel: string;

  freshness: QuoteFreshness;
  qualityGrade: QuoteQualityGrade | null;

  provider: MarketDataProviderId | null;

  live: boolean;
  delayed: boolean;
  stale: boolean;
  expired: boolean;
  indicative: boolean;
  usable: boolean;

  message: string;

  timestamp: string | null;
  ageSeconds: number | null;
};

export type LiveQuoteClientDiagnosticSummary = {
  generatedAt: string;

  trackedSymbolCount: number;

  idleCount: number;
  loadingCount: number;
  refreshingCount: number;
  successCount: number;
  errorCount: number;
  offlineCount: number;
  pausedCount: number;

  liveQuoteCount: number;
  delayedQuoteCount: number;
  staleQuoteCount: number;
  expiredQuoteCount: number;
  indicativeQuoteCount: number;

  activeRequestCount: number;

  totalRequests: number;
  totalSuccesses: number;
  totalFailures: number;

  averageQualityScore: number;
  averageConfidenceScore: number;

  providers: Record<string, number>;
  freshness: Record<string, number>;

  symbols: Array<{
    symbol: string;
    state: LiveQuoteRequestState;
    provider: MarketDataProviderId | null;
    freshness: QuoteFreshness | null;
    qualityScore: number | null;
    confidenceScore: number | null;
    lastSuccessAt: string | null;
    errorMessage: string | null;
  }>;
};
