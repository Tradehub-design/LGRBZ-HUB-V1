#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/compatibility/legacyMarketDataCompatibility.ts",

    markers: [
      "LegacyMarketDataProviderId",
      "NormalisedMarketSymbol",
      "QuoteRequestSecurity",
      "MarketQuote",
      "MarketQuoteBatch",
      "QuoteApiResponse",
      "QuoteCacheEntry",
      "MarketDataProviderHealth",
      "MarketDataProviderResult",
      "MarketDataProvider",
      "normaliseLegacyProviderId",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataTypes.ts",

    markers: [
      "legacyMarketDataCompatibility",
      "LegacyMarketQuote",
      "LegacyQuoteRequestSecurity",
      "LegacyNormalisedMarketSymbol",
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",

    markers: [
      'export * from "./compatibility/legacyMarketDataCompatibility"',
    ],
  },

  {
    file:
      "src/lib/market-data/providerHealth.ts",

    markers: [
      "registerProviderConfiguration",
      "recordProviderAttempt",
      "recordProviderSuccess",
      "recordProviderFailure",
      "getCompatibilityProviderHealth",
    ],
  },

  {
    file:
      "src/lib/market-data/marketClock.ts",

    markers: [
      "createMarketSessionSnapshot",
      "CompatibilityMarketSessionSnapshot",
    ],
  },
];

const failures = [];

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    failures.push(
      `Missing file: ${check.file}`
    );

    continue;
  }

  const source =
    fs.readFileSync(
      check.file,
      "utf8"
    );

  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const providerFiles = [
  "src/lib/market-data/providers/alphaVantageProvider.ts",
  "src/lib/market-data/providers/twelveDataProvider.ts",
  "src/lib/market-data/providers/finnhubProvider.ts",
];

for (const file of providerFiles) {
  if (!fs.existsSync(file)) {
    continue;
  }

  const source =
    fs.readFileSync(
      file,
      "utf8"
    );

  for (const legacyId of [
    '"alpha-vantage"',
    '"twelve-data"',
    '"finnhub"',
  ]) {
    if (source.includes(legacyId)) {
      failures.push(
        `${file} still contains legacy provider ID ${legacyId}`
      );
    }
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Stabilisation Sprint S1A verification failed:"
  );

  for (const failure of failures) {
    console.error(
      `   - ${failure}`
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "✅ Stabilisation Sprint S1A verification passed."
);
console.log(
  "✅ Legacy market-data contracts installed."
);
console.log(
  "✅ Provider-health compatibility installed."
);
console.log(
  "✅ Market-session compatibility installed."
);
console.log(
  "✅ Provider IDs normalised."
);
console.log(
  "✅ Market-data barrel compatibility installed."
);
console.log("");
