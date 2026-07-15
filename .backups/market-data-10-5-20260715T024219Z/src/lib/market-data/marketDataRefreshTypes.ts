import type {
  MarketDataExchange,
  MarketDataProviderId,
  NormalisedMarketQuote,
} from "./marketDataTypes";

export type MarketDataRefreshPriority =
  | "CRITICAL"
  | "HIGH"
  | "NORMAL"
  | "LOW"
  | "BACKGROUND";

export type MarketDataRefreshProfile =
  | "HOLDINGS"
  | "WATCHLIST"
  | "DASHBOARD"
  | "DIVIDENDS"
  | "ALLOCATION"
  | "ANALYTICS"
  | "MANUAL";

export type MarketDataRefreshJobState =
  | "QUEUED"
  | "RUNNING"
  | "SUCCEEDED"
  | "PARTIAL"
  | "FAILED"
  | "CANCELLED"
  | "DEFERRED";

export type MarketDataRefreshJob = {
  id: string;
  key: string;

  symbols: string[];

  exchange: MarketDataExchange;
  currency: string | null;

  profile: MarketDataRefreshProfile;
  priority: MarketDataRefreshPriority;

  forceRefresh: boolean;
  compareProviders: boolean;

  maximumProviderAttempts: number;
  minimumQualityScore: number;

  providerPreference: MarketDataProviderId[];
  excludedProviders: MarketDataProviderId[];

  createdAt: string;
  scheduledAt: string;
  startedAt: string | null;
  completedAt: string | null;

  state: MarketDataRefreshJobState;

  attempt: number;
  maximumAttempts: number;

  retryAfterSeconds: number | null;
  nextRetryAt: string | null;

  timeoutMs: number;
  concurrency: number;

  errorCode: string | null;
  errorMessage: string | null;
};

export type MarketDataRefreshJobResult = {
  job: MarketDataRefreshJob;

  quotes: NormalisedMarketQuote[];

  successfulSymbols: string[];
  failedSymbols: string[];

  requestedCount: number;
  successfulCount: number;
  failedCount: number;

  durationMs: number;

  warnings: string[];
};

export type MarketDataRefreshQueueSnapshot = {
  generatedAt: string;

  queuedCount: number;
  runningCount: number;
  succeededCount: number;
  partialCount: number;
  failedCount: number;
  deferredCount: number;

  jobs: MarketDataRefreshJob[];
};

export type MarketDataRequestBudgetWindow = {
  windowStartedAt: string;
  windowEndsAt: string;

  maximumRequests: number;
  usedRequests: number;
  remainingRequests: number;

  maximumSymbols: number;
  usedSymbols: number;
  remainingSymbols: number;
};

export type MarketDataProviderBudget = {
  provider: MarketDataProviderId;

  minute: MarketDataRequestBudgetWindow;
  day: MarketDataRequestBudgetWindow;

  blocked: boolean;
  reason: string | null;
};

export type MarketDataBudgetDecision = {
  allowed: boolean;

  provider: MarketDataProviderId;

  requestedSymbols: number;

  retryAfterSeconds: number | null;

  reason: string;

  budget: MarketDataProviderBudget;
};

export type MarketDataRefreshCoordinatorSnapshot = {
  generatedAt: string;

  active: boolean;

  queue: MarketDataRefreshQueueSnapshot;

  completedJobCount: number;
  failedJobCount: number;

  totalRequestedSymbols: number;
  totalSuccessfulSymbols: number;
  totalFailedSymbols: number;

  lastRunAt: string | null;
  nextRunAt: string | null;

  budgets: MarketDataProviderBudget[];
};

export type CreateRefreshJobInput = {
  symbols: string[];

  exchange?: MarketDataExchange;
  currency?: string | null;

  profile?: MarketDataRefreshProfile;
  priority?: MarketDataRefreshPriority;

  forceRefresh?: boolean;
  compareProviders?: boolean;

  maximumProviderAttempts?: number;
  minimumQualityScore?: number;

  providerPreference?: MarketDataProviderId[];
  excludedProviders?: MarketDataProviderId[];

  scheduledAt?: string;
  maximumAttempts?: number;

  timeoutMs?: number;
  concurrency?: number;
};

export type RefreshIntervalRecommendation = {
  exchange: MarketDataExchange;
  profile: MarketDataRefreshProfile;

  marketState: string;

  intervalSeconds: number;

  urgency:
    | "IMMEDIATE"
    | "FAST"
    | "NORMAL"
    | "RELAXED"
    | "PAUSED";

  reason: string;
};
