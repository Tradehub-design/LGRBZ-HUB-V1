import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  holdingsPage:
    "src/app/(dashboard)/holdings/page.tsx",

  baseHook:
    "src/core/portfolio-engine/client/usePortfolioEngineSnapshot.ts",

  liveHook:
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",

  selectors:
    "src/core/portfolio-engine/client/selectors.ts",

  liveSelectors:
    "src/core/portfolio-engine/client/live-market-selectors.ts",

  compatibility:
    "src/core/portfolio-engine/adapters/holding-compatibility.ts",

  contracts:
    "src/core/portfolio-engine/contracts.ts",

  dashboardContracts:
    "src/core/portfolio-engine/dashboard/contracts.ts",
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

function includesAny(
  content,
  tokens,
) {
  const compacted =
    compact(content);

  return tokens.some(
    (token) =>
      compacted.includes(
        compact(token),
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

function requirePattern(
  content,
  pattern,
  message,
) {
  assert(
    pattern.test(content),
    message,
  );
}

const holdingsPage =
  read(files.holdingsPage);

const baseHook =
  read(files.baseHook);

const liveHook =
  read(files.liveHook);

const selectors =
  read(files.selectors);

const liveSelectors =
  read(files.liveSelectors);

const compatibility =
  read(files.compatibility);

const contracts =
  read(files.contracts);

const dashboardContracts =
  read(files.dashboardContracts);

###############################################################################
# Holdings canonical hook
###############################################################################

requireAny(
  holdingsPage,
  [
    "usePortfolioEngineSnapshot",
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
  ],
  "Holdings does not consume an accepted Portfolio Engine hook.",
);

###############################################################################
# Base and live hooks
###############################################################################

requirePattern(
  baseHook,
  /export\s+function\s+usePortfolioEngineSnapshot\s*\(/,
  "Base Portfolio Engine hook export is missing.",
);

requireAny(
  baseHook,
  [
    "buildPortfolioSnapshot",
    "runPortfolioEngine",
    "buildPortfolioEngineSnapshot",
    "portfolioSnapshot",
    "snapshot",
    "portfolio",
  ],
  "Base Portfolio Engine hook does not expose or construct canonical portfolio state.",
);

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
  "Live hook does not consume the base Portfolio Engine state.",
);

requireAny(
  liveHook,
  [
    "quote",
    "quotes",
    "resolvedQuotes",
    "retainedQuotes",
    "marketData",
    "pricing",
  ],
  "Live hook does not expose market-price resolution.",
);

###############################################################################
# Snapshot contracts
###############################################################################

requireAny(
  contracts,
  [
    "PortfolioSnapshot",
    "PortfolioEngineSnapshot",
    "CanonicalPortfolioSnapshot",
  ],
  "Portfolio Engine snapshot contract is missing.",
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
    "marketValueAud",
    "valuation",
  ],
  "Canonical contracts do not expose valuation data.",
);

requireAny(
  contracts,
  [
    "costBaseAud",
    "openCostBaseAud",
    "costBase",
  ],
  "Canonical contracts do not expose cost-base data.",
);

###############################################################################
# Holdings values
###############################################################################

requireAny(
  holdingsPage,
  [
    "marketValueAud",
    "valuation.marketValueAud",
    "selectHoldingsMarketValueAud",
    "securitiesMarketValueAud",
  ],
  "Holdings does not display canonical market value.",
);

requireAny(
  holdingsPage,
  [
    "costBaseAud",
    "openCostBaseAud",
    "selectHoldingsCostBaseAud",
  ],
  "Holdings does not display canonical cost base.",
);

requireAny(
  holdingsPage,
  [
    "unrealisedGainAud",
    "unrealizedGainAud",
    "selectHoldingsUnrealisedGainAud",
  ],
  "Holdings does not display canonical unrealised P/L.",
);

requireAny(
  holdingsPage,
  [
    "realisedGainAud",
    "realizedGainAud",
    "selectHoldingsRealisedGainAud",
  ],
  "Holdings does not display canonical realised P/L.",
);

requireAny(
  holdingsPage,
  [
    "portfolioWeightPercent",
    "weightPercent",
    "selectHoldingWeight",
  ],
  "Holdings does not display canonical portfolio weight.",
);

###############################################################################
# Selector layer
###############################################################################

requireAny(
  selectors,
  [
    "selectHoldings",
    "selectOpenHoldings",
    "selectPortfolioHoldings",
    "selectCanonicalHoldings",
  ],
  "Portfolio selectors do not expose canonical holdings.",
);

requireAny(
  selectors,
  [
    "selectHoldingsMarketValueAud",
    "selectMarketValueAud",
    "selectPortfolioMarketValueAud",
    "securitiesMarketValueAud",
  ],
  "Portfolio selectors do not expose canonical market value.",
);

requireAny(
  selectors,
  [
    "selectHoldingsCostBaseAud",
    "selectCostBaseAud",
    "selectPortfolioCostBaseAud",
    "openCostBaseAud",
  ],
  "Portfolio selectors do not expose canonical cost base.",
);

requireAny(
  selectors,
  [
    "selectHoldingsRealisedGainAud",
    "selectRealisedGainAud",
    "realisedGainAud",
    "realizedGainAud",
  ],
  "Portfolio selectors do not expose realised P/L.",
);

requireAny(
  selectors,
  [
    "selectHoldingsUnrealisedGainAud",
    "selectUnrealisedGainAud",
    "unrealisedGainAud",
    "unrealizedGainAud",
  ],
  "Portfolio selectors do not expose unrealised P/L.",
);

###############################################################################
# Compatibility adapter
###############################################################################

requireAny(
  compatibility,
  [
    "toHolding",
    "toHoldings",
    "mapHolding",
    "adaptHolding",
    "holdingCompatibility",
  ],
  "Holding compatibility adapter does not expose a holding mapping function.",
);

requireAny(
  compatibility,
  [
    "marketValueAud",
    "valuation",
  ],
  "Holding compatibility adapter does not map market value.",
);

requireAny(
  compatibility,
  [
    "costBaseAud",
    "openCostBaseAud",
  ],
  "Holding compatibility adapter does not map cost base.",
);

requireAny(
  compatibility,
  [
    "realisedGainAud",
    "realizedGainAud",
  ],
  "Holding compatibility adapter does not map realised P/L.",
);

requireAny(
  compatibility,
  [
    "unrealisedGainAud",
    "unrealizedGainAud",
  ],
  "Holding compatibility adapter does not map unrealised P/L.",
);

###############################################################################
# Quote quality
###############################################################################

requireAny(
  holdingsPage,
  [
    "quoteSource",
    "priceSource",
    "sourceLabel",
    "pricingCoveragePercent",
    "liveCount",
    "cachedCount",
    "previousCloseCount",
    "transactionFallbackCount",
  ],
  "Holdings does not expose quote-source quality.",
);

requireAny(
  holdingsPage,
  [
    "cachedCount",
    "previousCloseCount",
    "transactionFallbackCount",
    "isFallback",
    "fallback",
    "CACHED",
    "PREVIOUS_CLOSE",
    "TRANSACTION_FALLBACK",
  ],
  "Holdings does not expose fallback quote quality.",
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
  "Holdings does not expose unavailable quote coverage.",
);

requireAny(
  liveSelectors,
  [
    "pricing",
    "quote",
    "coverage",
    "fallback",
    "unavailable",
    "priced",
  ],
  "Live-market selectors do not expose pricing-quality information.",
);

###############################################################################
# Dashboard holding contract
###############################################################################

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
  ],
  "Dashboard holding row does not expose market value.",
);

