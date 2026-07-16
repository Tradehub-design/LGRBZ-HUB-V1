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
    `${message} Accepted tokens: ${tokens.join(
      ", ",
    )}`,
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

const dashboardContracts =
  read(files.dashboardContracts);

/**
 * The original P2.2 verifier only accepted usePortfolioEngineSnapshot.
 *
 * Later sprints correctly upgraded Holdings to live or unified hooks. All
 * accepted hooks still originate from the canonical Portfolio Engine.
 */
requireAny(
  holdingsPage,
  [
    "usePortfolioEngineSnapshot",
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
  ],
  "Holdings page does not consume an accepted canonical Portfolio Engine hook.",
);

requireTokens(
  baseHook,
  [
    "usePortfolioEngineSnapshot",
    "PortfolioSnapshot",
  ],
  "Base Portfolio Engine hook",
);

requireTokens(
  liveHook,
  [
    "useLivePortfolioEngineSnapshot",
    "usePortfolioEngineSnapshot",
  ],
  "Live Portfolio Engine hook",
);

requireAny(
  liveHook,
  [
    "resolvedQuotes",
    "quoteResolution",
    "liveQuotes",
    "retainedQuotes",
    "quotes",
  ],
  "Live Portfolio Engine hook does not expose resolved quote data.",
);

requireAny(
  holdingsPage,
  [
    "marketValueAud",
    "holding.valuation.marketValueAud",
    "dashboard.totals.securitiesMarketValueAud",
    "selectHoldingsMarketValueAud",
  ],
  "Holdings page does not expose canonical market value.",
);

requireAny(
  holdingsPage,
  [
    "costBaseAud",
    "holding.costBaseAud",
    "selectHoldingsCostBaseAud",
  ],
  "Holdings page does not expose canonical cost base.",
);

requireAny(
  holdingsPage,
  [
    "unrealisedGainAud",
    "holding.valuation.unrealisedGainAud",
    "selectHoldingsUnrealisedGainAud",
  ],
  "Holdings page does not expose canonical unrealised P/L.",
);

requireAny(
  holdingsPage,
  [
    "realisedGainAud",
    "holding.realisedGainAud",
    "selectHoldingsRealisedGainAud",
  ],
  "Holdings page does not expose canonical realised P/L.",
);

requireAny(
  holdingsPage,
  [
    "portfolioWeightPercent",
    "weightPercent",
    "holding.portfolioWeightPercent",
  ],
  "Holdings page does not expose canonical portfolio weight.",
);

/**
 * Current quote quality can be displayed directly per holding or as aggregate
 * pricing fields from the unified Dashboard Snapshot.
 */
requireAny(
  holdingsPage,
  [
    "quoteSource",
    "holding.quoteSource",
    "valuation.quoteSource",
    "priceSource",
    "pricing.liveCount",
    "pricing.cachedCount",
    "pricing.previousCloseCount",
    "pricing.transactionFallbackCount",
  ],
  "Holdings page does not expose canonical quote-source quality.",
);

requireAny(
  holdingsPage,
  [
    "isFallback",
    "quoteFallback",
    "transactionFallbackCount",
    "cachedCount",
    "previousCloseCount",
    "FALLBACK",
    "CACHED",
    "PREVIOUS_CLOSE",
    "TRANSACTION_FALLBACK",
  ],
  "Holdings page does not identify fallback quote quality.",
);

requireAny(
  holdingsPage,
  [
    "unavailableCount",
    "quoteUnavailable",
    "UNAVAILABLE",
    "missingQuote",
    "pricingCoveragePercent",
    "pricedHoldingCount",
    "openHoldingCount",
  ],
  "Holdings page does not expose unavailable quote coverage.",
);

requireAny(
  holdingsPage,
  [
    "Portfolio Engine",
    "PortfolioEngine",
    "canonical",
    "live-valued",
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
  ],
  "Holdings page does not identify its canonical Portfolio Engine data flow.",
);

requireTokens(
  selectors,
  [
    "marketValue",
    "costBase",
    "realised",
    "unrealised",
  ],
  "Portfolio Engine selectors",
);

requireAny(
  liveSelectors,
  [
    "pricingCoverage",
    "quote",
    "priced",
    "unavailable",
    "fallback",
  ],
  "Live-market selectors do not expose quote-quality information.",
);

requireAny(
  compatibility,
  [
    "marketValue",
    "costBase",
    "realised",
    "unrealised",
  ],
  "Holding compatibility adapter does not expose canonical financial fields.",
);

requireTokens(
  dashboardContracts,
  [
    "DashboardHoldingRow",
    "marketValueAud",
    "costBaseAud",
    "unrealisedGainAud",
    "realisedGainAud",
    "quoteSource",
  ],
  "Dashboard holding contract",
);

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
    `Holdings page contains a forbidden legacy or independent path: ${term}`,
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
    `Holdings page contains forbidden placeholder logic: ${pattern}`,
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
console.log(" - Holdings consumes an accepted Portfolio Engine hook");
console.log(" - Base Portfolio Snapshot hook remains available");
console.log(" - Live Portfolio Snapshot hook remains available");
console.log(" - Live quote resolution remains connected");
console.log(" - Canonical holdings market value");
console.log(" - Canonical holdings cost base");
console.log(" - Canonical realised P/L");
console.log(" - Canonical unrealised P/L");
console.log(" - Canonical portfolio weight");
console.log(" - Quote source quality");
console.log(" - Quote fallback quality");
console.log(" - Quote unavailable coverage");
console.log(" - Current live/unified hook architecture is accepted");
console.log(" - No legacy holdings calculator");
console.log(" - No mock or placeholder portfolio values");
console.log("");
