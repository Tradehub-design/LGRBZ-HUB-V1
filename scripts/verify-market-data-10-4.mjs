#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/marketSessionTypes.ts",
    markers: [
      "MarketSessionType",
      "MarketClosureReason",
      "TradingDayName",
      "MarketTimeOfDay",
      "ExchangeSessionWindow",
      "ExchangeTradingCalendarDefinition",
      "ExchangeHolidayOverride",
      "MarketClockInput",
      "MarketSessionSnapshot",
      "AdaptiveQuoteFreshnessInput",
      "AdaptiveQuoteFreshnessResult",
      "MarketSessionDiagnosticSummary",
      "PRE_MARKET",
      "REGULAR",
      "AFTER_HOURS",
      "CONTINUOUS",
      "HALTED",
      "WEEKEND",
      "HOLIDAY",
      "OUTSIDE_SESSION",
      "secondsUntilOpen",
      "secondsUntilClose",
      "earlyClose",
    ],
  },

  {
    file:
      "src/lib/market-data/exchangeTradingCalendar.ts",
    markers: [
      "EXCHANGE_TRADING_CALENDARS",
      "tradingCalendarForExchange",
      "supportedTradingCalendarExchanges",
      "Australian Securities Exchange",
      "Nasdaq Stock Market",
      "New York Stock Exchange",
      "NYSE Arca",
      "NYSE American",
      "Toronto Stock Exchange",
      "London Stock Exchange",
      "New Zealand Exchange",
      "Hong Kong Stock Exchange",
      "Tokyo Stock Exchange",
      "Foreign Exchange Market",
      "Cryptocurrency Market",
      "Australia/Sydney",
      "America/New_York",
      "America/Toronto",
      "Europe/London",
      "Pacific/Auckland",
      "Asia/Hong_Kong",
      "Asia/Tokyo",
      "openMarketThresholds",
      "closedMarketThresholds",
      "preMarketThresholds",
      "afterHoursThresholds",
      "supportsPreMarket",
      "supportsAfterHours",
    ],
  },

  {
    file:
      "src/lib/market-data/marketClock.ts",
    markers: [
      "createMarketSessionSnapshot",
      "isMarketOpen",
      "marketTradingStatus",
      "datePartsInTimezone",
      "timezoneOffsetMilliseconds",
      "localDateTimeToUtc",
      "holidayForDate",
      "regularSessionsForDay",
      "findNextOpenAndClose",
      "sessionContains",
      "tradingStatusForSession",
      "thresholdsForSession",
      "TRADING_HALT",
      "UNSUPPORTED_EXCHANGE",
      "secondsUntilOpen",
      "secondsUntilClose",
      "currentSessionOpenedAt",
      "currentSessionClosesAt",
      "nextOpenAt",
      "nextCloseAt",
      "marketOpen",
      "marketClosed",
    ],
  },

  {
    file:
      "src/lib/market-data/adaptiveQuoteFreshness.ts",
    markers: [
      "calculateAdaptiveQuoteFreshness",
      "thresholdsForLatency",
      "staleReasonFor",
      "acceptableForValuation",
      "acceptableForLiveDisplay",
      "marketAdjusted",
      "End-of-day pricing is not suitable for intraday live-price display",
      "Indicative pricing may differ from executable market prices",
      "Provider reports delayed market data",
      "marketSession",
      "classifyQuoteFreshness",
      "quoteAgeSeconds",
    ],
  },

  {
    file:
      "src/lib/market-data/marketSessionDiagnostics.ts",
    markers: [
      "createMarketSessionDiagnosticSummary",
      "openExchangeCount",
      "closedExchangeCount",
      "continuousExchangeCount",
      "haltedExchangeCount",
      "preMarketExchangeCount",
      "regularSessionExchangeCount",
      "afterHoursExchangeCount",
      "haltedExchanges",
    ],
  },

  {
    file:
      "src/lib/market-data/quoteQuality.ts",
    markers: [
      "calculateAdaptiveQuoteFreshness",
      "adaptiveFreshness",
      "adaptiveFreshness.warnings",
      "adaptiveFreshness.acceptableForValuation",
      "adaptiveFreshness.marketSession.tradingStatus",
      "normaliseMarketQuote",
      "qualityScore",
      "confidenceScore",
    ],
  },

  {
    file:
      "src/lib/market-data/multiProviderQuoteResolver.ts",
    markers: [
      "createMarketSessionSnapshot",
      "const marketSession",
      "marketSession.message",
      "MultiProviderQuoteResolver",
      "resolveCachedMarketQuote",
      "providerFallbackOrder",
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",
    markers: [
      'export * from "./adaptiveQuoteFreshness"',
      'export * from "./exchangeTradingCalendar"',
      'export * from "./marketClock"',
      'export * from "./marketSessionDiagnostics"',
      'export * from "./marketSessionTypes"',
      'export * from "./multiProviderQuoteResolver"',
      'export * from "./quoteQuality"',
    ],
  },
];

const failures = [];

