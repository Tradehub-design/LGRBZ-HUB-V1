import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
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

function readOptional(
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

function walkTsxFiles(
  directory,
) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const results = [];

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
    const absolutePath =
      path.join(
        directory,
        entry.name,
      );

    if (entry.isDirectory()) {
      results.push(
        ...walkTsxFiles(
          absolutePath,
        ),
      );

      continue;
    }

    if (
      entry.isFile() &&
      /\.(tsx|ts)$/.test(
        entry.name,
      )
    ) {
      results.push(
        absolutePath,
      );
    }
  }

  return results;
}

function importedLocalComponents(
  source,
) {
  const matches =
    source.matchAll(
      /from\s+["'](@\/[^"']+|\.\.?\/[^"']+)["']/g,
    );

  const resolved = [];

  for (const match of matches) {
    const importPath =
      match[1];

    let basePath;

    if (
      importPath.startsWith(
        "@/",
      )
    ) {
      basePath =
        path.join(
          root,
          "src",
          importPath.slice(2),
        );
    } else {
      basePath =
        path.resolve(
          path.dirname(
            path.join(
              root,
              files.holdingsPage,
            ),
          ),
          importPath,
        );
    }

    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      path.join(
        basePath,
        "index.ts",
      ),
      path.join(
        basePath,
        "index.tsx",
      ),
    ];

    for (const candidate of candidates) {
      if (
        fs.existsSync(
          candidate,
        ) &&
        fs.statSync(
          candidate,
        ).isFile()
      ) {
        resolved.push(
          candidate,
        );

        break;
      }
    }
  }

  return resolved;
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

const holdingsComponentDirectory =
  path.join(
    root,
    "src/components/holdings",
  );

const discoveredHoldingFiles =
  [
    ...walkTsxFiles(
      holdingsComponentDirectory,
    ),

    ...importedLocalComponents(
      holdingsPage,
    ),
  ];

const uniqueHoldingFiles =
  Array.from(
    new Set(
      discoveredHoldingFiles,
    ),
  );

const discoveredHoldingContent =
  uniqueHoldingFiles
    .map(
      (absolutePath) =>
        fs.readFileSync(
          absolutePath,
          "utf8",
        ),
    )
    .join("\n");

const combinedHoldingsUi =
  [
    holdingsPage,
    discoveredHoldingContent,
  ].join("\n");

// Canonical hook -------------------------------------------------------------

requireAny(
  holdingsPage,
  [
    "usePortfolioEngineSnapshot",
    "useLivePortfolioEngineSnapshot",
    "useUnifiedPortfolioDashboard",
  ],
  "Holdings page does not use an accepted Portfolio Engine hook.",
);

