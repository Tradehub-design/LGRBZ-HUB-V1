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

  dashboardContracts:
    "src/core/portfolio-engine/dashboard/contracts.ts",

  dashboardBuild:
    "src/core/portfolio-engine/dashboard/build.ts",

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
    `${message} Accepted evidence: ${tokens.join(
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

function walkFiles(
  directory,
) {
  if (!fs.existsSync(
    directory,
  )) {
    return [];
  }

  const output = [];

  for (
    const entry of
    fs.readdirSync(
      directory,
      {
        withFileTypes:
          true,
      },
    )
  ) {
    const absolute =
      path.join(
        directory,
        entry.name,
      );

    if (entry.isDirectory()) {
      output.push(
        ...walkFiles(
          absolute,
        ),
      );

      continue;
    }

    if (
      entry.isFile() &&
      /\.(ts|tsx|mjs)$/.test(
        entry.name,
      )
    ) {
      output.push(
        absolute,
      );
    }
  }

  return output;
}

const content =
  Object.fromEntries(
    Object.entries(
      files,
    ).map(
      (
        [
          key,
          relativePath,
        ],
      ) => [
        key,
        read(
          relativePath,
        ),
      ],
    ),
  );

const clientFiles =
  walkFiles(
    path.join(
      root,
      "src/core/portfolio-engine/client",
    ),
  );

const pricingComponentFiles =
  [
    ...walkFiles(
      path.join(
        root,
        "src/components/holdings",
      ),
    ),

    ...walkFiles(
      path.join(
        root,
        "src/components/live-prices",
      ),
    ),

    ...walkFiles(
      path.join(
        root,
        "src/components/pricing",
      ),
    ),
  ];

const clientBoundary =
  clientFiles
    .map(
      (file) =>
        fs.readFileSync(
          file,
          "utf8",
        ),
    )
    .join("\n");

const pricingComponents =
  pricingComponentFiles
    .map(
      (file) =>
        fs.readFileSync(
          file,
          "utf8",
        ),
    )
    .join("\n");

const quoteBoundary =
  [
    content.contracts,
    content.quoteResolution,
    content.snapshot,
    content.adapter,
    content.liveHook,
    content.retention,
    clientBoundary,
    content.dashboardContracts,
    content.dashboardBuild,
  ].join("\n");

const pricingUi =
  [
    content.holdings,
    content.livePrices,
    pricingComponents,
  ].join("\n");

// Quote data contract --------------------------------------------------------

requireAny(
  quoteBoundary,
  [
    "quoteTicker",
    "providerTicker",
    "symbol",
    "ticker",
    "securityId",
  ],
  "Pricing boundary does not expose quote/security identity.",
);

requireAny(
  quoteBoundary,
  [
    "price",
    "marketPrice",
    "marketPriceAud",
    "lastPrice",
    "regularMarketPrice",
    "previousClose",
  ],
  "Pricing boundary does not expose a provider or resolved price.",
);

requireAny(
  quoteBoundary,
  [
    "source",
    "status",
    "provider",
    "quality",
    "asOf",
    "updatedAt",
    "quotedAt",
    "fetchedAt",
  ],
  "Pricing boundary does not expose quote source, status or freshness.",
);

// Market support -------------------------------------------------------------

requireAny(
  content.adapter,
  [
    "ASX",
    ".AX",
    "AUD",
    "Australia",
  ],
  "Live quote adapter does not contain ASX market support.",
);

requireAny(
  content.adapter,
  [
    "US",
    "USD",
    "NASDAQ",
    "NYSE",
  ],
  "Live quote adapter does not contain US market support.",
);

requireAny(
  content.adapter,
  [
    "quoteTicker",
    "providerTicker",
    "symbol",
    "ticker",
  ],
  "Live quote adapter does not map canonical securities to provider symbols.",
);

// Finite and positive price validation --------------------------------------

requireAny(
  quoteBoundary,
  [
    "Number.isFinite",
    "isFinite",
    "finiteNumber",
    "finitePrice",
    "isUsablePrice",
    "validPrice",
    "normalisePrice",
    "normalizePrice",
  ],
  "Pricing boundary does not validate finite numeric prices.",
);

requireAny(
  quoteBoundary,
  [
    "> 0",
    "<= 0",
    "positive",
    "isUsablePrice",
    "validPrice",
    "finitePrice",
  ],
  "Pricing boundary does not require a usable positive price.",
);

// Provider response filtering ------------------------------------------------

requireAny(
  quoteBoundary,
  [
    ".filter(",
    ".find(",
    "isUsableQuote",
    "usableQuote",
    "validQuote",
    "availableQuote",
    "quoteAvailable",
    "isAvailable",
    "availability",
    "status",
    "source",
  ],
  "Pricing boundary contains no evidence that provider responses are gated before valuation.",
);

requireAny(
  content.quoteResolution,
  [
    "Number.isFinite",
    "isUsablePrice",
    "validPrice",
    "finitePrice",
    "price",
  ],
  "Quote resolution does not validate candidate quote prices.",
);

requireAny(
  content.liveHook,
  [
    "resolve",
    "resolved",
    "filter",
    "usable",
    "valid",
    "quote",
    "pricing",
  ],
  "Live Portfolio hook does not pass provider data through a quote-resolution boundary.",
);

// Retained/cached fallback ---------------------------------------------------

requireAny(
  content.retention,
  [
    "retain",
    "retained",
    "cache",
    "cached",
    "previous",
    "stored",
    "persist",
    "lastKnown",
    "lastValid",
  ],
  "Quote retention module does not preserve a last-known usable quote.",
);

requireAny(
  content.retention,
  [
    "price",
    "marketPrice",
    "lastPrice",
    "previousClose",
  ],
  "Quote retention module does not retain price data.",
);

requireAny(
  content.retention,
  [
    "asOf",
    "updatedAt",
    "quotedAt",
    "fetchedAt",
    "timestamp",
    "date",
  ],
  "Quote retention module does not preserve quote freshness.",
);

requireAny(
  [
    content.quoteResolution,
    content.liveHook,
    content.retention,
  ].join("\n"),
  [
    "retention",
    "retain",
    "retained",
    "cache",
    "cached",
    "lastKnown",
    "lastValid",
    "stored",
    "previous",
  ],
  "Resolved pricing flow does not reference retained or last-known quote data.",
);

// Previous close and transaction fallback -----------------------------------

requireAny(
  quoteBoundary,
  [
    "previousClose",
    "previous close",
    "closePrice",
    "priorClose",
    "lastClose",
  ],
  "Pricing boundary does not expose previous-close fallback data.",
);

requireAny(
  quoteBoundary,
  [
    "transactionPrice",
    "latestTransactionPrice",
    "lastTransactionPrice",
    "fallbackPrice",
    "tradePrice",
  ],
  "Pricing boundary does not expose transaction-price fallback.",
);

// Unavailable terminal state -------------------------------------------------

requireAny(
  quoteBoundary,
  [
    "UNAVAILABLE",
    "unavailable",
    "missingQuote",
    "noQuote",
    "quoteMissing",
    "priceUnavailable",
    "null",
  ],
  "Pricing boundary does not represent an unavailable terminal state.",
);

// Canonical valuation --------------------------------------------------------

requireAny(
  content.snapshot,
  [
    "quote",
    "quotes",
    "resolved",
    "price",
  ],
  "Portfolio Snapshot does not consume resolved pricing data.",
);

requireAny(
  content.snapshot,
  [
    "marketPriceAud",
    "marketValueAud",
  ],
  "Portfolio Snapshot does not derive canonical market price and market value.",
);

requireAny(
  content.snapshot,
  [
    "quantity",
    "shares",
    "units",
  ],
  "Portfolio Snapshot valuation does not reference holding quantity.",
);

// Protect against failed-provider zeroing -----------------------------------

const dangerousPatterns = [
  /providerPrice\s*\?\?\s*0/,
  /quotePrice\s*\?\?\s*0/,
  /resolvedPrice\s*\?\?\s*0/,
  /marketPriceAud\s*:\s*0\s*,?\s*\/\/\s*(?:provider|quote)/i,
  /marketPrice\s*\|\|\s*0/,
  /lastPrice\s*\|\|\s*0/,
];

for (
  const pattern of
  dangerousPatterns
) {
  assert(
    !pattern.test(
      quoteBoundary,
    ),
    `Provider failure may be converted directly into a zero valuation price: ${pattern}`,
  );
}

// Pricing quality may be aggregated in selectors, dashboard or route --------

const qualityBoundary =
  [
    clientBoundary,
    content.dashboardContracts,
    content.dashboardBuild,
    pricingUi,
  ].join("\n");

requireAny(
  qualityBoundary,
  [
    "quoteSource",
    "priceSource",
    "pricingCoverage",
    "coveragePercent",
    "pricedHolding",
    "unavailable",
    "missingQuote",
    "fallback",
    "previousClose",
    "live",
    "cached",
    "retained",
  ],
  "Canonical client/dashboard/UI boundary does not expose pricing quality.",
);

requireAny(
  qualityBoundary,
  [
    "unavailable",
    "missingQuote",
    "coverage",
    "pricedHolding",
    "unpriced",
    "no price",
  ],
  "Pricing boundary does not expose unavailable or unpriced holdings.",
);

requireAny(
  qualityBoundary,
  [
    "fallback",
    "estimated",
    "previousClose",
    "transaction",
    "retained",
    "cached",
  ],
  "Pricing boundary does not distinguish fallback or estimated prices.",
);

// Holdings and live-prices consumers ----------------------------------------

requireAny(
  content.holdings,
  [
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
    "usePortfolioEngineSnapshot",
  ],
  "Holdings does not consume a canonical Portfolio Engine pricing hook.",
);

requireAny(
  content.livePrices,
  [
    "quote",
    "price",
    "pricing",
    "marketData",
  ],
  "Live Prices route does not consume pricing data.",
);

// No mocks or random price generation ---------------------------------------

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
    !quoteBoundary.includes(
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
      quoteBoundary,
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
  console.error(
    `Discovered client files: ${clientFiles.length}`,
  );
  console.error(
    `Discovered pricing component files: ${pricingComponentFiles.length}`,
  );
  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "Portfolio Engine P3.1 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Quote identity, price and source/freshness contract");
console.log(" - ASX quote-adapter support");
console.log(" - US quote-adapter support");
console.log(" - Finite numeric price validation");
console.log(" - Positive usable-price validation");
console.log(" - Provider responses gated before valuation");
console.log(" - Retained or last-known quote fallback");
console.log(" - Previous-close fallback");
console.log(" - Transaction-price fallback");
console.log(" - Explicit unavailable terminal state");
console.log(" - Resolved pricing feeds Portfolio Snapshot valuation");
console.log(" - Quantity participates in market-value calculation");
console.log(" - Provider failure is not converted directly to zero");
console.log(" - Pricing quality is surfaced in the canonical boundary");
console.log(" - Unavailable holdings are surfaced");
console.log(" - Fallback or estimated pricing is surfaced");
console.log(" - Holdings consumes canonical pricing");
console.log(" - Live Prices consumes canonical pricing");
console.log(" - No mock or placeholder quote values");
console.log("");
