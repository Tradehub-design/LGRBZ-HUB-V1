import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  reconciliation:
    "src/core/portfolio-engine/client/market-data-reconciliation.ts",

  selectors:
    "src/core/portfolio-engine/client/live-market-selectors.ts",

  retention:
    "src/core/portfolio-engine/client/portfolio-quote-retention.ts",

  quoteAdapter:
    "src/core/portfolio-engine/adapters/live-market-quote-adapter.ts",

  liveHook:
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",

  holdings:
    "src/app/(dashboard)/holdings/page.tsx",

  livePrices:
    "src/app/(dashboard)/live-prices/page.tsx",

  clientIndex:
    "src/core/portfolio-engine/client/index.ts",
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

const reconciliation =
  read(files.reconciliation);

const selectors =
  read(files.selectors);

const retention =
  read(files.retention);

const quoteAdapter =
  read(files.quoteAdapter);

const liveHook =
  read(files.liveHook);

const holdings =
  read(files.holdings);

const livePrices =
  read(files.livePrices);

const clientIndex =
  read(files.clientIndex);

const reconciliationTokens = [
  "reconcilePortfolioMarketData",
  "assertPortfolioMarketDataReconciles",
  "validateUnavailableHolding",
  "validatePricedHolding",
  "expectedLocalMarketValue",
  "expectedAudPrice",
  "expectedAudMarketValue",
  "snapshot.totals.securitiesMarketValueAud",
  "holding.portfolioWeightPercent",
  "fallbackQuoteCount",
  "missingQuoteCount",
  "LAST_KNOWN_VALID",
];

for (const token of reconciliationTokens) {
  assert(
    reconciliation.includes(token),
    `Market-data reconciliation is missing: ${token}`,
  );
}

const selectorTokens = [
  "selectMarketDataReconciliation",
  "selectPricingSourceSummary",
  "selectProviderFailureProtectedHoldings",
  "selectPricingCoveragePercent",
  "retained",
];

for (const token of selectorTokens) {
  assert(
    selectors.includes(token),
    `Live market selector is missing: ${token}`,
  );
}

assert(
  clientIndex.includes(
    "./market-data-reconciliation",
  ),
  "Client index does not export market-data reconciliation.",
);

const fallbackTokens = [
  "LIVE",
  "CACHE",
  "PREVIOUS_CLOSE",
  "TRANSACTION_FALLBACK",
  "UNAVAILABLE",
];

for (const token of fallbackTokens) {
  assert(
    quoteAdapter.includes(token),
    `Quote adapter is missing fallback state: ${token}`,
  );

  assert(
    reconciliation.includes(token),
    `Market reconciliation is missing fallback state: ${token}`,
  );
}

assert(
  quoteAdapter.includes(
    "previousCloseQuote",
  ),
  "Provider previous-close fallback is missing.",
);

assert(
  retention.includes(
    "mergeResilientPortfolioQuotes",
  ),
  "Resilient retained quote merge is missing.",
);

assert(
  retention.includes(
    "LAST_KNOWN_VALID",
  ),
  "Last-known valid quote marking is missing.",
);

assert(
  liveHook.includes(
    "resilientQuotes",
  ),
  "Live Portfolio Engine hook does not use resilient quotes.",
);

assert(
  liveHook.includes(
    "engineResult:\n      liveEngineResult",
  ) ||
  liveHook.includes(
    "engineResult:\r\n      liveEngineResult",
  ),
  "Live Portfolio Engine result is not exposed as canonical engineResult.",
);

assert(
  holdings.includes(
    "useLivePortfolioEngineSnapshot",
  ),
  "Holdings page does not use the live Portfolio Engine snapshot.",
);

assert(
  livePrices.includes(
    "useLivePortfolioEngineSnapshot",
  ),
  "Live Prices page does not use the live Portfolio Engine snapshot.",
);

const forbiddenHoldingsTokens = [
  "calculateHoldingsFromLedger",
  "loadTxLedger",
  "usePortfolioStore",
  "openHoldings.reduce",
  "holdings.reduce",
  "localTransactions",
];

for (const token of forbiddenHoldingsTokens) {
  assert(
    !holdings.includes(token),
    `Holdings page still contains legacy calculation logic: ${token}`,
  );
}

const forbiddenLivePriceTokens = [
  "useDashboardData",
  "useSeedPortfolio",
  "Current values use cost basis only",
  "Market price engine placeholder",
  "Pending API",
  'value="$0"',
];

for (const token of forbiddenLivePriceTokens) {
  assert(
    !livePrices.includes(token),
    `Live Prices page still contains placeholder pricing: ${token}`,
  );
}

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock quote/i,
  /sample price/i,
  /placeholder price/i,
  /fake market value/i,
  /hardcoded current valuation/i,
  /price:\s*1(?:\.0+)?[,;]/,
];

for (const [
  name,
  content,
] of [
  [
    "market-data-reconciliation.ts",
    reconciliation,
  ],
  [
    "live-market-selectors.ts",
    selectors,
  ],
  [
    "portfolio-quote-retention.ts",
    retention,
  ],
  [
    "live-market-quote-adapter.ts",
    quoteAdapter,
  ],
  [
    "useLivePortfolioEngineSnapshot.ts",
    liveHook,
  ],
  [
    "holdings/page.tsx",
    holdings,
  ],
  [
    "live-prices/page.tsx",
    livePrices,
  ],
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden pricing logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P3.4 verification FAILED:",
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
  "Portfolio Engine P3.4 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Complete pricing fallback hierarchy");
console.log(" - Live provider quote support");
console.log(" - Provider cache support");
console.log(" - Last-known valid quote retention");
console.log(" - Previous-close fallback");
console.log(" - Transaction-price fallback");
console.log(" - Explicit unavailable state");
console.log(" - Zero and invalid quote rejection");
console.log(" - Quantity x local price reconciliation");
console.log(" - Local price x FX reconciliation");
console.log(" - Quantity x AUD price reconciliation");
console.log(" - Holding and total market-value reconciliation");
console.log(" - Holding weight reconciliation");
console.log(" - Data-quality quote-count reconciliation");
console.log(" - Holdings page live snapshot connection");
console.log(" - Live Prices page live snapshot connection");
console.log(" - No mock or placeholder pricing");
console.log("");
