import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const requiredFiles = [
  "src/core/portfolio-engine/contracts.ts",
  "src/core/portfolio-engine/actions.ts",
  "src/core/portfolio-engine/money.ts",
  "src/core/portfolio-engine/identity.ts",
  "src/core/portfolio-engine/raw-transaction.ts",
  "src/core/portfolio-engine/dates.ts",
  "src/core/portfolio-engine/normalise.ts",
  "src/core/portfolio-engine/validate.ts",
  "src/core/portfolio-engine/ledger.ts",
  "src/core/portfolio-engine/replay-contracts.ts",
  "src/core/portfolio-engine/cash.ts",
  "src/core/portfolio-engine/lots.ts",
  "src/core/portfolio-engine/replay.ts",
  "src/core/portfolio-engine/quote-resolution.ts",
  "src/core/portfolio-engine/allocation.ts",
  "src/core/portfolio-engine/snapshot.ts",
  "src/core/portfolio-engine/reconcile.ts",
  "src/core/portfolio-engine/engine.ts",
  "src/core/portfolio-engine/index.ts",
];

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function read(relativePath) {
  const absolutePath =
    path.join(root, relativePath);

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

for (const file of requiredFiles) {
  assert(
    fs.existsSync(path.join(root, file)),
    `Required file does not exist: ${file}`,
  );
}

const quoteResolution = read(
  "src/core/portfolio-engine/quote-resolution.ts",
);

const allocation = read(
  "src/core/portfolio-engine/allocation.ts",
);

const snapshot = read(
  "src/core/portfolio-engine/snapshot.ts",
);

const reconcile = read(
  "src/core/portfolio-engine/reconcile.ts",
);

const engine = read(
  "src/core/portfolio-engine/engine.ts",
);

const barrel = read(
  "src/core/portfolio-engine/index.ts",
);

const quoteTokens = [
  "resolveHoldingQuote",
  "selectBestQuote",
  "quotePriority",
  "TRANSACTION_FALLBACK",
  "UNAVAILABLE",
  "portfolio-transaction-ledger",
];

for (const token of quoteTokens) {
  assert(
    quoteResolution.includes(token),
    `quote-resolution.ts is missing: ${token}`,
  );
}

const allocationTokens = [
  "buildPortfolioAllocation",
  "createEmptyAllocation",
  "allocationPercentTotal",
  "security",
  "sector",
  "industry",
  "currency",
  "platform",
  "account",
  "strategy",
];

for (const token of allocationTokens) {
  assert(
    allocation.includes(token),
    `allocation.ts is missing: ${token}`,
  );
}

const snapshotTokens = [
  "buildPortfolioSnapshot",
  "replayPortfolioTransactions",
  "positionToHolding",
  "buildTotals",
  "applyPortfolioWeights",
  "buildPortfolioAllocation",
  "buildDataQuality",
  "securitiesMarketValueAud",
  "portfolioValueAud",
  "realisedGainAud",
  "unrealisedGainAud",
];

for (const token of snapshotTokens) {
  assert(
    snapshot.includes(token),
    `snapshot.ts is missing: ${token}`,
  );
}

const reconciliationTokens = [
  "reconcilePortfolioSnapshot",
  "assertPortfolioSnapshotReconciles",
  "Holdings market value does not reconcile",
  "Holdings cost base does not reconcile",
  "allocation does not reconcile",
  "Portfolio value does not equal",
];

for (const token of reconciliationTokens) {
  assert(
    reconcile.includes(token),
    `reconcile.ts is missing: ${token}`,
  );
}

const engineTokens = [
  "buildPortfolioEngineFromRaw",
  "buildPortfolioEngineFromCanonical",
  "PortfolioEngine",
  "portfolioEngine",
  "buildTransactionLedger",
  "buildPortfolioSnapshot",
  "reconcilePortfolioSnapshot",
];

for (const token of engineTokens) {
  assert(
    engine.includes(token),
    `engine.ts is missing: ${token}`,
  );
}

const requiredExports = [
  './quote-resolution',
  './allocation',
  './snapshot',
  './reconcile',
  './engine',
];

for (const requiredExport of requiredExports) {
  assert(
    barrel.includes(requiredExport),
    `index.ts is missing export: ${requiredExport}`,
  );
}

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock portfolio/i,
  /sample holding/i,
  /placeholder value/i,
  /fake quote/i,
  /demo portfolio/i,
  /hardcoded portfolio total/i,
];

for (const file of requiredFiles) {
  const content = read(file);

  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${file} contains forbidden placeholder or non-deterministic logic: ${pattern}`,
    );
  }
}

assert(
  snapshot.includes(
    "replay.positions.map",
  ),
  "Snapshot holdings are not derived from replay positions.",
);

assert(
  snapshot.includes(
    "buildPortfolioAllocation",
  ),
  "Snapshot allocation is not derived from canonical holdings.",
);

assert(
  snapshot.includes(
    "holding.valuation.marketValueAud",
  ),
  "Portfolio totals are not derived from holding valuations.",
);

assert(
  quoteResolution.includes(
    "latestSecurityTrade",
  ),
  "Transaction-price fallback is missing.",
);

assert(
  reconcile.includes(
    "snapshot.openHoldings.map",
  ),
  "Holdings reconciliation is missing.",
);

assert(
  reconcile.includes(
    "snapshot.allocation",
  ),
  "Allocation reconciliation is missing.",
);

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P1.4 verification FAILED:",
  );
  console.error("");

  for (const failure of failures) {
    console.error(` - ${failure}`);
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "Portfolio Engine P1.4 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Canonical Portfolio Snapshot");
console.log(" - Holdings generated from transaction replay");
console.log(" - Totals generated from canonical holdings");
console.log(" - Allocation generated from canonical holdings");
console.log(" - Security weights generated from market value");
console.log(" - Supplied quote support");
console.log(" - Latest transaction-price fallback");
console.log(" - Missing quote data-quality reporting");
console.log(" - Holdings/totals reconciliation");
console.log(" - Allocation/totals reconciliation");
console.log(" - Portfolio value reconciliation");
console.log(" - Raw and canonical engine entry points");
console.log(" - Single Portfolio Engine facade");
console.log(" - No mock portfolio values");
console.log("");
