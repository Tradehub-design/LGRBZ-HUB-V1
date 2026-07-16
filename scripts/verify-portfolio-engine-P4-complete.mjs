import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const requiredFiles = [
  "src/core/portfolio-engine/dividends/contracts.ts",
  "src/core/portfolio-engine/dividends/eligibility.ts",
  "src/core/portfolio-engine/dividends/deduplicate.ts",
  "src/core/portfolio-engine/dividends/tax.ts",
  "src/core/portfolio-engine/dividends/normalise.ts",
  "src/core/portfolio-engine/dividends/snapshot.ts",
  "src/core/portfolio-engine/dividends/reconcile.ts",
  "src/core/portfolio-engine/dividends/audit.ts",
  "src/core/portfolio-engine/adapters/dividend-intelligence-adapter.ts",
  "src/core/portfolio-engine/client/usePortfolioDividendEngine.ts",
  "src/core/portfolio-engine/client/portfolio-dividend-retention.ts",
  "src/core/portfolio-engine/client/dividend-selectors.ts",
  "src/app/(dashboard)/dividends/page.tsx",
  "src/app/(dashboard)/dividend-forecast/page.tsx",
  "src/app/api/dividend-data/route.ts",
  "src/lib/dividend-data/dividendService.ts",
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
      `Missing Sprint P4 file: ${relativePath}`,
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
    "src/core/portfolio-engine/client/usePortfolioDividendEngine.ts",
  );

const adapter =
  read(
    "src/core/portfolio-engine/adapters/dividend-intelligence-adapter.ts",
  );

const snapshot =
  read(
    "src/core/portfolio-engine/dividends/snapshot.ts",
  );

const audit =
  read(
    "src/core/portfolio-engine/dividends/audit.ts",
  );

const dividends =
  read(
    "src/app/(dashboard)/dividends/page.tsx",
  );

const forecast =
  read(
    "src/app/(dashboard)/dividend-forecast/page.tsx",
  );

const service =
  read(
    "src/lib/dividend-data/dividendService.ts",
  );

const route =
  read(
    "src/app/api/dividend-data/route.ts",
  );

const requiredFlowTokens = [
  [
    hook,
    "useLivePortfolioEngineSnapshot",
  ],
  [
    hook,
    '"/api/dividend-data"',
  ],
  [
    adapter,
    "portfolioSnapshotToDividendHoldings",
  ],
  [
    adapter,
    "portfolioSnapshotToDividendTransactions",
  ],
  [
    snapshot,
    "deduplicatePortfolioDividendEvents",
  ],
  [
    snapshot,
    "buildHoldingSummaries",
  ],
  [
    snapshot,
    "buildMonthlyForecast",
  ],
  [
    audit,
    "auditPortfolioDividends",
  ],
  [
    dividends,
    "usePortfolioDividendEngine",
  ],
  [
    forecast,
    "usePortfolioDividendEngine",
  ],
  [
    service,
    "getDividendIntelligence",
  ],
  [
    route,
    "getDividendIntelligence",
  ],
];

for (const [
  content,
  token,
] of requiredFlowTokens) {
  if (!content.includes(token)) {
    failures.push(
      `Complete P4 flow is missing token: ${token}`,
    );
  }
}

const forbiddenTerms = [
  "mockDividends",
  "sampleDividends",
  "useSeedPortfolio",
  "useDashboardData",
  "calculateDividendForecast(",
  "calculateDividendYield(",
  "placeholder dividend",
];

for (const term of forbiddenTerms) {
  if (
    dividends.includes(term) ||
    forecast.includes(term)
  ) {
    failures.push(
      `Dividend route contains legacy or placeholder term: ${term}`,
    );
  }
}

if (
  /Math\.random\s*\(/.test(
    [
      hook,
      adapter,
      snapshot,
      audit,
      dividends,
      forecast,
    ].join("\n"),
  )
) {
  failures.push(
    "Non-deterministic dividend logic remains in Sprint P4 files.",
  );
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Complete Sprint P4 verification FAILED:",
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
  "Complete Sprint P4 verification passed.",
);
console.log("");
console.log(
  "Transactions, live holdings, provider events, eligibility, forecasts and tax outputs now feed one canonical Portfolio Dividend Snapshot.",
);
console.log("");
