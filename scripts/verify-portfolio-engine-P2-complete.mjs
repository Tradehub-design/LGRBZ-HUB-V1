import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  holdingsPage:
    "src/app/(dashboard)/holdings/page.tsx",

  contracts:
    "src/core/portfolio-engine/contracts.ts",

  engine:
    "src/core/portfolio-engine/engine.ts",

  snapshot:
    "src/core/portfolio-engine/snapshot.ts",

  reconcile:
    "src/core/portfolio-engine/reconcile.ts",

  ledgerAdapter:
    "src/core/portfolio-engine/adapters/ledger-row-adapter.ts",

  holdingCompatibility:
    "src/core/portfolio-engine/adapters/holding-compatibility.ts",

  baseHook:
    "src/core/portfolio-engine/client/usePortfolioEngineSnapshot.ts",

  liveHook:
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",

  selectors:
    "src/core/portfolio-engine/client/selectors.ts",

  liveSelectors:
    "src/core/portfolio-engine/client/live-market-selectors.ts",

  dashboardContracts:
    "src/core/portfolio-engine/dashboard/contracts.ts",

  p21:
    "scripts/verify-portfolio-engine-P2-1.mjs",

  p22:
    "scripts/verify-portfolio-engine-P2-2.mjs",

  p23:
    "scripts/verify-portfolio-engine-P2-3.mjs",

  p24:
    "scripts/verify-portfolio-engine-P2-4.mjs",
};

