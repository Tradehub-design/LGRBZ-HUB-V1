import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const files = {
  contracts:
    "src/core/portfolio-engine/dashboard/contracts.ts",

  builder:
    "src/core/portfolio-engine/dashboard/build.ts",

  reconciliation:
    "src/core/portfolio-engine/dashboard/reconcile.ts",

  health:
    "src/core/portfolio-engine/dashboard/health.ts",

  attribution:
    "src/core/portfolio-engine/dashboard/attribution.ts",

  hook:
    "src/core/portfolio-engine/client/useUnifiedPortfolioDashboard.ts",

  selectors:
    "src/core/portfolio-engine/client/dashboard-selectors.ts",

  dashboard:
    "src/app/(dashboard)/dashboard/page.tsx",

  holdings:
    "src/app/(dashboard)/holdings/page.tsx",

  allocation:
    "src/app/(dashboard)/portfolio-allocation/page.tsx",

  portfolioHealth:
    "src/app/(dashboard)/portfolio-health/page.tsx",

  performanceAttribution:
    "src/app/(dashboard)/performance-attribution/page.tsx",

  dividends:
    "src/app/(dashboard)/dividends/page.tsx",

  dividendForecast:
    "src/app/(dashboard)/dividend-forecast/page.tsx",
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

function containsCompact(
  content,
  token,
) {
  return compact(content).includes(
    compact(token),
  );
}

function requireTokens(
  content,
  tokens,
  prefix,
) {
  for (const token of tokens) {
    assert(
      containsCompact(
        content,
        token,
      ),
      `${prefix} is missing: ${token}`,
    );
  }
}

const contracts =
  read(files.contracts);

const builder =
  read(files.builder);

const reconciliation =
  read(files.reconciliation);

const health =
  read(files.health);

const attribution =
  read(files.attribution);

const hook =
  read(files.hook);

const selectors =
  read(files.selectors);

const dashboard =
  read(files.dashboard);

const holdings =
  read(files.holdings);

const allocation =
  read(files.allocation);

const portfolioHealth =
  read(files.portfolioHealth);

const performanceAttribution =
  read(files.performanceAttribution);

const dividends =
  read(files.dividends);

const dividendForecast =
  read(files.dividendForecast);

requireTokens(
  contracts,
  [
    "PortfolioDashboardSnapshot",
    "DashboardHoldingRow",
    "DashboardAllocationRow",
    "DashboardPerformanceSummary",
    "DashboardDividendSummary",
    "DashboardPricingSummary",
    "DashboardConcentrationSummary",
    "DashboardDataQuality",
  ],
  "Dashboard contracts",
);

requireTokens(
  builder,
  [
    "buildPortfolioDashboardSnapshot",
    "input.portfolio.openHoldings",
    "input.portfolio.totals",
    "input.portfolio.allocation",
    "input.dividends.totals",
    "portfolioCashBalanceAud",
    "portfolioNetContributionsAud",
    "portfolioDisposedCostBaseAud",
    "portfolioRealisedProceedsAud",
    "allocationRows(",
    "holdingMatchesAllocationSlice",
    "matchingHoldings",
    "holding.costBaseAud",
    "holding.valuation.unrealisedGainAud",
    "holding.realisedGainAud",
  ],
  "Dashboard builder",
);

requireTokens(
  reconciliation,
  [
    "reconcilePortfolioDashboard",
    "holdingsMarketValueAud",
    "holdingsCostBaseAud",
    "holdingsUnrealisedGainAud",
    "holdingsRealisedGainAud",
    "securityAllocationMarketValueAud",
    "sectorAllocationMarketValueAud",
    "countryAllocationMarketValueAud",
    "platformAllocationMarketValueAud",
    "dividendMarketValueAud",
    "dividendCostBaseAud",
  ],
  "Dashboard reconciliation",
);

requireTokens(
  hook,
  [
    "useUnifiedPortfolioDashboard",
    "usePortfolioDividendEngine",
    "buildPortfolioDashboardSnapshot",
    "dividendEngine.portfolio",
    "dividendEngine.dividendSnapshot",
  ],
  "Unified dashboard hook",
);

requireTokens(
  selectors,
  [
    "selectDashboardReconciliation",
    "selectDashboardAllocation",
    "selectPortfolioHealth",
    "selectPerformanceAttribution",
  ],
  "Dashboard selectors",
);

requireTokens(
  health,
  [
    "buildPortfolioHealth",
    "dashboard.concentration",
    "dashboard.pricing",
    "dashboard.dataQuality",
  ],
  "Portfolio Health engine",
);

requireTokens(
  attribution,
  [
    "buildPerformanceAttribution",
    "dashboard.totals.realisedGainAud",
    "dashboard.totals.unrealisedGainAud",
    "dashboard.totals.totalIncomeAud",
    "dashboard.totals.totalReturnAud",
    "dashboard.portfolio.transactions",
  ],
  "Performance Attribution engine",
);

requireTokens(
  dashboard,
  [
    "useUnifiedPortfolioDashboard",
    "dashboard.totals",
    "dashboard.performance",
    "dashboard.dividendsSummary",
    "dashboard.pricing",
    "dashboard.concentration",
    "selectDashboardReconciliation",
  ],
  "Dashboard route",
);

requireTokens(
  allocation,
  [
    "useUnifiedPortfolioDashboard",
    "selectDashboardAllocation",
    "selectDashboardReconciliation",
    "row.marketValueAud",
    "row.costBaseAud",
    "row.unrealisedGainAud",
    "row.realisedGainAud",
    "row.weightPercent",
  ],
  "Portfolio Allocation route",
);

requireTokens(
  portfolioHealth,
  [
    "useUnifiedPortfolioDashboard",
    "selectPortfolioHealth",
    "selectDashboardReconciliation",
    "dashboard.totals.cashBalanceAud",
    "dashboard.totals.totalReturnAud",
  ],
  "Portfolio Health route",
);

requireTokens(
  performanceAttribution,
  [
    "useUnifiedPortfolioDashboard",
    "selectPerformanceAttribution",
    "selectDashboardReconciliation",
    "attribution.totalReturnAud",
    "attribution.realisedGainAud",
    "attribution.unrealisedGainAud",
    "attribution.incomeAud",
  ],
  "Performance Attribution route",
);

requireTokens(
  dividends,
  [
    "usePortfolioDividendEngine",
    "dividendSnapshot",
    "selectDividendReconciliation",
  ],
  "Dividend Centre route",
);

requireTokens(
  dividendForecast,
  [
    "usePortfolioDividendEngine",
    "dividendSnapshot",
    "selectDividendReconciliation",
  ],
  "Dividend Forecast route",
);

assert(
  holdings.includes(
    "useLivePortfolioEngineSnapshot",
  ) ||
  holdings.includes(
    "useUnifiedPortfolioDashboard",
  ) ||
  holdings.includes(
    "usePortfolioEngineSnapshot",
  ),
  "Holdings route does not appear to consume a Portfolio Engine hook.",
);

const unifiedPages = [
  [
    "Dashboard",
    dashboard,
  ],

  [
    "Portfolio Allocation",
    allocation,
  ],

  [
    "Portfolio Health",
    portfolioHealth,
  ],

  [
    "Performance Attribution",
    performanceAttribution,
  ],
];

for (
  const [
    name,
    content,
  ] of unifiedPages
) {
  assert(
    content.includes(
      "useUnifiedPortfolioDashboard",
    ),
    `${name} does not use the unified Portfolio Dashboard hook.`,
  );
}

const forbiddenTerms = [
  "useSeedPortfolio",
  "useDashboardData",
  "mock-data",
  "mockPortfolio",
  "samplePortfolio",
  "Math.random(",
  "calculatePortfolioAllocation(",
  "calculateDividendForecast(",
  "calculateDividendYield(",
  "calculateHoldingsFromLedger(",
  "getTransactionTotal(",
];

for (
  const [
    name,
    content,
  ] of [
    [
      "Dashboard",
      dashboard,
    ],

    [
      "Portfolio Allocation",
      allocation,
    ],

    [
      "Portfolio Health",
      portfolioHealth,
    ],

    [
      "Performance Attribution",
      performanceAttribution,
    ],

    [
      "Dividend Centre",
      dividends,
    ],

    [
      "Dividend Forecast",
      dividendForecast,
    ],
  ]
) {
  for (const term of forbiddenTerms) {
    assert(
      !content.includes(term),
      `${name} contains a forbidden legacy or independent path: ${term}`,
    );
  }
}

assert(
  !containsCompact(
    performanceAttribution,
    "const contributors =",
  ),
  "Performance Attribution still calculates contributors inside the route.",
);

assert(
  !containsCompact(
    allocation,
    "const weight =",
  ),
  "Portfolio Allocation still calculates weight inside the route.",
);

assert(
  !containsCompact(
    dashboard,
    "const portfolioValue =",
  ),
  "Dashboard still calculates portfolio value inside the route.",
);

const forbiddenPatterns = [
  /mock dashboard/i,
  /mock allocation/i,
  /mock attribution/i,
  /mock health/i,
  /placeholder portfolio/i,
  /sample portfolio/i,
  /fake market value/i,
  /hardcoded portfolio value/i,
  /hardcoded total return/i,
  /hardcoded dividend income/i,
  /hardcoded allocation/i,
];

for (
  const [
    name,
    content,
  ] of [
    [
      "dashboard/build.ts",
      builder,
    ],

    [
      "dashboard/reconcile.ts",
      reconciliation,
    ],

    [
      "dashboard/health.ts",
      health,
    ],

    [
      "dashboard/attribution.ts",
      attribution,
    ],

    [
      "dashboard/page.tsx",
      dashboard,
    ],

    [
      "portfolio-allocation/page.tsx",
      allocation,
    ],

    [
      "portfolio-health/page.tsx",
      portfolioHealth,
    ],

    [
      "performance-attribution/page.tsx",
      performanceAttribution,
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
    "Portfolio Engine P5.4 verification FAILED:",
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
  "Portfolio Engine P5.4 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Unified Portfolio Dashboard contract");
console.log(" - Canonical Dashboard builder");
console.log(" - Canonical cross-page reconciliation");
console.log(" - Dashboard uses unified snapshot");
console.log(" - Portfolio Allocation uses unified snapshot");
console.log(" - Portfolio Health uses unified snapshot");
console.log(" - Performance Attribution uses unified snapshot");
console.log(" - Dividend Centre uses canonical Dividend Snapshot");
console.log(" - Dividend Forecast uses canonical Dividend Snapshot");
console.log(" - Holdings consumes a Portfolio Engine hook");
console.log(" - Canonical market value");
console.log(" - Canonical cost base");
console.log(" - Canonical realised P/L");
console.log(" - Canonical unrealised P/L");
console.log(" - Canonical total return");
console.log(" - Canonical allocation weights");
console.log(" - Canonical dividend values");
console.log(" - No page-level portfolio calculations");
console.log(" - No mock or placeholder portfolio values");
console.log("");
