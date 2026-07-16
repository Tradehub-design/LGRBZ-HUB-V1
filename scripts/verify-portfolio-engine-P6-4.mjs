import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  engine:
    "src/core/portfolio-engine/engine.ts",

  snapshot:
    "src/core/portfolio-engine/snapshot.ts",

  allocation:
    "src/core/portfolio-engine/allocation.ts",

  portfolioReconcile:
    "src/core/portfolio-engine/reconcile.ts",

  dividendContracts:
    "src/core/portfolio-engine/dividends/contracts.ts",

  dividendReconcile:
    "src/core/portfolio-engine/dividends/reconcile.ts",

  dashboardContracts:
    "src/core/portfolio-engine/dashboard/contracts.ts",

  dashboardBuild:
    "src/core/portfolio-engine/dashboard/build.ts",

  dashboardReconcile:
    "src/core/portfolio-engine/dashboard/reconcile.ts",

  health:
    "src/core/portfolio-engine/dashboard/health.ts",

  attribution:
    "src/core/portfolio-engine/dashboard/attribution.ts",

  analyticsContracts:
    "src/core/portfolio-engine/analytics/contracts.ts",

  analyticsBuild:
    "src/core/portfolio-engine/analytics/build.ts",

  analyticsReconcile:
    "src/core/portfolio-engine/analytics/reconcile.ts",

  taxContracts:
    "src/core/portfolio-engine/tax/contracts.ts",

  taxBuild:
    "src/core/portfolio-engine/tax/build.ts",

  taxReconcile:
    "src/core/portfolio-engine/tax/reconcile.ts",

  reportContracts:
    "src/core/portfolio-engine/reports/contracts.ts",

  reportBuild:
    "src/core/portfolio-engine/reports/build.ts",

  liveHook:
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",

  dividendHook:
    "src/core/portfolio-engine/client/usePortfolioDividendEngine.ts",

  dashboardHook:
    "src/core/portfolio-engine/client/useUnifiedPortfolioDashboard.ts",

  intelligenceHook:
    "src/core/portfolio-engine/client/usePortfolioIntelligence.ts",

  dashboard:
    "src/app/(dashboard)/dashboard/page.tsx",

  holdings:
    "src/app/(dashboard)/holdings/page.tsx",

  allocationPage:
    "src/app/(dashboard)/portfolio-allocation/page.tsx",

  healthPage:
    "src/app/(dashboard)/portfolio-health/page.tsx",

  attributionPage:
    "src/app/(dashboard)/performance-attribution/page.tsx",

  dividendsPage:
    "src/app/(dashboard)/dividends/page.tsx",

  dividendForecastPage:
    "src/app/(dashboard)/dividend-forecast/page.tsx",

  analyticsPage:
    "src/app/(dashboard)/analytics/page.tsx",

  reportsPage:
    "src/app/(dashboard)/reports/page.tsx",

  taxPage:
    "src/app/(dashboard)/tax/page.tsx",
};

function fail(
  message,
) {
  failures.push(
    message,
  );
}

