import type {
  ExchangeTradingSessionDefinition,
  MarketSessionDefinition,
} from "./marketHoursTypes";
import type {
  MarketDataExchange,
} from "./marketDataTypes";

function session(
  type: MarketSessionDefinition["type"],
  openTime: string,
  closeTime: string,
  enabled = true
): MarketSessionDefinition {
  return {
    type,
    openTime,
    closeTime,
    enabled,
  };
}

export const EXCHANGE_TRADING_SESSIONS:
  ExchangeTradingSessionDefinition[] = [
    {
      exchange: "ASX",
      name: "Australian Securities Exchange",
      timezone: "Australia/Sydney",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "10:00", "16:00"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: "AUD",

      defaultQuoteTtlSeconds: 120,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 1_800,
    },

    {
      exchange: "NASDAQ",
      name: "Nasdaq Stock Market",
      timezone: "America/New_York",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("PRE_MARKET", "04:00", "09:30"),
        session("REGULAR", "09:30", "16:00"),
        session("AFTER_HOURS", "16:00", "20:00"),
      ],

      supportsPreMarket: true,
      supportsAfterHours: true,

      defaultCurrency: "USD",

      defaultQuoteTtlSeconds: 60,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 900,
    },

    {
      exchange: "NYSE",
      name: "New York Stock Exchange",
      timezone: "America/New_York",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("PRE_MARKET", "04:00", "09:30"),
        session("REGULAR", "09:30", "16:00"),
        session("AFTER_HOURS", "16:00", "20:00"),
      ],

      supportsPreMarket: true,
      supportsAfterHours: true,

      defaultCurrency: "USD",

      defaultQuoteTtlSeconds: 60,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 900,
    },

    {
      exchange: "NYSE_ARCA",
      name: "NYSE Arca",
      timezone: "America/New_York",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("PRE_MARKET", "04:00", "09:30"),
        session("REGULAR", "09:30", "16:00"),
        session("AFTER_HOURS", "16:00", "20:00"),
      ],

      supportsPreMarket: true,
      supportsAfterHours: true,

      defaultCurrency: "USD",

      defaultQuoteTtlSeconds: 60,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 900,
    },

    {
      exchange: "AMEX",
      name: "NYSE American",
      timezone: "America/New_York",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("PRE_MARKET", "04:00", "09:30"),
        session("REGULAR", "09:30", "16:00"),
        session("AFTER_HOURS", "16:00", "20:00"),
      ],

      supportsPreMarket: true,
      supportsAfterHours: true,

      defaultCurrency: "USD",

      defaultQuoteTtlSeconds: 60,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 900,
    },

    {
      exchange: "TSX",
      name: "Toronto Stock Exchange",
      timezone: "America/Toronto",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "09:30", "16:00"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: "CAD",

      defaultQuoteTtlSeconds: 120,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 1_200,
    },

    {
      exchange: "LSE",
      name: "London Stock Exchange",
      timezone: "Europe/London",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "08:00", "16:30"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: "GBP",

      defaultQuoteTtlSeconds: 120,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 1_200,
    },

    {
      exchange: "NZX",
      name: "New Zealand Exchange",
      timezone: "Pacific/Auckland",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "10:00", "16:45"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: "NZD",

      defaultQuoteTtlSeconds: 120,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 1_800,
    },

    {
      exchange: "HKEX",
      name: "Hong Kong Stock Exchange",
      timezone: "Asia/Hong_Kong",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "09:30", "12:00"),
        session("REGULAR", "13:00", "16:00"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: "HKD",

      defaultQuoteTtlSeconds: 120,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 1_200,

      notes:
        "HKEX includes a midday break.",
    },

    {
      exchange: "TSE",
      name: "Tokyo Stock Exchange",
      timezone: "Asia/Tokyo",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "09:00", "11:30"),
        session("REGULAR", "12:30", "15:30"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: "JPY",

      defaultQuoteTtlSeconds: 120,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 1_200,

      notes:
        "TSE includes a midday break.",
    },

    {
      exchange: "FOREX",
      name: "Global Foreign Exchange Market",
      timezone: "UTC",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "00:00", "23:59"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: null,

      defaultQuoteTtlSeconds: 30,
      closedMarketQuoteTtlSeconds: 900,
      staleWhileRevalidateSeconds: 300,

      notes:
        "Simplified Monday-to-Friday continuous market model.",
    },

    {
      exchange: "CRYPTO",
      name: "Global Cryptocurrency Market",
      timezone: "UTC",
      tradingWeekdays: [1, 2, 3, 4, 5, 6, 7],

      sessions: [
        session("REGULAR", "00:00", "23:59"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: null,

      defaultQuoteTtlSeconds: 30,
      closedMarketQuoteTtlSeconds: 30,
      staleWhileRevalidateSeconds: 180,

      notes:
        "Cryptocurrency markets operate continuously.",
    },

    {
      exchange: "OTC",
      name: "Over-the-Counter Market",
      timezone: "America/New_York",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "09:30", "16:00"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: "USD",

      defaultQuoteTtlSeconds: 300,
      closedMarketQuoteTtlSeconds: 7_200,
      staleWhileRevalidateSeconds: 3_600,
    },

    {
      exchange: "UNKNOWN",
      name: "Unknown Exchange",
      timezone: "UTC",
      tradingWeekdays: [1, 2, 3, 4, 5],

      sessions: [
        session("REGULAR", "00:00", "23:59"),
      ],

      supportsPreMarket: false,
      supportsAfterHours: false,

      defaultCurrency: null,

      defaultQuoteTtlSeconds: 300,
      closedMarketQuoteTtlSeconds: 3_600,
      staleWhileRevalidateSeconds: 1_800,
    },
  ];

export function exchangeTradingSession(
  exchange: MarketDataExchange
): ExchangeTradingSessionDefinition {
  return (
    EXCHANGE_TRADING_SESSIONS.find(
      (
        definition
      ) =>
        definition.exchange === exchange
    ) ||
    EXCHANGE_TRADING_SESSIONS.find(
      (
        definition
      ) =>
        definition.exchange === "UNKNOWN"
    )!
  );
}

export function exchangeTimezone(
  exchange: MarketDataExchange
): string {
  return exchangeTradingSession(
    exchange
  ).timezone;
}

export function exchangeDefaultCurrency(
  exchange: MarketDataExchange
): string | null {
  return exchangeTradingSession(
    exchange
  ).defaultCurrency;
}
