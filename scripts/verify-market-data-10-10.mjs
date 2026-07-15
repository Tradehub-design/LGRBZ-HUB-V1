#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/marketDataReliabilityTypes.ts",

    markers: [
      "MarketDataReliabilityStatus",
      "MarketDataEndpointStatus",
      "MarketDataEndpointDiagnostic",
      "MarketDataProviderDiagnostic",
      "MarketDataCacheDiagnostic",
      "MarketDataRefreshDiagnostic",
      "MarketDataClientDiagnostic",
      "MarketDataEnvironmentDiagnostic",
      "MarketDataReliabilitySnapshot",
      "MarketDataApiEnvelope",
      "HEALTHY",
      "DEGRADED",
      "CRITICAL",
      "UNKNOWN",
      "ONLINE",
      "OFFLINE",
      "UNTESTED",
    ],
  },

  {
    file:
      "src/lib/market-data/client/marketDataReliabilityClient.ts",

    markers: [
      '"use client"',
      "fetchMarketDataReliabilitySnapshot",
      "useLiveQuoteStore",
      "diagnoseEndpoint",
      "providerDiagnostics",
      "cacheDiagnostic",
      "refreshDiagnostic",
      "clientDiagnostic",
      "environmentDiagnostics",
      "/api/market-data/health",
      "/api/market-data/cache",
      "/api/market-data/refresh",
      "/api/market-data/market-hours",
      "endpointOnlineCount",
      "configuredProviderCount",
      "warnings",
    ],
  },

  {
    file:
      "src/components/market-data/MarketDataReliabilityCentre.tsx",

    markers: [
      '"use client"',
      "MarketDataReliabilityCentre",
      "fetchMarketDataReliabilitySnapshot",
      "Institutional Data Operations",
      "Market Data Reliability Centre",
      "Run diagnostics",
      "System status",
      "API endpoints",
      "Providers",
      "Provider success",
      "Cache hit rate",
      "Client quality",
      "Reliability warnings",
      "API endpoint health",
      "Provider reliability",
      "Cache reliability",
      "Refresh coordination",
      "Browser quote state",
      "setInterval",
      "60_000",
    ],
  },

  {
    file:
      "src/app/(dashboard)/market-data-health/page.tsx",

    markers: [
      "MarketDataReliabilityCentre",
      'dynamic =\n  "force-dynamic"',
      "revalidate",
      "MarketDataHealthPage",
    ],
  },

  {
    file:
      "scripts/smoke-market-data-endpoints.mjs",

    markers: [
      "MARKET_DATA_SMOKE_BASE_URL",
      "/api/market-data/health",
      "/api/market-data/cache",
      "/api/market-data/refresh",
      "/api/market-data/market-hours",
      "/api/market-data/quote",
      "Single quote validation",
      "expectedStatus: 400",
      "All market-data endpoint smoke tests passed",
    ],
  },

  {
    file:
      "scripts/regression-market-data-sprint-10.mjs",

    markers: [
      "Sprint 10 Static Regression",
      "requiredFiles",
      "Duplicate market-data route detected",
      "duplicate export",
      "uses browser APIs without a use-client boundary",
      "hard-coded API key",
      "unresolved market-data placeholder",
      "verify:market-data-sprint-10",
      "smoke:market-data",
      "regression:market-data-sprint-10",
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",

    markers: [
      'export * from "./marketDataReliabilityTypes"',
    ],
  },

  {
    file:
      "src/lib/market-data/client/index.ts",

    markers: [
      'export * from "./marketDataReliabilityClient"',
    ],
  },

  {
    file:
      "src/components/market-data/index.ts",

    markers: [
      'export * from "./MarketDataReliabilityCentre"',
    ],
  },
];

const failures = [];

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
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

  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const reliabilityClient =
  fs.readFileSync(
    "src/lib/market-data/client/marketDataReliabilityClient.ts",
    "utf8"
  );

for (const status of [
  "HEALTHY",
  "DEGRADED",
  "CRITICAL",
]) {
  if (
    !reliabilityClient.includes(
      `"${status}"`
    )
  ) {
    failures.push(
      `Reliability client missing status: ${status}`
    );
  }
}

const reliabilityCentre =
  fs.readFileSync(
    "src/components/market-data/MarketDataReliabilityCentre.tsx",
    "utf8"
  );

for (const section of [
  "API endpoint health",
  "Provider reliability",
  "Cache reliability",
  "Refresh coordination",
  "Browser quote state",
]) {
  if (
    !reliabilityCentre.includes(
      section
    )
  ) {
    failures.push(
      `Reliability Centre missing section: ${section}`
    );
  }
}

if (
  !reliabilityCentre.includes(
    "window.setInterval"
  ) ||
  !reliabilityCentre.includes(
    "window.clearInterval"
  )
) {
  failures.push(
    "Reliability Centre automatic diagnostic refresh is incomplete."
  );
}

const packageJson =
  JSON.parse(
    fs.readFileSync(
      "package.json",
      "utf8"
    )
  );

for (const script of [
  "verify:market-data-10-10",
  "verify:market-data-sprint-10",
  "regression:market-data-sprint-10",
  "smoke:market-data",
]) {
  if (
    !packageJson.scripts?.[
      script
    ]
  ) {
    failures.push(
      `package.json missing script: ${script}`
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Market Data Bash 10.10 verification failed:"
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
  "✅ Market Data Bash 10.10 verification passed."
);
console.log(
  "✅ Unified reliability types installed."
);
console.log(
  "✅ Unified reliability client installed."
);
console.log(
  "✅ Market Data Reliability Centre installed."
);
console.log(
  "✅ Market Data Health page installed."
);
console.log(
  "✅ Provider diagnostics installed."
);
console.log(
  "✅ Cache diagnostics installed."
);
console.log(
  "✅ Refresh-queue diagnostics installed."
);
console.log(
  "✅ Client quote-store diagnostics installed."
);
console.log(
  "✅ Endpoint diagnostics installed."
);
console.log(
  "✅ Endpoint smoke test installed."
);
console.log(
  "✅ Static regression test installed."
);
console.log(
  "✅ Duplicate route detection installed."
);
console.log(
  "✅ Duplicate export detection installed."
);
console.log(
  "✅ Client/server boundary checks installed."
);
console.log(
  "✅ API-key leak detection installed."
);
console.log(
  "✅ Placeholder detection installed."
);
console.log("");
