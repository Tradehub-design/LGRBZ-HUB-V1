import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const requiredFiles = [
  "src/core/portfolio-engine/adapters/ledger-row-adapter.ts",
  "src/core/portfolio-engine/adapters/holding-compatibility.ts",
  "src/core/portfolio-engine/client/usePortfolioEngineSnapshot.ts",
  "src/core/portfolio-engine/client/selectors.ts",
  "src/core/portfolio-engine/client/index.ts",
  "src/core/portfolio-engine/index.ts",
];

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

for (
  const file of requiredFiles
) {
  assert(
    fs.existsSync(
      path.join(root, file),
    ),
    `Required file does not exist: ${file}`,
  );
}

const adapter = read(
  "src/core/portfolio-engine/adapters/ledger-row-adapter.ts",
);

const compatibility = read(
  "src/core/portfolio-engine/adapters/holding-compatibility.ts",
);

const hook = read(
  "src/core/portfolio-engine/client/usePortfolioEngineSnapshot.ts",
);

const selectors = read(
  "src/core/portfolio-engine/client/selectors.ts",
);

const clientIndex = read(
  "src/core/portfolio-engine/client/index.ts",
);

const rootIndex = read(
  "src/core/portfolio-engine/index.ts",
);

const adapterTokens = [
  "ledgerRowToRawPortfolioTransaction",
  "ledgerRowsToRawPortfolioTransactions",
  "resolveFxRateToAud",
  "resolveUnitPrice",
  "resolveFeesLocal",
  "resolveNetAmountLocal",
  "resolveGrossAmountLocal",
  "inferMarket",
  "priceAud",
  "totalAud",
  "feesAud",
];

for (
  const token of adapterTokens
) {
  assert(
    adapter.includes(token),
    `ledger-row-adapter.ts is missing: ${token}`,
  );
}

const compatibilityTokens = [
  "canonicalHoldingToStoreHolding",
  "snapshotToStoreHoldings",
  "snapshotToOpenStoreHoldings",
  "snapshotToClosedStoreHoldings",
  "marketValueAud",
  "costBaseAud",
  "realisedPlAud",
  "unrealisedPlAud",
  "portfolioWeightPercent",
];

for (
  const token of compatibilityTokens
) {
  assert(
    compatibility.includes(token),
    `holding-compatibility.ts is missing: ${token}`,
  );
}

const hookTokens = [
  "usePortfolioEngineSnapshot",
  "usePortfolioStore",
  "loadTxLedger",
  "ledgerRowsToRawPortfolioTransactions",
  "buildPortfolioEngineFromRaw",
  "portfolio-store",
  "transaction-ledger",
  "uniqueRows",
];

for (
  const token of hookTokens
) {
  assert(
    hook.includes(token),
    `usePortfolioEngineSnapshot.ts is missing: ${token}`,
  );
}

const selectorTokens = [
  "selectCanonicalHoldings",
  "selectApplicationHoldings",
  "selectPortfolioTotals",
  "selectPortfolioAllocation",
  "selectPortfolioMarketValueAud",
  "selectOpenCostBaseAud",
  "selectRealisedGainAud",
  "selectUnrealisedGainAud",
  "selectTotalReturnAud",
];

for (
  const token of selectorTokens
) {
  assert(
    selectors.includes(token),
    `selectors.ts is missing: ${token}`,
  );
}

assert(
  clientIndex.includes(
    "./usePortfolioEngineSnapshot",
  ),
  "Client index does not export the canonical snapshot hook.",
);

assert(
  clientIndex.includes(
    "./selectors",
  ),
  "Client index does not export Portfolio Engine selectors.",
);

assert(
  rootIndex.includes(
    "./adapters/ledger-row-adapter",
  ),
  "Root engine index does not export the ledger adapter.",
);

assert(
  rootIndex.includes(
    "./adapters/holding-compatibility",
  ),
  "Root engine index does not export the compatibility adapter.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock-data/,
  /mock portfolio/i,
  /sample holding/i,
  /placeholder holding/i,
  /fake quote/i,
];

for (
  const file of requiredFiles
) {
  const content =
    read(file);

  for (
    const pattern of forbiddenPatterns
  ) {
    assert(
      !pattern.test(content),
      `${file} contains forbidden mock or non-deterministic logic: ${pattern}`,
    );
  }
}

assert(
  hook.includes(
    "storeTransactions.length > 0",
  ),
  "Portfolio Store transaction priority is missing.",
);

assert(
  hook.includes(
    "persistedTransactions.length > 0",
  ),
  "Persisted transaction ledger fallback is missing.",
);

assert(
  !hook.includes(
    "calculateHoldingsFromLedger",
  ),
  "Canonical snapshot hook must not use the legacy holdings calculator.",
);

assert(
  compatibility.includes(
    "holding.valuation.marketValueAud",
  ),
  "Application holding market value is not sourced from the canonical valuation.",
);

assert(
  compatibility.includes(
    "holding.portfolioWeightPercent",
  ),
  "Application holding weight is not sourced from the canonical snapshot.",
);

if (
  failures.length > 0
) {
  console.error("");
  console.error(
    "Portfolio Engine P2.1 verification FAILED:",
  );
  console.error("");

  for (
    const failure of failures
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
  "Portfolio Engine P2.1 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Existing LedgerRow transaction adapter");
console.log(" - Local and AUD amount resolution");
console.log(" - Existing FX-rate derivation");
console.log(" - ASX and US market inference");
console.log(" - Portfolio Store transaction priority");
console.log(" - Persisted ledger fallback");
console.log(" - Transaction deduplication boundary");
console.log(" - Canonical client Portfolio Snapshot hook");
console.log(" - Canonical holdings compatibility mapping");
console.log(" - Holdings market value selector");
console.log(" - Holdings cost-base selector");
console.log(" - Realised and unrealised gain selectors");
console.log(" - Allocation selectors");
console.log(" - No legacy holdings calculator in the new hook");
console.log(" - No mock or placeholder portfolio values");
console.log("");
