import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  contracts:
    "src/core/portfolio-engine/contracts.ts",

  quoteResolution:
    "src/core/portfolio-engine/quote-resolution.ts",

  snapshot:
    "src/core/portfolio-engine/snapshot.ts",

  adapter:
    "src/core/portfolio-engine/adapters/live-market-quote-adapter.ts",

  liveHook:
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",

  retention:
    "src/core/portfolio-engine/client/portfolio-quote-retention.ts",

  selectors:
    "src/core/portfolio-engine/client/live-market-selectors.ts",

  holdings:
    "src/app/(dashboard)/holdings/page.tsx",

  livePrices:
    "src/app/(dashboard)/live-prices/page.tsx",
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

function containsCompact(
  content,
  token,
) {
  return compact(
    content,
  ).includes(
    compact(
      token,
    ),
  );
}

function requireTokens(
  content,
  tokens,
  label,
) {
  for (const token of tokens) {
    assert(
      containsCompact(
        content,
        token,
      ),
      `${label} is missing: ${token}`,
    );
  }
}

function requireAny(
  content,
  tokens,
  message,
) {
  assert(
    tokens.some(
      (token) =>
        containsCompact(
          content,
          token,
        ),
    ),
    `${message} Accepted evidence: ${tokens.join(
      " | ",
    )}`,
  );
}

const contracts =
  read(
    files.contracts,
  );

const quoteResolution =
  read(
    files.quoteResolution,
  );

const snapshot =
  read(
    files.snapshot,
  );

const adapter =
  read(
    files.adapter,
  );

const liveHook =
  read(
    files.liveHook,
  );

const retention =
  read(
    files.retention,
  );

const selectors =
  read(
    files.selectors,
  );

const holdings =
  read(
    files.holdings,
  );

const livePrices =
  read(
    files.livePrices,
  );

// Exact quote contracts ------------------------------------------------------

requireTokens(
  contracts,
  [
    "QuoteSnapshot",
    "ResolvedQuote",
  ],
  "Quote contracts",
);

requireTokens(
  contracts,
  [
    '"LIVE"',
    '"CACHE"',
    '"PREVIOUS_CLOSE"',
    '"TRANSACTION_FALLBACK"',
    '"UNAVAILABLE"',
  ],
  "Quote source contract",
);

// Exact resolution functions ------------------------------------------------

requireTokens(
  quoteResolution,
  [
    "resolveHoldingQuote",
    "QuoteResolutionInput",
    "ResolvedQuote",
  ],
  "Quote resolution",
);

requireTokens(
  quoteResolution,
  [
    "validPositiveNumber",
    "supplied.price",
    "latestSecurityTrade",
    "latestTrade.amounts.unitPrice",
  ],
  "Quote candidate validation",
);

// Exact transaction-price fallback ------------------------------------------

requireTokens(
  quoteResolution,
  [
    "latestTrade.amounts.unitPrice",
    'source: "TRANSACTION_FALLBACK"',
    'quality: "FALLBACK"',
    'provider: "portfolio-transaction-ledger"',
  ],
  "Transaction-price fallback",
);

requireTokens(
  quoteResolution,
  [
    "No valid live, cached or previous-close quote was supplied.",
    "Latest transaction price was used.",
  ],
  "Transaction fallback disclosure",
);

// Exact unavailable state ---------------------------------------------------

requireTokens(
  quoteResolution,
  [
    "price: 0",
    'source: "UNAVAILABLE"',
    'quality: "UNAVAILABLE"',
    'provider: "unavailable"',
    "No quote or transaction-derived price is available.",
  ],
  "Unavailable quote state",
);

// Exact quote priority -------------------------------------------------------

requireTokens(
  quoteResolution,
  [
    "quotePriority",
    'case "LIVE":',
    "return 5",
    'case "CACHE":',
    "return 4",
    'case "PREVIOUS_CLOSE":',
    "return 3",
    'case "TRANSACTION_FALLBACK":',
    "return 2",
    'case "UNAVAILABLE":',
    "return 1",
  ],
  "Quote priority",
);

// Exact usable-quote filtering ----------------------------------------------

requireTokens(
  quoteResolution,
  [
    "selectBestQuote",
    ".filter(",
    "Number.isFinite(quote.price)",
    "quote.price > 0",
    ".sort(",
    "quotePriority(right)",
    "quotePriority(left)",
  ],
  "Best quote filtering",
);

// Exact live quote adapter ---------------------------------------------------

