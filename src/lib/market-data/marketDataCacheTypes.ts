import type {
  MarketDataProviderId,
  NormalisedMarketQuote,
} from "./marketDataTypes";

export type MarketDataCacheState =
  | "FRESH"
  | "STALE"
  | "EXPIRED"
  | "MISSING"
  | "NEGATIVE";

export type MarketDataCacheSource =
  | "MEMORY"
  | "LOCAL_STORAGE"
  | "FILE"
  | "COMPOSITE"
  | "NONE";

export type MarketDataCacheOperation =
  | "GET"
  | "SET"
  | "DELETE"
  | "CLEAR"
  | "EVICT"
  | "HYDRATE"
  | "PERSIST";

export type MarketDataCacheEntryType =
  | "QUOTE"
  | "NEGATIVE_QUOTE";

export type MarketDataCacheKeyInput = {
  namespace?: string;
  symbol: string;
  provider?: MarketDataProviderId | null;
  currency?: string | null;
  exchange?: string | null;
  variant?: string | null;
};

export type MarketDataCachePolicy = {
  ttlSeconds: number;
  staleWhileRevalidateSeconds: number;
  negativeTtlSeconds: number;

  maximumEntries: number;
  maximumEntryAgeSeconds: number;

  allowStale: boolean;
  allowExpiredFallback: boolean;
  persist: boolean;
};

export type MarketDataCacheMetadata = {
  key: string;
  symbol: string;
  provider: MarketDataProviderId | null;

  entryType: MarketDataCacheEntryType;

  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  staleUntil: string;
  lastAccessedAt: string;

  accessCount: number;
  byteSize: number;

  source: MarketDataCacheSource;

  errorCode: string | null;
  errorMessage: string | null;
};

export type MarketDataQuoteCacheEntry = {
  metadata: MarketDataCacheMetadata;
  quote: NormalisedMarketQuote | null;
};

export type MarketDataCacheReadResult = {
  key: string;
  state: MarketDataCacheState;
  source: MarketDataCacheSource;

  entry: MarketDataQuoteCacheEntry | null;
  quote: NormalisedMarketQuote | null;

  ageSeconds: number | null;
  remainingTtlSeconds: number | null;
  remainingStaleSeconds: number | null;

  shouldRevalidate: boolean;
  usable: boolean;

  message: string;
};

export type MarketDataCacheWriteInput = {
  key: string;
  symbol: string;
  provider?: MarketDataProviderId | null;

  quote?: NormalisedMarketQuote | null;

  entryType?: MarketDataCacheEntryType;

  ttlSeconds?: number;
  staleWhileRevalidateSeconds?: number;

  source?: MarketDataCacheSource;

  errorCode?: string | null;
  errorMessage?: string | null;

  now?: Date;
};

export type MarketDataCacheBatchReadResult = {
  requestedKeys: string[];
  results: MarketDataCacheReadResult[];

  freshCount: number;
  staleCount: number;
  expiredCount: number;
  missingCount: number;
  negativeCount: number;

  usableQuotes: NormalisedMarketQuote[];
  missingKeys: string[];
  revalidateKeys: string[];
};

export type MarketDataCacheStatistics = {
  generatedAt: string;

  entryCount: number;
  quoteEntryCount: number;
  negativeEntryCount: number;

  freshEntryCount: number;
  staleEntryCount: number;
  expiredEntryCount: number;

  totalReads: number;
  totalWrites: number;
  totalDeletes: number;
  totalClears: number;
  totalEvictions: number;

  hitCount: number;
  missCount: number;
  staleHitCount: number;
  expiredHitCount: number;
  negativeHitCount: number;

  hitRate: number;
  missRate: number;

  requestDeduplicationCount: number;
  requestCoalescingCount: number;

  estimatedByteSize: number;
  oldestEntryAt: string | null;
  newestEntryAt: string | null;

  entriesByProvider: Record<string, number>;
  entriesBySource: Record<string, number>;
};

export type MarketDataCacheEvent = {
  id: string;
  timestamp: string;

  operation: MarketDataCacheOperation;
  key: string | null;

  state: MarketDataCacheState | null;
  source: MarketDataCacheSource;

  provider: MarketDataProviderId | null;
  symbol: string | null;

  success: boolean;
  durationMs: number;

  message: string;
};

export type MarketDataCacheSnapshot = {
  version: number;
  generatedAt: string;
  entries: MarketDataQuoteCacheEntry[];
  statistics: MarketDataCacheStatistics;
};

export type MarketDataPersistentCacheAdapter = {
  name: string;
  source: MarketDataCacheSource;

  available(): boolean | Promise<boolean>;

  load():
    | MarketDataCacheSnapshot
    | null
    | Promise<MarketDataCacheSnapshot | null>;

  save(
    snapshot: MarketDataCacheSnapshot
  ):
    | void
    | Promise<void>;

  clear():
    | void
    | Promise<void>;
};

export type MarketDataMemoryCacheOptions = {
  policy?: Partial<MarketDataCachePolicy>;
  persistentAdapter?: MarketDataPersistentCacheAdapter | null;
  eventLimit?: number;
  autoHydrate?: boolean;
};

export type MarketDataCacheDiagnostics = {
  generatedAt: string;

  policy: MarketDataCachePolicy;
  statistics: MarketDataCacheStatistics;

  recentEvents: MarketDataCacheEvent[];

  topAccessedEntries: Array<{
    key: string;
    symbol: string;
    provider: MarketDataProviderId | null;
    state: MarketDataCacheState;
    accessCount: number;
    ageSeconds: number;
    byteSize: number;
  }>;

  staleEntries: Array<{
    key: string;
    symbol: string;
    provider: MarketDataProviderId | null;
    ageSeconds: number;
    staleForSeconds: number;
  }>;

  expiredEntries: Array<{
    key: string;
    symbol: string;
    provider: MarketDataProviderId | null;
    ageSeconds: number;
    expiredForSeconds: number;
  }>;

  negativeEntries: Array<{
    key: string;
    symbol: string;
    provider: MarketDataProviderId | null;
    errorCode: string | null;
    errorMessage: string | null;
    ageSeconds: number;
  }>;
};

export type MarketDataCoalescedRequestState =
  | "CREATED"
  | "JOINED"
  | "RESOLVED"
  | "REJECTED";

export type MarketDataCoalescedRequestInfo = {
  key: string;
  createdAt: string;
  participantCount: number;
  state: MarketDataCoalescedRequestState;
};

export type CachedQuoteResolverRequest = {
  cacheKey: string;
  symbol: string;
  provider: MarketDataProviderId;

  policy?: Partial<MarketDataCachePolicy>;

  forceRefresh?: boolean;
  allowStale?: boolean;
  allowExpiredFallback?: boolean;
};

export type CachedQuoteResolverResult = {
  quote: NormalisedMarketQuote | null;

  cacheState: MarketDataCacheState;
  cacheSource: MarketDataCacheSource;

  fromCache: boolean;
  refreshed: boolean;
  revalidationStarted: boolean;

  provider: MarketDataProviderId;
  symbol: string;

  warnings: string[];
};
