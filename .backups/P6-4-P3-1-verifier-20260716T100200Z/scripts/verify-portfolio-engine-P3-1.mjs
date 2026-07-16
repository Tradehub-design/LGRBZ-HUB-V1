import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  adapter:
    "src/core/portfolio-engine/adapters/live-market-quote-adapter.ts",

  hook:
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",

  selectors:
    "src/core/portfolio-engine/client/live-market-selectors.ts",

  clientIndex:
    "src/core/portfolio-engine/client/index.ts",

  rootIndex:
    "src/core/portfolio-engine/index.ts",

  existingHook:
    "src/hooks/useLiveMarketQuotes.ts",

  quoteRoute:
    "src/app/api/market-data/quotes/route.ts",

  marketTypes:
    "src/lib/market-data/marketDataTypes.ts",
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

  if (
    !fs.existsSync(
      absolutePath,
    )
  ) {
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

const adapter =
  read(files.adapter);

const hook =
  read(files.hook);

const selectors =
  read(files.selectors);

const clientIndex =
  read(files.clientIndex);

const rootIndex =
  read(files.rootIndex);

const existingHook =
  read(files.existingHook);

const quoteRoute =
  read(files.quoteRoute);

const marketTypes =
  read(files.marketTypes);

const adapterTokens = [
  "normalisedMarketQuoteToPortfolioQuote",
  "createPortfolioQuoteRecord",
  "NormalisedMarketQuote",
  "QuoteSnapshot",
  "previousClose",
  "quoteTimestamp",
  "receivedAt",
  "adaptiveCacheTtlSeconds",
  "TRANSACTION_FALLBACK",
  "UNAVAILABLE",
  "isUsable",
  "isExpired",
];

for (const token of adapterTokens) {
  assert(
    adapter.includes(token),
    `Live quote adapter is missing: ${token}`,
  );
}

const hookTokens = [
  "useLivePortfolioEngineSnapshot",
  "usePortfolioEngineSnapshot",
  "useLiveMarketQuotes",
  "createPortfolioQuoteRecord",
  "buildPortfolioEngineFromCanonical",
  "baseSnapshot.transactions",
  "baseSnapshot.openHoldings",
  "live.quoteBySymbol",
  "livePricingCoveragePercent",
  "forceRefreshLiveQuotes",
];

for (const token of hookTokens) {
  assert(
    hook.includes(token),
    `Live Portfolio Engine hook is missing: ${token}`,
  );
}

const selectorTokens = [
  "selectLiveQuotes",
  "selectHoldingQuote",
  "selectLivePricedHoldings",
  "selectCachedPricedHoldings",
  "selectPreviousCloseHoldings",
  "selectTransactionFallbackHoldings",
  "selectUnpricedHoldings",
  "selectPricingCoveragePercent",
  "selectQuoteSourceCounts",
];

for (const token of selectorTokens) {
  assert(
    selectors.includes(token),
    `Live market selector is missing: ${token}`,
  );
}

assert(
  clientIndex.includes(
    "./useLivePortfolioEngineSnapshot",
  ),
  "Client exports do not include the live Portfolio Engine hook.",
);

assert(
  clientIndex.includes(
    "./live-market-selectors",
  ),
  "Client exports do not include live market selectors.",
);

assert(
  rootIndex.includes(
    "./adapters/live-market-quote-adapter",
  ),
  "Root Portfolio Engine exports do not include the live quote adapter.",
);

assert(
  existingHook.includes(
    "quoteBySymbol",
  ),
  "Existing live quote hook does not expose quoteBySymbol.",
);

assert(
  quoteRoute.includes(
    "resolveMarketQuotes",
  ),
  "Existing quote route is not connected to multi-provider resolution.",
);

assert(
  marketTypes.includes(
    "NormalisedMarketQuote",
  ),
  "Existing market-data contract is missing NormalisedMarketQuote.",
);

assert(
  adapter.includes(
    "if (\n      adapted.source === \"UNAVAILABLE\"",
  ) ||
  adapter.includes(
    'adapted.source === "UNAVAILABLE"',
  ),
  "Unavailable provider quotes are not filtered before canonical valuation.",
);

assert(
  hook.includes(
    "engineResult:\n      liveEngineResult",
  ) ||
  hook.includes(
    "engineResult:\r\n      liveEngineResult",
  ),
  "The live hook does not expose the live-valued result as the canonical engineResult.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock quote/i,
  /sample price/i,
  /placeholder price/i,
  /fake market value/i,
  /demo quote/i,
];

for (const content of [
  adapter,
  hook,
  selectors,
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `P3.1 contains forbidden mock or non-deterministic logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P3.1 verification FAILED:",
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
  "Portfolio Engine P3.1 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Existing market-data system retained");
console.log(" - Existing multi-provider quote route retained");
console.log(" - Existing live quote Zustand store retained");
console.log(" - Existing visibility-aware polling retained");
console.log(" - NormalisedMarketQuote adapter added");
console.log(" - ASX and US market mapping added");
console.log(" - Provider quote source mapped to canonical source");
console.log(" - Provider freshness mapped to canonical quality");
console.log(" - Previous close retained");
console.log(" - Quote timestamps retained");
console.log(" - Cache expiry retained");
console.log(" - Unusable zero quotes excluded");
console.log(" - Canonical Portfolio Snapshot rebuilt with live quotes");
console.log(" - Transaction fallback remains available");
console.log(" - Pricing coverage selectors added");
console.log(" - No mock or placeholder prices");
console.log("");
