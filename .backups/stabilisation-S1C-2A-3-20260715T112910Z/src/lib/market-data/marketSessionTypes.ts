import type {
  MarketDataExchange,
  MarketDataLatencyClass,
  QuoteFreshness,
  QuoteQualityThresholds,
  QuoteTradingStatus,
} from "./marketDataTypes";

export type MarketSessionType =
  | "PRE_MARKET"
  | "REGULAR"
  | "AFTER_HOURS"
  | "CLOSED"
  | "CONTINUOUS"
  | "HALTED"
  | "UNKNOWN";

export type MarketClosureReason =
  | "WEEKEND"
  | "HOLIDAY"
  | "OUTSIDE_SESSION"
  | "TRADING_HALT"
  | "UNSUPPORTED_EXCHANGE"
  | "UNKNOWN";

export type TradingDayName =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type MarketTimeOfDay = {
  hour: number;
  minute: number;
};

export type ExchangeSessionWindow = {
  type:
    Exclude<
      MarketSessionType,
      "CLOSED" |
      "HALTED" |
      "UNKNOWN"
    >;

  opensAt: MarketTimeOfDay;
  closesAt: MarketTimeOfDay;

  crossesMidnight?: boolean;
};

export type ExchangeTradingCalendarDefinition = {
  exchange: MarketDataExchange;
  name: string;

  timezone: string;

  tradingDays: TradingDayName[];

  sessions: ExchangeSessionWindow[];

  continuous: boolean;

  supportsPreMarket: boolean;
  supportsAfterHours: boolean;

  defaultLatencyClass: MarketDataLatencyClass;

  openMarketThresholds: QuoteQualityThresholds;
  closedMarketThresholds: QuoteQualityThresholds;
  preMarketThresholds: QuoteQualityThresholds;
  afterHoursThresholds: QuoteQualityThresholds;

  notes?: string;
};

export type ExchangeHolidayOverride = {
  exchange: MarketDataExchange;
  date: string;

  name: string;

  closed: boolean;

  regularOpen?: MarketTimeOfDay | null;
  regularClose?: MarketTimeOfDay | null;

  preMarketOpen?: MarketTimeOfDay | null;
  afterHoursClose?: MarketTimeOfDay | null;
};

export type MarketClockInput = {
  exchange: MarketDataExchange;

  now?: Date;

  holidays?: ExchangeHolidayOverride[];

  tradingHalted?: boolean;
};

export type MarketSessionSnapshot = {
  exchange: MarketDataExchange;
  exchangeName: string;

  timezone: string;

  nowUtc: string;
  nowLocal: string;
  localDate: string;

  dayName: TradingDayName;

  sessionType: MarketSessionType;
  tradingStatus: QuoteTradingStatus;

  marketOpen: boolean;
  marketClosed: boolean;
  continuous: boolean;
  tradingHalted: boolean;

  closureReason: MarketClosureReason | null;

  currentSessionOpenedAt: string | null;
  currentSessionClosesAt: string | null;

  nextOpenAt: string | null;
  nextCloseAt: string | null;

  secondsUntilOpen: number | null;
  secondsUntilClose: number | null;

  holidayName: string | null;
  earlyClose: boolean;

  thresholds: QuoteQualityThresholds;

  message: string;
};

export type AdaptiveQuoteFreshnessInput = {
  quoteTimestamp: string | number | Date;
  receivedAt?: string | number | Date | null;

  exchange: MarketDataExchange;

  latencyClass: MarketDataLatencyClass;

  explicitTradingStatus?: QuoteTradingStatus | null;

  now?: Date;

  holidays?: ExchangeHolidayOverride[];

  tradingHalted?: boolean;

  quotedAt?: string | number | Date;
  marketSession?: MarketSessionSnapshot;
};

export type AdaptiveQuoteFreshnessResult = {
  freshness: QuoteFreshness;

  ageSeconds: number;

  thresholds: QuoteQualityThresholds;

  marketSession: MarketSessionSnapshot;

  marketAdjusted: boolean;

  acceptableForValuation: boolean;
  acceptableForLiveDisplay: boolean;

  staleReason: string | null;

  warnings: string[];

  isAcceptableForValuation?: boolean;
};

export type MarketSessionDiagnosticSummary = {
  generatedAt: string;

  exchangeCount: number;

  openExchangeCount: number;
  closedExchangeCount: number;
  continuousExchangeCount: number;
  haltedExchangeCount: number;

  preMarketExchangeCount: number;
  regularSessionExchangeCount: number;
  afterHoursExchangeCount: number;

  exchanges: MarketSessionSnapshot[];
};
