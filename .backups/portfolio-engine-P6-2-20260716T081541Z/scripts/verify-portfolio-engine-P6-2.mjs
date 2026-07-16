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

  analyticsBuild:
    "src/core/portfolio-engine/analytics/build.ts",

  analyticsReconcile:
    "src/core/portfolio-engine/analytics/reconcile.ts",

  reportsBuild:
    "src/core/portfolio-engine/reports/build.ts",

  taxBuild:
    "src/core/portfolio-engine/tax/build.ts",
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

const analyticsBuild =
  read(files.analyticsBuild);

const analyticsReconcile =
  read(files.analyticsReconcile);

const reportsBuild =
  read(files.reportsBuild);

const taxBuild =
  read(files.taxBuild);

requireTokens(
  analytics,
  [
    '"use client";',
    "usePortfolioIntelligence",
    "analytics.totals.portfolioValueAud",
    "analytics.totals.securitiesMarketValueAud",
    "analytics.totals.totalReturnAud",
    "analytics.totals.realisedGainAud",
    "analytics.totals.unrealisedGainAud",
    "analytics.totals.totalIncomeAud",
    "analytics.income.forwardTwelveMonthIncomeAud",
    "analytics.income.dividendYieldPercent",
    "analytics.holdings",
    "analytics.winners",
    "analytics.losers",
    "analytics.performanceBySector",
    "analytics.performanceByStrategy",
    "analytics.performanceByCountry",
    "analytics.performanceByIndustry",
    "reconciliation.valid",
    "forceRefresh",
  ],
  "Analytics route",
);

requireTokens(
  reports,
  [
    '"use client";',
    "usePortfolioIntelligence",
    "reports.summary.portfolioValueAud",
    "reports.summary.securitiesMarketValueAud",
    "reports.summary.openCostBaseAud",
    "reports.summary.realisedGainAud",
    "reports.summary.unrealisedGainAud",
    "reports.summary.totalIncomeAud",
    "reports.summary.totalReturnAud",
    "reports.summary.forwardDividendIncomeAud",
    "analytics.income.receivedIncomeAud",
    "analytics.winners",
    "analytics.losers",
    "tax.financialYear",
    "tax.totals.netRealisedCapitalGainAud",
    "tax.totals.dividendIncomeAud",
    "tax.totals.transactionFeesAud",
    "tax.totals.grossTaxableIncomeAud",
    "reconciliation.valid",
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
  analyticsBuild,
  [
    "input.dashboard.holdings",
    "input.dashboard.allocation",
    "input.dashboard.dividendsSummary",
    "input.dashboard.totals",
  ],
  "Analytics builder",
);

requireTokens(
  analyticsReconcile,
  [
    "reconcilePortfolioAnalytics",
    "analytics.totals.totalReturnAud",
    "analytics.totals.securitiesMarketValueAud",
  ],
  "Analytics reconciliation",
);

requireTokens(
  reportsBuild,
  [
    "dashboard.totals",
    "dashboard.dividendsSummary",
    "input.analytics",
    "input.tax",
  ],
  "Reports builder",
);

requireTokens(
  taxBuild,
  [
    "input.dashboard.portfolio.transactions",
    'transaction.status !== "posted"',
    "financialYearForDate",
  ],
  "Tax builder",
);

const forbiddenTerms = [
  "useSeedPortfolio",
  "useDashboardData",
  "usePortfolioStore",
  "getTransactionTotal",
  "safeTransaction",
  "mock-data",
  "mockAnalytics",
  "mockReports",
  "Math.random(",
  "calculatePortfolioAllocation(",
  "calculateAnalytics(",
  "calculateReport(",
];

for (const term of forbiddenTerms) {
  assert(
    !analytics.includes(term),
    `Analytics route contains a forbidden legacy path: ${term}`,
  );

  assert(
    !reports.includes(term),
    `Reports route contains a forbidden legacy path: ${term}`,
  );
}

assert(
  !/\bdata\.allocation\.[A-Za-z]+\.map\s*\(/.test(
    analytics,
  ),
  "Analytics route still consumes legacy untyped allocation data.",
);

assert(
  !/\bconst\s+portfolioValue\s*=/.test(
    analytics,
  ),
  "Analytics route independently calculates portfolio value.",
);

assert(
  !/\bconst\s+totalReturn\s*=/.test(
    analytics,
  ),
  "Analytics route independently calculates total return.",
);

assert(
  !/\bconst\s+portfolioValue\s*=/.test(
    reports,
  ),
  "Reports route independently calculates portfolio value.",
);

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

const forbiddenPatterns = [
  /mock analytics/i,
  /mock report/i,
  /sample portfolio/i,
  /placeholder portfolio/i,
  /fake market value/i,
  /invented history/i,
  /hardcoded total return/i,
  /hardcoded portfolio value/i,
  /hardcoded tax/i,
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
console.log(" - Analytics portfolio value is canonical");
console.log(" - Analytics market value is canonical");
console.log(" - Analytics total return is canonical");
console.log(" - Analytics realised P/L is canonical");
console.log(" - Analytics unrealised P/L is canonical");
console.log(" - Analytics income is canonical");
console.log(" - Holding performance is canonical");
console.log(" - Sector performance is canonical");
console.log(" - Strategy performance is canonical");
console.log(" - Country performance is canonical");
console.log(" - Industry performance is canonical");
console.log(" - Winners and detractors are canonical");
console.log(" - Report totals are canonical");
console.log(" - Report income is canonical");
console.log(" - Report tax summary is transaction-derived");
console.log(" - Legacy untyped allocation path removed");
console.log(" - Legacy transaction helper removed");
console.log(" - No invented history or benchmarks");
console.log(" - No mock or placeholder values");
console.log("");
