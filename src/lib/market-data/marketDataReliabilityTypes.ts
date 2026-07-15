export type MarketDataReliabilityStatus =
  | "HEALTHY"
  | "DEGRADED"
  | "CRITICAL"
  | "UNKNOWN";

export type MarketDataEndpointStatus =
  | "ONLINE"
  | "DEGRADED"
  | "OFFLINE"
  | "UNTESTED";

export type MarketDataEndpointDiagnostic = {
  key: string;
  label: string;
  path: string;

  status: MarketDataEndpointStatus;

  responseStatus: number | null;
  durationMs: number | null;

  message: string;

  testedAt: string | null;
};

export type MarketDataProviderDiagnostic = {
  provider: string;

  status: MarketDataReliabilityStatus;

  enabled: boolean;
  configured: boolean;

  successfulRequests: number;
  failedRequests: number;

  successRate: number;

  averageLatencyMs: number | null;

  lastSuccessAt: string | null;
  lastFailureAt: string | null;

  circuitOpen: boolean;

  message: string;
};

export type MarketDataCacheDiagnostic = {
  status: MarketDataReliabilityStatus;

  entryCount: number;
  freshEntryCount: number;
  staleEntryCount: number;
  expiredEntryCount: number;

  hitCount: number;
  missCount: number;

  hitRate: number;

  message: string;
};

export type MarketDataRefreshDiagnostic = {
  status: MarketDataReliabilityStatus;

  queuedCount: number;
  runningCount: number;
  completedCount: number;
  failedCount: number;
  deferredCount: number;

  totalRequestedSymbols: number;
  totalSuccessfulSymbols: number;
  totalFailedSymbols: number;

  successRate: number;

  message: string;
};

export type MarketDataClientDiagnostic = {
  status: MarketDataReliabilityStatus;

  trackedSymbolCount: number;

  loadingCount: number;
  refreshingCount: number;
  successCount: number;
  errorCount: number;
  offlineCount: number;

  liveQuoteCount: number;
  delayedQuoteCount: number;
  staleQuoteCount: number;
  expiredQuoteCount: number;

  averageQualityScore: number;
  averageConfidenceScore: number;

  message: string;
};

export type MarketDataEnvironmentDiagnostic = {
  key: string;
  label: string;

  configured: boolean;

  secret: boolean;

  message: string;
};

export type MarketDataReliabilitySnapshot = {
  generatedAt: string;

  status: MarketDataReliabilityStatus;

  summary: {
    healthyCount: number;
    degradedCount: number;
    criticalCount: number;
    unknownCount: number;

    endpointOnlineCount: number;
    endpointTotalCount: number;

    configuredProviderCount: number;
    providerCount: number;
  };

  endpoints: MarketDataEndpointDiagnostic[];

  providers: MarketDataProviderDiagnostic[];

  cache: MarketDataCacheDiagnostic;

  refresh: MarketDataRefreshDiagnostic;

  client: MarketDataClientDiagnostic;

  environment: MarketDataEnvironmentDiagnostic[];

  warnings: string[];
};

export type MarketDataApiEnvelope<T> = {
  ok: boolean;

  generatedAt: string;

  data?: T;

  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};
