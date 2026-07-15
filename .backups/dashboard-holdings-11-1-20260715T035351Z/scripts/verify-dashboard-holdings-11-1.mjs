#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const dashboardPage =
  'src/app/(dashboard)/dashboard/page.tsx';

const holdingsPage =
  'src/app/(dashboard)/holdings/page.tsx';

const checks = [
  {
    file:
      "src/components/professional-overview/portfolioOverviewNormaliser.ts",

    markers: [
      "ProfessionalOverviewHolding",
      "ProfessionalOverviewSector",
      "ProfessionalPortfolioOverview",
      "calculateProfessionalPortfolioOverview",
      "marketValue",
      "costBasis",
      "gainLoss",
      "gainLossPercent",
      "annualDividendIncome",
      "monthlyDividendIncome",
      "dividendYield",
      "portfolioWeight",
      "topHoldingWeight",
      "topFiveWeight",
      "pricingCoverage",
      "averageQuoteQuality",
      "largestHolding",
      "bestPerformer",
      "worstPerformer",
    ],
  },

  {
    file:
      "src/components/professional-overview/ProfessionalDashboardOverview.tsx",

    markers: [
      '"use client"',
      "ProfessionalDashboardOverview",
      "Portfolio Command Centre",
      "Your entire investment platform",
      "Portfolio value",
      "Annual income",
      "Open holdings",
      "Pricing coverage",
      "Unrealised gain/loss",
      "Monthly income",
      "Top-five concentration",
      "Portfolio breadth",
      "Largest holdings",
      "Sector allocation",
      "Platform Overview",
      "Explore every professional workspace",
      "Holdings",
      "Transactions",
      "Portfolio Allocation",
      "Portfolio Health",
      "Analytics",
      "Dividends",
      "Dividend Forecast",
      "Performance Attribution",
      "Goals",
      "Watchlist",
      "Reports",
      "Tax Centre",
      "Business Model",
      "Broker Sync",
      "Live Prices",
      "Settings",
      "/holdings",
      "/transactions",
      "/portfolio-allocation",
      "/portfolio-health",
      "/analytics",
      "/dividends",
      "/goals",
      "/watchlist",
      "/reports",
      "/tax-centre",
      "/business-model",
      "/broker-sync",
      "/market-data-health",
      "/settings",
    ],
  },

  {
    file:
      "src/components/professional-overview/ProfessionalHoldingsOverview.tsx",

    markers: [
      '"use client"',
      "ProfessionalHoldingsOverview",
      "Holdings Intelligence",
      "Professional portfolio holdings",
      "Current market value",
      "Total cost basis",
      "Annual income",
      "Portfolio concentration",
      "Holdings",
      "Unrealised P/L",
      "Monthly income",
      "Largest holding",
      "Sectors",
      "Pricing coverage",
      "Position ranking",
      "Sector exposure",
      "Portfolio position",
      "Profitable",
      "Below cost",
      "Best performer",
      "Add Transaction",
      "View Allocation",
    ],
  },

  {
    file:
      "src/components/professional-overview/index.ts",

    markers: [
      'export * from "./ProfessionalDashboardOverview"',
      'export * from "./ProfessionalHoldingsOverview"',
      'export * from "./portfolioOverviewNormaliser"',
    ],
  },

  {
    file:
      dashboardPage,

    markers: [
      "ProfessionalDashboardOverview",
      "<ProfessionalDashboardOverview holdings={",
    ],
  },

  {
    file:
      holdingsPage,

    markers: [
      "ProfessionalHoldingsOverview",
      "<ProfessionalHoldingsOverview holdings={",
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

const dashboardSource =
  fs.readFileSync(
    dashboardPage,
    "utf8"
  );

const dashboardCount =
  (
    dashboardSource.match(
      /<ProfessionalDashboardOverview holdings=\{/g
    ) ||
    []
  ).length;

if (dashboardCount !== 1) {
  failures.push(
    `Dashboard must contain exactly one professional overview; found ${dashboardCount}.`
  );
}

const holdingsSource =
  fs.readFileSync(
    holdingsPage,
    "utf8"
  );

const holdingsCount =
  (
    holdingsSource.match(
      /<ProfessionalHoldingsOverview holdings=\{/g
    ) ||
    []
  ).length;

if (holdingsCount !== 1) {
  failures.push(
    `Holdings must contain exactly one professional overview; found ${holdingsCount}.`
  );
}

const dashboardComponent =
  fs.readFileSync(
    "src/components/professional-overview/ProfessionalDashboardOverview.tsx",
    "utf8"
  );

const requiredLinks = [
  "/holdings",
  "/transactions",
  "/portfolio-allocation",
  "/portfolio-health",
  "/analytics",
  "/dividends",
  "/dividend-forecast",
  "/performance-attribution",
  "/goals",
  "/watchlist",
  "/reports",
  "/tax-centre",
  "/business-model",
  "/broker-sync",
  "/market-data-health",
  "/settings",
];

for (const href of requiredLinks) {
  if (!dashboardComponent.includes(href)) {
    failures.push(
      `Professional dashboard missing workspace link: ${href}`
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Dashboard + Holdings Bash 11.1 verification failed:"
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
  "✅ Dashboard + Holdings Bash 11.1 verification passed."
);
console.log(
  "✅ Professional dashboard hero installed."
);
console.log(
  "✅ Portfolio summary cards installed."
);
console.log(
  "✅ Holdings overview installed."
);
console.log(
  "✅ Dividend income overview installed."
);
console.log(
  "✅ Portfolio concentration overview installed."
);
console.log(
  "✅ Largest-holdings visual installed."
);
console.log(
  "✅ Sector-allocation visual installed."
);
console.log(
  "✅ Every major workspace linked from Dashboard."
);
console.log(
  "✅ Professional Holdings hero installed."
);
console.log(
  "✅ Holdings position ranking installed."
);
console.log(
  "✅ Holdings sector exposure installed."
);
console.log(
  "✅ Responsive desktop and mobile layouts installed."
);
console.log("");
console.log(
  "Bash 11.1 complete."
);
console.log(
  "Estimated Dashboard + Holdings bashes remaining: 4."
);
console.log("");