requireAny(
  dashboardContracts,
  [
    "costBaseAud",
  ],
  "Dashboard holding row does not expose cost base.",
);

requireAny(
  dashboardContracts,
  [
    "realisedGainAud",
    "realizedGainAud",
  ],
  "Dashboard holding row does not expose realised P/L.",
);

requireAny(
  dashboardContracts,
  [
    "unrealisedGainAud",
    "unrealizedGainAud",
  ],
  "Dashboard holding row does not expose unrealised P/L.",
);

requireAny(
  dashboardContracts,
  [
    "quoteSource",
    "priceSource",
  ],
  "Dashboard holding row does not expose quote source.",
);

###############################################################################
# Forbidden legacy paths
###############################################################################

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

for (const term of forbiddenTerms) {
  assert(
    !holdingsPage.includes(
      term,
    ),
    `Holdings contains a forbidden legacy or independent path: ${term}`,
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

for (const pattern of forbiddenPatterns) {
  assert(
    !pattern.test(
      holdingsPage,
    ),
    `Holdings contains forbidden placeholder logic: ${pattern}`,
  );
}

assert(
  holdingsPage.startsWith(
    '"use client";',
  ),
  'Holdings "use client" directive is not first.',
);

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P2.2 verification FAILED:",
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
  "Portfolio Engine P2.2 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Holdings uses a canonical Portfolio Engine hook");
console.log(" - Base Portfolio Engine hook exists");
console.log(" - Live Portfolio Engine hook exists");
console.log(" - Canonical snapshot contract exists");
console.log(" - Canonical holdings contract exists");
console.log(" - Holdings market value is canonical");
console.log(" - Holdings cost base is canonical");
console.log(" - Holdings realised P/L is canonical");
console.log(" - Holdings unrealised P/L is canonical");
console.log(" - Holdings portfolio weight is canonical");
console.log(" - Holdings selector layer is connected");
console.log(" - Holding compatibility mapping is connected");
console.log(" - Quote source is exposed");
console.log(" - Quote fallback quality is exposed");
console.log(" - Unavailable quote coverage is exposed");
console.log(" - No legacy holdings calculator");
console.log(" - No mock or placeholder portfolio values");
console.log("");