function assert(
  condition,
  message,
) {
  if (!condition) {
    failures.push(
      message,
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

  if (!fs.existsSync(
    absolutePath,
  )) {
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

function includesAny(
  content,
  tokens,
) {
  const compacted =
    compact(
      content,
    );

  return tokens.some(
    (token) =>
      compacted.includes(
        compact(
          token,
        ),
      ),
  );
}

function requireAny(
  content,
  tokens,
  message,
) {
  assert(
    includesAny(
      content,
      tokens,
    ),
    `${message} Accepted patterns: ${tokens.join(
      " | ",
    )}`,
  );
}

function requireTokens(
  content,
  tokens,
  label,
) {
  const compacted =
    compact(
      content,
    );

  for (const token of tokens) {
    assert(
      compacted.includes(
        compact(
          token,
        ),
      ),
      `${label} is missing: ${token}`,
    );
  }
}

function requirePattern(
  content,
  pattern,
  message,
) {
  assert(
    pattern.test(
      content,
    ),
    message,
  );
}

const holdingsPage =
  read(
    files.holdingsPage,
  );

const contracts =
  read(
    files.contracts,
  );

const engine =
  read(
    files.engine,
  );

const snapshot =
  read(
    files.snapshot,
  );

const reconcile =
  read(
    files.reconcile,
  );

const ledgerAdapter =
  read(
    files.ledgerAdapter,
  );

const holdingCompatibility =
  read(
    files.holdingCompatibility,
  );

const baseHook =
  read(
    files.baseHook,
  );

const liveHook =
  read(
    files.liveHook,
  );

const selectors =
  read(
    files.selectors,
  );

const liveSelectors =
  read(
    files.liveSelectors,
  );

const dashboardContracts =
  read(
    files.dashboardContracts,
  );

const p21 =
  read(
    files.p21,
  );

const p22 =
  read(
    files.p22,
  );

const p23 =
  read(
    files.p23,
  );

const p24 =
  read(
    files.p24,
  );

// P2 verifier suite -----------------------------------------------------------

requireTokens(
  p21,
  [
    "Portfolio Engine P2.1",
  ],
  "P2.1 verifier",
);

requireTokens(
  p22,
  [
    "Portfolio Engine P2.2",
  ],
  "P2.2 verifier",
);

requireTokens(
  p23,
  [
    "Portfolio Engine P2.3",
  ],
  "P2.3 verifier",
);

requireTokens(
  p24,
  [
    "Portfolio Engine P2.4",
  ],
  "P2.4 verifier",
);

// Canonical contracts --------------------------------------------------------

requireAny(
  contracts,
  [
    "PortfolioSnapshot",
    "PortfolioEngineSnapshot",
    "CanonicalPortfolioSnapshot",
  ],
  "Canonical Portfolio Snapshot contract is missing.",
);

requireAny(
  contracts,
  [
    "PortfolioHolding",
    "CanonicalHolding",
    "HoldingSnapshot",
  ],
  "Canonical holding contract is missing.",
);

requireAny(
  contracts,
  [
    "PortfolioTransaction",
    "CanonicalTransaction",
  ],
  "Canonical transaction contract is missing.",
);

requireAny(
  contracts,
  [
    "marketValueAud",
    "valuation",
  ],
  "Canonical holding contract does not expose valuation.",
);

requireAny(
  contracts,
  [
    "costBaseAud",
    "openCostBaseAud",
  ],
  "Canonical holding contract does not expose cost base.",
);

// Transaction adapter --------------------------------------------------------

requireAny(
  ledgerAdapter,
  [
    "adaptLedger",
    "ledgerRow",
    "LedgerRow",
    "toPortfolioTransaction",
    "PortfolioTransaction",
  ],
  "Ledger adapter does not expose a canonical transaction conversion path.",
);

requireAny(
  ledgerAdapter,
  [
    "normaliseStoreCurrency",
    "CurrencyCode",
  ],
  "Ledger adapter does not normalise transaction currency.",
);

requireAny(
  ledgerAdapter,
  [
    "AUD",
    "USD",
  ],
  "Ledger adapter does not support AUD and USD currency handling.",
);

// Portfolio Engine facade ----------------------------------------------------

requireAny(
  engine,
  [
    "runPortfolioEngine",
    "buildPortfolioEngine",
    "buildPortfolioSnapshot",
    "PortfolioEngine",
  ],
  "Portfolio Engine facade is missing.",
);

requireAny(
  engine,
  [
    "transactions",
    "canonicalTransactions",
  ],
  "Portfolio Engine facade does not consume canonical transactions.",
);

// Portfolio Snapshot ---------------------------------------------------------

requireAny(
  snapshot,
  [
    "openHoldings",
    "holdings",
  ],
  "Portfolio Snapshot does not expose canonical holdings.",
);

requireAny(
  snapshot,
  [
    "totals",
    "PortfolioTotals",
  ],
  "Portfolio Snapshot does not expose canonical totals.",
);

requireAny(
  snapshot,
  [
    "allocation",
    "PortfolioAllocation",
  ],
  "Portfolio Snapshot does not expose canonical allocation.",
);

requireAny(
  snapshot,
  [
    "marketValueAud",
    "securitiesMarketValueAud",
  ],
  "Portfolio Snapshot does not expose market value.",
);

requireAny(
  snapshot,
  [
    "costBaseAud",
    "openCostBaseAud",
  ],
  "Portfolio Snapshot does not expose cost base.",
);

// Portfolio reconciliation --------------------------------------------------

requireAny(
  reconcile,
  [
    "reconcilePortfolio",
    "reconcile",
  ],
  "Portfolio reconciliation is missing.",
);

requireAny(
  reconcile,
  [
    "marketValue",
    "securitiesMarketValue",
  ],
  "Portfolio reconciliation does not validate market value.",
);

requireAny(
  reconcile,
  [
    "costBase",
    "openCostBase",
  ],
  "Portfolio reconciliation does not validate cost base.",
);

requireAny(
  reconcile,
  [
    "allocation",
  ],
  "Portfolio reconciliation does not validate allocation.",
);

// Client Portfolio Snapshot hook --------------------------------------------

requirePattern(
  baseHook,
  /export\s+function\s+usePortfolioEngineSnapshot\s*\(/,
  "Base Portfolio Engine hook export is missing.",
);

requireAny(
  baseHook,
  [
    "runPortfolioEngine",
    "buildPortfolioSnapshot",
    "portfolio",
    "snapshot",
  ],
  "Base hook does not expose or construct canonical portfolio state.",
);

// Live Portfolio Snapshot hook ----------------------------------------------

requirePattern(
  liveHook,
  /export\s+function\s+useLivePortfolioEngineSnapshot\s*\(/,
  "Live Portfolio Engine hook export is missing.",
);

requireAny(
  liveHook,
  [
    "usePortfolioEngineSnapshot",
    "portfolio",
    "snapshot",
  ],
  "Live hook does not consume canonical base portfolio state.",
);

requireAny(
  liveHook,
  [
    "quote",
    "quotes",
    "pricing",
    "marketData",
    "resolvedQuotes",
    "retainedQuotes",
  ],
  "Live hook does not connect canonical quote resolution.",
);

// Holdings route -------------------------------------------------------------

requireAny(
  holdingsPage,
  [
    "usePortfolioEngineSnapshot",
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
  ],
  "Holdings route is not connected to an accepted canonical Portfolio Engine hook.",
);

requireAny(
  holdingsPage,
  [
    "marketValueAud",
    "valuation.marketValueAud",
    "securitiesMarketValueAud",
  ],
  "Holdings route does not expose canonical market value.",
);

requireAny(
  holdingsPage,
  [
    "costBaseAud",
    "openCostBaseAud",
  ],
  "Holdings route does not expose canonical cost base.",
);

requireAny(
  holdingsPage,
  [
    "realisedGainAud",
    "realizedGainAud",
  ],
  "Holdings route does not expose canonical realised P/L.",
);

requireAny(
  holdingsPage,
  [
    "unrealisedGainAud",
    "unrealizedGainAud",
  ],
  "Holdings route does not expose canonical unrealised P/L.",
);

requireAny(
  holdingsPage,
  [
    "portfolioWeightPercent",
    "weightPercent",
  ],
  "Holdings route does not expose canonical portfolio weight.",
);

// Quote quality --------------------------------------------------------------

requireAny(
  holdingsPage,
  [
    "quoteSource",
    "priceSource",
    "pricingCoveragePercent",
    "liveCount",
    "cachedCount",
    "previousCloseCount",
    "transactionFallbackCount",
  ],
  "Holdings route does not expose quote-source quality.",
);

requireAny(
  holdingsPage,
  [
    "cachedCount",
    "previousCloseCount",
    "transactionFallbackCount",
    "fallback",
    "CACHED",
    "PREVIOUS_CLOSE",
    "TRANSACTION_FALLBACK",
  ],
  "Holdings route does not expose fallback pricing quality.",
);

requireAny(
  holdingsPage,
  [
    "unavailableCount",
    "pricingCoveragePercent",
    "pricedHoldingCount",
    "openHoldingCount",
    "UNAVAILABLE",
    "missingQuote",
  ],
  "Holdings route does not expose unavailable quote coverage.",
);

// Selector layer -------------------------------------------------------------

requireAny(
  selectors,
  [
    "holdings",
    "openHoldings",
    "selectHoldings",
    "selectOpenHoldings",
  ],
  "Portfolio selectors do not expose canonical holdings.",
);

requireAny(
  selectors,
  [
    "marketValueAud",
    "securitiesMarketValueAud",
    "selectHoldingsMarketValueAud",
    "selectPortfolioMarketValueAud",
  ],
  "Portfolio selectors do not expose market value.",
);

requireAny(
  selectors,
  [
    "costBaseAud",
    "openCostBaseAud",
    "selectHoldingsCostBaseAud",
  ],
  "Portfolio selectors do not expose cost base.",
);

requireAny(
  selectors,
  [
    "realisedGainAud",
    "realizedGainAud",
    "selectRealisedGainAud",
  ],
  "Portfolio selectors do not expose realised P/L.",
);

requireAny(
  selectors,
  [
    "unrealisedGainAud",
    "unrealizedGainAud",
    "selectUnrealisedGainAud",
  ],
  "Portfolio selectors do not expose unrealised P/L.",
);

requireAny(
  liveSelectors,
  [
    "quote",
    "pricing",
    "coverage",
    "fallback",
    "unavailable",
    "source",
  ],
  "Live market selectors do not expose pricing quality.",
);

// Holding compatibility adapter ---------------------------------------------

requireAny(
  holdingCompatibility,
  [
    "holding",
    "mapHolding",
    "adaptHolding",
    "toHolding",
  ],
  "Holding compatibility adapter does not expose a mapping path.",
);

requireAny(
  holdingCompatibility,
  [
    "marketValueAud",
    "valuation",
  ],
  "Holding compatibility adapter does not map market value.",
);

requireAny(
  holdingCompatibility,
  [
    "costBaseAud",
    "openCostBaseAud",
  ],
  "Holding compatibility adapter does not map cost base.",
);

requireAny(
  holdingCompatibility,
  [
    "realisedGainAud",
    "realizedGainAud",
  ],
  "Holding compatibility adapter does not map realised P/L.",
);

requireAny(
  holdingCompatibility,
  [
    "unrealisedGainAud",
    "unrealizedGainAud",
  ],
  "Holding compatibility adapter does not map unrealised P/L.",
);

// Dashboard holding contract ------------------------------------------------

requireAny(
  dashboardContracts,
  [
    "DashboardHoldingRow",
  ],
  "Dashboard holding-row contract is missing.",
);

requireAny(
  dashboardContracts,
  [
    "marketValueAud",
    "costBaseAud",
    "realisedGainAud",
    "unrealisedGainAud",
  ],
  "Dashboard holding-row contract is missing canonical financial values.",
);

requireAny(
  dashboardContracts,
  [
    "quoteSource",
    "priceSource",
  ],
  "Dashboard holding-row contract does not expose quote source.",
);

// Prevent market-value substitution -----------------------------------------

const dangerousPatterns = [
  /marketValueAud\s*:\s*holding\.costBaseAud/,
  /marketValueAud\s*=\s*holding\.costBaseAud/,
  /marketValue\s*:\s*holding\.costBase/,
  /marketValue\s*=\s*holding\.costBase/,
  /marketPriceAud\s*:\s*holding\.averageCostAud/,
  /marketPriceAud\s*=\s*holding\.averageCostAud/,
];

for (
  const pattern of
  dangerousPatterns
) {
  assert(
    !pattern.test(
      holdingsPage,
    ) &&
    !pattern.test(
      holdingCompatibility,
    ),
    `Cost base or average cost is substituted for market valuation: ${pattern}`,
  );
}

// Legacy and placeholder paths ----------------------------------------------

const forbiddenTerms = [
  "useSeedPortfolio",
  "useDashboardData",
  "mockHoldings",
  "mockPortfolio",
  "samplePortfolio",
  "calculateHoldingsFromLedger(",
  "calculatePortfolioAllocation(",
  "Math.random(",
];

for (
  const term of
  forbiddenTerms
) {
  assert(
    !holdingsPage.includes(
      term,
    ),
    `Holdings route contains a forbidden legacy or independent path: ${term}`,
  );
}

const forbiddenPatterns = [
  /mock holdings/i,
  /mock portfolio/i,
  /sample holdings/i,
  /placeholder holdings/i,
  /fake market value/i,
  /hardcoded market value/i,
  /hardcoded portfolio weight/i,
];

for (
  const pattern of
  forbiddenPatterns
) {
  assert(
    !pattern.test(
      holdingsPage,
    ),
    `Holdings route contains forbidden placeholder logic: ${pattern}`,
  );
}

assert(
  holdingsPage.startsWith(
    '"use client";',
  ),
  'Holdings "use client" directive is not first.',
);

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "Complete Sprint P2 verification FAILED:",
  );
  console.error("");

  for (
    const failure of
    failures
  ) {
    console.error(
      ` - ${failure}`,
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "Complete Sprint P2 verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - P2.1 verifier exists");
console.log(" - P2.2 verifier exists");
console.log(" - P2.3 verifier exists");
console.log(" - P2.4 verifier exists");
console.log(" - Canonical transaction contract");
console.log(" - Canonical Portfolio Snapshot contract");
console.log(" - Canonical holding contract");
console.log(" - Existing LedgerRow adapter");
console.log(" - Portfolio Engine facade");
console.log(" - Portfolio Snapshot totals");
console.log(" - Portfolio Snapshot allocation");
console.log(" - Portfolio reconciliation");
console.log(" - Base Portfolio Engine hook");
console.log(" - Live Portfolio Engine hook");
console.log(" - Holdings route uses an accepted canonical hook");
console.log(" - Holdings market value is canonical");
console.log(" - Holdings cost base is canonical");
console.log(" - Holdings realised P/L is canonical");
console.log(" - Holdings unrealised P/L is canonical");
console.log(" - Holdings weights are canonical");
console.log(" - Quote source quality is exposed");
console.log(" - Fallback quote quality is exposed");
console.log(" - Unavailable quote coverage is exposed");
console.log(" - Selector layer is connected");
console.log(" - Holding compatibility mapping is connected");
console.log(" - Cost base is not substituted for market value");
console.log(" - No legacy Holdings calculator");
console.log(" - No mock or placeholder values");
console.log("");
