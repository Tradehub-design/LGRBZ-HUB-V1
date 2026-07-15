import type {
  MarketDataAssetType,
  MarketDataExchange,
  MarketDataProviderId,
  MarketDataRegion,
  NormalisedMarketQuote,
  ProviderHealthStore,
} from "./marketDataTypes";

export type MarketDataRefreshPriority =
  | "CRITICAL"
  | "HIGH"
  | "NORMAL"
  | "LOW"
  | "BACKGROUND";

export type MarketDataRefreshJobState =
  | "QUEUED"
  | "RUNNING"
  | "RETRY_WAIT"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "DEDUPLICATED";

export type MarketDataRefreshTrigger =
  | "USER"
  | "API"
  | "BACKGROUND"
  | "STALE_WHILE_REVALIDATE"
  | "MARKET_OPEN"
  | "MARKET_CLOSE"
  | "SCHEDULED"
  | "RETRY";

export type MarketDataRefreshJobInput = {
  symbol: string;

  assetType?: MarketDataAssetType;
  region?: MarketDataRegion;
  exchange?: MarketDataExchange;
  currency?: string | null;

  priority?: MarketDataRefreshPriority;
  trigger?: MarketDataRefreshTrigger;

  providerPreference?: MarketDataProviderId[];
  excludedProviders?: MarketDataProviderId[];

  forceRefresh?: boolean;
  compareProviders?: boolean;

  minimumQualityScore?: number;
  maximumProviderAttempts?: number;

  timeoutMs?: number;
  maximumRetries?: number;

  metadata?: Record<string, unknown>;
};

export type MarketDataRefreshJob = {
  id: string;
  deduplicationKey: string;

  input: MarketDataRefreshJobInput;

  state: MarketDataRefreshJobState;
  priority: MarketDataRefreshPriority;
  trigger: MarketDataRefreshTrigger;

  createdAt: string;
  updatedAt: string;

  startedAt: string | null;
  finishedAt: string | null;
  nextRetryAt: string | null;

  attemptCount: number;
  maximumRetries: number;

  result: NormalisedMarketQuote | null;

  selectedProvider: MarketDataProviderId | null;

  errorCode: string | null;
  errorMessage: string | null;

  durationMs: number | null;

  joinedRequestCount: number;
};

export type MarketDataRefreshQueuePolicy = {
  maximumQueueSize: number;
  maximumConcurrency: number;

  defaultMaximumRetries: number;

  baseRetryDelayMs: number;
  maximumRetryDelayMs: number;

  completedJobRetentionMs: number;
  failedJobRetentionMs: number;

  marketOpenMinimumIntervalMs: number;
  marketClosedMinimumIntervalMs: number;
};

export type MarketDataRefreshQueueStatistics = {
  generatedAt: string;

  totalJobCount: number;
  queuedJobCount: number;
  runningJobCount: number;
  retryWaitJobCount: number;
  completedJobCount: number;
  failedJobCount: number;
  cancelledJobCount: number;
  deduplicatedJobCount: number;

  totalSubmitted: number;
  totalCompleted: number;
  totalFailed: number;
  totalRetried: number;
  totalCancelled: number;
  totalDeduplicated: number;

  averageDurationMs: number;
  averageAttempts: number;

  queueUtilisationPercentage: number;
  concurrencyUtilisationPercentage: number;

  jobsByPriority: Record<string, number>;
  jobsByTrigger: Record<string, number>;
  jobsByProvider: Record<string, number>;
};

export type MarketDataRefreshDiagnosticSummary = {
  generatedAt: string;

  policy: MarketDataRefreshQueuePolicy;
  statistics: MarketDataRefreshQueueStatistics;

  activeJobs: MarketDataRefreshJob[];
  queuedJobs: MarketDataRefreshJob[];
  retryJobs: MarketDataRefreshJob[];
  recentCompletedJobs: MarketDataRefreshJob[];
  recentFailedJobs: MarketDataRefreshJob[];

  providerHealth: ProviderHealthStore;
};

export type MarketDataRequestBudgetPolicy = {
  globalRequestsPerMinute: number;
  globalRequestsPerHour: number;

  providerRequestsPerMinute: Partial<
    Record<MarketDataProviderId, number>
  >;

  providerRequestsPerHour: Partial<
    Record<MarketDataProviderId, number>
  >;

  burstAllowance: number;
};

export type MarketDataRequestBudgetSnapshot = {
  generatedAt: string;

  globalMinuteUsed: number;
  globalMinuteRemaining: number;

  globalHourUsed: number;
  globalHourRemaining: number;

  providerMinuteUsed: Record<string, number>;
  providerMinuteRemaining: Record<string, number>;

  providerHourUsed: Record<string, number>;
  providerHourRemaining: Record<string, number>;

  blockedProviders: MarketDataProviderId[];
};

export type MarketDataRequestBudgetDecision = {
  allowed: boolean;

  provider: MarketDataProviderId;

  retryAfterMs: number;

  reason: string;

  snapshot: MarketDataRequestBudgetSnapshot;
};