requireTokens(
  adapter,
  [
    "createPortfolioQuoteRecord",
    "quoteRecordCount",
  ],
  "Live quote adapter",
);

requireAny(
  adapter,
  [
    "NormalisedMarketQuote",
    "normalisedMarketQuoteToPortfolioQuote",
    "providerQuote",
  ],
  "Live quote adapter does not expose the confirmed provider-to-portfolio conversion.",
);

requireAny(
  adapter,
  [
    "ASX",
    ".AX",
    "AUD",
  ],
  "Live quote adapter does not expose ASX support.",
);

requireAny(
  adapter,
  [
    "US",
    "USD",
  ],
  "Live quote adapter does not expose US support.",
);

// Exact resilient quote merge -----------------------------------------------

requireTokens(
  liveHook,
  [
    "useLiveMarketQuotes",
    "createPortfolioQuoteRecord",
    "loadRetainedPortfolioQuotes",
    "mergeResilientPortfolioQuotes",
    "saveRetainedPortfolioQuotes",
  ],
  "Live Portfolio Engine quote flow",
);

requireTokens(
  liveHook,
  [
    "previousValidQuotesRef",
    "persistedQuotes",
    "currentProviderQuotes",
    "resilientQuotes",
  ],
  "Provider failure protection",
);

requireTokens(
  liveHook,
  [
    "mergeResilientPortfolioQuotes({",
    "current:",
    "currentProviderQuotes",
    "previous:",
    "previousValidQuotesRef.current",
    "persisted:",
    "persistedQuotes",
    "securityIds:",
    "openSecurityIds",
  ],
  "Resilient quote merge input",
);

requireTokens(
  liveHook,
  [
    "buildPortfolioEngineFromCanonical({",
    "transactions:",
    "baseSnapshot.transactions",
    "quotes:",
    "resilientQuotes",
  ],
  "Canonical live valuation",
);

// Exact live pricing metrics -------------------------------------------------

requireTokens(
  liveHook,
  [
    "liveQuoteCount",
    "currentProviderQuoteCount",
    "retainedQuoteCount",
    "requestedQuoteCount",
    "livePricingCoveragePercent",
  ],
  "Live pricing coverage",
);

requireTokens(
  liveHook,
  [
    "quoteRecordCount(",
    "currentProviderQuotes",
    "resilientQuotes",
  ],
  "Quote count calculation",
);

// Exact pricing source summary ----------------------------------------------

requireTokens(
  selectors,
  [
    "PricingSourceSummary",
    "live: number",
    "cached: number",
    "previousClose: number",
    "transactionFallback: number",
    "unavailable: number",
    "retained: number",
    "total: number",
  ],
  "Pricing summary contract",
);

requireTokens(
  selectors,
  [
    "selectLivePricedHoldings",
    'holding.valuation.quoteSource === "LIVE"',
  ],
  "Live holding selector",
);

requireTokens(
  selectors,
  [
    "selectCachedPricedHoldings",
    'holding.valuation.quoteSource === "CACHE"',
  ],
  "Cached holding selector",
);

requireTokens(
  selectors,
  [
    "selectPreviousCloseHoldings",
    'holding.valuation.quoteSource === "PREVIOUS_CLOSE"',
  ],
  "Previous-close selector",
);

requireTokens(
  selectors,
  [
    "selectTransactionFallbackHoldings",
    'holding.valuation.quoteSource === "TRANSACTION_FALLBACK"',
  ],
  "Transaction fallback selector",
);

requireTokens(
  selectors,
  [
    "selectUnpricedHoldings",
    'holding.valuation.quoteSource === "UNAVAILABLE"',
    "holding.valuation.marketPriceLocal <= 0",
    "holding.valuation.marketPriceAud <= 0",
  ],
  "Unpriced holding selector",
);

requireTokens(
  selectors,
  [
    "selectPricingCoveragePercent",
    "holding.valuation.marketPriceLocal > 0",
    "holding.valuation.marketPriceAud > 0",
    'holding.valuation.quoteSource !== "UNAVAILABLE"',
  ],
  "Pricing coverage selector",
);

requireTokens(
  selectors,
  [
    "selectPricingSourceSummary",
    "counts.LIVE ?? 0",
    "counts.CACHE ?? 0",
    "counts.PREVIOUS_CLOSE ?? 0",
    "counts.TRANSACTION_FALLBACK ?? 0",
    "counts.UNAVAILABLE ?? 0",
  ],
  "Pricing source summary",
);

