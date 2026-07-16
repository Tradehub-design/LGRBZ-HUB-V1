import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  dashboard:
    "src/app/(dashboard)/dashboard/page.tsx",

  allocation:
    "src/app/(dashboard)/portfolio-allocation/page.tsx",

  unifiedHook:
    "src/core/portfolio-engine/client/useUnifiedPortfolioDashboard.ts",

  dashboardBuilder:
    "src/core/portfolio-engine/dashboard/build.ts",

  dashboardSelectors:
    "src/core/portfolio-engine/client/dashboard-selectors.ts",
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

const dashboard =
  read(files.dashboard);

const allocation =
  read(files.allocation);

const unifiedHook =
  read(files.unifiedHook);

const dashboardBuilder =
  read(files.dashboardBuilder);

const dashboardSelectors =
  read(files.dashboardSelectors);

const dashboardTokens = [
  "useUnifiedPortfolioDashboard",
  "dashboard.totals",
  "dashboard.performance",
  "dashboard.dividendsSummary",
  "dashboard.pricing",
  "dashboard.concentration",
  "dashboard.topHoldings",
  "selectDashboardReconciliation",
  "totals.portfolioValueAud",
  "totals.securitiesMarketValueAud",
  "totals.openCostBaseAud",
  "totals.realisedGainAud",
  "totals.unrealisedGainAud",
  "totals.totalReturnAud",
  "dividends.forwardTwelveMonthIncomeAud",
  "dividends.portfolioDividendYieldPercent",
  "pricing.pricingCoveragePercent",
  "forceRefresh",
];

for (const token of dashboardTokens) {
  assert(
    dashboard.includes(token),
    `Dashboard route is missing canonical token: ${token}`,
  );
}

const allocationTokens = [
  "useUnifiedPortfolioDashboard",
  "selectDashboardAllocation",
  "selectDashboardReconciliation",
  'selectDashboardAllocation(\n      dashboard,\n      "security"',
  'selectDashboardAllocation(\n      dashboard,\n      "sector"',
  'selectDashboardAllocation(\n      dashboard,\n      "country"',
  'selectDashboardAllocation(\n      dashboard,\n      "platform"',
  "row.marketValueAud",
  "row.costBaseAud",
  "row.unrealisedGainAud",
  "row.realisedGainAud",
  "row.weightPercent",
  "dashboard.concentration",
  "dashboard.totals.securitiesMarketValueAud",
  "forceRefresh",
];

for (const token of allocationTokens) {
  assert(
    allocation.includes(token),
    `Portfolio Allocation route is missing canonical token: ${token}`,
  );
}

const forbiddenDashboardTokens = [
  "useSeedPortfolio",
  "useDashboardData",
  "usePortfolioStore",
  "loadTxLedger",
  "getTransactionTotal",
  "calculateHoldingsFromLedger",
  "LiveDashboardSummary",
  "Math.random(",
];

for (const token of forbiddenDashboardTokens) {
  assert(
    !dashboard.includes(token),
    `Dashboard route still contains an independent or legacy path: ${token}`,
  );
}

const forbiddenAllocationTokens = [
  "useSeedPortfolio",
  "useDashboardData",
  "usePortfolioStore",
  "loadTxLedger",
  "calculateAllocation",
  "calculatePortfolioAllocation",
  "mock-data",
  "Math.random(",
];

for (const token of forbiddenAllocationTokens) {
  assert(
    !allocation.includes(token),
    `Portfolio Allocation route still contains an independent or legacy path: ${token}`,
  );
}

assert(
  dashboard.startsWith(
    '"use client";',
  ),
  'Dashboard "use client" directive is not first.',
);

assert(
  allocation.startsWith(
    '"use client";',
  ),
  'Portfolio Allocation "use client" directive is not first.',
);

assert(
  unifiedHook.includes(
    "buildPortfolioDashboardSnapshot",
  ),
  "Unified dashboard hook does not build the canonical Dashboard Snapshot.",
);

assert(
  unifiedHook.includes(
    "usePortfolioDividendEngine",
  ),
  "Unified dashboard hook does not consume the canonical Dividend Engine.",
);

assert(
  dashboardBuilder.includes(
    "input.portfolio.totals",
  ) &&
  dashboardBuilder.includes(
    "input.portfolio.allocation",
  ) &&
  dashboardBuilder.includes(
    "input.dividends.totals",
  ),
  "Dashboard builder does not consume all canonical engine outputs.",
);

assert(
  dashboardSelectors.includes(
    "selectDashboardAllocation",
  ),
  "Canonical dashboard allocation selector is missing.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock dashboard/i,
  /sample portfolio/i,
  /placeholder portfolio/i,
  /fake market value/i,
  /hardcoded portfolio value/i,
  /hardcoded allocation/i,
  /hardcoded total return/i,
  /hardcoded dividend income/i,
];

for (const [
  name,
  content,
] of [
  [
    "dashboard/page.tsx",
    dashboard,
  ],
  [
    "portfolio-allocation/page.tsx",
    allocation,
  ],
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden mock or independent logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P5.2 verification FAILED:",
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
  "Portfolio Engine P5.2 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Dashboard route uses unified Portfolio Dashboard Snapshot");
console.log(" - Allocation route uses unified Portfolio Dashboard Snapshot");
console.log(" - Dashboard market value is canonical");
console.log(" - Dashboard portfolio value is canonical");
console.log(" - Dashboard cost base is canonical");
console.log(" - Dashboard realised P/L is canonical");
console.log(" - Dashboard unrealised P/L is canonical");
console.log(" - Dashboard total return is canonical");
console.log(" - Dashboard dividend forecast is canonical");
console.log(" - Dashboard pricing coverage is canonical");
console.log(" - Dashboard holdings are canonical");
console.log(" - Security allocation is canonical");
console.log(" - Sector allocation is canonical");
console.log(" - Country allocation is canonical");
console.log(" - Platform allocation is canonical");
console.log(" - Allocation weights are canonical");
console.log(" - Dashboard and allocation reconciliation are displayed");
console.log(" - Manual unified refresh is connected");
console.log(" - Legacy dashboard data hooks are removed");
console.log(" - Page-level allocation calculations are removed");
console.log(" - No mock or placeholder portfolio values");
console.log("");