requirePattern(
  baseHook,
  /export\s+function\s+usePortfolioEngineSnapshot\s*\(/,
  "Base Portfolio Engine hook export is missing.",
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
  "Live Portfolio Engine hook does not consume canonical base state.",
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
  "Live Portfolio Engine hook does not expose quote resolution.",
);

// Holdings financial values -------------------------------------------------

requireAny(
  combinedHoldingsUi,
  [
    "marketValueAud",
    "valuation.marketValueAud",
    "securitiesMarketValueAud",
  ],
  "Holdings UI does not expose canonical market value.",
);

requireAny(
  combinedHoldingsUi,
  [
    "marketPriceAud",
    "valuation.marketPriceAud",
    "priceAud",
  ],
  "Holdings UI does not expose canonical market price.",
);

requireAny(
  combinedHoldingsUi,
  [
    "costBaseAud",
    "openCostBaseAud",
  ],
  "Holdings UI does not expose canonical cost base.",
);

requireAny(
  combinedHoldingsUi,
  [
    "averageCostAud",
    "averageCost",
  ],
  "Holdings UI does not expose canonical average cost.",
);

requireAny(
  combinedHoldingsUi,
  [
    "unrealisedGainAud",
    "unrealizedGainAud",
  ],
  "Holdings UI does not expose canonical unrealised P/L.",
);

requireAny(
  combinedHoldingsUi,
  [
    "realisedGainAud",
    "realizedGainAud",
  ],
  "Holdings UI does not expose canonical realised P/L.",
);

requireAny(
  combinedHoldingsUi,
  [
    "portfolioWeightPercent",
    "weightPercent",
  ],
  "Holdings UI does not expose canonical portfolio weight.",
);

// Pricing quality ------------------------------------------------------------

requireAny(
  combinedHoldingsUi,
  [
    "quoteSource",
    "priceSource",
    "sourceLabel",
    "liveCount",
    "cachedCount",
    "previousCloseCount",
    "transactionFallbackCount",
    "pricingCoveragePercent",
  ],
  "Holdings UI does not expose quote-source quality.",
);

requireAny(
  combinedHoldingsUi,
  [
    "LIVE",
    "live",
    "liveCount",
    "quoteSource",
  ],
  "Holdings UI does not preserve live quote status.",
);

requireAny(
  combinedHoldingsUi,
  [
    "CACHED",
    "cached",
    "cachedCount",
  ],
  "Holdings UI does not preserve cached quote status.",
);

requireAny(
  combinedHoldingsUi,
  [
    "PREVIOUS_CLOSE",
    "previous close",
    "previousCloseCount",
  ],
  "Holdings UI does not preserve previous-close status.",
);

requireAny(
  combinedHoldingsUi,
  [
    "TRANSACTION_FALLBACK",
    "transaction fallback",
    "transactionFallbackCount",
    "estimated",
    "fallback",
  ],
  "Holdings UI does not identify transaction fallback pricing.",
);

requireAny(
  combinedHoldingsUi,
  [
    "UNAVAILABLE",
    "unavailableCount",
    "missingQuote",
    "pricingCoveragePercent",
    "pricedHoldingCount",
  ],
  "Holdings UI does not expose unavailable quote coverage.",
);

// Contracts and selectors ----------------------------------------------------

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
  liveSelectors,
  [
    "quote",
    "pricing",
    "coverage",
    "fallback",
    "unavailable",
    "source",
  ],
  "Live-market selectors do not expose quote quality.",
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
  dashboardContracts,
  [
    "DashboardHoldingRow",
  ],
  "Dashboard holding contract is missing.",
);

requireAny(
  dashboardContracts,
  [
    "marketValueAud",
    "costBaseAud",
    "realisedGainAud",
    "unrealisedGainAud",
  ],
  "Dashboard holding contract is missing canonical financial fields.",
);

// Prevent cost-base substitution ---------------------------------------------

const dangerousPatterns = [
  /marketValueAud\s*:\s*holding\.costBaseAud/,
  /marketValueAud\s*=\s*holding\.costBaseAud/,
  /marketValue\s*:\s*holding\.costBase/,
  /marketValue\s*=\s*holding\.costBase/,
  /marketPriceAud\s*:\s*holding\.averageCostAud/,
  /marketPriceAud\s*=\s*holding\.averageCostAud/,
];

for (const pattern of dangerousPatterns) {
  assert(
    !pattern.test(
      combinedHoldingsUi,
    ) &&
    !pattern.test(
      compatibility,
    ),
    `Cost base or average cost is substituted for market valuation: ${pattern}`,
  );
}

// Legacy and placeholder scan -----------------------------------------------

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
    !combinedHoldingsUi.includes(
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
      combinedHoldingsUi,
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
    "Portfolio Engine P2.4 verification FAILED:",
  );
  console.error("");

  for (const failure of failures) {
    console.error(
      ` - ${failure}`,
    );
  }

  console.error("");
  console.error(
    `Discovered Holdings support files: ${uniqueHoldingFiles.length}`,
  );

  for (const file of uniqueHoldingFiles) {
    console.error(
      ` - ${path.relative(
        root,
        file,
      )}`,
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "Portfolio Engine P2.4 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Holdings uses an accepted Portfolio Engine hook");
console.log(" - Holdings component structure discovered dynamically");
console.log(` - Holdings support files discovered: ${uniqueHoldingFiles.length}`);
console.log(" - Canonical market price");
console.log(" - Canonical market value");
console.log(" - Canonical cost base");
console.log(" - Canonical average cost");
console.log(" - Canonical realised P/L");
console.log(" - Canonical unrealised P/L");
console.log(" - Canonical portfolio weight");
console.log(" - Live quote status");
console.log(" - Cached quote status");
console.log(" - Previous-close quote status");
console.log(" - Transaction fallback status");
console.log(" - Unavailable quote coverage");
console.log(" - Cost base is not substituted for market value");
console.log(" - No legacy holdings calculator");
console.log(" - No mock or placeholder values");
console.log("");
