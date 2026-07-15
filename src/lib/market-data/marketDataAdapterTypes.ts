import type {
  MarketDataAssetType,
  MarketDataExchange,
  MarketDataProviderDefinition,
  MarketDataProviderId,
  MarketDataRegion,
  MarketDataSymbol,
  NormalisedMarketQuote,
  ProviderHealthSnapshot,
  ProviderHealthStore,
  ProviderRequestResult,
  RawMarketQuote,
} from "./marketDataTypes";

export type MarketDataAdapterErrorCode =
  | "NOT_CONFIGURED"
  | "UNSUPPORTED_SYMBOL"
  | "UNSUPPORTED_ASSET"
  | "UNSUPPORTED_EXCHANGE"
  | "AUTHENTICATION_FAILED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE"
  | "SYMBOL_NOT_FOUND"
  | "PROVIDER_UNAVAILABLE"
  | "CIRCUIT_OPEN"
  | "UNKNOWN";

export type MarketDataAdapterError = {
  provider: MarketDataProviderId;
  code: MarketDataAdapterErrorCode;
  message: string;

  retryable: boolean;
  rateLimited: boolean;
  timedOut: boolean;

  statusCode: number | null;
  rawError: unknown;
};

export type ProviderQuoteRequest = {
  symbol: MarketDataSymbol;
  providerSymbol?: string;

  signal?: AbortSignal;

  environment?: Record<string, string | undefined>;

  timeoutMs?: number;
  now?: Date;
};

export type ProviderBatchQuoteRequest = {
  symbols: MarketDataSymbol[];

  signal?: AbortSignal;

  environment?: Record<string, string | undefined>;

  timeoutMs?: number;
  now?: Date;
};

export type ProviderQuoteSuccess = {
  successful: true;

  provider: MarketDataProviderId;
  symbol: MarketDataSymbol;

  rawQuote: RawMarketQuote;
  quote: NormalisedMarketQuote;

  requestResult: ProviderRequestResult;
};

export type ProviderQuoteFailure = {
  successful: false;

  provider: MarketDataProviderId;
  symbol: MarketDataSymbol;

  error: MarketDataAdapterError;

  requestResult: ProviderRequestResult;
};

export type ProviderQuoteResult =
  | ProviderQuoteSuccess
  | ProviderQuoteFailure;

export type ProviderBatchQuoteResult = {
  provider: MarketDataProviderId;

  results: ProviderQuoteResult[];

  requestResult: ProviderRequestResult;

  successful: boolean;
  partial: boolean;

  successfulCount: number;
  failedCount: number;
};

export type MarketDataProviderAdapter = {
  readonly providerId: MarketDataProviderId;

  getDefinition(): MarketDataProviderDefinition;

  supports(
    symbol: MarketDataSymbol
  ): boolean;

  quote(
    request: ProviderQuoteRequest
  ): Promise<ProviderQuoteResult>;

  quotes(
    request: ProviderBatchQuoteRequest
  ): Promise<ProviderBatchQuoteResult>;
};

export type ProviderAdapterRegistry = {
  register(
    adapter: MarketDataProviderAdapter
  ): void;

  unregister(
    provider: MarketDataProviderId
  ): boolean;

  get(
    provider: MarketDataProviderId
  ): MarketDataProviderAdapter | null;

  has(
    provider: MarketDataProviderId
  ): boolean;

  all(): MarketDataProviderAdapter[];

  clear(): void;
};

export type MultiProviderQuoteAttempt = {
  provider: MarketDataProviderId;

  startedAt: string;
  finishedAt: string;

  durationMs: number;

  successful: boolean;

  quote: NormalisedMarketQuote | null;
  error: MarketDataAdapterError | null;

  healthBefore: ProviderHealthSnapshot;
  healthAfter: ProviderHealthSnapshot;

  fromCache: boolean;
  cacheState: string | null;

  selectionScore: number;
  selectionReasons: string[];
};

export type MultiProviderQuoteRequest = {
  symbol: string;

  assetType?: MarketDataAssetType;
  region?: MarketDataRegion;
  exchange?: MarketDataExchange;
  currency?: string | null;

  providerPreference?: MarketDataProviderId[];
  excludedProviders?: MarketDataProviderId[];

  allowDelayed?: boolean;
  allowIndicative?: boolean;
  allowStale?: boolean;
  allowExpiredFallback?: boolean;

  forceRefresh?: boolean;

  compareProviders?: boolean;
  minimumQualityScore?: number;
  maximumProviderAttempts?: number;

  timeoutMs?: number;
  now?: Date;

  environment?: Record<string, string | undefined>;
};

export type MultiProviderQuoteResult = {
  symbol: MarketDataSymbol;

  quote: NormalisedMarketQuote | null;

  successful: boolean;
  selectedProvider: MarketDataProviderId | null;

  attempts: MultiProviderQuoteAttempt[];

  attemptedProviderCount: number;
  successfulProviderCount: number;
  failedProviderCount: number;

  fallbackUsed: boolean;
  comparedProviders: boolean;

  healthStore: ProviderHealthStore;

  warnings: string[];
  errors: MarketDataAdapterError[];

  generatedAt: string;
};

export type MultiProviderBatchQuoteRequest = {
  symbols: string[];

  assetType?: MarketDataAssetType;
  region?: MarketDataRegion;
  exchange?: MarketDataExchange;
  currency?: string | null;

  providerPreference?: MarketDataProviderId[];
  excludedProviders?: MarketDataProviderId[];

  allowDelayed?: boolean;
  allowIndicative?: boolean;
  allowStale?: boolean;
  allowExpiredFallback?: boolean;

  forceRefresh?: boolean;

  compareProviders?: boolean;
  minimumQualityScore?: number;
  maximumProviderAttempts?: number;

  concurrency?: number;
  timeoutMs?: number;

  environment?: Record<string, string | undefined>;
};

export type MultiProviderBatchQuoteResult = {
  results: MultiProviderQuoteResult[];

  quotes: NormalisedMarketQuote[];

  successfulSymbols: string[];
  failedSymbols: string[];

  requestedCount: number;
  successfulCount: number;
  failedCount: number;

  partial: boolean;

  healthStore: ProviderHealthStore;

  generatedAt: string;
};
