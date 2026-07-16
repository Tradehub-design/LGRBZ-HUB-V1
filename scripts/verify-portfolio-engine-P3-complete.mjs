import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const requiredFiles = [
  "src/core/portfolio-engine/contracts.ts",
  "src/core/portfolio-engine/quote-resolution.ts",
  "src/core/portfolio-engine/snapshot.ts",
  "src/core/portfolio-engine/reconcile.ts",
  "src/core/portfolio-engine/adapters/live-market-quote-adapter.ts",
  "src/core/portfolio-engine/client/portfolio-quote-retention.ts",
  "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",
  "src/core/portfolio-engine/client/live-market-selectors.ts",
  "src/core/portfolio-engine/client/market-data-reconciliation.ts",
  "src/app/(dashboard)/holdings/page.tsx",
  "src/app/(dashboard)/live-prices/page.tsx",
  "src/hooks/useLiveMarketQuotes.ts",
  "src/lib/market-data/marketDataTypes.ts",
];

for (const relativePath of requiredFiles) {
  if (
    !fs.existsSync(
      path.join(root, relativePath),
    )
  ) {
    failures.push(
      `Missing Sprint P3 file: ${relativePath}`,
    );
  }
}

function read(relativePath) {
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

const adapter =
  read(
    "src/core/portfolio-engine/adapters/live-market-quote-adapter.ts",
  );

const retention =
  read(
    "src/core/portfolio-engine/client/portfolio-quote-retention.ts",
  );

const hook =
  read(
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",
  );

const reconciliation =
  read(
    "src/core/portfolio-engine/client/market-data-reconciliation.ts",
  );

const holdings =
  read(
    "src/app/(dashboard)/holdings/page.tsx",
  );

const livePrices =
  read(
    "src/app/(dashboard)/live-prices/page.tsx",
  );

const requiredDataFlowTokens = [
  [
    adapter,
    "normalisedMarketQuoteToPortfolioQuote",
  ],
  [
    adapter,
    "previousCloseQuote",
  ],
  [
    retention,
    "mergeResilientPortfolioQuotes",
  ],
  [
    hook,
    "buildPortfolioEngineFromCanonical",
  ],
  [
    hook,
    "resilientQuotes",
  ],
  [
    reconciliation,
    "reconcilePortfolioMarketData",
  ],
  [
    holdings,
    "useLivePortfolioEngineSnapshot",
  ],
  [
    livePrices,
    "useLivePortfolioEngineSnapshot",
  ],
];

for (const [
  content,
  token,
] of requiredDataFlowTokens) {
  if (!content.includes(token)) {
    failures.push(
      `Complete P3 flow is missing token: ${token}`,
    );
  }
}

const forbiddenTerms = [
  "Current values use cost basis only",
  "Market price engine placeholder",
  "calculateHoldingsFromLedger",
  "useSeedPortfolio",
];

for (const term of forbiddenTerms) {
  if (
    holdings.includes(term) ||
    livePrices.includes(term)
  ) {
    failures.push(
      `Legacy or placeholder term remains: ${term}`,
    );
  }
}

if (
  /Math\.random\s*\(/.test(
    [
      adapter,
      retention,
      hook,
      reconciliation,
      holdings,
      livePrices,
    ].join("\n"),
  )
) {
  failures.push(
    "Non-deterministic pricing logic remains in Sprint P3 files.",
  );
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Complete Sprint P3 verification FAILED:",
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
  "Complete Sprint P3 verification passed.",
);
console.log("");
console.log(
  "The existing market-data provider system now feeds one resilient live-valued Portfolio Snapshot used by Holdings and Live Prices.",
);
console.log("");
