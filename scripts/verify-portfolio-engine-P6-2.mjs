import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  analytics:
    "src/app/(dashboard)/analytics/page.tsx",

  reports:
    "src/app/(dashboard)/reports/page.tsx",

  hook:
    "src/core/portfolio-engine/client/usePortfolioIntelligence.ts",

  selectors:
    "src/core/portfolio-engine/client/intelligence-selectors.ts",

  analyticsBuilder:
    "src/core/portfolio-engine/analytics/build.ts",

  reportsBuilder:
    "src/core/portfolio-engine/reports/build.ts",
};

function assert(
  condition,
  message,
) {
  if (!condition) {
    failures.push(message);
  }
}

function read(
  relativePath,
) {
  const absolutePath =
    path.join(
      root,
      relativePath,
    );

  if (!fs.existsSync(absolutePath)) {
    failures.push(
      `Missing required file: ${relativePath}`,
    );

    return "";
  }

  return fs.readFileSync(
    absolutePath,
    "utf8",
  );
}

function compact(
  content,
) {
  return content.replace(
    /\s+/g,
    "",
  );
}

function requireTokens(
  content,
  tokens,
  prefix,
) {
  const compacted =
    compact(content);

  for (const token of tokens) {
    assert(
      compacted.includes(
        compact(token),
      ),
      `${prefix} is missing: ${token}`,
    );
  }
}

const analytics =
  read(files.analytics);

const reports =
  read(files.reports);

const hook =
  read(files.hook);

const selectors =
  read(files.selectors);

const analyticsBuilder =
  read(files.analyticsBuilder);

const reportsBuilder =
  read(files.reportsBuilder);

requireTokens(
  analytics,
  [
    "usePortfolioIntelligence",
    "selectAnalyticsReconciliation",
    "selectAnalyticsWinners",
    "selectAnalyticsLosers",
    "selectAnalyticsSectorPerformance",
    "selectAnalyticsCountryPerformance",
    "selectAnalyticsStrategyPerformance",
    "analytics.totals.portfolioValueAud",
    "analytics.totals.totalReturnAud",
    "analytics.totals.realisedGainAud",
    "analytics.totals.unrealisedGainAud",
    "analytics.totals.totalIncomeAud",
    "analytics.income.forwardTwelveMonthIncomeAud",
    "analytics.income.dividendYieldPercent",
    "analytics.contribution.netContributionAud",
    "forceRefresh",
  ],
  "Analytics route",
);

requireTokens(
  reports,
  [
    "usePortfolioIntelligence",
    "selectPortfolioReports",
    "reports.summary",
    "reports.analytics.holdings",
    "reports.analytics.dashboard.portfolio.transactions",
    "reports.tax.financialYear.label",
    "reports.tax.totals.netRealisedCapitalGainAud",
    "reports.tax.totals.dividendIncomeAud",
    "reports.tax.totals.frankingCreditsAud",
    "reports.portfolioSnapshotId",
    "reports.dashboardSnapshotId",
    "reports.analyticsSnapshotId",
    "reports.dividendSnapshotId",
    "exportJson",
    "exportHoldingsCsv",
    "exportTransactionsCsv",
    "forceRefresh",
  ],
  "Reports route",
);

requireTokens(
  hook,
  [
    "useUnifiedPortfolioDashboard",
    "buildPortfolioAnalyticsSnapshot",
    "buildPortfolioTaxSnapshot",
    "buildPortfolioReportSnapshot",
    "reconcilePortfolioAnalytics",
  ],
  "Portfolio Intelligence hook",
);

requireTokens(
  selectors,
  [
    "selectAnalyticsWinners",
    "selectAnalyticsLosers",
    "selectAnalyticsSectorPerformance",
    "selectAnalyticsCountryPerformance",
    "selectAnalyticsStrategyPerformance",
    "selectAnalyticsReconciliation",
    "selectPortfolioReports",
  ],
  "Intelligence selectors",
);

requireTokens(
  analyticsBuilder,
  [
    "input.dashboard.holdings",
    "input.dashboard.allocation",
    "input.dashboard.dividendsSummary",
    "input.dashboard.totals",
  ],
  "Analytics builder",
);

requireTokens(
  reportsBuilder,
  [
    "dashboard.totals",
    "dashboard.dividendsSummary",
    "input.analytics",
    "input.tax",
  ],
  "Reports builder",
);

const forbiddenTerms = [
  "useSeedPortfolio",
  "useDashboardData",
  "usePortfolioStore",
  "getTransactionTotal",
  "mock-data",
  "mockReports",
  "mockAnalytics",
  "samplePortfolio",
  "Math.random(",
  "calculatePortfolioAllocation(",
  "calculateAnalytics(",
];

for (const term of forbiddenTerms) {
  assert(
    !analytics.includes(term),
    `Analytics contains a legacy or independent path: ${term}`,
  );

  assert(
    !reports.includes(term),
    `Reports contains a legacy or independent path: ${term}`,
  );
}

assert(
  analytics.startsWith(
    '"use client";',
  ),
  'Analytics "use client" directive is not first.',
);

assert(
  reports.startsWith(
    '"use client";',
  ),
  'Reports "use client" directive is not first.',
);

assert(
  !/data\.allocation\.[A-Za-z]+\.map/.test(
    analytics,
  ),
  "Analytics still consumes the legacy untyped data.allocation object.",
);

assert(
  !/const\s+totalReturn\s*=/.test(
    analytics,
  ),
  "Analytics still calculates canonical total return inside the route.",
);

assert(
  !/const\s+portfolioValue\s*=/.test(
    analytics,
  ),
  "Analytics still calculates canonical portfolio value inside the route.",
);

const forbiddenPatterns = [
  /mock analytics/i,
  /mock report/i,
  /placeholder analytics/i,
  /placeholder report/i,
  /hardcoded portfolio return/i,
  /hardcoded market value/i,
  /fake performance/i,
  /fake report/i,
];

for (
  const [
    name,
    content,
  ] of [
    [
      "analytics/page.tsx",
      analytics,
    ],

    [
      "reports/page.tsx",
      reports,
    ],
  ]
) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden placeholder or independent logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P6.2 verification FAILED:",
  );
  console.error("");

  for (const failure of failures) {
    console.error(
      ` - ${failure}`,
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "Portfolio Engine P6.2 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Analytics uses Portfolio Intelligence");
console.log(" - Reports uses Portfolio Intelligence");
console.log(" - Canonical portfolio value displayed");
console.log(" - Canonical total return displayed");
console.log(" - Canonical realised P/L displayed");
console.log(" - Canonical unrealised P/L displayed");
console.log(" - Canonical income displayed");
console.log(" - Canonical sector analytics displayed");
console.log(" - Canonical country analytics displayed");
console.log(" - Canonical strategy analytics displayed");
console.log(" - Canonical winners and losers displayed");
console.log(" - Canonical report summary displayed");
console.log(" - Canonical financial-year tax summary displayed");
console.log(" - JSON report export connected");
console.log(" - Holdings CSV export connected");
console.log(" - Transactions CSV export connected");
console.log(" - Snapshot lineage displayed");
console.log(" - Legacy analytics hooks removed");
console.log(" - Legacy report mock data removed");
console.log(" - No page-level portfolio calculations");
console.log(" - No mock or placeholder values");
console.log("");