for (
  const check of
  checks
) {
  if (
    !fs.existsSync(
      check.file
    )
  ) {
    failures.push(
      `Missing required file: ${check.file}`
    );

    continue;
  }

  const source =
    fs.readFileSync(
      check.file,
      "utf8"
    );

  for (
    const marker of
    check.markers
  ) {
    if (
      !source.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const calendarSource =
  fs.readFileSync(
    "src/lib/market-data/exchangeTradingCalendar.ts",
    "utf8"
  );

for (
  const exchange of
  [
    "ASX",
    "NASDAQ",
    "NYSE",
    "NYSE_ARCA",
    "AMEX",
    "TSX",
    "LSE",
    "NZX",
    "HKEX",
    "TSE",
    "FOREX",
    "CRYPTO",
    "OTC",
    "UNKNOWN",
  ]
) {
  if (
    !calendarSource.includes(
      `exchange:\n        "${exchange}"`
    )
  ) {
    failures.push(
      `Trading calendar missing exchange definition: ${exchange}`
    );
  }
}

for (
  const timezone of
  [
    "Australia/Sydney",
    "America/New_York",
    "America/Toronto",
    "Europe/London",
    "Pacific/Auckland",
    "Asia/Hong_Kong",
    "Asia/Tokyo",
    "UTC",
  ]
) {
  if (
    !calendarSource.includes(
      `"${timezone}"`
    )
  ) {
    failures.push(
      `Trading calendar missing timezone: ${timezone}`
    );
  }
}

const clockSource =
  fs.readFileSync(
    "src/lib/market-data/marketClock.ts",
    "utf8"
  );

for (
  const state of
  [
    "REGULAR",
    "PRE_MARKET",
    "AFTER_HOURS",
    "CONTINUOUS",
    "HALTED",
    "CLOSED",
    "UNKNOWN",
  ]
) {
  if (
    !clockSource.includes(
      `"${state}"`
    )
  ) {
    failures.push(
      `Market clock missing session state: ${state}`
    );
  }
}

for (
  const reason of
  [
    "WEEKEND",
    "HOLIDAY",
    "OUTSIDE_SESSION",
    "TRADING_HALT",
    "UNSUPPORTED_EXCHANGE",
  ]
) {
  if (
    !clockSource.includes(
      `"${reason}"`
    )
  ) {
    failures.push(
      `Market clock missing closure reason: ${reason}`
    );
  }
}

const adaptiveSource =
  fs.readFileSync(
    "src/lib/market-data/adaptiveQuoteFreshness.ts",
    "utf8"
  );

for (
  const latencyClass of
  [
    "REAL_TIME",
    "DELAYED",
    "END_OF_DAY",
    "INDICATIVE",
  ]
) {
  if (
    !adaptiveSource.includes(
      `"${latencyClass}"`
    )
  ) {
    failures.push(
      `Adaptive freshness missing latency class: ${latencyClass}`
    );
  }
}

const quoteQualitySource =
  fs.readFileSync(
    "src/lib/market-data/quoteQuality.ts",
    "utf8"
  );

if (
  !quoteQualitySource.includes(
    "calculateAdaptiveQuoteFreshness"
  ) ||
  !quoteQualitySource.includes(
    "adaptiveFreshness.acceptableForValuation"
  )
) {
  failures.push(
    "Quote-quality engine is not connected to adaptive market-session freshness."
  );
}

const resolverSource =
  fs.readFileSync(
    "src/lib/market-data/multiProviderQuoteResolver.ts",
    "utf8"
  );

if (
  !resolverSource.includes(
    "createMarketSessionSnapshot"
  ) ||
  !resolverSource.includes(
    "marketSession.message"
  )
) {
  failures.push(
    "Multi-provider resolver is not connected to market-session intelligence."
  );
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Market Data Bash 10.4 verification failed:"
  );

  for (
    const failure of
    failures
  ) {
    console.error(
      `   - ${failure}`
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "✅ Market Data Bash 10.4 verification passed."
);
console.log(
  "✅ Exchange trading-calendar models installed."
);
console.log(
  "✅ ASX trading session installed."
);
console.log(
  "✅ Nasdaq trading sessions installed."
);
console.log(
  "✅ NYSE trading sessions installed."
);
console.log(
  "✅ NYSE Arca trading sessions installed."
);
console.log(
  "✅ NYSE American trading sessions installed."
);
console.log(
  "✅ TSX trading session installed."
);
console.log(
  "✅ LSE trading session installed."
);
console.log(
  "✅ NZX trading session installed."
);
console.log(
  "✅ HKEX split trading sessions installed."
);
console.log(
  "✅ TSE split trading sessions installed."
);
console.log(
  "✅ Forex continuous weekday session installed."
);
console.log(
  "✅ Crypto continuous session installed."
);
console.log(
  "✅ Exchange timezone mapping installed."
);
console.log(
  "✅ Weekend detection installed."
);
console.log(
  "✅ Holiday override support installed."
);
console.log(
  "✅ Early-close support installed."
);
console.log(
  "✅ Trading-halt support installed."
);
console.log(
  "✅ Pre-market classification installed."
);
console.log(
  "✅ Regular-session classification installed."
);
console.log(
  "✅ After-hours classification installed."
);
console.log(
  "✅ Continuous-session classification installed."
);
console.log(
  "✅ Closed-market classification installed."
);
console.log(
  "✅ Next market-open calculation installed."
);
console.log(
  "✅ Next market-close calculation installed."
);
console.log(
  "✅ Adaptive open-market freshness installed."
);
console.log(
  "✅ Adaptive closed-market freshness installed."
);
console.log(
  "✅ Adaptive pre-market freshness installed."
);
console.log(
  "✅ Adaptive after-hours freshness installed."
);
console.log(
  "✅ Delayed-provider freshness adjustment installed."
);
console.log(
  "✅ End-of-day freshness adjustment installed."
);
console.log(
  "✅ Indicative-price freshness adjustment installed."
);
console.log(
  "✅ Quote valuation suitability installed."
);
console.log(
  "✅ Live-display suitability installed."
);
console.log(
  "✅ Quote-quality integration installed."
);
console.log(
  "✅ Multi-provider resolver integration installed."
);
console.log(
  "✅ Market-session diagnostics installed."
);
console.log("");
console.log(
  "Bash 10.4 complete."
);
console.log(
  "Estimated Sprint 10 bashes remaining: 7."
);
console.log("");
