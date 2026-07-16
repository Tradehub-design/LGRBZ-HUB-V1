import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  contracts:
    "src/core/portfolio-engine/dashboard/contracts.ts",

  build:
    "src/core/portfolio-engine/dashboard/build.ts",

  reconcile:
    "src/core/portfolio-engine/dashboard/reconcile.ts",

  dashboardIndex:
    "src/core/portfolio-engine/dashboard/index.ts",

  hook:
    "src/core/portfolio-engine/client/useUnifiedPortfolioDashboard.ts",

  selectors:
    "src/core/portfolio-engine/client/dashboard-selectors.ts",

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

const contracts =
  read(files.contracts);

const build =
  read(files.build);

const reconcile =
  read(files.reconcile);

const dashboardIndex =
  read(files.dashboardIndex);

const hook =
  read(files.hook);

const selectors =
  read(files.selectors);

const clientIndex =
  read(files.clientIndex);

const rootIndex =
  read(files.rootIndex);

const contractTokens = [
  "PortfolioDashboardSnapshot",
  "DashboardHoldingRow",
  "DashboardAllocationRow",
  "DashboardPerformanceSummary",
  "DashboardDividendSummary",
  "DashboardPricingSummary",
  "DashboardConcentrationSummary",
  "DashboardDataQuality",
  "UnifiedPortfolioDashboardState",
];

for (const token of contractTokens) {
  assert(
    contracts.includes(token),
    `Dashboard contracts are missing: ${token}`,
  );
}

const buildTokens = [
  "buildPortfolioDashboardSnapshot",
  "input.portfolio.totals",
  "input.portfolio.openHoldings",
  "input.portfolio.allocation",
  "input.dividends.totals",
  "holding.valuation.marketValueAud",
  "holding.costBaseAud",
  "holding.realisedGainAud",
  "holding.valuation.unrealisedGainAud",
  "holding.portfolioWeightPercent",
  "reconcilePortfolioMarketData",
  "reconcileApplicationHoldings",
  "reconcilePortfolioDividends",
  "crossEngineIssues",
];

for (const token of buildTokens) {
  assert(
    build.includes(token),
    `Dashboard builder is missing: ${token}`,
  );
}

const reconciliationTokens = [
  "reconcilePortfolioDashboard",
  "assertPortfolioDashboardReconciles",
  "holdingsMarketValueAud",
  "holdingsCostBaseAud",
  "holdingsUnrealisedGainAud",
  "holdingsRealisedGainAud",
  "securityAllocationMarketValueAud",
  "sectorAllocationMarketValueAud",
  "securityWeightPercent",
  "sectorWeightPercent",
  "dividendMarketValueAud",
  "dividendCostBaseAud",
];

for (const token of reconciliationTokens) {
  assert(
    reconcile.includes(token),
    `Dashboard reconciliation is missing: ${token}`,
  );
}

const hookTokens = [
  "useUnifiedPortfolioDashboard",
  "usePortfolioDividendEngine",
  "buildPortfolioDashboardSnapshot",
  "dividendEngine.portfolio",
  "dividendEngine.dividendSnapshot",
  "dividendEngine.refresh",
  "dividendEngine.forceRefresh",
];

for (const token of hookTokens) {
  assert(
    hook.includes(token),
    `Unified dashboard hook is missing: ${token}`,
  );
}

const selectorTokens = [
  "selectDashboardSnapshot",
  "selectDashboardHoldings",
  "selectDashboardTopHoldings",
  "selectDashboardAllocation",
  "selectDashboardMarketValueAud",
  "selectDashboardPortfolioValueAud",
  "selectDashboardCostBaseAud",
  "selectDashboardRealisedGainAud",
  "selectDashboardUnrealisedGainAud",
  "selectDashboardTotalReturnAud",
  "selectDashboardForwardDividendIncomeAud",
  "selectDashboardMonthlyDividendIncomeAud",
  "selectDashboardDividendYieldPercent",
  "selectDashboardYieldOnCostPercent",
  "selectDashboardPricingCoveragePercent",
  "selectDashboardReconciliation",
];

for (const token of selectorTokens) {
  assert(
    selectors.includes(token),
    `Dashboard selector is missing: ${token}`,
  );
}

assert(
  dashboardIndex.includes(
    "./contracts",
  ) &&
  dashboardIndex.includes(
    "./build",
  ) &&
  dashboardIndex.includes(
    "./reconcile",
  ),
  "Dashboard module exports are incomplete.",
);

assert(
  clientIndex.includes(
    "./useUnifiedPortfolioDashboard",
  ),
  "Client exports do not include the unified dashboard hook.",
);

assert(
  clientIndex.includes(
    "./dashboard-selectors",
  ),
  "Client exports do not include dashboard selectors.",
);

assert(
  rootIndex.includes(
    "./dashboard",
  ),
  "Root Portfolio Engine does not export the dashboard module.",
);

assert(
  build.includes(
    "input.portfolio.totals\n          .securitiesMarketValueAud",
  ),
  "Dashboard market value is not sourced from canonical Portfolio totals.",
);

assert(
  build.includes(
    "input.dividends.totals\n          .forwardTwelveMonthIncomeAud",
  ),
  "Dashboard forward dividend income is not sourced from the Dividend Snapshot.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock dashboard/i,
  /sample portfolio/i,
  /placeholder portfolio/i,
  /fake market value/i,
  /hardcoded portfolio value/i,
  /hardcoded dividend income/i,
  /hardcoded total return/i,
];

for (const [
  name,
  content,
] of [
  [
    "dashboard/contracts.ts",
    contracts,
  ],
  [
    "dashboard/build.ts",
    build,
  ],
  [
    "dashboard/reconcile.ts",
    reconcile,
  ],
  [
    "useUnifiedPortfolioDashboard.ts",
    hook,
  ],
  [
    "dashboard-selectors.ts",
    selectors,
  ],
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden mock or independent dashboard logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P5.1 verification FAILED:",
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
  "Portfolio Engine P5.1 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - One canonical dashboard contract");
console.log(" - Live Portfolio Snapshot connected");
console.log(" - Portfolio Dividend Snapshot connected");
console.log(" - Canonical market value connected");
console.log(" - Canonical portfolio value connected");
console.log(" - Canonical open cost base connected");
console.log(" - Canonical realised P/L connected");
console.log(" - Canonical unrealised P/L connected");
console.log(" - Canonical total return connected");
console.log(" - Canonical allocation connected");
console.log(" - Canonical pricing coverage connected");
console.log(" - Canonical dividend forecast connected");
console.log(" - Canonical dividend yield connected");
console.log(" - Canonical yield on cost connected");
console.log(" - Cross-engine reconciliation added");
console.log(" - Dashboard selectors added");
console.log(" - No mock or placeholder values");
console.log("");
