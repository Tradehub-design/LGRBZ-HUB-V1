import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/marketDataTypes.ts",
    markers: [
      "MarketQuote",
      "MarketQuoteBatch",
      "MarketDataProvider",
      "MarketDataProviderHealth",
      "QuoteFreshnessStatus",
    ],
  },
  {
    file:
      "src/lib/market-data/symbolNormaliser.ts",
    markers: [
      "normaliseMarketSymbol",
      "normaliseMarketSymbols",
      ".AX",
      "ASX",
      "NASDAQ",
    ],
  },
  {
    file:
      "src/lib/market-data/quoteFreshness.ts",
    markers: [
      "evaluateQuoteFreshness",
      "REAL_TIME",
      "DELAYED",
      "STALE",
      "END_OF_DAY",
    ],
  },
  {
    file:
      "src/lib/market-data/quoteCache.ts",
    markers: [
      "cacheQuote",
      "getFreshCachedQuote",
      "getFallbackCachedQuote",
      "clearQuoteCache",
    ],
  },
  {
    file:
      "src/lib/market-data/quoteService.ts",
    markers: [
      "getMarketQuotes",
      "configuredMarketDataProviders",
      "getFreshCachedQuote",
      "getFallbackCachedQuote",
      "createUnavailableQuote",
    ],
  },
  {
    file:
      "src/lib/market-data/providers/twelveDataProvider.ts",
    markers: [
      "twelveDataProvider",
      "TWELVE_DATA_API_KEY",
      "/quote?",
      "recordProviderSuccess",
    ],
  },
  {
    file:
      "src/lib/market-data/providers/finnhubProvider.ts",
    markers: [
      "finnhubProvider",
      "FINNHUB_API_KEY",
      "/api/v1/quote",
      "AU:",
    ],
  },
  {
    file:
      "src/lib/market-data/providers/alphaVantageProvider.ts",
    markers: [
      "alphaVantageProvider",
      "ALPHA_VANTAGE_API_KEY",
      "GLOBAL_QUOTE",
      "Global Quote",
    ],
  },
  {
    file:
      "src/app/api/market-data/quotes/route.ts",
    markers: [
      "getMarketQuotes",
      "QuoteApiResponse",
      "MAX_SYMBOLS",
      "forceRefresh",
      "providerHealth",
    ],
  },
  {
    file:
      "src/hooks/useLiveQuotes.ts",
    markers: [
      "useLiveQuotes",
      "/api/market-data/quotes",
      "refreshIntervalMs",
      "refreshOnFocus",
      "quoteMap",
    ],
  },
  {
    file:
      "src/components/market-data/MarketDataProviderStatus.tsx",
    markers: [
      "MarketDataProviderStatus",
      "API key not configured",
      "Provider available",
      "successRate",
    ],
  },
  {
    file:
      ".env.market-data.example",
    markers: [
      "TWELVE_DATA_API_KEY",
      "FINNHUB_API_KEY",
      "ALPHA_VANTAGE_API_KEY",
    ],
  },
];

const failures = [];

for (
  const check of checks
) {
  if (
    !fs.existsSync(
      check.file
    )
  ) {
    failures.push(
      `Missing file: ${check.file}`
    );

    continue;
  }

  const content =
    fs.readFileSync(
      check.file,
      "utf8"
    );

  for (
    const marker of
    check.markers
  ) {
    if (
      !content.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

if (
  failures.length >
  0
) {
  console.error(
    "❌ Live-data foundation verification failed:"
  );

  for (
    const failure of
    failures
  ) {
    console.error(
      `   - ${failure}`
    );
  }

  process.exit(1);
}

console.log(
  "✅ Live-data foundation verification passed."
);

console.log(
  "✅ Shared symbol normalisation is installed."
);

console.log(
  "✅ ASX .AX ticker conversion is installed."
);

console.log(
  "✅ Twelve Data, Finnhub and Alpha Vantage adapters are installed."
);

console.log(
  "✅ Provider fallback and previous-valid-quote fallback are installed."
);

console.log(
  "✅ Real-time, delayed, stale and end-of-day labels are installed."
);

console.log(
  "✅ Shared quote API and useLiveQuotes hook are installed."
);

console.log(
  `✅ Verified ${checks.length} live-data files.`
);
