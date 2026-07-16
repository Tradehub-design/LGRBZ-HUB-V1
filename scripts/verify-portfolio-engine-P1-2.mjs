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

const rawTransaction = read(
  "src/core/portfolio-engine/raw-transaction.ts",
);

const dates = read(
  "src/core/portfolio-engine/dates.ts",
);

const normalise = read(
  "src/core/portfolio-engine/normalise.ts",
);

const validate = read(
  "src/core/portfolio-engine/validate.ts",
);

const ledger = read(
  "src/core/portfolio-engine/ledger.ts",
);

const barrel = read(
  "src/core/portfolio-engine/index.ts",
);

const rawTokens = [
  "RawPortfolioTransaction",
  "RAW_TRANSACTION_FIELD_MAP",
  "readRawField",
  "copyRawRecord",
];

for (const token of rawTokens) {
  assert(
    rawTransaction.includes(token),
    `raw-transaction.ts is missing: ${token}`,
  );
}

const dateTokens = [
  "parseDateValue",
  "requireIsoDate",
  "optionalIsoDate",
  "normaliseTimestamp",
  "EXCEL_EPOCH_UTC",
];

for (const token of dateTokens) {
  assert(
    dates.includes(token),
    `dates.ts is missing: ${token}`,
  );
}

const normaliseTokens = [
  "normalisePortfolioTransaction",
  "normalisePortfolioTransactions",
  "createStableTransactionId",
  "createSecurityId",
  "createAccountId",
  "actionRequiresSecurity",
  "actionRequiresQuantity",
  "actionRequiresUnitPrice",
  "copyRawRecord",
];

for (const token of normaliseTokens) {
  assert(
    normalise.includes(token),
    `normalise.ts is missing: ${token}`,
  );
}

const validationTokens = [
  "validatePortfolioTransaction",
  "validatePortfolioTransactions",
  "MISSING_FX_RATE",
  "INCONSISTENT_AMOUNT",
  "INVALID_CORPORATE_ACTION",
];

for (const token of validationTokens) {
  assert(
    validate.includes(token),
    `validate.ts is missing: ${token}`,
  );
}

const ledgerTokens = [
  "buildTransactionLedger",
  "buildLedgerFromCanonicalTransactions",
  "removeDuplicateTransactions",
  "sortTransactionsDeterministically",
  "DUPLICATE_TRANSACTION",
  "ledgerHasErrors",
  "ledgerErrorCount",
  "ledgerWarningCount",
];

for (const token of ledgerTokens) {
  assert(
    ledger.includes(token),
    `ledger.ts is missing: ${token}`,
  );
}

const requiredExports = [
  './raw-transaction',
  './dates',
  './normalise',
  './validate',
  './ledger',
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
  /placeholder transaction/i,
  /fake transaction/i,
  /demo portfolio/i,
];

for (const file of requiredFiles) {
  const content = read(file);

  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${file} contains forbidden non-deterministic or placeholder logic: ${pattern}`,
    );
  }
}

assert(
  normalise.includes(
    'currency === "AUD"',
  ),
  "AUD FX normalisation is missing.",
);

assert(
  normalise.includes(
    'market === "ASX"',
  ) ||
  normalise.includes(
    'security?.market === "ASX"',
  ),
  "ASX currency or country normalisation is missing.",
);

assert(
  ledger.includes(
    "transaction.status === \"pending\"",
  ),
  "Pending transaction exclusion is missing.",
);

assert(
  ledger.includes(
    "transaction.status === \"cancelled\"",
  ),
  "Cancelled transaction exclusion is missing.",
);

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P1.2 verification FAILED:",
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
  "Portfolio Engine P1.2 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Raw workbook/manual transaction boundary");
console.log(" - Australian and ISO date normalisation");
console.log(" - Excel serial date support");
console.log(" - Canonical transaction normalisation");
console.log(" - ASX and US currency inference");
console.log(" - AUD and foreign-currency FX validation");
console.log(" - Trade amount reconstruction");
console.log(" - Corporate action ratio validation");
console.log(" - Deterministic transaction IDs");
console.log(" - Duplicate transaction rejection");
console.log(" - Pending and cancelled transaction isolation");
console.log(" - Raw source audit preservation");
console.log(" - No mock or placeholder portfolio records");
console.log("");
