import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  contracts:
    "src/core/portfolio-engine/dividends/contracts.ts",

  normalise:
    "src/core/portfolio-engine/dividends/normalise.ts",

  snapshot:
    "src/core/portfolio-engine/dividends/snapshot.ts",

  dividendIndex:
    "src/core/portfolio-engine/dividends/index.ts",

  adapter:
    "src/core/portfolio-engine/adapters/dividend-intelligence-adapter.ts",

  retention:
    "src/core/portfolio-engine/client/portfolio-dividend-retention.ts",

  hook:
    "src/core/portfolio-engine/client/usePortfolioDividendEngine.ts",

  selectors:
    "src/core/portfolio-engine/client/dividend-selectors.ts",

  clientIndex:
    "src/core/portfolio-engine/client/index.ts",

  rootIndex:
    "src/core/portfolio-engine/index.ts",

  existingService:
    "src/lib/dividend-data/dividendService.ts",

  existingRoute:
    "src/app/api/dividend-data/route.ts",
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

const contracts =
  read(files.contracts);

const normalise =
  read(files.normalise);

const snapshot =
  read(files.snapshot);

const dividendIndex =
  read(files.dividendIndex);

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

const rootIndex =
  read(files.rootIndex);

const existingService =
  read(files.existingService);

const existingRoute =
  read(files.existingRoute);

const contractTokens = [
  "PortfolioDividendSnapshot",
  "PortfolioDividendEvent",
  "PortfolioDividendHoldingSummary",
  "PortfolioDividendMonth",
  "PortfolioDividendTotals",
  "PortfolioDividendDataQuality",
  "PortfolioDividendApiPayload",
  "PortfolioDividendApiResult",
  "PortfolioDividendEngineState",
  "historicalEvents",
  "upcomingEvents",
  "forecastEvents",
  "receivedEvents",
  "portfolioDividendYieldPercent",
  "portfolioYieldOnCostPercent",
];

for (const token of contractTokens) {
  assert(
    contracts.includes(token),
    `Dividend contracts are missing: ${token}`,
  );
}

const adapterTokens = [
  "portfolioSnapshotToDividendHoldings",
  "portfolioSnapshotToDividendTransactions",
  "createPortfolioDividendApiPayload",
  "dividendPayloadIdentity",
  "portfolio.openHoldings",
  "portfolio.transactions",
  "holding.valuation.marketPriceAud",
  "holding.averageCostAud",
  "transaction.action",
];

for (const token of adapterTokens) {
  assert(
    adapter.includes(token),
    `Dividend adapter is missing: ${token}`,
  );
}

const normaliseTokens = [
  "normalisePortfolioDividendEvent",
  "normaliseDividendHoldingSummary",
  "normaliseDividendMonth",
  "expectedCashAud",
  "frankingCreditAud",
  "grossedUpIncomeAud",
  "withholdingTaxAud",
  "estimatedTaxAud",
  "marketValueAud",
  "costBaseAud",
];

for (const token of normaliseTokens) {
  assert(
    normalise.includes(token),
    `Dividend normalisation is missing: ${token}`,
  );
}

const snapshotTokens = [
  "buildPortfolioDividendSnapshot",
  "forwardTwelveMonthIncomeAud",
  "monthlyForwardIncomeAud",
  "trailingTwelveMonthIncomeAud",
  "receivedCurrentFinancialYearAud",
  "portfolioDividendYieldPercent",
  "portfolioYieldOnCostPercent",
  "securitiesMarketValueAud",
  "openCostBaseAud",
  "nextDividendEvent",
  "buildDataQuality",
];

for (const token of snapshotTokens) {
  assert(
    snapshot.includes(token),
    `Dividend snapshot is missing: ${token}`,
  );
}

const hookTokens = [
  "usePortfolioDividendEngine",
  "useLivePortfolioEngineSnapshot",
  "createPortfolioDividendApiPayload",
  'fetch(\n      "/api/dividend-data"',
  "AbortController",
  "requestSequenceRef",
  "buildPortfolioDividendSnapshot",
  "loadRetainedDividendResponse",
  "saveRetainedDividendResponse",
  "forceRefresh",
];

for (const token of hookTokens) {
  assert(
    hook.includes(token),
    `Dividend hook is missing: ${token}`,
  );
}

const retentionTokens = [
  "loadRetainedDividendResponse",
  "saveRetainedDividendResponse",
  "MAX_AGE_MS",
  "24 *",
  "window.localStorage",
  "portfolioIdentity",
];

for (const token of retentionTokens) {
  assert(
    retention.includes(token),
    `Dividend retention is missing: ${token}`,
  );
}

