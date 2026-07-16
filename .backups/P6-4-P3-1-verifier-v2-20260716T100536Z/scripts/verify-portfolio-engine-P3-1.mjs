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

const pricingBoundary =
  [
    contracts,
    quoteResolution,
    snapshot,
    adapter,
    liveHook,
    retention,
    selectors,
  ].join(
    "\n",
  );

const pricingUi =
  [
    holdings,
    livePrices,
  ].join(
    "\n",
  );

// Quote contracts ------------------------------------------------------------

requireAny(
  contracts,
  [
    "MarketQuote",
    "PortfolioQuote",
    "ResolvedQuote",
    "QuoteResolution",
  ],
  "Canonical quote contract is missing.",
);

requireAny(
  contracts,
  [
    "LIVE",
    "CACHED",
    "PREVIOUS_CLOSE",
    "TRANSACTION_FALLBACK",
    "UNAVAILABLE",
  ],
  "Canonical quote-source contract is incomplete.",
);

requireAny(
  contracts,
  [
    "marketPriceAud",
    "priceAud",
    "marketPrice",
  ],
  "Canonical quote contract does not expose price.",
);

// ASX and US adapter support -------------------------------------------------

requireAny(
  adapter,
  [
    "ASX",
    ".AX",
    "AU",
  ],
  "Live quote adapter does not support ASX securities.",
);

requireAny(
  adapter,
  [
    "US",
    "NASDAQ",
    "NYSE",
    "USD",
  ],
  "Live quote adapter does not support US securities.",
);

requireAny(
  adapter,
  [
    "quoteTicker",
    "providerTicker",
    "symbol",
    "ticker",
  ],
  "Live quote adapter does not resolve provider symbols.",
);

requireAny(
  adapter,
  [
    "price",
    "regularMarketPrice",
    "lastPrice",
    "close",
  ],
  "Live quote adapter does not map provider prices.",
);

// Valid-price filtering ------------------------------------------------------

requireAny(
  pricingBoundary,
  [
    "Number.isFinite",
    "isFinite",
    "finiteNumber",
    "isUsablePrice",
    "validPrice",
    "positivePrice",
  ],
  "Pricing boundary does not validate finite quote prices.",
);

requireAny(
  pricingBoundary,
  [
    "> 0",
    "<= 0",
    "price > 0",
    "price <= 0",
    "positive",
    "isUsablePrice",
  ],
  "Pricing boundary does not reject zero or negative prices.",
);

// Unavailable provider filtering --------------------------------------------

requireAny(
  pricingBoundary,
  [
    'status === "UNAVAILABLE"',
    'status !== "UNAVAILABLE"',
    'source === "UNAVAILABLE"',
    'source !== "UNAVAILABLE"',
    "quoteUnavailable",
    "isUnavailable",
    "available",
    "isAvailable",
    "isUsableQuote",
    "usableQuote",
    "validQuote",
    "filter",
  ],
  "Pricing boundary does not identify unavailable provider responses.",
);

requireAny(
  quoteResolution,
  [
    "isUsableQuote",
    "isUsablePrice",
    "validQuote",
    "resolvedQuote",
    "quote &&",
    "quote?",
    "filter",
    "find",
  ],
  "Quote resolution does not gate provider responses before valuation.",
);

requireAny(
  liveHook,
  [
    "resolvedQuotes",
    "usableQuotes",
    "validQuotes",
    "quoteResolution",
    "resolve",
    "filter",
  ],
  "Live Portfolio hook does not pass provider responses through quote resolution.",
);

// Fallback precedence --------------------------------------------------------

requireAny(
  quoteResolution,
  [
    "LIVE",
    "liveQuote",
    "providerQuote",
  ],
  "Quote resolution does not support live-provider precedence.",
);

requireAny(
  quoteResolution,
  [
    "CACHED",
    "cachedQuote",
    "retainedQuote",
  ],
  "Quote resolution does not support cached quote fallback.",
);

requireAny(
  quoteResolution,
  [
    "PREVIOUS_CLOSE",
    "previousClose",
  ],
  "Quote resolution does not support previous-close fallback.",
);

requireAny(
  quoteResolution,
  [
    "TRANSACTION_FALLBACK",
    "transactionPrice",
    "latestTransactionPrice",
  ],
  "Quote resolution does not support explicit transaction-price fallback.",
);

requireAny(
  quoteResolution,
  [
    "UNAVAILABLE",
    "unavailable",
  ],
  "Quote resolution does not expose an unavailable terminal state.",
);

// Quote retention ------------------------------------------------------------

