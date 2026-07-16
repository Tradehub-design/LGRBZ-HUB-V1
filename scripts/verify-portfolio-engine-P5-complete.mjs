import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const requiredFiles = [
  "src/core/portfolio-engine/dashboard/contracts.ts",
  "src/core/portfolio-engine/dashboard/build.ts",
  "src/core/portfolio-engine/dashboard/reconcile.ts",
  "src/core/portfolio-engine/dashboard/health.ts",
  "src/core/portfolio-engine/dashboard/attribution.ts",
  "src/core/portfolio-engine/dashboard/index.ts",

  "src/core/portfolio-engine/client/useUnifiedPortfolioDashboard.ts",
  "src/core/portfolio-engine/client/dashboard-selectors.ts",

  "src/app/(dashboard)/dashboard/page.tsx",
  "src/app/(dashboard)/holdings/page.tsx",
  "src/app/(dashboard)/portfolio-allocation/page.tsx",
  "src/app/(dashboard)/portfolio-health/page.tsx",
  "src/app/(dashboard)/performance-attribution/page.tsx",
  "src/app/(dashboard)/dividends/page.tsx",
  "src/app/(dashboard)/dividend-forecast/page.tsx",
];

for (const relativePath of requiredFiles) {
  if (
    !fs.existsSync(
      path.join(
        root,
        relativePath,
      ),
    )
  ) {
    failures.push(
      `Missing complete P5 file: ${relativePath}`,
    );
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
    return "";
  }

  return fs.readFileSync(
    absolutePath,
    "utf8",
  );
}

const hook =
  read(
    "src/core/portfolio-engine/client/useUnifiedPortfolioDashboard.ts",
  );

const builder =
  read(
    "src/core/portfolio-engine/dashboard/build.ts",
  );

const reconciliation =
  read(
    "src/core/portfolio-engine/dashboard/reconcile.ts",
  );

const dashboard =
  read(
    "src/app/(dashboard)/dashboard/page.tsx",
  );

const allocation =
  read(
    "src/app/(dashboard)/portfolio-allocation/page.tsx",
  );

const health =
  read(
    "src/app/(dashboard)/portfolio-health/page.tsx",
  );

const attribution =
  read(
    "src/app/(dashboard)/performance-attribution/page.tsx",
  );

const completeFlow = [
  [
    hook,
    "usePortfolioDividendEngine",
  ],

  [
    hook,
    "buildPortfolioDashboardSnapshot",
  ],

  [
    builder,
    "input.portfolio.openHoldings",
  ],

  [
    builder,
    "input.portfolio.allocation",
  ],

  [
    builder,
    "input.dividends.totals",
  ],

  [
    reconciliation,
    "reconcilePortfolioDashboard",
  ],

  [
    dashboard,
    "useUnifiedPortfolioDashboard",
  ],

  [
    allocation,
    "useUnifiedPortfolioDashboard",
  ],

  [
    health,
    "useUnifiedPortfolioDashboard",
  ],

  [
    attribution,
    "useUnifiedPortfolioDashboard",
  ],
];

for (
  const [
    content,
    token,
  ] of completeFlow
) {
  if (!content.includes(token)) {
    failures.push(
      `Complete P5 flow is missing token: ${token}`,
    );
  }
}

const routeContent = [
  dashboard,
  allocation,
  health,
  attribution,
].join("\n");

const forbiddenTerms = [
  "useSeedPortfolio",
  "useDashboardData",
  "mockPortfolio",
  "samplePortfolio",
  "calculatePortfolioAllocation(",
  "Math.random(",
];

for (const term of forbiddenTerms) {
  if (routeContent.includes(term)) {
    failures.push(
      `Complete P5 routes contain forbidden term: ${term}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Complete Sprint P5 verification FAILED:",
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
  "Complete Sprint P5 verification passed.",
);
console.log("");
console.log(
  "Dashboard, Allocation, Portfolio Health and Performance Attribution now consume one unified Portfolio Dashboard Snapshot.",
);
console.log("");
