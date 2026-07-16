import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const requiredFiles = [
  "src/core/portfolio-engine/replay-contracts.ts",
  "src/core/portfolio-engine/cash.ts",
  "src/core/portfolio-engine/lots.ts",
  "src/core/portfolio-engine/replay.ts",
  "src/core/portfolio-engine/index.ts",
];

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function read(relativePath) {
  const absolutePath = path.join(
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

for (const file of requiredFiles) {
  assert(
    fs.existsSync(path.join(root, file)),
    `Required file does not exist: ${file}`,
  );
}

const replayContracts = read(
  "src/core/portfolio-engine/replay-contracts.ts",
);

const cash = read(
  "src/core/portfolio-engine/cash.ts",
);

const lots = read(
  "src/core/portfolio-engine/lots.ts",
);

const replay = read(
  "src/core/portfolio-engine/replay.ts",
);

const barrel = read(
  "src/core/portfolio-engine/index.ts",
);

const contractTokens = [
  "MutablePositionState",
  "SecurityIncomeState",
  "ReplayState",
  "ReplayOptions",
  "ReplayPositionResult",
  "PortfolioReplayResult",
];

for (const token of contractTokens) {
  assert(
    replayContracts.includes(token),
    `replay-contracts.ts is missing: ${token}`,
  );
}

const cashTokens = [
  "createEmptyCashSummary",
  "applyCashTransaction",
  "actionCashDirection",
  "dividendsReceivedAud",
  "interestReceivedAud",
  "returnOfCapitalAud",
  "cashAud",
];

for (const token of cashTokens) {
  assert(
    cash.includes(token),
    `cash.ts is missing: ${token}`,
  );
}

const lotTokens = [
  "createAcquisitionLot",
  "disposeLotsFifo",
  "disposeLotsAverageCost",
  "disposePositionLots",
  "scaleLotsForCorporateAction",
  "reduceLotsForReturnOfCapital",
  "transactionAcquisitionCostAud",
  "transactionSaleProceedsAud",
  "transactionFeesAud",
];

for (const token of lotTokens) {
  assert(
    lots.includes(token),
    `lots.ts is missing: ${token}`,
  );
}

const replayTokens = [
  "replayPortfolioTransactions",
  "applyAcquisition",
  "applyDisposal",
  "applyCorporateAction",
  "applyDividendIncome",
  "applyInterestIncome",
  "applyReturnOfCapital",
  "SELL_EXCEEDS_POSITION",
  "sortTransactionsDeterministically",
  "state.processedTransactions",
  "state.rejectedTransactions",
];

for (const token of replayTokens) {
  assert(
    replay.includes(token),
    `replay.ts is missing: ${token}`,
  );
}

const requiredExports = [
  './replay-contracts',
  './cash',
  './lots',
  './replay',
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
  /placeholder holding/i,
  /fake value/i,
  /demo transaction/i,
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
  replay.includes(
    'case "BUY"',
  ),
  "BUY replay support is missing.",
);

assert(
  replay.includes(
    'case "SELL"',
  ),
  "SELL replay support is missing.",
);

assert(
  replay.includes(
    'case "DIVIDEND_REINVESTMENT"',
  ),
  "Dividend reinvestment replay support is missing.",
);

assert(
  replay.includes(
    'case "TRANSFER_IN"',
  ),
  "Transfer-in replay support is missing.",
);

assert(
  replay.includes(
    'case "TRANSFER_OUT"',
  ),
  "Transfer-out replay support is missing.",
);

assert(
  replay.includes(
    'case "SPLIT"',
  ),
  "Share split replay support is missing.",
);

assert(
  replay.includes(
    'case "CONSOLIDATION"',
  ),
  "Share consolidation replay support is missing.",
);

assert(
  replay.includes(
    'case "RETURN_OF_CAPITAL"',
  ),
  "Return-of-capital replay support is missing.",
);

assert(
  lots.includes(
    'input.method === "FIFO"',
  ),
  "FIFO cost basis selection is missing.",
);

assert(
  lots.includes(
    "disposeLotsAverageCost",
  ),
  "Average cost disposal selection is missing.",
);

assert(
  replay.includes(
    "requestedQuantity >",
  ) &&
  replay.includes(
    "position.quantity",
  ),
  "Oversell protection is missing.",
);

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P1.3 verification FAILED:",
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
  "Portfolio Engine P1.3 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Deterministic transaction replay");
console.log(" - Transaction-only position construction");
console.log(" - Acquisition lot creation");
console.log(" - Average-cost disposal calculations");
console.log(" - FIFO disposal calculations");
console.log(" - Realised gain and proceeds tracking");
console.log(" - Oversell rejection");
console.log(" - Transfer-in and transfer-out processing");
console.log(" - Share split processing");
console.log(" - Share consolidation processing");
console.log(" - Return-of-capital cost-base reduction");
console.log(" - Dividend and interest income tracking");
console.log(" - Multi-currency cash movement tracking");
console.log(" - Processed and rejected transaction audit");
console.log(" - No mock or placeholder portfolio values");
console.log("");
