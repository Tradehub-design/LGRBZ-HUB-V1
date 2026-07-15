#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const failures = [];

function requireMarkers(
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

requireMarkers(
  "src/lib/market-data/index.ts",
  [
    "normaliseLegacyProviderId",
    'export * from "./symbolNormaliser"',
    'export * from "./marketSessionDiagnostics"',
  ]
);

requireMarkers(
  "src/lib/market-data/symbolNormaliser.ts",
  [
    "normaliseMarketSymbols",
  ]
);

requireMarkers(
  "src/lib/market-data/marketSessionDiagnostics.ts",
  [
    "createMarketHoursDiagnosticSummary",
    "MarketHoursDiagnosticSummary",
  ]
);

requireMarkers(
  "src/lib/market-data/marketDataRefreshTypes.ts",
  [
    "MarketDataRefreshDiagnosticSummary",
  ]
);

const indexSource =
  fs.readFileSync(
    "src/lib/market-data/index.ts",
    "utf8"
  );

if (
  indexSource.includes(
    'export * from "./compatibility/legacyMarketDataCompatibility"'
  )
) {
  failures.push(
    "Conflicting compatibility star export still exists."
  );
}

for (const file of [
  "src/app/(dashboard)/dashboard/page.tsx",
  "src/app/(dashboard)/holdings/page.tsx",
]) {
  if (!fs.existsSync(file)) {
    continue;
  }

  const source =
    fs.readFileSync(
      file,
      "utf8"
    );

  const uses =
    source.includes(
      "openHoldings"
    );

  const defines =
    /\b(?:const|function)\s+openHoldings\b/.test(
      source
    );

  if (
    uses &&
    !defines
  ) {
    failures.push(
      `${file} uses openHoldings without defining it.`
    );
  }
}

if (failures.length) {
  console.error("");
  console.error(
    "❌ S1B.1 verification failed:"
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
  "✅ Stabilisation Sprint S1B.1 verification passed."
);
console.log(
  "✅ openHoldings callbacks repaired."
);
console.log(
  "✅ Market-data barrel conflicts repaired."
);
console.log(
  "✅ normaliseMarketSymbols exported."
);
console.log(
  "✅ Market-hours diagnostics exported."
);
console.log(
  "✅ Refresh diagnostic type installed."
);
console.log("");
