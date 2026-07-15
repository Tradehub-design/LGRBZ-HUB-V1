/**
 * Temporary compatibility contracts for modules written against the earlier
 * market-data API.
 *
 * These definitions intentionally remain broad enough to bridge the older and
 * newer market-data implementations while the stabilisation sprint converges
 * the complete runtime.
 */

export type LegacyMarketDataProviderId =
  | "TWELVE_DATA"
  | "ALPHA_VANTAGE"
  | "FINNHUB"
  | "CACHE"
  | "UNAVAILABLE"
  | "TWELVE_DATA"
  | "ALPHA_VANTAGE"
  | "FINNHUB"
  | "CACHE"
  | "UNAVAILABLE";

export type QuoteConfidence =
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "UNAVAILABLE"
  | "high"
  | "medium"
  | "low"
  | "UNAVAILABLE";

export type QuoteFreshnessStatus =
  | "LIVE"
  | "FRESH"
  | "DELAYED"
  | "STALE"
  | "UNAVAILABLE"
  | "live"
  | "fresh"
  | "delayed"
  | "stale"
  | "UNAVAILABLE";

export type NormalisedMarketSymbol = {
  originalSymbol: string;
  canonicalSymbol: string;
  displaySymbol: string;

  symbol: string;
  exchange?: string | null;
  currency?: string | null;
  country?: string | null;

  providerSymbol?: string;
  twelveDataSymbol?: string;
  alphaVantageSymbol?: string;
  finnhubSymbol?: string;

  [key: string]: unknown;
};

export type QuoteRequestSecurity = {
  symbol: string;

  exchange?: string | null;
  currency?: string | null;
  country?: string | null;
  assetType?: string | null;

  [key: string]: unknown;
};

export type MarketQuote = {
  symbol: string;

  canonicalSymbol?: string;
  displaySymbol?: string;

  price: number;
  previousClose?: number;
  open?: number;
  high?: number;
  low?: number;

  change?: number;
  changePercent?: number;
  volume?: number;

  currency?: string;
  exchange?: string;

  provider?: LegacyMarketDataProviderId | string;
  providerId?: LegacyMarketDataProviderId | string;

  timestamp?: string;
  quotedAt?: string;
  receivedAt?: string;

  confidence?: QuoteConfidence;
  freshness?: QuoteFreshnessStatus;

  marketState?: string;
  marketTimezone?: string | null;
  nextMarketOpenAt?: string | null;
  nextMarketCloseAt?: string | null;

  isMarketOpen?: boolean;
  isDelayed?: boolean;
  isStale?: boolean;

  warnings?: string[];

  [key: string]: unknown;
};

export type RawMarketQuoteCompatibility = {
  [key: string]: unknown;
};

export type MarketQuoteBatch = {
  quotes: MarketQuote[];

  requestedSymbols?: string[];
  failedSymbols?: string[];

  generatedAt?: string;
  provider?: LegacyMarketDataProviderId | string;

  [key: string]: unknown;
};

export type QuoteApiResponse = {
  ok: boolean;

  quotes?: MarketQuote[];

  unresolvedSymbols?:
    NormalisedMarketSymbol[];

  requestedAt?: string;
  completedAt?: string;
  durationMs?: number;
  quote?: MarketQuote;

  errors?: Array<{
    symbol?: string;
    message: string;
    code?: string;
  }>;

  generatedAt?: string;

  [key: string]: unknown;
};

export type QuoteCacheEntry = {
  key: string;
  quote: MarketQuote;

  createdAt: string;
  expiresAt: string;

  staleAt?: string;

  [key: string]: unknown;
};

export type MarketDataProviderHealth = {
  provider: string;

  id?: string;
  name?: string;

  configured: boolean;
  available: boolean;
  healthy?: boolean;

  status?:
    | "HEALTHY"
    | "DEGRADED"
    | "UNAVAILABLE"
    | "DISABLED"
    | string;

  attempts?: number;
  successes?: number;
  failures?: number;

  successRate?: number;
  latencyMs?: number;
  averageLatencyMs?: number;

  lastAttemptAt?: string | null;
  lastSuccessAt?: string | null;
  lastFailureAt?: string | null;
  lastError?: string | null;

  message?: string | null;

  [key: string]: unknown;
};

export type MarketDataProviderResult = {
  ok?: boolean;

  quote?: MarketQuote;
  quotes?: MarketQuote[];

  error?: string;
  warnings?: string[];

  provider:
    LegacyMarketDataProviderId |
    string;

  [key: string]: unknown;
};

export type MarketDataProvider = {
  id:
    LegacyMarketDataProviderId |
    string;

  name?: string;

  isConfigured?: () => boolean;

  fetchQuote?: (
    security:
      QuoteRequestSecurity |
      NormalisedMarketSymbol
  ) =>
    Promise<
      MarketDataProviderResult
    >;

  fetchQuotes?: (
    securities:
      Array<
        QuoteRequestSecurity |
        NormalisedMarketSymbol
      >
  ) =>
    Promise<
      MarketDataProviderResult
    >;

  [key: string]: unknown;
};

export function normaliseLegacyProviderId(
  value:
    string |
    null |
    undefined
): string {
  const normalised =
    String(
      value ||
      "UNAVAILABLE"
    )
      .trim()
      .replace(/-/g, "_")
      .toUpperCase();

  if (
    normalised ===
    "TWELVE_DATA"
  ) {
    return "TWELVE_DATA";
  }

  if (
    normalised ===
    "ALPHA_VANTAGE"
  ) {
    return "ALPHA_VANTAGE";
  }

  if (
    normalised ===
    "FINNHUB"
  ) {
    return "FINNHUB";
  }

  if (
    normalised ===
    "CACHE"
  ) {
    return "CACHE";
  }

  return "UNAVAILABLE";
}
