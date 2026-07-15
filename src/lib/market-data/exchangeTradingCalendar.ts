import type {
  MarketDataExchange,
  QuoteQualityThresholds,
} from "./marketDataTypes";
import type {
  ExchangeTradingCalendarDefinition,
  MarketTimeOfDay,
  TradingDayName,
} from "./marketSessionTypes";

const WEEKDAYS: TradingDayName[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

const EVERY_DAY: TradingDayName[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function time(
  hour: number,
  minute = 0
): MarketTimeOfDay {
  return {
    hour,
    minute,
  };
}

function thresholds({
  fresh,
  acceptable,
  delayed,
  stale,
  expired,
}: {
  fresh: number;
  acceptable: number;
  delayed: number;
  stale: number;
  expired: number;
}): QuoteQualityThresholds {
  return {
    freshSeconds:
      fresh,

    acceptableSeconds:
      acceptable,

    delayedSeconds:
      delayed,

    staleSeconds:
      stale,

    expiredSeconds:
      expired,
  };
}

const OPEN_REAL_TIME =
  thresholds({
    fresh:
      90,

    acceptable:
      240,

    delayed:
      900,

    stale:
      3_600,

    expired:
      21_600,
  });

const OPEN_DELAYED =
  thresholds({
    fresh:
      300,

    acceptable:
      900,

    delayed:
      1_800,

    stale:
      7_200,

    expired:
      43_200,
  });

const CLOSED_EQUITY =
  thresholds({
    fresh:
      3_600,

    acceptable:
      21_600,

    delayed:
      43_200,

    stale:
      86_400,

    expired:
      259_200,
  });

const PRE_AFTER =
  thresholds({
    fresh:
      300,

    acceptable:
      900,

    delayed:
      3_600,

    stale:
      14_400,

    expired:
      86_400,
  });

const CONTINUOUS =
  thresholds({
    fresh:
      60,

    acceptable:
      180,

    delayed:
      600,

    stale:
      1_800,

    expired:
      7_200,
  });

export const EXCHANGE_TRADING_CALENDARS:
  ExchangeTradingCalendarDefinition[] = [
    {
      exchange:
        "ASX",

      name:
        "Australian Securities Exchange",

      timezone:
        "Australia/Sydney",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "REGULAR",

          opensAt:
            time(
              10,
              0
            ),

          closesAt:
            time(
              16,
              0
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "DELAYED",

      openMarketThresholds:
        OPEN_DELAYED,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,

      notes:
        "ASX normal trading session. Auction phases are intentionally excluded from regular-session classification.",
    },

    {
      exchange:
        "NASDAQ",

      name:
        "Nasdaq Stock Market",

      timezone:
        "America/New_York",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "PRE_MARKET",

          opensAt:
            time(
              4,
              0
            ),

          closesAt:
            time(
              9,
              30
            ),
        },

        {
          type:
            "REGULAR",

          opensAt:
            time(
              9,
              30
            ),

          closesAt:
            time(
              16,
              0
            ),
        },

        {
          type:
            "AFTER_HOURS",

          opensAt:
            time(
              16,
              0
            ),

          closesAt:
            time(
              20,
              0
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        true,

      supportsAfterHours:
        true,

      defaultLatencyClass:
        "REAL_TIME",

      openMarketThresholds:
        OPEN_REAL_TIME,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },

    {
      exchange:
        "NYSE",

      name:
        "New York Stock Exchange",

      timezone:
        "America/New_York",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "PRE_MARKET",

          opensAt:
            time(
              4,
              0
            ),

          closesAt:
            time(
              9,
              30
            ),
        },

        {
          type:
            "REGULAR",

          opensAt:
            time(
              9,
              30
            ),

          closesAt:
            time(
              16,
              0
            ),
        },

        {
          type:
            "AFTER_HOURS",

          opensAt:
            time(
              16,
              0
            ),

          closesAt:
            time(
              20,
              0
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        true,

      supportsAfterHours:
        true,

      defaultLatencyClass:
        "REAL_TIME",

      openMarketThresholds:
        OPEN_REAL_TIME,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },

    {
      exchange:
        "NYSE_ARCA",

      name:
        "NYSE Arca",

      timezone:
        "America/New_York",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "PRE_MARKET",

          opensAt:
            time(
              4,
              0
            ),

          closesAt:
            time(
              9,
              30
            ),
        },

        {
          type:
            "REGULAR",

          opensAt:
            time(
              9,
              30
            ),

          closesAt:
            time(
              16,
              0
            ),
        },

        {
          type:
            "AFTER_HOURS",

          opensAt:
            time(
              16,
              0
            ),

          closesAt:
            time(
              20,
              0
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        true,

      supportsAfterHours:
        true,

      defaultLatencyClass:
        "REAL_TIME",

      openMarketThresholds:
        OPEN_REAL_TIME,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },

    {
      exchange:
        "AMEX",

      name:
        "NYSE American",

      timezone:
        "America/New_York",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "PRE_MARKET",

          opensAt:
            time(
              4,
              0
            ),

          closesAt:
            time(
              9,
              30
            ),
        },

        {
          type:
            "REGULAR",

          opensAt:
            time(
              9,
              30
            ),

          closesAt:
            time(
              16,
              0
            ),
        },

        {
          type:
            "AFTER_HOURS",

          opensAt:
            time(
              16,
              0
            ),

          closesAt:
            time(
              20,
              0
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        true,

      supportsAfterHours:
        true,

      defaultLatencyClass:
        "REAL_TIME",

      openMarketThresholds:
        OPEN_REAL_TIME,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },

    {
      exchange:
        "TSX",

      name:
        "Toronto Stock Exchange",

      timezone:
        "America/Toronto",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "REGULAR",

          opensAt:
            time(
              9,
              30
            ),

          closesAt:
            time(
              16,
              0
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "DELAYED",

      openMarketThresholds:
        OPEN_DELAYED,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },

    {
      exchange:
        "LSE",

      name:
        "London Stock Exchange",

      timezone:
        "Europe/London",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "REGULAR",

          opensAt:
            time(
              8,
              0
            ),

          closesAt:
            time(
              16,
              30
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "DELAYED",

      openMarketThresholds:
        OPEN_DELAYED,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },

    {
      exchange:
        "NZX",

      name:
        "New Zealand Exchange",

      timezone:
        "Pacific/Auckland",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "REGULAR",

          opensAt:
            time(
              10,
              0
            ),

          closesAt:
            time(
              16,
              45
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "DELAYED",

      openMarketThresholds:
        OPEN_DELAYED,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },

    {
      exchange:
        "HKEX",

      name:
        "Hong Kong Stock Exchange",

      timezone:
        "Asia/Hong_Kong",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "REGULAR",

          opensAt:
            time(
              9,
              30
            ),

          closesAt:
            time(
              12,
              0
            ),
        },

        {
          type:
            "REGULAR",

          opensAt:
            time(
              13,
              0
            ),

          closesAt:
            time(
              16,
              0
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "DELAYED",

      openMarketThresholds:
        OPEN_DELAYED,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,

      notes:
        "Includes the normal midday break between morning and afternoon sessions.",
    },

    {
      exchange:
        "TSE",

      name:
        "Tokyo Stock Exchange",

      timezone:
        "Asia/Tokyo",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "REGULAR",

          opensAt:
            time(
              9,
              0
            ),

          closesAt:
            time(
              11,
              30
            ),
        },

        {
          type:
            "REGULAR",

          opensAt:
            time(
              12,
              30
            ),

          closesAt:
            time(
              15,
              30
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "DELAYED",

      openMarketThresholds:
        OPEN_DELAYED,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,

      notes:
        "Includes the normal midday break between morning and afternoon sessions.",
    },

    {
      exchange:
        "FOREX",

      name:
        "Foreign Exchange Market",

      timezone:
        "UTC",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "CONTINUOUS",

          opensAt:
            time(
              0,
              0
            ),

          closesAt:
            time(
              23,
              59
            ),
        },
      ],

      continuous:
        true,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "REAL_TIME",

      openMarketThresholds:
        CONTINUOUS,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        CONTINUOUS,

      afterHoursThresholds:
        CONTINUOUS,

      notes:
        "Simplified weekday continuous model. Weekend closure is retained.",
    },

    {
      exchange:
        "CRYPTO",

      name:
        "Cryptocurrency Market",

      timezone:
        "UTC",

      tradingDays:
        EVERY_DAY,

      sessions: [
        {
          type:
            "CONTINUOUS",

          opensAt:
            time(
              0,
              0
            ),

          closesAt:
            time(
              23,
              59
            ),
        },
      ],

      continuous:
        true,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "REAL_TIME",

      openMarketThresholds:
        CONTINUOUS,

      closedMarketThresholds:
        CONTINUOUS,

      preMarketThresholds:
        CONTINUOUS,

      afterHoursThresholds:
        CONTINUOUS,
    },

    {
      exchange:
        "OTC",

      name:
        "Over-the-Counter Market",

      timezone:
        "America/New_York",

      tradingDays:
        WEEKDAYS,

      sessions: [
        {
          type:
            "REGULAR",

          opensAt:
            time(
              9,
              30
            ),

          closesAt:
            time(
              16,
              0
            ),
        },
      ],

      continuous:
        false,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "END_OF_DAY",

      openMarketThresholds:
        OPEN_DELAYED,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },

    {
      exchange:
        "UNKNOWN",

      name:
        "Unknown Exchange",

      timezone:
        "UTC",

      tradingDays:
        EVERY_DAY,

      sessions: [],

      continuous:
        false,

      supportsPreMarket:
        false,

      supportsAfterHours:
        false,

      defaultLatencyClass:
        "UNKNOWN",

      openMarketThresholds:
        OPEN_DELAYED,

      closedMarketThresholds:
        CLOSED_EQUITY,

      preMarketThresholds:
        PRE_AFTER,

      afterHoursThresholds:
        PRE_AFTER,
    },
  ];

export function tradingCalendarForExchange(
  exchange: MarketDataExchange
): ExchangeTradingCalendarDefinition {
  return (
    EXCHANGE_TRADING_CALENDARS.find(
      (
        calendar
      ) =>
        calendar.exchange ===
        exchange
    ) ||
    EXCHANGE_TRADING_CALENDARS.find(
      (
        calendar
      ) =>
        calendar.exchange ===
        "UNKNOWN"
    )!
  );
}

export function supportedTradingCalendarExchanges():
  MarketDataExchange[] {
  return EXCHANGE_TRADING_CALENDARS
    .filter(
      (
        calendar
      ) =>
        calendar.exchange !==
        "UNKNOWN"
    )
    .map(
      (
        calendar
      ) =>
        calendar.exchange
    );
}
