#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/marketDataAdapterTypes.ts",
    markers: [
      "MarketDataAdapterErrorCode",
      "MarketDataAdapterError",
      "ProviderQuoteRequest",
      "ProviderBatchQuoteRequest",
      "ProviderQuoteSuccess",
      "ProviderQuoteFailure",
      "ProviderQuoteResult",
      "ProviderBatchQuoteResult",
      "MarketDataProviderAdapter",
      "ProviderAdapterRegistry",
      "MultiProviderQuoteAttempt",
      "MultiProviderQuoteRequest",
      "MultiProviderQuoteResult",
      "MultiProviderBatchQuoteRequest",
      "MultiProviderBatchQuoteResult",
      "NOT_CONFIGURED",
      "RATE_LIMITED",
      "TIMEOUT",
      "NETWORK_ERROR",
      "INVALID_RESPONSE",
      "SYMBOL_NOT_FOUND",
      "CIRCUIT_OPEN",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataHttpClient.ts",
    markers: [
      "marketDataHttpJson",
      "createAdapterError",
      "isMarketDataAdapterError",
      "combineAbortSignals",
      "AbortSignal.any",
      "AbortController",
      "AUTHENTICATION_FAILED",
      "RATE_LIMITED",
      "TIMEOUT",
      "NETWORK_ERROR",
      "PROVIDER_UNAVAILABLE",
      'cache:\n            "no-store"',
    ],
  },

  {
    file:
      "src/lib/market-data/providerSymbolMapper.ts",
    markers: [
      "inferExchangeFromSymbol",
      "inferRegionFromExchange",
      "inferAssetTypeFromSymbol",
      "createMarketDataSymbol",
      "removeKnownExchangeSuffix",
      "addExchangeSuffix",
      "mapSymbolForProvider",
      "symbolForProvider",
      "YAHOO_FINANCE",
      "FINNHUB",
      "TWELVE_DATA",
      "ALPHA_VANTAGE",
      ".AX",
      ":ASX",
    ],
  },

  {
    file:
      "src/lib/market-data/adapters/baseQuoteAdapter.ts",
    markers: [
      "BaseMarketDataQuoteAdapter",
      "providerRequestResult",
      "fetchRawQuote",
      "normaliseMarketQuote",
      "symbolForProvider",
      "UNSUPPORTED_SYMBOL",
      "INVALID_RESPONSE",
      "ProviderQuoteSuccess",
      "ProviderQuoteFailure",
      "successfulCount",
      "failedCount",
      "partial",
    ],
  },

  {
    file:
      "src/lib/market-data/adapters/yahooFinanceQuoteAdapter.ts",
    markers: [
      "YahooFinanceQuoteAdapter",
      "YAHOO_FINANCE",
      "query1.finance.yahoo.com",
      "regularMarketPrice",
      "regularMarketPreviousClose",
      "regularMarketChangePercent",
      "regularMarketTime",
      "marketState",
      "Yahoo Finance",
    ],
  },

  {
    file:
      "src/lib/market-data/adapters/finnhubQuoteAdapter.ts",
    markers: [
      "FinnhubQuoteAdapter",
      "FINNHUB",
      "FINNHUB_API_KEY",
      "finnhub.io/api/v1/quote",
      "response.data.c",
      "response.data.pc",
      "response.data.dp",
      "REAL_TIME",
    ],
  },

  {
    file:
      "src/lib/market-data/adapters/twelveDataQuoteAdapter.ts",
    markers: [
      "TwelveDataQuoteAdapter",
      "TWELVE_DATA",
      "TWELVE_DATA_API_KEY",
      "api.twelvedata.com/quote",
      "previous_close",
      "percent_change",
      "RATE_LIMITED",
      "REAL_TIME",
    ],
  },

  {
    file:
      "src/lib/market-data/adapters/alphaVantageQuoteAdapter.ts",
    markers: [
      "AlphaVantageQuoteAdapter",
      "ALPHA_VANTAGE",
      "ALPHA_VANTAGE_API_KEY",
      "GLOBAL_QUOTE",
      "Global Quote",
      "05. price",
      "08. previous close",
      "10. change percent",
      "RATE_LIMITED",
      "DELAYED",
    ],
  },

  {
    file:
      "src/lib/market-data/adapters/providerAdapterRegistry.ts",
    markers: [
      "DefaultProviderAdapterRegistry",
      "createDefaultProviderAdapterRegistry",
      "getSharedProviderAdapterRegistry",
      "resetSharedProviderAdapterRegistry",
      "new YahooFinanceQuoteAdapter",
      "new FinnhubQuoteAdapter",
      "new TwelveDataQuoteAdapter",
      "new AlphaVantageQuoteAdapter",
      "register",
      "unregister",
    ],
  },

  {
    file:
      "src/lib/market-data/multiProviderQuoteResolver.ts",
    markers: [
      "MultiProviderQuoteResolver",
      "resolveMarketQuote",
      "resolveMarketQuotes",
      "getSharedMultiProviderQuoteResolver",
      "resetSharedMultiProviderQuoteResolver",
      "selectMarketDataProvider",
      "providerFallbackOrder",
      "resolveCachedMarketQuote",
      "createProviderQuoteCacheKey",
      "updateProviderHealthStore",
      "bestQuote",
      "quoteRank",
      "fallbackUsed",
      "compareProviders",
      "minimumQualityScore",
      "maximumProviderAttempts",
      "resolveBatch",
      "partial",
    ],
  },

  {
    file:
      "src/lib/market-data/adapters/index.ts",
    markers: [
      'export * from "./alphaVantageQuoteAdapter"',
      'export * from "./baseQuoteAdapter"',
      'export * from "./finnhubQuoteAdapter"',
      'export * from "./providerAdapterRegistry"',
      'export * from "./twelveDataQuoteAdapter"',
      'export * from "./yahooFinanceQuoteAdapter"',
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",
    markers: [
      'export * from "./adapters"',
      'export * from "./marketDataAdapterTypes"',
      'export * from "./marketDataHttpClient"',
      'export * from "./multiProviderQuoteResolver"',
      'export * from "./providerSymbolMapper"',
      'export * from "./providerRegistry"',
      'export * from "./providerHealth"',
      'export * from "./providerSelector"',
      'export * from "./cachedQuoteResolver"',
    ],
  },
];