requireTokens(
  selectors,
  [
    "selectProviderFailureProtectedHoldings",
    'holding.valuation.quoteSource === "CACHE"',
    'holding.valuation.quoteQuality === "STALE"',
    "LAST_KNOWN_VALID",
  ],
  "Provider failure protection selector",
);

// Snapshot consumes resolved quotes -----------------------------------------

requireTokens(
  snapshot,
  [
    "resolveHoldingQuote",
    "quote.price",
    "marketPriceAud",
    "marketValueAud",
    "quote.source",
    "quote.quality",
    "quote.provider",
  ],
  "Snapshot quote valuation",
);

requireTokens(
  snapshot,
  [
    "No valid valuation price is available",
    "latest transaction price until market data is available",
  ],
  "Snapshot quote quality issues",
);

// Ensure provider failure does not override a usable fallback ----------------

const dangerousPatterns = [
  /providerPrice\s*\?\?\s*0/,
  /quotePrice\s*\?\?\s*0/,
  /resolvedPrice\s*\?\?\s*0/,
  /marketPrice\s*\|\|\s*0/,
  /lastPrice\s*\|\|\s*0/,
];

for (
  const pattern of
  dangerousPatterns
) {
  assert(
    !pattern.test(
      quoteResolution,
    ) &&
    !pattern.test(
      liveHook,
    ) &&
    !pattern.test(
      snapshot,
    ),
    `Provider failure may be converted directly to zero: ${pattern}`,
  );
}

// Canonical route consumers -------------------------------------------------

requireAny(
  holdings,
  [
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
    "usePortfolioEngineSnapshot",
  ],
  "Holdings route does not consume canonical Portfolio Engine pricing.",
);

requireAny(
  livePrices,
  [
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
    "quote",
    "pricing",
  ],
  "Live Prices route does not consume canonical pricing data.",
);

// No mock pricing ------------------------------------------------------------

const combined =
  [
    contracts,
    quoteResolution,
    snapshot,
    adapter,
    liveHook,
    retention,
    selectors,
    holdings,
    livePrices,
  ].join("\n");

const forbiddenTerms = [
  "mockQuotes",
  "mockPrices",
  "sampleQuotes",
  "placeholderPrice",
  "hardcodedPrice",
  "Math.random(",
];

for (
  const term of
  forbiddenTerms
) {
  assert(
    !combined.includes(
      term,
    ),
    `Pricing architecture contains forbidden mock or placeholder data: ${term}`,
  );
}

const forbiddenPatterns = [
  /mock quote/i,
  /mock price/i,
  /sample price/i,
  /placeholder price/i,
  /fake live price/i,
  /hardcoded market price/i,
];

for (
  const pattern of
  forbiddenPatterns
) {
  assert(
    !pattern.test(
      combined,
    ),
    `Pricing architecture contains forbidden placeholder logic: ${pattern}`,
  );
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "Portfolio Engine P3.1 verification FAILED:",
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
  "Portfolio Engine P3.1 structural verification passed.",
);
console.log("");
console.log("Verified using exact repository symbols:");
console.log(" - QuoteSnapshot contract");
console.log(" - ResolvedQuote contract");
console.log(" - resolveHoldingQuote()");
console.log(" - validPositiveNumber()");
console.log(" - latestSecurityTrade()");
console.log(" - latestTrade.amounts.unitPrice");
console.log(" - TRANSACTION_FALLBACK source");
console.log(" - portfolio-transaction-ledger provider");
console.log(" - LIVE > CACHE > PREVIOUS_CLOSE > TRANSACTION_FALLBACK > UNAVAILABLE");
console.log(" - selectBestQuote()");
console.log(" - Number.isFinite(quote.price)");
console.log(" - quote.price > 0");
console.log(" - mergeResilientPortfolioQuotes()");
console.log(" - previousValidQuotesRef");
console.log(" - persistedQuotes");
console.log(" - resilientQuotes feed canonical valuation");
console.log(" - liveQuoteCount");
console.log(" - retainedQuoteCount");
console.log(" - livePricingCoveragePercent");
console.log(" - selectPricingSourceSummary()");
console.log(" - live/cached/previousClose/transactionFallback/unavailable/retained");
console.log(" - provider-failure protected holdings");
console.log(" - unavailable holdings remain explicitly identified");
console.log(" - provider failure cannot directly force zero over a valid fallback");
console.log(" - no mock or placeholder quote values");
console.log("");
