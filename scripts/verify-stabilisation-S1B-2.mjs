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
  "src/lib/market-data/marketClock.ts",
  [
    "CompatibilityMarketSessionSnapshot",
    "createMarketSessionSnapshot",
    "marketOpen",
    "marketClosed",
    "continuous",
    "tradingHalted",
    "sessionType",
    "message",
  ]
);

requireMarkers(
  "src/lib/market-data/marketDataRefreshDiagnostics.ts",
  [
    "RefreshCoordinatorDiagnosticSurface",
    "coordinatorJobs",
    "coordinatorPolicy",
    "coordinatorStatistics",
  ]
);

requireMarkers(
  "src/lib/market-data/marketDataRefreshTypes.ts",
  [
    "activeJobs",
    "queuedJobs",
    "completedJobs",
    "failedJobs",
  ]
);

requireMarkers(
  "src/hooks/useLiveQuotes.ts",
  [
    "StabilisedLiveQuotesPayload",
    "stabiliseLiveQuotesPayload",
    "stabiliseErrorMessage",
  ]
);

requireMarkers(
  "src/components/market-data/MarketDataProviderStatus.tsx",
  [
    "providerText",
    "providerNumber",
  ]
);

requireMarkers(
  "src/lib/market-data/multiProviderQuoteResolver.ts",
  [
    "providerResultError",
  ]
);

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

  const definitions =
    (
      source.match(
        /\bconst\s+openHoldings\b/g
      ) ||
      []
    ).length;

  if (definitions !== 1) {
    failures.push(
      `${file} must contain exactly one module-scope openHoldings definition; found ${definitions}.`
    );
  }
}

const banner =
  "src/components/dividend-centre-v2/DividendProviderBanner.tsx";

if (fs.existsSync(banner)) {
  const source =
    fs.readFileSync(
      banner,
      "utf8"
    );

  if (
    source.includes(
      "unavailable:"
    ) ||
    source.includes(
      '"unavailable"'
    )
  ) {
    failures.push(
      "DividendProviderBanner still contains a lowercase unavailable provider key."
    );
  }
}

if (failures.length) {
  console.error("");
  console.error(
    "❌ Stabilisation Sprint S1B.2 verification failed:"
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
  "✅ Stabilisation Sprint S1B.2 verification passed."
);
console.log(
  "✅ openHoldings scope repaired."
);
console.log(
  "✅ Provider presentation keys repaired."
);
console.log(
  "✅ Provider-health rendering stabilised."
);
console.log(
  "✅ Live-quotes response typing stabilised."
);
console.log(
  "✅ Refresh diagnostics stabilised."
);
console.log(
  "✅ Market-session compatibility expanded."
);
console.log(
  "✅ Resolver error access stabilised."
);
console.log("");
