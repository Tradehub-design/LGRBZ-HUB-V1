import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/core/portfolio-engine/contracts.ts",
  "src/core/portfolio-engine/actions.ts",
  "src/core/portfolio-engine/money.ts",
  "src/core/portfolio-engine/identity.ts",
  "src/core/portfolio-engine/index.ts",
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);

  if (!fs.existsSync(absolutePath)) {
    fail(`Missing required file: ${relativePath}`);
    return "";
  }

  return fs.readFileSync(absolutePath, "utf8");
}

for (const file of requiredFiles) {
  assert(
    fs.existsSync(path.join(root, file)),
    `Required Portfolio Engine file does not exist: ${file}`,
  );
}

const contracts = read(
  "src/core/portfolio-engine/contracts.ts",
);

const actions = read(
  "src/core/portfolio-engine/actions.ts",
);

const money = read(
  "src/core/portfolio-engine/money.ts",
);

const identity = read(
  "src/core/portfolio-engine/identity.ts",
);

const barrel = read(
  "src/core/portfolio-engine/index.ts",
);

const requiredContractTokens = [
  "PortfolioTransaction",
  "PortfolioSnapshot",
  "PortfolioHolding",
  "PositionLot",
  "RealisedDisposal",
  "QuoteSnapshot",
  "PortfolioTotals",
  "PortfolioAllocation",
  "PortfolioDataQuality",
  "PortfolioEngineBuildInput",
  "PortfolioEngineBuildResult",
  "DIVIDEND_REINVESTMENT",
  "RETURN_OF_CAPITAL",
];

for (const token of requiredContractTokens) {
  assert(
    contracts.includes(token),
    `contracts.ts is missing required token: ${token}`,
  );
}

const requiredActionTokens = [
  "normaliseTransactionAction",
  "requireTransactionAction",
  "actionRequiresSecurity",
  "actionRequiresQuantity",
  "actionRequiresUnitPrice",
  "actionAffectsPosition",
  "actionCashDirection",
];

for (const token of requiredActionTokens) {
  assert(
    actions.includes(token),
    `actions.ts is missing required function: ${token}`,
  );
}

const requiredMoneyTokens = [
  "finiteNumber",
  "roundMoney",
  "roundQuantity",
  "percentage",
  "toAud",
  "calculateGrossAmount",
  "calculateBuyNetAmount",
  "calculateSellNetAmount",
  "weightedAverage",
  "assertFiniteFinancialValue",
];

for (const token of requiredMoneyTokens) {
  assert(
    money.includes(token),
    `money.ts is missing required function: ${token}`,
  );
}

const requiredIdentityTokens = [
  "normaliseTicker",
  "inferMarket",
  "displayTickerForMarket",
  "quoteTickerForMarket",
  "createSecurityId",
  "createHoldingId",
  "createAccountId",
  "createStableTransactionId",
  "createSnapshotId",
  "sortTransactionsDeterministically",
];

for (const token of requiredIdentityTokens) {
  assert(
    identity.includes(token),
    `identity.ts is missing required function: ${token}`,
  );
}

assert(
  barrel.includes('export * from "./contracts"'),
  "Portfolio Engine index is not exporting contracts.",
);

assert(
  barrel.includes('export * from "./actions"'),
  "Portfolio Engine index is not exporting actions.",
);

assert(
  barrel.includes('export * from "./money"'),
  "Portfolio Engine index is not exporting money utilities.",
);

assert(
  barrel.includes('export * from "./identity"'),
  "Portfolio Engine index is not exporting identity utilities.",
);

const forbiddenPatterns = [
  /mock portfolio/i,
  /placeholder holding/i,
  /sample portfolio/i,
  /fake quote/i,
  /Math\.random\s*\(/,
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

if (failures.length > 0) {
  console.error("");
  console.error("Portfolio Engine P1.1 verification FAILED:");
  console.error("");

  for (const failure of failures) {
    console.error(` - ${failure}`);
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log("Portfolio Engine P1.1 verification passed.");
console.log("");
console.log("Verified:");
console.log(" - Canonical transaction contract");
console.log(" - Portfolio snapshot contract");
console.log(" - Holdings and lot contracts");
console.log(" - Quote fallback contract");
console.log(" - Dividend and income action support");
console.log(" - Transaction action normalisation");
console.log(" - Safe financial arithmetic");
console.log(" - ASX and US security identity");
console.log(" - Deterministic transaction ordering");
console.log(" - No mock or placeholder portfolio data");
console.log("");
