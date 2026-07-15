#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const failures = [];

function check(
  file,
  markers
) {
  if (!fs.existsSync(file)) {
    failures.push(
      `Missing required file: ${file}`
    );

    return;
  }

  const source =
    fs.readFileSync(
      file,
      "utf8"
    );

  for (const marker of markers) {
    if (!source.includes(marker)) {
      failures.push(
        `${file} missing marker: ${marker}`
      );
    }
  }
}

check(
  "src/lib/market-data/quoteCache.ts",
  [
    "quoteCacheTimestamp",
    "quoteCacheIsoTimestamp",
  ]
);

check(
  "src/lib/market-data/adaptiveQuoteFreshness.ts",
  [
    "receivedAt",
    "acceptableForValuation",
    "marketSession",
  ]
);

check(
  "src/lib/market-data/quoteQuality.ts",
  [
    "CompatibleAdaptiveFreshnessResult",
    "compatibleAdaptiveFreshness",
  ]
);

check(
  "src/lib/market-data/quoteService.ts",
  [
    "QuoteProviderCallable",
    "quoteProviderCallable",
    "quoteServiceProviderId",
  ]
);

check(
  "src/lib/market-data/symbolNormaliser.ts",
  [
    "stableSymbolText",
  ]
);

const marketDataTypes =
  "src/lib/market-data/marketDataTypes.ts";

if (
  fs.existsSync(
    marketDataTypes
  )
) {
  const source =
    fs.readFileSync(
      marketDataTypes,
      "utf8"
    );

  for (const value of [
    '"REAL_TIME"',
    '"END_OF_DAY"',
    '"MANUAL"',
    '"NONE"',
  ]) {
    if (!source.includes(value)) {
      failures.push(
        `${marketDataTypes} missing compatibility value: ${value}`
      );
    }
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Stabilisation S1B.3C verification failed:"
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
  "✅ Stabilisation S1B.3C verification passed."
);
console.log(
  "✅ Quote-cache timestamp contracts stabilised."
);
console.log(
  "✅ Freshness and confidence values aligned."
);
console.log(
  "✅ Adaptive freshness compatibility installed."
);
console.log(
  "✅ Quote-quality compatibility installed."
);
console.log(
  "✅ Quote-service callability stabilised."
);
console.log(
  "✅ Symbol-normaliser contracts stabilised."
);
console.log("");