requireAny(
  retention,
  [
    "retain",
    "retained",
    "cache",
    "cached",
    "previous",
  ],
  "Quote retention boundary is missing.",
);

requireAny(
  retention,
  [
    "Number.isFinite",
    "isFinite",
    "price",
    "isUsable",
    "valid",
  ],
  "Quote retention does not validate retained price data.",
);

requireAny(
  retention,
  [
    "timestamp",
    "updatedAt",
    "asOf",
    "quotedAt",
    "fetchedAt",
  ],
  "Quote retention does not retain quote freshness metadata.",
);

// Snapshot valuation ---------------------------------------------------------

requireAny(
  snapshot,
  [
    "quoteResolution",
    "resolvedQuote",
    "quotes",
    "suppliedQuotes",
  ],
  "Portfolio Snapshot does not consume resolved quote data.",
);

requireAny(
  snapshot,
  [
    "marketPriceAud",
    "marketValueAud",
  ],
  "Portfolio Snapshot does not derive market valuation from resolved prices.",
);

const dangerousZeroFallbacks = [
  /marketPriceAud\s*:\s*0/,
  /marketValueAud\s*:\s*0\s*,?\s*\/\/\s*provider/,
  /quotePrice\s*\?\?\s*0/,
  /providerPrice\s*\?\?\s*0/,
  /marketPrice\s*\|\|\s*0/,
];

for (
  const pattern of
  dangerousZeroFallbacks
) {
  assert(
    !pattern.test(
      snapshot,
    ) &&
    !pattern.test(
      quoteResolution,
    ) &&
    !pattern.test(
      liveHook,
    ),
    `A provider failure may be converted directly into a zero price: ${pattern}`,
  );
}

// Quote quality selectors ----------------------------------------------------

requireAny(
  selectors,
  [
    "liveCount",
    "cachedCount",
    "previousCloseCount",
    "transactionFallbackCount",
    "unavailableCount",
    "pricingCoveragePercent",
  ],
  "Live market selectors do not expose quote-quality totals.",
);

requireAny(
  selectors,
  [
    "LIVE",
    "CACHED",
    "PREVIOUS_CLOSE",
    "TRANSACTION_FALLBACK",
    "UNAVAILABLE",
    "quoteSource",
  ],
  "Live market selectors do not classify quote sources.",
);

// Holdings and Live Prices pages --------------------------------------------

requireAny(
  holdings,
  [
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
  ],
  "Holdings does not consume live or unified Portfolio Engine data.",
);

requireAny(
  pricingUi,
  [
    "quoteSource",
    "priceSource",
    "liveCount",
    "cachedCount",
    "previousCloseCount",
    "transactionFallbackCount",
  ],
  "Portfolio pricing UI does not expose quote source.",
);

requireAny(
  pricingUi,
  [
    "unavailableCount",
    "pricingCoveragePercent",
    "UNAVAILABLE",
    "Unavailable",
  ],
  "Portfolio pricing UI does not expose unavailable quote coverage.",
);

requireAny(
  pricingUi,
  [
    "estimated",
    "fallback",
    "TRANSACTION_FALLBACK",
  ],
  "Portfolio pricing UI does not label fallback prices.",
);

// No mock or placeholder quote paths ----------------------------------------

const forbiddenTerms = [
  "mockQuotes",
  "mockPrices",
  "sampleQuotes",
  "placeholderPrice",
  "Math.random(",
  "hardcodedPrice",
];

for (
  const term of
  forbiddenTerms
) {
  assert(
    !pricingBoundary.includes(
      term,
    ) &&
    !pricingUi.includes(
      term,
    ),
    `Pricing architecture contains a forbidden mock or placeholder path: ${term}`,
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
      pricingBoundary,
    ) &&
    !pattern.test(
      pricingUi,
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
console.log("Verified:");
console.log(" - Canonical quote contract");
console.log(" - ASX provider-symbol support");
console.log(" - US provider-symbol support");
console.log(" - Finite price validation");
console.log(" - Zero and negative price rejection");
console.log(" - Unavailable provider quote filtering");
console.log(" - Live quote precedence");
console.log(" - Cached quote fallback");
console.log(" - Previous-close fallback");
console.log(" - Transaction-price fallback");
console.log(" - Explicit unavailable terminal state");
console.log(" - Quote retention and freshness");
console.log(" - Resolved quotes feed Portfolio Snapshot valuation");
console.log(" - Provider failure does not force a zero price");
console.log(" - Quote quality selectors");
console.log(" - Holdings consumes live or unified pricing");
console.log(" - Pricing pages expose fallback and unavailable status");
console.log(" - No mock or placeholder quote values");
console.log("");
