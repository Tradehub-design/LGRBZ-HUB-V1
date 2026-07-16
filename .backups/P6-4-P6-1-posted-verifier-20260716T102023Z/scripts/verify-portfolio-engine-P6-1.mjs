import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  analyticsContracts:
    "src/core/portfolio-engine/analytics/contracts.ts",

  analyticsBuild:
    "src/core/portfolio-engine/analytics/build.ts",

  analyticsReconcile:
    "src/core/portfolio-engine/analytics/reconcile.ts",

  reportsContracts:
    "src/core/portfolio-engine/reports/contracts.ts",

  reportsBuild:
    "src/core/portfolio-engine/reports/build.ts",

  taxContracts:
    "src/core/portfolio-engine/tax/contracts.ts",

  taxBuild:
    "src/core/portfolio-engine/tax/build.ts",

  hook:
    "src/core/portfolio-engine/client/usePortfolioIntelligence.ts",

  selectors:
    "src/core/portfolio-engine/client/intelligence-selectors.ts",

  clientIndex:
    "src/core/portfolio-engine/client/index.ts",

  rootIndex:
    "src/core/portfolio-engine/index.ts",
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

const analyticsContracts =
  read(files.analyticsContracts);

const analyticsBuild =
  read(files.analyticsBuild);

const analyticsReconcile =
  read(files.analyticsReconcile);

const reportsContracts =
  read(files.reportsContracts);

const reportsBuild =
  read(files.reportsBuild);

const taxContracts =
  read(files.taxContracts);

const taxBuild =
  read(files.taxBuild);

const hook =
  read(files.hook);

const selectors =
  read(files.selectors);

const clientIndex =
  read(files.clientIndex);

const rootIndex =
  read(files.rootIndex);

requireTokens(
  analyticsContracts,
  [
    "PortfolioAnalyticsSnapshot",
    "AnalyticsHoldingRank",
    "AnalyticsPerformanceBucket",
    "AnalyticsContributionSummary",
    "AnalyticsIncomeSummary",
  ],
  "Analytics contracts",
);

requireTokens(
  analyticsBuild,
  [
    "buildPortfolioAnalyticsSnapshot",
    "buildPerformanceAttribution",
    "input.dashboard.holdings",
    "input.dashboard.allocation",
    "input.dashboard.dividendsSummary",
    "input.dashboard.totals",
    "performanceBuckets",
    "holdingRanks",
  ],
  "Analytics builder",
);

requireTokens(
  analyticsReconcile,
  [
    "reconcilePortfolioAnalytics",
    "holdingReturnAud",
    "sectorReturnAud",
    "countryReturnAud",
    "strategyReturnAud",
    "holdingMarketValueAud",
  ],
  "Analytics reconciliation",
);

requireTokens(
  taxContracts,
  [
    "PortfolioTaxSnapshot",
    "TaxTransactionRow",
    "TaxFinancialYear",
  ],
  "Tax contracts",
);

requireTokens(
  taxBuild,
  [
    "buildPortfolioTaxSnapshot",
    "financialYearForDate",
    "transaction.status ===",
    "transaction.action",
    "transaction.amounts",
    "realisedCapitalGainAud",
    "dividendIncomeAud",
    "interestIncomeAud",
    "frankingCreditsAud",
    "withholdingTaxAud",
  ],
  "Tax builder",
);

requireTokens(
  reportsContracts,
  [
    "PortfolioReportSnapshot",
    "PortfolioAnalyticsSnapshot",
    "PortfolioTaxSnapshot",
  ],
  "Reports contracts",
);

requireTokens(
  reportsBuild,
  [
    "buildPortfolioReportSnapshot",
    "dashboard.totals",
    "dashboard.dividendsSummary",
    "input.analytics",
    "input.tax",
  ],
  "Reports builder",
);

requireTokens(
  hook,
  [
    "usePortfolioIntelligence",
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
    "selectPortfolioAnalytics",
    "selectAnalyticsWinners",
    "selectAnalyticsLosers",
    "selectAnalyticsSectorPerformance",
    "selectAnalyticsCountryPerformance",
    "selectAnalyticsStrategyPerformance",
    "selectAnalyticsReconciliation",
    "selectPortfolioTax",
    "selectPortfolioReports",
  ],
  "Intelligence selectors",
);

requireTokens(
  clientIndex,
  [
    "./usePortfolioIntelligence",
    "./intelligence-selectors",
  ],
  "Client exports",
);

requireTokens(
  rootIndex,
  [
    "./analytics",
    "./reports",
    "./tax",
  ],
  "Root engine exports",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock analytics/i,
  /mock report/i,
  /mock tax/i,
  /sample portfolio/i,
  /placeholder tax/i,
  /fake capital gain/i,
  /hardcoded portfolio return/i,
  /hardcoded tax payable/i,
];

for (
  const [
    name,
    content,
  ] of [
    [
      "analytics/build.ts",
      analyticsBuild,
    ],

    [
      "analytics/reconcile.ts",
      analyticsReconcile,
    ],

    [
      "reports/build.ts",
      reportsBuild,
    ],

    [
      "tax/build.ts",
      taxBuild,
    ],

    [
      "usePortfolioIntelligence.ts",
      hook,
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
    "Portfolio Engine P6.1 verification FAILED:",
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
  "Portfolio Engine P6.1 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Canonical analytics contract");
console.log(" - Holding performance analytics");
console.log(" - Sector performance analytics");
console.log(" - Industry performance analytics");
console.log(" - Country performance analytics");
console.log(" - Strategy performance analytics");
console.log(" - Platform performance analytics");
console.log(" - Winners and losers");
console.log(" - Contribution reconciliation");
console.log(" - Canonical income analytics");
console.log(" - Canonical tax contract");
console.log(" - Australian financial-year filtering");
console.log(" - Posted-transaction tax rows");
console.log(" - Dividend and interest income separation");
console.log(" - Franking and withholding separation");
console.log(" - Canonical report snapshot");
console.log(" - Unified Portfolio Intelligence hook");
console.log(" - No invented performance history");
console.log(" - No mock or placeholder values");
console.log("");
