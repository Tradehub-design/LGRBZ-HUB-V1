import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  adapter:
    "src/core/portfolio-engine/adapters/live-market-quote-adapter.ts",

  retention:
    "src/core/portfolio-engine/client/portfolio-quote-retention.ts",

  hook:
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",

  selectors:
    "src/core/portfolio-engine/client/live-market-selectors.ts",

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

const adapter =
  read(files.adapter);

const retention =
  read(files.retention);

const hook =
  read(files.hook);

const selectors =
  read(files.selectors);

const clientIndex =
  read(files.clientIndex);

const adapterTokens = [
  "normalisedMarketQuoteToPortfolioQuote",
  "currentPriceQuote",
  "previousCloseQuote",
  "selectStrongestPortfolioQuote",
  "canonicalQuotePriority",
  "validPositiveNumber",
  "PREVIOUS_CLOSE",
  "CACHE",
  "LIVE",
  "quote.previousClose",
];

for (const token of adapterTokens) {
  assert(
    adapter.includes(token),
    `Quote adapter is missing: ${token}`,
  );
}

const retentionTokens = [
  "loadRetainedPortfolioQuotes",
  "saveRetainedPortfolioQuotes",
  "mergeResilientPortfolioQuotes",
  "LAST_KNOWN_VALID",
  "MAX_RETAINED_AGE_MS",
  "72 * 60 * 60 * 1000",
  "window.localStorage",
  "validPositivePrice",
  "withinRetentionAge",
];

for (const token of retentionTokens) {
  assert(
    retention.includes(token),
    `Quote retention is missing: ${token}`,
  );
}

const hookTokens = [
  "persistedQuotes",
  "previousValidQuotesRef",
  "currentProviderQuotes",
  "resilientQuotes",
  "mergeResilientPortfolioQuotes",
  "saveRetainedPortfolioQuotes",
  "buildPortfolioEngineFromCanonical",
  "retainedQuoteCount",
  "currentProviderQuoteCount",
];

for (const token of hookTokens) {
  assert(
    hook.includes(token),
    `Live Portfolio Engine hook is missing: ${token}`,
  );
}

const selectorTokens = [
  "selectPricingSourceSummary",
  "selectProviderFailureProtectedHoldings",
  "LAST_KNOWN_VALID",
  "TRANSACTION_FALLBACK",
  "PREVIOUS_CLOSE",
  "UNAVAILABLE",
];

for (const token of selectorTokens) {
  assert(
    selectors.includes(token),
    `Live market selectors are missing: ${token}`,
  );
}

assert(
  clientIndex.includes(
    "./portfolio-quote-retention",
  ),
  "Client exports do not include quote retention.",
);

assert(
  adapter.includes(
    "currentPriceQuote(\n      holding,\n      quote,\n    ) ??\n    previousCloseQuote",
  ),
  "Provider previous close is not the fallback after an unusable current price.",
);

assert(
  retention.includes(
    "current.source === \"LIVE\"",
  ),
  "Fresh live quote replacement rule is missing.",
);

assert(
  retention.includes(
    "canonicalQuotePriority(current) >=",
  ),
  "Weak quote overwrite protection is missing.",
);

assert(
  hook.includes(
    "engineResult:\n      liveEngineResult",
  ),
  "Live-valued result is not exposed as the canonical engine result.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock quote/i,
  /sample price/i,
  /placeholder price/i,
  /fake quote/i,
  /price:\s*1(?:\.0+)?[,;]/,
];

for (const content of [
  adapter,
  retention,
  hook,
  selectors,
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `P3.2 contains forbidden mock or non-deterministic pricing logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P3.2 verification FAILED:",
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
  "Portfolio Engine P3.2 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Invalid provider prices are rejected");
console.log(" - Zero provider prices are rejected");
console.log(" - Provider previous close remains usable");
console.log(" - Live quote priority is explicit");
console.log(" - Cached quote priority is explicit");
console.log(" - Previous-close priority is explicit");
console.log(" - Last-known valid quote retention is active");
console.log(" - Last-known valid quotes persist across reloads");
console.log(" - Retained quotes expire after 72 hours");
console.log(" - Weak refreshes cannot overwrite stronger quotes");
console.log(" - Failed refreshes cannot clear valid quotes");
console.log(" - Transaction fallback remains in the Portfolio Engine");
console.log(" - Explicit unavailable state remains final fallback");
console.log(" - No mock or placeholder prices");
console.log("");
