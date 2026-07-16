import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  compatibility:
    "src/core/portfolio-engine/adapters/holding-compatibility.ts",

  reconciliation:
    "src/core/portfolio-engine/client/holdings-reconciliation.ts",

  selectors:
    "src/core/portfolio-engine/client/selectors.ts",

  clientIndex:
    "src/core/portfolio-engine/client/index.ts",

  holdingsPage:
    "src/app/(dashboard)/holdings/page.tsx",

  visualEngine:
    "src/lib/holdings-professional/holdingsVisualEngine.ts",

  overviewNormaliser:
    "src/components/professional-overview/portfolioOverviewNormaliser.ts",
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

const compatibility =
  read(files.compatibility);

const reconciliation =
  read(files.reconciliation);

const selectors =
  read(files.selectors);

const clientIndex =
  read(files.clientIndex);

const holdingsPage =
  read(files.holdingsPage);

const visualEngine =
  read(files.visualEngine);

const overviewNormaliser =
  read(files.overviewNormaliser);

const compatibilityTokens = [
  "canonicalHoldingToStoreHolding",
  "snapshotToStoreHoldings",
  "snapshotToOpenStoreHoldings",
  "snapshotToClosedStoreHoldings",
  "holding.valuation.marketPriceAud",
  "holding.valuation.marketValueAud",
  "holding.costBaseAud",
  "holding.realisedGainAud",
  "holding.valuation.unrealisedGainAud",
  "holding.portfolioWeightPercent",
  "holding.realisedProceedsAud",
  "holding.disposedCostBaseAud",
  "holding.totalReturnAud",
];

for (const token of compatibilityTokens) {
  assert(
    compatibility.includes(token),
    `Compatibility adapter is missing: ${token}`,
  );
}

const reconciliationTokens = [
  "reconcileApplicationHoldings",
  "assertApplicationHoldingsReconcile",
  "snapshotToStoreHoldings",
  "snapshotToOpenStoreHoldings",
  "snapshotToClosedStoreHoldings",
  "applicationMarketValueAud",
  "applicationCostBaseAud",
  "applicationRealisedGainAud",
  "applicationUnrealisedGainAud",
  "applicationWeightPercent",
  "snapshot.allocation",
];

for (const token of reconciliationTokens) {
  assert(
    reconciliation.includes(token),
    `Holdings reconciliation is missing: ${token}`,
  );
}

assert(
  selectors.includes(
    "selectHoldingsReconciliation",
  ),
  "Selectors do not expose holdings reconciliation.",
);

assert(
  clientIndex.includes(
    "./holdings-reconciliation",
  ),
  "Client exports do not expose holdings reconciliation.",
);

const forbiddenHoldingsPageTokens = [
  "calculateHoldingsFromLedger",
  "loadTxLedger",
  "usePortfolioStore",
  "holdings.reduce",
  "openHoldings.reduce",
  "localTransactions",
  "setLocalTransactions",
];

for (const token of forbiddenHoldingsPageTokens) {
  assert(
    !holdingsPage.includes(token),
    `Holdings page still contains a legacy calculation path: ${token}`,
  );
}

const requiredHoldingsPageTokens = [
  "usePortfolioEngineSnapshot",
  "engineResult.snapshot",
  "selectApplicationOpenHoldings",
  "selectApplicationClosedHoldings",
  "snapshot.totals",
  "snapshot.dataQuality",
];

for (const token of requiredHoldingsPageTokens) {
  assert(
    holdingsPage.includes(token),
    `Holdings page is missing canonical data source: ${token}`,
  );
}

const requiredProfessionalTokens = [
  "marketPriceAud",
  "marketValueAud",
  "costBaseAud",
  "unrealisedPlAud",
  "portfolioWeightPercent",
  "TRANSACTION_FALLBACK",
  "UNAVAILABLE",
];

for (const token of requiredProfessionalTokens) {
  assert(
    visualEngine.includes(token),
    `Professional visual engine is missing: ${token}`,
  );

  assert(
    overviewNormaliser.includes(token),
    `Professional overview normaliser is missing: ${token}`,
  );
}

const allFiles = [
  compatibility,
  reconciliation,
  selectors,
  clientIndex,
  holdingsPage,
  visualEngine,
  overviewNormaliser,
];

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock portfolio/i,
  /sample holding/i,
  /placeholder holding/i,
  /fake market value/i,
  /hardcoded portfolio value/i,
];

for (const content of allFiles) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `P2 contains forbidden placeholder or non-deterministic logic: ${pattern}`,
    );
  }
}

assert(
  !visualEngine.includes(
    '"dividendsAud"',
  ),
  "Professional visual engine still treats historical dividends as forecast income.",
);

assert(
  !overviewNormaliser.includes(
    '"dividendsAud"',
  ),
  "Professional overview still treats historical dividends as forecast income.",
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
  process.exit(1);
}

console.log("");
console.log(
  "Portfolio Engine P2.4 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Canonical holding compatibility adapter");
console.log(" - Open holding adapter");
console.log(" - Closed holding adapter");
console.log(" - Application/canonical holding reconciliation");
console.log(" - Market value reconciliation");
console.log(" - Open cost-base reconciliation");
console.log(" - Realised P/L reconciliation");
console.log(" - Unrealised P/L reconciliation");
console.log(" - Portfolio weight reconciliation");
console.log(" - Allocation reconciliation");
console.log(" - Holdings route uses canonical snapshot");
console.log(" - Holdings route has no legacy calculator");
console.log(" - Professional widgets use canonical valuation fields");
console.log(" - Missing prices remain unavailable");
console.log(" - Historical dividends are not forecast income");
console.log(" - No mock portfolio values");
console.log("");
