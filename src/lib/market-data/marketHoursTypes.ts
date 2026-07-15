import type {
  MarketDataExchange,
  QuoteFreshness,
  QuoteTradingStatus,
} from "./marketDataTypes";

export type MarketWeekday =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7;

export type MarketSessionType =
  | "PRE_MARKET"
  | "REGULAR"
  | "AFTER_HOURS"
  | "CLOSED";

export type MarketSessionDefinition = {
  type: MarketSessionType;
  openTime: string;
  closeTime: string;
  enabled: boolean;
};

export type ExchangeTradingSessionDefinition = {
  exchange: MarketDataExchange;
  name: string;
  timezone: string;

  tradingWeekdays: MarketWeekday[];

  sessions: MarketSessionDefinition[];

  supportsPreMarket: boolean;
  supportsAfterHours: boolean;

  defaultCurrency: string | null;

  defaultQuoteTtlSeconds: number;
  closedMarketQuoteTtlSeconds: number;
  staleWhileRevalidateSeconds: number;

  notes?: string;
};

export type MarketHolidayDefinition = {
  exchange: MarketDataExchange;
  date: string;
  name: string;
  closed: boolean;
  earlyCloseTime: string | null;
};

export type MarketClockState =
  | "OPEN"
  | "PRE_MARKET"
  | "AFTER_HOURS"
  | "CLOSED"
  | "WEEKEND"
  | "HOLIDAY"
  | "UNKNOWN";

export type MarketClockResult = {
  exchange: MarketDataExchange;
  exchangeName: string;
  timezone: string;

  state: MarketClockState;
  tradingStatus: QuoteTradingStatus;

  localDate: string;
  localTime: string;
  localWeekday: MarketWeekday;

  isTradingDay: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  isEarlyClose: boolean;

  currentSession: MarketSessionDefinition | null;

  regularOpenAt: string | null;
  regularCloseAt: string | null;

  nextOpenAt: string | null;
  nextCloseAt: string | null;

  secondsUntilOpen: number | null;
  secondsUntilClose: number | null;

  holidayName: string | null;
  message: string;
};

export type AdaptiveQuoteFreshnessPolicy = {
  freshSeconds: number;
  acceptableSeconds: number;
  delayedSeconds: number;
  staleSeconds: number;
  expiredSeconds: number;

  cacheTtlSeconds: number;
  staleWhileRevalidateSeconds: number;

  allowStale: boolean;
  allowExpiredFallback: boolean;

  reason: string;
};

export type AdaptiveQuoteFreshnessInput = {
  exchange: MarketDataExchange;
  quoteTimestamp: string | number | Date;
  now?: Date;

  providerStaleAfterSeconds: number;
  providerExpireAfterSeconds: number;

  providerIsDelayed?: boolean;
  providerIsIndicative?: boolean;

  tradingStatus?: QuoteTradingStatus | null;
};

export type AdaptiveQuoteFreshnessResult = {
  marketClock: MarketClockResult;
  policy: AdaptiveQuoteFreshnessPolicy;

  ageSeconds: number;
  freshness: QuoteFreshness;

  isAcceptableForValuation: boolean;
  isAcceptableForLiveDisplay: boolean;

  shouldRefresh: boolean;
  refreshUrgency: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "IMMEDIATE";

  displayLabel: string;
  explanation: string;

  warnings: string[];
};

export type MarketHoursDiagnosticSummary = {
  generatedAt: string;

  exchangeCount: number;
  openExchangeCount: number;
  preMarketExchangeCount: number;
  afterHoursExchangeCount: number;
  closedExchangeCount: number;
  weekendExchangeCount: number;
  holidayExchangeCount: number;

  exchanges: MarketClockResult[];
};
