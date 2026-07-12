export type MarketDataProviderId =
  | "twelve-data"
  | "finnhub"
  | "alpha-vantage"
  | "cache"
  | "manual"
  | "unavailable";

export type MarketDataExchange =
  | "ASX"
  | "NASDAQ"
  | "NYSE"
  | "NYSEARCA"
  | "LSE"
  | "TSX"
  | "HKEX"
  | "UNKNOWN";

export type QuoteFreshnessStatus =
  | "REAL_TIME"
  | "DELAYED"
  | "STALE"
  | "END_OF_DAY"
  | "MANUAL"
  | "UNAVAILABLE";

export type QuoteConfidence =
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "NONE";

export type QuoteRequestSecurity = {
  symbol: string;
  exchange?: string | null;
  currency?: string | null;
  providerSymbol?: string | null;
};

export type NormalisedMarketSymbol = {
  originalSymbol: string;
  canonicalSymbol: string;
  providerSymbol: string;
  displaySymbol: string;
  exchange: MarketDataExchange;
  currency: string;
};

export type MarketQuote = {
  symbol: string;
  providerSymbol: string;
  displaySymbol: string;
  exchange: MarketDataExchange;
  currency: string;

  price: number | null;
  previousClose: number | null;
  open: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  volume: number | null;

  change: number | null;
  changePercent: number | null;

  quotedAt: string | null;
  receivedAt: string;
  provider: MarketDataProviderId;

  freshness: QuoteFreshnessStatus;
  confidence: QuoteConfidence;
  delayMinutes: number | null;
  staleAfterMinutes: number;

  isValid: boolean;
  isFallback: boolean;
  error: string | null;
};

export type MarketQuoteBatch = {
  quotes: MarketQuote[];
  requestedSymbols: string[];
  resolvedSymbols: string[];
  unresolvedSymbols: string[];

  provider: MarketDataProviderId;
  providersUsed: MarketDataProviderId[];

  requestedAt: string;
  completedAt: string;
  durationMs: number;

  cacheHits: number;
  providerRequests: number;
  successCount: number;
  failureCount: number;
};

export type MarketDataProviderHealth = {
  id: MarketDataProviderId;
  name: string;
  configured: boolean;
  available: boolean;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastLatencyMs: number | null;
  requestCount: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  lastError: string | null;
};

export type MarketDataProviderResult = {
  provider: MarketDataProviderId;
  quotes: MarketQuote[];
  unresolvedSymbols: NormalisedMarketSymbol[];
  requestedAt: string;
  completedAt: string;
  durationMs: number;
};

export type MarketDataProvider = {
  id: MarketDataProviderId;
  name: string;
  isConfigured: () => boolean;
  getQuotes: (
    symbols: NormalisedMarketSymbol[]
  ) => Promise<MarketDataProviderResult>;
};

export type QuoteApiRequest = {
  securities: QuoteRequestSecurity[];
  forceRefresh?: boolean;
};

export type QuoteApiResponse = {
  ok: boolean;
  batch: MarketQuoteBatch;
  providerHealth: MarketDataProviderHealth[];
  message?: string;
};

export type QuoteCacheEntry = {
  quote: MarketQuote;
  expiresAt: number;
  storedAt: number;
};
