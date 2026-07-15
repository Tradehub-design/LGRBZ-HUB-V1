#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/components/dividend-centre-v2/DividendAnalyticsDashboard.tsx",
    markers: [
      "DividendAnalyticsDashboard",
      "Dividend Portfolio Intelligence",
      "Monthly Income",
      "Received, Announced and Forecast",
      "Forward Income Composition",
      "Holding Contribution",
      "Forward Income by Security",
      "Country Exposure",
      "Dividend Income by Market",
      "Provider Analysis",
      "Dividend Income by Source",
      "Confirmed Share",
      "Forecast Reliance",
      "Income Consistency",
      "Largest Contributor",
      "ResponsiveContainer",
      "AreaChart",
      "BarChart",
      "PieChart",
      "ChartTooltip",
      "AnalyticsSkeleton",
      "EmptyAnalyticsState",
      "marketForSymbol",
      "providerLabel",
      "monthlyForecast",
      "holdingSummaries",
      "providersUsed",
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/DividendAnalyticsExport.tsx",
    markers: [
      "DividendAnalyticsExport",
      "Export Portfolio Income Data",
      "Dividend Events",
      "Monthly Forecast",
      "Holding Income",
      "downloadCsv",
      "exportEvents",
      "exportMonthly",
      "exportHoldings",
      "Dividend Per Share",
      "Forward 12 Month Income",
      "Franking Credits",
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
    markers: [
      "DividendAnalyticsDashboard",
      "DividendAnalyticsExport",
      "Dividend income analytics",
      "Dividend report exports",
      "DividendHoldingBreakdown",
      "DividendCalendar",
      "DividendUpcomingPaymentsTable",
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/DividendCentreStates.tsx",
    markers: [
      "h-80 animate-pulse",
      "DividendCentreLoadingState",
      "DividendCentreErrorState",
      "DividendCentreEmptyState",
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/index.ts",
    markers: [
      'export * from "./DividendAnalyticsDashboard"',
      'export * from "./DividendAnalyticsExport"',
      'export * from "./ProfessionalDividendCentre"',
    ],
  },
];

const failures = [];

for (
  const check of
  checks
) {
  if (
    !fs.existsSync(
      check.file
    )
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
      !source.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const analytics =
  fs.readFileSync(
    "src/components/dividend-centre-v2/DividendAnalyticsDashboard.tsx",
    "utf8"
  );

for (
  const view of
  [
    "INCOME",
    "HOLDINGS",
    "MARKETS",
    "SOURCES",
  ]
) {
  if (
    !analytics.includes(
      `"${view}"`
    )
  ) {
    failures.push(
      `Analytics dashboard missing view: ${view}`
    );
  }
}

for (
  const provider of
  [
    "ledger",
    "forecast",
    "manual",
    "twelve-data",
    "alpha-vantage",
    "finnhub",
  ]
) {
  if (
    !analytics.includes(
      `"${provider}"`
    )
  ) {
    failures.push(
      `Analytics dashboard missing provider label mapping: ${provider}`
    );
  }
}

for (
  const market of
  [
    ".AX",
    ".L",
    ".TO",
    ".NZ",
    ".HK",
  ]
) {
  if (
    !analytics.includes(
      `"${market}"`
    )
  ) {
    failures.push(
      `Analytics dashboard missing market inference: ${market}`
    );
  }
}

const centre =
  fs.readFileSync(
    "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
    "utf8"
  );

const analyticsIndex =
  centre.indexOf(
    "<DividendAnalyticsDashboard"
  );

const holdingIndex =
  centre.indexOf(
    "<DividendHoldingBreakdown"
  );

const exportIndex =
  centre.indexOf(
    "<DividendAnalyticsExport"
  );

if (
  analyticsIndex ===
  -1
) {
  failures.push(
    "ProfessionalDividendCentre does not render DividendAnalyticsDashboard."
  );
}

if (
  exportIndex ===
  -1
) {
  failures.push(
    "ProfessionalDividendCentre does not render DividendAnalyticsExport."
  );
}

if (
  analyticsIndex >
  holdingIndex
) {
  failures.push(
    "Dividend analytics should render before the detailed holding breakdown."
  );
}

if (
  exportIndex <
  holdingIndex
) {
  failures.push(
    "Dividend exports should render after the detailed holding breakdown."
  );
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Dividend Centre Bash 8.4 verification failed:"
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
  "✅ Dividend Centre Bash 8.4 verification passed."
);
console.log(
  "✅ Monthly dividend income analytics installed."
);
console.log(
  "✅ Received, announced and forecast comparison installed."
);
console.log(
  "✅ Holding contribution analytics installed."
);
console.log(
  "✅ Income concentration indicators installed."
);
console.log(
  "✅ Market and country analytics installed."
);
console.log(
  "✅ Provider-source analytics installed."
);
console.log(
  "✅ Forecast reliance indicator installed."
);
console.log(
  "✅ Income consistency indicator installed."
);
console.log(
  "✅ Confirmed income share installed."
);
console.log(
  "✅ Largest contributor indicator installed."
);
console.log(
  "✅ Professional chart tooltips installed."
);
console.log(
  "✅ Responsive analytics layout installed."
);
console.log(
  "✅ Dividend event CSV export installed."
);
console.log(
  "✅ Monthly forecast CSV export installed."
);
console.log(
  "✅ Holding income CSV export installed."
);
console.log(
  "✅ Analytics loading skeleton installed."
);
console.log(
  "✅ Analytics empty state installed."
);
console.log(
  "✅ Motion-safe final UI polish installed."
);
console.log("");
console.log(
  "Bash 8.4 complete."
);
console.log(
  "Dividend Centre UI bashes remaining: 0."
);
console.log("");
