#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const dashboardPage =
  'src/app/(dashboard)/dashboard/page.tsx';

const allocationPage =
  'src/app/(dashboard)/portfolio-allocation/page.tsx';

const checks = [
  {
    file:
      "src/lib/market-data/client/portfolioLiveRecalculation.ts",

    markers: [
      "PortfolioLiveSourcePosition",
      "PortfolioLiveValuation",
      "PortfolioLiveAllocationBucket",
      "PortfolioLiveProviderBucket",
      "PortfolioLiveFreshnessBucket",
      "PortfolioLiveRecalculation",
      "normalisePortfolioLivePosition",
      "calculatePortfolioLiveRecalculation",
      "liveMarketValue",
      "unrealisedGainLoss",
      "unrealisedGainLossPercent",
      "dailyValueChange",
      "dailyChangePercent",
      "portfolioWeight",
      "pricingCoveragePercent",
      "marketValueCoveragePercent",
      "averageQualityScore",
      "averageConfidenceScore",
      "topHoldingWeight",
      "topFiveWeight",
      "bestDailyMover",
      "worstDailyMover",
      "sectorAllocation",
      "industryAllocation",
      "currencyAllocation",
      "exchangeAllocation",
      "accountAllocation",
      "brokerAllocation",
      "providerDistribution",
      "freshnessDistribution",
      "delayedPositionCount",
      "stalePositionCount",
      "expiredPositionCount",
      "indicativePositionCount",
      "unusablePositionCount",
    ],
  },

  {
    file:
      "src/components/market-data/DashboardLivePortfolioPanel.tsx",

    markers: [
      '"use client"',
      "DashboardLivePortfolioPanel",
      "useLiveMarketQuotes",
      "calculatePortfolioLiveRecalculation",
      "normalisePortfolioLivePosition",
      "Live Portfolio Intelligence",
      "Dashboard Live Recalculation",
      "Live portfolio value",
      "Unrealised P/L",
      "Daily movement",
      "Pricing coverage",
      "Quote quality",
      "Top-five weight",
      "Largest live positions",
      "Daily movers",
      "Best mover",
      "Worst mover",
      "Pricing reliability",
      "Provider distribution",
      "Refresh dashboard",
      "marketOpenIntervalMs",
      "marketClosedIntervalMs",
      "backgroundIntervalMs",
      "pauseWhenHidden",
      "pauseWhenOffline",
      "refreshWhenVisible",
      "refreshWhenOnline",
      "live.quoteBySymbol",
      "live.refresh",
    ],
  },

  {
    file:
      "src/components/market-data/PortfolioAllocationLivePanel.tsx",

    markers: [
      '"use client"',
      "PortfolioAllocationLivePanel",
      "useLiveMarketQuotes",
      "calculatePortfolioLiveRecalculation",
      "Live Allocation Intelligence",
      "Portfolio Allocation Live Recalculation",
      "Live market value",
      "Pricing coverage",
      "Largest holding",
      "Top-five concentration",
      "Quote quality",
      "Allocation quality warnings",
      "Live concentration",
      "Provider distribution",
      "Recalculate allocation",
      "SECTOR",
      "INDUSTRY",
      "CURRENCY",
      "EXCHANGE",
      "ACCOUNT",
      "BROKER",
      "sectorAllocation",
      "industryAllocation",
      "currencyAllocation",
      "exchangeAllocation",
      "accountAllocation",
      "brokerAllocation",
      "portfolioWeight",
      "live.forceRefresh",
    ],
  },

  {
    file:
      "src/components/market-data/index.ts",

    markers: [
      'export * from "./DashboardLivePortfolioPanel"',
      'export * from "./PortfolioAllocationLivePanel"',
      'export * from "./HoldingsLiveQuotePanel"',
      'export * from "./WatchlistLiveQuotePanel"',
    ],
  },

  {
    file:
      "src/lib/market-data/client/index.ts",

    markers: [
      'export * from "./portfolioLiveRecalculation"',
      'export * from "./liveQuoteStore"',
      'export * from "./liveQuoteStatus"',
    ],
  },

  {
    file:
      dashboardPage,

    markers: [
      "DashboardLivePortfolioPanel",
      "<DashboardLivePortfolioPanel holdings={",
    ],
  },

  {
    file:
      allocationPage,

    markers: [
      "PortfolioAllocationLivePanel",
      "<PortfolioAllocationLivePanel holdings={",
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

const engine =
  fs.readFileSync(
    "src/lib/market-data/client/portfolioLiveRecalculation.ts",
    "utf8"
  );

for (const field of [
  "quantity",
  "costBasis",
  "livePrice",
  "liveMarketValue",
  "unrealisedGainLoss",
  "dailyChangePercent",
  "portfolioWeight",
  "qualityScore",
  "confidenceScore",
  "provider",
  "freshness",
  "marketState",
]) {
  if (!engine.includes(field)) {
    failures.push(
      `Portfolio live-recalculation engine missing field: ${field}`
    );
  }
}

for (const grouping of [
  "sector",
  "industry",
  "currency",
  "exchange",
  "account",
  "broker",
]) {
  if (!engine.includes(`position.${grouping}`)) {
    failures.push(
      `Portfolio live-recalculation engine missing grouping: ${grouping}`
    );
  }
}

const dashboardSource =
  fs.readFileSync(
    dashboardPage,
    "utf8"
  );

const dashboardPanelCount =
  (
    dashboardSource.match(
      /<DashboardLivePortfolioPanel holdings=\{/g
    ) ||
    []
  ).length;

if (dashboardPanelCount !== 1) {
  failures.push(
    `Dashboard must contain exactly one live portfolio panel; found ${dashboardPanelCount}.`
  );
}

const allocationSource =
  fs.readFileSync(
    allocationPage,
    "utf8"
  );

const allocationPanelCount =
  (
    allocationSource.match(
      /<PortfolioAllocationLivePanel holdings=\{/g
    ) ||
    []
  ).length;

if (allocationPanelCount !== 1) {
  failures.push(
    `Portfolio Allocation must contain exactly one live allocation panel; found ${allocationPanelCount}.`
  );
}

const dashboardPanel =
  fs.readFileSync(
    "src/components/market-data/DashboardLivePortfolioPanel.tsx",
    "utf8"
  );

if (
  !dashboardPanel.includes(
    "calculatePortfolioLiveRecalculation"
  ) ||
  !dashboardPanel.includes(
    "live.quoteBySymbol"
  )
) {
  failures.push(
    "Dashboard live panel is not connected to shared quote recalculation."
  );
}

const allocationPanel =
  fs.readFileSync(
    "src/components/market-data/PortfolioAllocationLivePanel.tsx",
    "utf8"
  );

if (
  !allocationPanel.includes(
    "allocationForView"
  ) ||
  !allocationPanel.includes(
    "bucket.weight"
  )
) {
  failures.push(
    "Portfolio Allocation live weighting is incomplete."
  );
}

if (
  !allocationPanel.includes(
    "topFiveWeight"
  ) ||
  !allocationPanel.includes(
    "topHoldingWeight"
  )
) {
  failures.push(
    "Portfolio concentration analysis is incomplete."
  );
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Market Data Bash 10.8 verification failed:"
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
  "✅ Market Data Bash 10.8 verification passed."
);
console.log(
  "✅ Shared portfolio live-recalculation engine installed."
);
console.log(
  "✅ Dashboard live portfolio panel installed."
);
console.log(
  "✅ Portfolio Allocation live panel installed."
);
console.log(
  "✅ Live portfolio value installed."
);
console.log(
  "✅ Live unrealised gain/loss installed."
);
console.log(
  "✅ Daily portfolio movement installed."
);
console.log(
  "✅ Pricing coverage installed."
);
console.log(
  "✅ Quote-quality coverage installed."
);
console.log(
  "✅ Best and worst daily movers installed."
);
console.log(
  "✅ Live sector allocation installed."
);
console.log(
  "✅ Live industry allocation installed."
);
console.log(
  "✅ Live currency allocation installed."
);
console.log(
  "✅ Live exchange allocation installed."
);
console.log(
  "✅ Live account allocation installed."
);
console.log(
  "✅ Live broker allocation installed."
);
console.log(
  "✅ Largest-position concentration installed."
);
console.log(
  "✅ Top-five concentration installed."
);
console.log(
  "✅ Provider distribution installed."
);
console.log(
  "✅ Freshness distribution installed."
);
console.log(
  "✅ Dashboard page wiring installed."
);
console.log(
  "✅ Portfolio Allocation page wiring installed."
);
console.log("");
console.log(
  "Bash 10.8 complete."
);
console.log(
  "Estimated Sprint 10 bashes remaining: 3."
);
console.log("");
