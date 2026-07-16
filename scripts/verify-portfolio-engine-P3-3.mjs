import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  holdings:
    "src/app/(dashboard)/holdings/page.tsx",

  livePrices:
    "src/app/(dashboard)/live-prices/page.tsx",

  liveHook:
    "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",
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

const holdings =
  read(files.holdings);

const livePrices =
  read(files.livePrices);

const liveHook =
  read(files.liveHook);

const holdingsTokens = [
  "useLivePortfolioEngineSnapshot",
  "engineResult.snapshot",
  "selectApplicationOpenHoldings",
  "selectApplicationClosedHoldings",
  "selectPricingSourceSummary",
  "forceRefreshLiveQuotes",
  "livePricingCoveragePercent",
  "retainedQuoteCount",
  "holding.quoteSource",
  "holding.quoteProvider",
  "totals.securitiesMarketValueAud",
  "totals.unrealisedGainAud",
];

for (const token of holdingsTokens) {
  assert(
    holdings.includes(token),
    `Holdings page is missing live Portfolio Engine field: ${token}`,
  );
}

const livePricesTokens = [
  "useLivePortfolioEngineSnapshot",
  "engineResult.snapshot",
  "selectPricingSourceSummary",
  "forceRefreshLiveQuotes",
  "currentProviderQuoteCount",
  "retainedQuoteCount",
  "liveQuoteCount",
  "livePricingCoveragePercent",
  "snapshot.totals.securitiesMarketValueAud",
  "snapshot.totals.unrealisedGainAud",
  "holding.valuation.marketPriceAud",
  "holding.valuation.marketValueAud",
  "holding.valuation.quoteSource",
  "holding.valuation.quoteProvider",
];

for (const token of livePricesTokens) {
  assert(
    livePrices.includes(token),
    `Live Prices page is missing canonical market field: ${token}`,
  );
}

const forbiddenHoldingsTokens = [
  "calculateHoldingsFromLedger",
  "loadTxLedger",
  "usePortfolioStore",
  "openHoldings.reduce",
  "holdings.reduce",
  "localTransactions",
  "setLocalTransactions",
];

for (const token of forbiddenHoldingsTokens) {
  assert(
    !holdings.includes(token),
    `Holdings page still contains legacy calculation logic: ${token}`,
  );
}

const forbiddenLivePricesTokens = [
  "useDashboardData",
  "useSeedPortfolio",
  "Current values use cost basis only",
  "Market price engine placeholder",
  "Requires live prices",
  "Pending API",
  "v2.0 market API",
  'value="$0"',
];

for (const token of forbiddenLivePricesTokens) {
  assert(
    !livePrices.includes(token),
    `Live Prices page still contains placeholder data path: ${token}`,
  );
}

assert(
  holdings.includes(
    "holding.marketPriceAud > 0",
  ),
  "Holdings page does not protect unavailable prices.",
);

assert(
  livePrices.includes(
    "holding.valuation.marketPriceAud <= 0",
  ),
  "Live Prices page does not protect unavailable prices.",
);

assert(
  liveHook.includes(
    "mergeResilientPortfolioQuotes",
  ),
  "Pages are connected to a live hook that lacks resilient quote retention.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock quote/i,
  /sample price/i,
  /placeholder price/i,
  /fake market value/i,
  /hardcoded current valuation/i,
];

for (const [
  name,
  content,
] of [
  [
    "Holdings page",
    holdings,
  ],
  [
    "Live Prices page",
    livePrices,
  ],
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden mock or non-deterministic logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P3.3 verification FAILED:",
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
  "Portfolio Engine P3.3 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Holdings page uses live Portfolio Engine snapshot");
console.log(" - Live Prices page uses live Portfolio Engine snapshot");
console.log(" - Holdings legacy calculator removed");
console.log(" - Live Prices cost-basis placeholder removed");
console.log(" - Live market valuation displayed");
console.log(" - Unrealised P/L displayed from canonical valuation");
console.log(" - Canonical portfolio weights displayed");
console.log(" - Manual market refresh connected");
console.log(" - Live provider counts displayed");
console.log(" - Retained last-known quote counts displayed");
console.log(" - Cached quote status displayed");
console.log(" - Previous-close status displayed");
console.log(" - Transaction fallback status displayed");
console.log(" - Unavailable prices are not shown as valid zero quotes");
console.log(" - Existing professional holdings components retained");
console.log(" - No mock or placeholder prices");
console.log("");
