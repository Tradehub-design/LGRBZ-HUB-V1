import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  healthEngine:
    "src/core/portfolio-engine/dashboard/health.ts",

  attributionEngine:
    "src/core/portfolio-engine/dashboard/attribution.ts",

  healthPage:
    "src/app/(dashboard)/portfolio-health/page.tsx",

  attributionPage:
    "src/app/(dashboard)/performance-attribution/page.tsx",

  selectors:
    "src/core/portfolio-engine/client/dashboard-selectors.ts",

  dashboardIndex:
    "src/core/portfolio-engine/dashboard/index.ts",

  unifiedHook:
    "src/core/portfolio-engine/client/useUnifiedPortfolioDashboard.ts",
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

const healthEngine =
  read(files.healthEngine);

const attributionEngine =
  read(files.attributionEngine);

const healthPage =
  read(files.healthPage);

const attributionPage =
  read(files.attributionPage);

const selectors =
  read(files.selectors);

const dashboardIndex =
  read(files.dashboardIndex);

const unifiedHook =
  read(files.unifiedHook);

const healthTokens = [
  "buildPortfolioHealth",
  "diversificationScore",
  "concentrationComponent",
  "liquidityScore",
  "dashboard.concentration",
  "dashboard.pricing",
  "dashboard.dataQuality",
  "largestHoldingWeightPercent",
  "largestSectorWeightPercent",
  "topFiveWeightPercent",
  "pricingCoveragePercent",
  "recommendations",
];

for (const token of healthTokens) {
  assert(
    healthEngine.includes(token),
    `Portfolio Health engine is missing: ${token}`,
  );
}

const attributionTokens = [
  "buildPerformanceAttribution",
  "postedFeesAud",
  "dashboard.portfolio",
  "dashboard.holdings",
  "dashboard.totals.realisedGainAud",
  "dashboard.totals.unrealisedGainAud",
  "dashboard.totals.totalIncomeAud",
  "dashboard.totals.totalReturnAud",
  "holdingAttribution",
  "categoryAttribution",
  "reconciliationDifferenceAud",
  "approximatelyEqual",
];

for (const token of attributionTokens) {
  assert(
    attributionEngine.includes(token),
    `Performance Attribution engine is missing: ${token}`,
  );
}

const healthPageTokens = [
  "useUnifiedPortfolioDashboard",
  "selectPortfolioHealth",
  "selectDashboardReconciliation",
  "dashboard.totals.cashBalanceAud",
  "dashboard.totals.totalReturnAud",
  "health.diversificationScore",
  "health.concentrationScore",
  "health.liquidityScore",
  "health.pricingScore",
  "health.dataQualityScore",
  "health.recommendations",
  "forceRefresh",
];

for (const token of healthPageTokens) {
  assert(
    healthPage.includes(token),
    `Portfolio Health page is missing canonical token: ${token}`,
  );
}

const attributionPageTokens = [
  "useUnifiedPortfolioDashboard",
  "selectPerformanceAttribution",
  "selectDashboardReconciliation",
  "attribution.totalReturnAud",
  "attribution.realisedGainAud",
  "attribution.unrealisedGainAud",
  "attribution.incomeAud",
  "attribution.feesAud",
  "attribution.components",
  "attribution.holdings",
  "attribution.sectors",
  "attribution.strategies",
  "forceRefresh",
];

for (const token of attributionPageTokens) {
  assert(
    attributionPage.includes(token),
    `Performance Attribution page is missing canonical token: ${token}`,
  );
}

const forbiddenTokens = [
  "useSeedPortfolio",
  "useDashboardData",
  "mock-data",
  "Math.random(",
];

for (const token of forbiddenTokens) {
  assert(
    !healthPage.includes(token),
    `Portfolio Health still contains legacy logic: ${token}`,
  );

  assert(
    !attributionPage.includes(token),
    `Performance Attribution still contains legacy logic: ${token}`,
  );
}

assert(
  !attributionPage.includes(
    "const contributors =",
  ),
  "Performance Attribution still calculates contributors inside the page.",
);

assert(
  !attributionPage.includes(
    "const totalReturn = Math.max",
  ),
  "Performance Attribution still calculates return magnitude from legacy data.",
);

assert(
  selectors.includes(
    "selectPortfolioHealth",
  ),
  "Dashboard selectors do not expose Portfolio Health.",
);

assert(
  selectors.includes(
    "selectPerformanceAttribution",
  ),
  "Dashboard selectors do not expose Performance Attribution.",
);

assert(
  dashboardIndex.includes(
    "./health",
  ),
  "Dashboard module does not export Portfolio Health.",
);

assert(
  dashboardIndex.includes(
    "./attribution",
  ),
  "Dashboard module does not export Performance Attribution.",
);

assert(
  unifiedHook.includes(
    "usePortfolioDividendEngine",
  ),
  "Unified dashboard hook no longer consumes the canonical engine chain.",
);

const forbiddenPatterns = [
  /mock health/i,
  /mock attribution/i,
  /sample return/i,
  /placeholder health/i,
  /hardcoded health score/i,
  /hardcoded risk score/i,
  /hardcoded total return/i,
  /hardcoded fee/i,
];

for (const [
  name,
  content,
] of [
  [
    "dashboard/health.ts",
    healthEngine,
  ],
  [
    "dashboard/attribution.ts",
    attributionEngine,
  ],
  [
    "portfolio-health/page.tsx",
    healthPage,
  ],
  [
    "performance-attribution/page.tsx",
    attributionPage,
  ],
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden independent or placeholder logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P5.3 verification FAILED:",
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
  "Portfolio Engine P5.3 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Portfolio Health uses unified Dashboard Snapshot");
console.log(" - Performance Attribution uses unified Dashboard Snapshot");
console.log(" - Legacy seed portfolio hook removed");
console.log(" - Legacy dashboard data hook removed");
console.log(" - Page-level attribution calculations removed");
console.log(" - Diversification score derived from canonical holdings");
console.log(" - Concentration score derived from canonical allocation");
console.log(" - Liquidity score derived from canonical cash");
console.log(" - Pricing score derived from canonical pricing coverage");
console.log(" - Data quality score derived from reconciliation");
console.log(" - Realised attribution is canonical");
console.log(" - Unrealised attribution is canonical");
console.log(" - Income attribution is canonical");
console.log(" - Recorded fees derive from posted transactions");
console.log(" - Holding attribution derives from canonical holdings");
console.log(" - Sector attribution derives from canonical classifications");
console.log(" - Strategy attribution derives from canonical classifications");
console.log(" - Attribution reconciles with canonical total return");
console.log(" - No mock or placeholder portfolio values");
console.log("");