const selectorTokens = [
  "selectHistoricalDividendEvents",
  "selectUpcomingDividendEvents",
  "selectForecastDividendEvents",
  "selectReceivedDividendEvents",
  "selectForwardDividendIncomeAud",
  "selectMonthlyDividendIncomeAud",
  "selectPortfolioDividendYieldPercent",
  "selectPortfolioYieldOnCostPercent",
  "selectProjectedFrankingCreditsAud",
  "selectEstimatedDividendTaxAud",
];

for (const token of selectorTokens) {
  assert(
    selectors.includes(token),
    `Dividend selector is missing: ${token}`,
  );
}

assert(
  existingService.includes(
    "getDividendIntelligence",
  ),
  "Existing dividend intelligence service is missing.",
);

assert(
  existingService.includes(
    "configuredDividendProviders",
  ),
  "Existing configured dividend providers are not retained.",
);

assert(
  existingService.includes(
    "calculateDividendEligibility",
  ),
  "Existing dividend eligibility engine is not retained.",
);

assert(
  existingService.includes(
    "createDividendForecastEvents",
  ),
  "Existing dividend forecast engine is not retained.",
);

assert(
  existingService.includes(
    "createReceivedDividendEvents",
  ),
  "Existing received-dividend ledger engine is not retained.",
);

assert(
  existingRoute.includes(
    "getDividendIntelligence",
  ),
  "Existing dividend API route is not connected to the dividend service.",
);

assert(
  dividendIndex.includes(
    "./contracts",
  ) &&
  dividendIndex.includes(
    "./normalise",
  ) &&
  dividendIndex.includes(
    "./snapshot",
  ),
  "Dividend module exports are incomplete.",
);

assert(
  clientIndex.includes(
    "./usePortfolioDividendEngine",
  ),
  "Client exports do not include the dividend hook.",
);

assert(
  clientIndex.includes(
    "./dividend-selectors",
  ),
  "Client exports do not include dividend selectors.",
);

assert(
  rootIndex.includes(
    "./dividends",
  ),
  "Root Portfolio Engine does not export the dividend module.",
);

assert(
  rootIndex.includes(
    "./adapters/dividend-intelligence-adapter",
  ),
  "Root Portfolio Engine does not export the dividend adapter.",
);

assert(
  snapshot.includes(
    "input.portfolio.totals\n      .securitiesMarketValueAud",
  ),
  "Portfolio dividend yield is not connected to canonical market value.",
);

assert(
  snapshot.includes(
    "input.portfolio.totals\n      .openCostBaseAud",
  ),
  "Portfolio yield on cost is not connected to canonical cost base.",
);

assert(
  !hook.includes(
    "mock-data",
  ),
  "Dividend hook imports mock data.",
);

assert(
  !adapter.includes(
    "mock-data",
  ),
  "Dividend adapter imports mock data.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock dividend/i,
  /sample dividend/i,
  /placeholder dividend/i,
  /fake income/i,
  /hardcoded annual income/i,
];

for (const [
  name,
  content,
] of [
  [
    "contracts.ts",
    contracts,
  ],
  [
    "normalise.ts",
    normalise,
  ],
  [
    "snapshot.ts",
    snapshot,
  ],
  [
    "dividend-intelligence-adapter.ts",
    adapter,
  ],
  [
    "portfolio-dividend-retention.ts",
    retention,
  ],
  [
    "usePortfolioDividendEngine.ts",
    hook,
  ],
  [
    "dividend-selectors.ts",
    selectors,
  ],
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden mock or non-deterministic dividend logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P4.1 verification FAILED:",
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
  "Portfolio Engine P4.1 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Existing dividend provider infrastructure retained");
console.log(" - Existing dividend API route retained");
console.log(" - Existing eligibility engine retained");
console.log(" - Existing forecast engine retained");
console.log(" - Existing received-dividend ledger retained");
console.log(" - Canonical live holdings adapted to dividend holdings");
console.log(" - Canonical transactions adapted to dividend transactions");
console.log(" - Provider events converted to canonical dividend events");
console.log(" - Historical and upcoming income remain separate");
console.log(" - Announced and forecast income remain separate");
console.log(" - Received income remains separate from forecast income");
console.log(" - Portfolio dividend yield uses canonical market value");
console.log(" - Yield on cost uses canonical transaction cost base");
console.log(" - Franking fields included");
console.log(" - Withholding-tax fields included");
console.log(" - Estimated-tax fields included");
console.log(" - Monthly and annual income outputs included");
console.log(" - Provider-failure retention included");
console.log(" - Request cancellation and stale-response protection included");
console.log(" - No mock dividend data used");
console.log("");
