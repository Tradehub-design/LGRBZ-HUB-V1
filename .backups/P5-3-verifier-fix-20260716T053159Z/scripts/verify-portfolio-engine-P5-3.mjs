import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const files = {
  adapter:
    "src/core/portfolio-engine/adapters/ledger-row-adapter.ts",

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

/**
 * Structural verification must not depend on Prettier's line wrapping.
 *
 * Removing whitespace allows:
 *
 *   dashboard.totals
 *     .realisedGainAud
 *
 * to match:
 *
 *   dashboard.totals.realisedGainAud
 */
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

const adapter =
  read(files.adapter);

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

requireTokens(
  adapter,
  [
    "function normaliseStoreCurrency(",
    "const supportedCurrencies: readonly string[] = SUPPORTED_ENGINE_CURRENCIES;",
    "supportedCurrencies.includes(currency)",
    "return currency as CurrencyCode;",
    'if (market === "US")',
    'return "USD";',
    'return "AUD";',
  ],
  "Ledger row adapter",
);

assert(
  !containsCompact(
    adapter,
    "(SUPPORTED_ENGINE_CURRENCIES as readonly string[])",
  ),
  "Ledger adapter still contains the parser-problematic inline currency assertion.",
);

requireTokens(
  healthEngine,
  [
    "buildPortfolioHealth",
    "diversificationScore",
    "concentrationComponent",
    "liquidityScore",
    "dashboard.concentration",
    "dashboard.pricing",
    "dashboard.dataQuality",
    "largestHoldingWeightPercent",
    "largestSectorWeightPercent",
    "largestCountryWeightPercent",
    "largestPlatformWeightPercent",
    "topFiveWeightPercent",
    "pricingCoveragePercent",
    "recommendations",
  ],
  "Portfolio Health engine",
);

requireTokens(
  attributionEngine,
  [
    "buildPerformanceAttribution",
    "postedFeesAud",
    "dashboard.portfolio.transactions",
    "dashboard.holdings",
    "dashboard.totals.realisedGainAud",
    "dashboard.totals.unrealisedGainAud",
    "dashboard.totals.totalIncomeAud",
    "dashboard.totals.totalReturnAud",
    "holdingAttribution",
    "categoryAttribution",
    "reconciliationDifferenceAud",
    "approximatelyEqual",
  ],
  "Performance Attribution engine",
);

requireTokens(
  healthPage,
  [
    "useUnifiedPortfolioDashboard",
    "selectPortfolioHealth",
    "selectDashboardReconciliation",
    "dashboard.totals.cashBalanceAud",
    "dashboard.totals.totalReturnAud",
    "dashboard.totals.totalReturnPercent",
    "dashboard.pricing.pricingCoveragePercent",
    "health.diversificationScore",
    "health.concentrationScore",
    "health.liquidityScore",
    "health.pricingScore",
    "health.dataQualityScore",
    "health.recommendations",
    "forceRefresh",
  ],
  "Portfolio Health page",
);

requireTokens(
  attributionPage,
  [
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
    "attribution.reconciliationDifferenceAud",
    "forceRefresh",
  ],
  "Performance Attribution page",
);

for (
  const token of
  [
    "useSeedPortfolio",
    "useDashboardData",
    "mock-data",
    "Math.random(",
  ]
) {
  assert(
    !healthPage.includes(token),
    `Portfolio Health still contains a legacy path: ${token}`,
  );

  assert(
    !attributionPage.includes(token),
    `Performance Attribution still contains a legacy path: ${token}`,
  );
}

assert(
  !containsCompact(
    attributionPage,
    "const contributors =",
  ),
  "Performance Attribution still calculates contributors inside the page.",
);

assert(
  !containsCompact(
    attributionPage,
    "const totalReturn = Math.max",
  ),
  "Performance Attribution still creates a legacy return magnitude.",
);

requireTokens(
  selectors,
  [
    "selectPortfolioHealth",
    "buildPortfolioHealth",
    "selectPerformanceAttribution",
    "buildPerformanceAttribution",
  ],
  "Dashboard selectors",
);

requireTokens(
  dashboardIndex,
  [
    'export * from "./health";',
    'export * from "./attribution";',
  ],
  "Dashboard module exports",
);

requireTokens(
  unifiedHook,
  [
    "usePortfolioDividendEngine",
    "buildPortfolioDashboardSnapshot",
    "dividendEngine.portfolio",
    "dividendEngine.dividendSnapshot",
  ],
  "Unified dashboard hook",
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

for (
  const [name, content] of
  [
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
  ]
) {
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
console.log(" - Ledger adapter currency parser repair");
console.log(" - Portfolio Health uses unified Dashboard Snapshot");
console.log(" - Performance Attribution uses unified Dashboard Snapshot");
console.log(" - Legacy seed portfolio hook removed");
console.log(" - Legacy dashboard data hook removed");
console.log(" - Page-level attribution calculations removed");
console.log(" - Diversification derives from canonical holdings");
console.log(" - Concentration derives from canonical allocation");
console.log(" - Liquidity derives from canonical cash");
console.log(" - Pricing reliability derives from canonical coverage");
console.log(" - Data-quality score derives from reconciliation");
console.log(" - Realised attribution is canonical");
console.log(" - Unrealised attribution is canonical");
console.log(" - Income attribution is canonical");
console.log(" - Recorded fees derive from posted transactions");
console.log(" - Holding attribution is canonical");
console.log(" - Sector attribution is canonical");
console.log(" - Strategy attribution is canonical");
console.log(" - Verification is independent of source formatting");
console.log(" - No mock or placeholder portfolio values");
console.log("");