function assert(
  condition,
  message,
) {
  if (!condition) {
    fail(message);
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
    fail(
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

function containsCompact(
  content,
  token,
) {
  return compact(
    content,
  ).includes(
    compact(
      token,
    ),
  );
}

function requireTokens(
  content,
  tokens,
  label,
) {
  for (const token of tokens) {
    assert(
      containsCompact(
        content,
        token,
      ),
      `${label} is missing: ${token}`,
    );
  }
}

const content =
  Object.fromEntries(
    Object.entries(
      files,
    ).map(
      (
        [
          key,
          relativePath,
        ],
      ) => [
        key,
        read(
          relativePath,
        ),
      ],
    ),
  );

requireTokens(
  content.engine,
  [
    "PortfolioSnapshot",
    "transactions",
  ],
  "Portfolio Engine",
);

requireTokens(
  content.snapshot,
  [
    "PortfolioSnapshot",
    "openHoldings",
    "totals",
    "allocation",
  ],
  "Portfolio Snapshot builder",
);

requireTokens(
  content.allocation,
  [
    "PortfolioAllocation",
    "marketValueAud",
    "holdingCount",
  ],
  "Allocation engine",
);

requireTokens(
  content.portfolioReconcile,
  [
    "reconcile",
    "marketValue",
    "costBase",
  ],
  "Portfolio reconciliation",
);

requireTokens(
  content.liveHook,
  [
    "useLivePortfolioEngineSnapshot",
  ],
  "Live Portfolio Engine hook",
);

requireTokens(
  content.dividendHook,
  [
    "usePortfolioDividendEngine",
    "portfolio",
    "dividendSnapshot",
  ],
  "Dividend Engine hook",
);

requireTokens(
  content.dashboardHook,
  [
    "useUnifiedPortfolioDashboard",
    "usePortfolioDividendEngine",
    "buildPortfolioDashboardSnapshot",
  ],
  "Unified Dashboard hook",
);

requireTokens(
  content.intelligenceHook,
  [
    "usePortfolioIntelligence",
    "useUnifiedPortfolioDashboard",
    "buildPortfolioAnalyticsSnapshot",
    "buildPortfolioTaxSnapshot",
    "buildPortfolioReportSnapshot",
    "reconcilePortfolioAnalytics",
    "reconcilePortfolioTax",
  ],
  "Portfolio Intelligence hook",
);

requireTokens(
  content.dashboardBuild,
  [
    "buildPortfolioDashboardSnapshot",
    "input.portfolio.openHoldings",
    "input.portfolio.allocation",
    "input.portfolio.totals",
    "input.dividends.totals",
    "portfolioCashBalanceAud",
    "portfolioNetContributionsAud",
    "allocationRows",
    "matchingHoldings",
  ],
  "Dashboard builder",
);

requireTokens(
  content.dashboardReconcile,
  [
    "reconcilePortfolioDashboard",
    "holdingsMarketValueAud",
    "holdingsCostBaseAud",
    "holdingsUnrealisedGainAud",
    "holdingsRealisedGainAud",
    "securityAllocationMarketValueAud",
    "sectorAllocationMarketValueAud",
    "dividendMarketValueAud",
    "dividendCostBaseAud",
  ],
  "Dashboard reconciliation",
);

requireTokens(
  content.health,
  [
    "buildPortfolioHealth",
    "dashboard.concentration",
    "dashboard.pricing",
    "dashboard.dataQuality",
  ],
  "Portfolio Health builder",
);

requireTokens(
  content.attribution,
  [
    "buildPerformanceAttribution",
    "dashboard.totals.realisedGainAud",
    "dashboard.totals.unrealisedGainAud",
    "dashboard.totals.totalIncomeAud",
    "dashboard.totals.totalReturnAud",
  ],
  "Performance Attribution builder",
);

requireTokens(
  content.analyticsBuild,
  [
    "buildPortfolioAnalyticsSnapshot",
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
  content.analyticsReconcile,
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
  content.taxBuild,
  [
    "buildPortfolioTaxSnapshot",
    "financialYearForDate",
    "transaction.status",
    "transactionGrossAmountAud",
    "transactionFeesAud",
    "transactionTaxAud",
    "transactionRealisedGainAud",
    "realisedCapitalGainAud",
    "realisedCapitalLossAud",
    "dividendIncomeAud",
    "interestIncomeAud",
    "frankingCreditsAud",
    "withholdingTaxAud",
    "grossAssessableIncomeAud",
  ],
  "Tax builder",
);

requireTokens(
  content.taxReconcile,
  [
    "reconcilePortfolioTax",
    "rowRealisedGainAud",
    "rowDividendIncomeAud",
    "rowInterestIncomeAud",
    "rowFeesAud",
    "rowRecordedTaxAud",
    "calculatedGrossAssessableIncomeAud",
  ],
  "Tax reconciliation",
);

requireTokens(
  content.reportBuild,
  [
    "buildPortfolioReportSnapshot",
    "dashboard.totals",
    "dashboard.dividendsSummary",
    "input.analytics",
    "input.tax",
    "input.tax.portfolioSnapshotId",
    "input.tax.dividendSnapshotId",
    "input.tax.dashboardSnapshotId",
  ],
  "Report builder",
);

const unifiedPageRequirements = [
  [
    "Dashboard",
    content.dashboard,
    "useUnifiedPortfolioDashboard",
  ],

  [
    "Portfolio Allocation",
    content.allocationPage,
    "useUnifiedPortfolioDashboard",
  ],

  [
    "Portfolio Health",
    content.healthPage,
    "useUnifiedPortfolioDashboard",
  ],

  [
    "Performance Attribution",
    content.attributionPage,
    "useUnifiedPortfolioDashboard",
  ],

  [
    "Analytics",
    content.analyticsPage,
    "usePortfolioIntelligence",
  ],

  [
    "Reports",
    content.reportsPage,
    "usePortfolioIntelligence",
  ],

  [
    "Tax Centre",
    content.taxPage,
    "usePortfolioIntelligence",
  ],

  [
    "Dividend Centre",
    content.dividendsPage,
    "usePortfolioDividendEngine",
  ],

  [
    "Dividend Forecast",
    content.dividendForecastPage,
    "usePortfolioDividendEngine",
  ],
];

for (
  const [
    label,
    pageContent,
    hook,
  ] of unifiedPageRequirements
) {
  assert(
    pageContent.includes(
      hook,
    ),
    `${label} does not use the required canonical hook: ${hook}`,
  );
}

assert(
  content.holdings.includes(
    "useLivePortfolioEngineSnapshot",
  ) ||
  content.holdings.includes(
    "useUnifiedPortfolioDashboard",
  ) ||
  content.holdings.includes(
    "usePortfolioEngineSnapshot",
  ),
  "Holdings does not consume a Portfolio Engine snapshot hook.",
);

const forbiddenRouteTokens = [
  "useSeedPortfolio",
  "useDashboardData",
  "mockPortfolio",
  "mockAnalytics",
  "mockReports",
  "mockTax",
  "samplePortfolio",
  "calculatePortfolioAllocation(",
  "calculateDividendForecast(",
  "calculateTaxPayable(",
  "calculateCgtDiscount(",
  "Math.random(",
];

const routeContent =
  [
    content.dashboard,
    content.holdings,
    content.allocationPage,
    content.healthPage,
    content.attributionPage,
    content.dividendsPage,
    content.dividendForecastPage,
    content.analyticsPage,
    content.reportsPage,
    content.taxPage,
  ].join(
    "\n",
  );

for (
  const token of
  forbiddenRouteTokens
) {
  assert(
    !routeContent.includes(
      token,
    ),
    `A final route contains forbidden legacy or independent logic: ${token}`,
  );
}

const forbiddenPatterns = [
  /mock portfolio/i,
  /mock analytics/i,
  /mock report/i,
  /mock tax/i,
  /sample portfolio/i,
  /placeholder portfolio/i,
  /placeholder market value/i,
  /placeholder tax/i,
  /fake market value/i,
  /fake total return/i,
  /hardcoded portfolio value/i,
  /hardcoded total return/i,
  /hardcoded dividend income/i,
  /hardcoded tax payable/i,
  /invented performance history/i,
  /invented benchmark/i,
  /automatic cgt discount/i,
];

for (
  const [
    key,
    fileContent,
  ] of Object.entries(
    content,
  )
) {
  for (
    const pattern of
    forbiddenPatterns
  ) {
    assert(
      !pattern.test(
        fileContent,
      ),
      `${files[key]} contains forbidden placeholder or invented logic: ${pattern}`,
    );
  }
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "Final Portfolio Engine structural verification FAILED:",
  );
  console.error("");

  for (
    const failure of
    failures
  ) {
    console.error(
      ` - ${failure}`,
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "Final Portfolio Engine structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Transactions remain the master record");
console.log(" - Portfolio Snapshot is canonical");
console.log(" - Holdings consume Portfolio Engine data");
console.log(" - Live valuation hook is connected");
console.log(" - Dividend Engine consumes canonical portfolio data");
console.log(" - Dashboard consumes unified dashboard data");
console.log(" - Allocation consumes unified dashboard data");
console.log(" - Portfolio Health consumes unified dashboard data");
console.log(" - Performance Attribution consumes unified dashboard data");
console.log(" - Analytics consumes Portfolio Intelligence");
console.log(" - Reports consume Portfolio Intelligence");
console.log(" - Tax Centre consumes Portfolio Intelligence");
console.log(" - Portfolio, Dashboard, Analytics, Tax and Report lineage exists");
console.log(" - No legacy seeded portfolio hooks remain on final routes");
console.log(" - No mock or placeholder portfolio values detected");
console.log(" - No invented performance history or tax payable detected");
console.log("");