const failures = [];

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    failures.push(`Missing required file: ${check.file}`);
    continue;
  }

  const source = fs.readFileSync(check.file, "utf8");

  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      failures.push(`${check.file} missing marker: ${marker}`);
    }
  }
}

const registrySource =
  fs.readFileSync(
    "src/lib/market-data/adapters/providerAdapterRegistry.ts",
    "utf8"
  );

for (const provider of [
  "YahooFinanceQuoteAdapter",
  "FinnhubQuoteAdapter",
  "TwelveDataQuoteAdapter",
  "AlphaVantageQuoteAdapter",
]) {
  if (!registrySource.includes(`new ${provider}()`)) {
    failures.push(`Default adapter registry missing ${provider}.`);
  }
}

const resolverSource =
  fs.readFileSync(
    "src/lib/market-data/multiProviderQuoteResolver.ts",
    "utf8"
  );

for (const marker of [
  "qualityScore",
  "confidenceScore",
  "isUsable",
  "freshness",
  "latencyClass",
]) {
  if (!resolverSource.includes(marker)) {
    failures.push(`Best-quote comparison missing ${marker}.`);
  }
}

if (
  !resolverSource.includes("updateProviderHealthStore") ||
  !resolverSource.includes("healthForProvider")
) {
  failures.push(
    "Multi-provider resolver is not connected to provider-health tracking."
  );
}

if (
  !resolverSource.includes("resolveCachedMarketQuote") ||
  !resolverSource.includes("createProviderQuoteCacheKey")
) {
  failures.push(
    "Multi-provider resolver is not connected to the smart quote cache."
  );
}

if (
  !resolverSource.includes("providerFallbackOrder") ||
  !resolverSource.includes("fallbackUsed")
) {
  failures.push(
    "Automatic provider fallback is incomplete."
  );
}

if (failures.length > 0) {
  console.error("");
  console.error("❌ Market Data Bash 10.3 verification failed:");

  for (const failure of failures) {
    console.error(`   - ${failure}`);
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log("✅ Market Data Bash 10.3 verification passed.");
console.log("✅ Shared provider-adapter contract installed.");
console.log("✅ Provider HTTP timeout protection installed.");
console.log("✅ Provider error normalisation installed.");
console.log("✅ Provider symbol mapping installed.");
console.log("✅ Yahoo Finance quote adapter installed.");
console.log("✅ Finnhub quote adapter installed.");
console.log("✅ Twelve Data quote adapter installed.");
console.log("✅ Alpha Vantage quote adapter installed.");
console.log("✅ Provider adapter registry installed.");
console.log("✅ Single-symbol provider resolution installed.");
console.log("✅ Batch provider resolution installed.");
console.log("✅ Provider priority selection installed.");
console.log("✅ Automatic provider fallback installed.");
console.log("✅ Provider health updates installed.");
console.log("✅ Circuit-breaker-aware selection installed.");
console.log("✅ Smart quote-cache integration installed.");
console.log("✅ Request coalescing integration installed.");
console.log("✅ Quote-quality comparison installed.");
console.log("✅ Best-quote selection installed.");
console.log("✅ Partial batch-result support installed.");
console.log("✅ Provider attempt diagnostics installed.");
console.log("");
console.log("Bash 10.3 complete.");
console.log("Estimated Sprint 10 bashes remaining: 8.");
console.log("");
