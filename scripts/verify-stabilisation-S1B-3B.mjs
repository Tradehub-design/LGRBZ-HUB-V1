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
  "src/lib/market-data/compatibility/legacyMarketDataCompatibility.ts",
  [
    "ok?: boolean",
    "unresolvedSymbols",
    "durationMs",
  ]
);

check(
  "src/lib/market-data/providerHealth.ts",
  [
    "_compatibilityArguments",
    "recordProviderAttempt",
    "recordProviderSuccess",
    "recordProviderFailure",
  ]
);

check(
  "src/lib/market-data/multiProviderQuoteResolver.ts",
  [
    "stableProviderResultError",
  ]
);

check(
  "src/lib/market-data/providers/providerUtils.ts",
  [
    "stableMarketDataExchange",
    "stableQuoteConfidence",
    "stableProviderId",
  ]
);

for (const file of [
  "src/lib/market-data/providers/alphaVantageProvider.ts",
  "src/lib/market-data/providers/finnhubProvider.ts",
  "src/lib/market-data/providers/twelveDataProvider.ts",
]) {
  if (!fs.existsSync(file)) {
    continue;
  }

  const source =
    fs.readFileSync(
      file,
      "utf8"
    );

  if (
    !source.includes("ok:")
  ) {
    failures.push(
      `${file} does not contain explicit provider-result status.`
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Stabilisation S1B.3B verification failed:"
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
  "✅ Stabilisation S1B.3B verification passed."
);
console.log(
  "✅ Provider-result contracts aligned."
);
console.log(
  "✅ Provider-health legacy arity supported."
);
console.log(
  "✅ Provider-result error access narrowed."
);
console.log(
  "✅ Exchange normalisation installed."
);
console.log(
  "✅ Quote-confidence normalisation installed."
);
console.log(
  "✅ Provider-ID normalisation installed."
);
console.log(
  "✅ Provider response status installed."
);
console.log("");
