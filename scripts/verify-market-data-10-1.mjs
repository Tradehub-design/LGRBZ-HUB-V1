#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/marketDataTypes.ts",
    markers: [
      "MarketDataAssetType",
      "MarketDataRegion",
      "MarketDataExchange",
      "MarketDataProviderId",
      "MarketDataCapability",
      "MarketDataLatencyClass",
      "QuoteFreshness",
      "QuoteTradingStatus",
      "QuoteQualityGrade",
      "ProviderCircuitState",
      "ProviderOperationalState",
      "MarketDataProviderDefinition",
      "RawMarketQuote",
      "NormalisedMarketQuote",
      "QuoteQualityThresholds",
      "ProviderRequestResult",
      "ProviderHealthSnapshot",
      "ProviderSelectionRequest",
      "ProviderSelectionCandidate",
      "ProviderSelectionResult",
      "MarketDataDiagnosticSummary",
      "qualityScore",
      "confidenceScore",
      "isUsable",
      "isDelayed",
      "isStale",
      "isExpired",
    ],
  },

  {
    file:
      "src/lib/market-data/providerRegistry.ts",
    markers: [
      "DEFAULT_MARKET_DATA_PROVIDERS",
      "YAHOO_FINANCE",
      "ALPHA_VANTAGE",
      "FINNHUB",
      "TWELVE_DATA",
      "POLYGON",
      "MARKETSTACK",
      "STOOQ",
      "COINGECKO",
      "MANUAL",
      "CACHE",
      "providerById",
      "providerSupportsCapability",
      "providerSupportsAssetType",
      "providerSupportsRegion",
      "providerSupportsExchange",
      "providerApiKeyConfigured",
      "enabledMarketDataProviders",
      "providersForCapability",
      "updateProviderDefinition",
      "disableProvider",
      "enableProvider",
      "setProviderPriority",
    ],
  },

  {
    file:
      "src/lib/market-data/quoteQuality.ts",
    markers: [
      "normaliseMarketQuote",
      "quoteAgeSeconds",
      "classifyQuoteFreshness",
      "quoteQualityGrade",
      "freshnessScore",
      "latencyScore",
      "completenessScore",
      "consistencyScore",
      "warningsForQuote",
      "FRESH",
      "ACCEPTABLE",
      "DELAYED",
      "STALE",
      "EXPIRED",
      "REAL_TIME",
      "END_OF_DAY",
      "INDICATIVE",
      "qualityScore",
      "confidenceScore",
    ],
  },

  {
    file:
      "src/lib/market-data/providerHealth.ts",
    markers: [
      "createProviderHealthStore",
      "updateProviderHealth",
      "updateProviderHealthStore",
      "providerCircuitAllowsRequest",
      "prepareProviderHalfOpen",
      "healthForProvider",
      "resetProviderHealth",
      "providerHealthMap",
      "CIRCUIT_FAILURE_THRESHOLD",
      "CIRCUIT_RETRY_SECONDS",
      "CLOSED",
      "OPEN",
      "HALF_OPEN",
      "HEALTHY",
      "DEGRADED",
      "UNHEALTHY",
      "successRate",
      "failureRate",
      "averageLatencyMs",
      "consecutiveFailures",
    ],
  },

  {
    file:
      "src/lib/market-data/providerSelector.ts",
    markers: [
      "selectMarketDataProvider",
      "providerFallbackOrder",
      "evaluateCandidate",
      "preferenceBonus",
      "latencyEligibility",
      "allowDelayed",
      "allowIndicative",
      "requiredBatchSize",
      "providerPreference",
      "excludedProviders",
      "Provider circuit breaker is open",
      "selection score",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataDiagnostics.ts",
    markers: [
      "createMarketDataDiagnosticSummary",
      "providerCount",
      "enabledProviderCount",
      "healthyProviderCount",
      "degradedProviderCount",
      "unhealthyProviderCount",
      "openCircuitCount",
      "averageHealthScore",
      "averageLatencyMs",
      "quoteProviderCount",
      "dividendProviderCount",
      "batchProviderCount",
      "configuredApiKeyCount",
      "missingApiKeyCount",
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",
    markers: [
      'export * from "./marketDataDiagnostics"',
      'export * from "./marketDataTypes"',
      'export * from "./providerHealth"',
      'export * from "./providerRegistry"',
      'export * from "./providerSelector"',
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
    !fs.existsSync(check.file)
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
      !source.includes(marker)
    ) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const registry =
  fs.readFileSync(
    "src/lib/market-data/providerRegistry.ts",
    "utf8"
  );

const providerIds = [
  "YAHOO_FINANCE",
  "ALPHA_VANTAGE",
  "FINNHUB",
  "TWELVE_DATA",
  "POLYGON",
  "MARKETSTACK",
  "STOOQ",
  "COINGECKO",
  "MANUAL",
  "CACHE",
];

for (
  const providerId of
  providerIds
) {
  if (
    !registry.includes(
      `id: "${providerId}"`
    )
  ) {
    failures.push(
      `Provider registry missing provider definition: ${providerId}`
    );
  }
}

const quoteQuality =
  fs.readFileSync(
    "src/lib/market-data/quoteQuality.ts",
    "utf8"
  );

for (
  const grade of
  [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ]
) {
  if (
    !quoteQuality.includes(
      `return "${grade}"`
    )
  ) {
    failures.push(
      `Quote quality engine missing grade: ${grade}`
    );
  }
}

const providerHealth =
  fs.readFileSync(
    "src/lib/market-data/providerHealth.ts",
    "utf8"
  );

for (
  const circuitState of
  [
    "CLOSED",
    "OPEN",
    "HALF_OPEN",
  ]
) {
  if (
    !providerHealth.includes(
      `"${circuitState}"`
    )
  ) {
    failures.push(
      `Provider health engine missing circuit state: ${circuitState}`
    );
  }
}

const selector =
  fs.readFileSync(
    "src/lib/market-data/providerSelector.ts",
    "utf8"
  );

if (
  !selector.includes(
    "providerApiKeyConfigured"
  ) ||
  !selector.includes(
    "providerCircuitAllowsRequest"
  ) ||
  !selector.includes(
    "providerSupportsCapability"
  )
) {
  failures.push(
    "Provider selector is not connected to provider eligibility and health checks."
  );
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Market Data Bash 10.1 verification failed:"
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
  "✅ Market Data Bash 10.1 verification passed."
);
console.log(
  "✅ Shared market-data types installed."
);
console.log(
  "✅ Multi-provider registry installed."
);
console.log(
  "✅ Provider capability checks installed."
);
console.log(
  "✅ Provider region and exchange checks installed."
);
console.log(
  "✅ API-key configuration checks installed."
);
console.log(
  "✅ Provider enable and disable controls installed."
);
console.log(
  "✅ Provider priority controls installed."
);
console.log(
  "✅ Quote normalisation installed."
);
console.log(
  "✅ Quote age calculation installed."
);
console.log(
  "✅ Fresh, acceptable, delayed, stale and expired states installed."
);
console.log(
  "✅ Quote-quality scoring installed."
);
console.log(
  "✅ Quote-quality grades A–F installed."
);
console.log(
  "✅ Quote-confidence scoring installed."
);
console.log(
  "✅ Provider health scoring installed."
);
console.log(
  "✅ Provider latency tracking installed."
);
console.log(
  "✅ Consecutive failure tracking installed."
);
console.log(
  "✅ Provider circuit breaker installed."
);
console.log(
  "✅ Provider selection ranking installed."
);
console.log(
  "✅ Provider fallback ordering installed."
);
console.log(
  "✅ Market-data diagnostics installed."
);
console.log("");
console.log(
  "Bash 10.1 complete."
);
console.log(
  "Estimated Sprint 10 bashes remaining: 10."
);
console.log("");
