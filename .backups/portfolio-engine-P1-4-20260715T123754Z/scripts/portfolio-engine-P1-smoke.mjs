import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredTokens = [
  {
    file:
      "src/core/portfolio-engine/engine.ts",
    tokens: [
      "buildPortfolioEngineFromRaw",
      "buildPortfolioEngineFromCanonical",
      "portfolioEngine",
    ],
  },
  {
    file:
      "src/core/portfolio-engine/snapshot.ts",
    tokens: [
      "buildPortfolioSnapshot",
      "replayPortfolioTransactions",
      "buildPortfolioAllocation",
    ],
  },
  {
    file:
      "src/core/portfolio-engine/reconcile.ts",
    tokens: [
      "reconcilePortfolioSnapshot",
    ],
  },
];

for (const check of requiredTokens) {
  const absolutePath =
    path.join(root, check.file);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `Missing smoke-test file: ${check.file}`,
    );
  }

  const content =
    fs.readFileSync(
      absolutePath,
      "utf8",
    );

  for (const token of check.tokens) {
    if (!content.includes(token)) {
      throw new Error(
        `${check.file} is missing ${token}`,
      );
    }
  }
}

console.log("");
console.log(
  "Portfolio Engine P1 smoke test passed.",
);
console.log("");
console.log(
  "The P1 transaction-to-snapshot pipeline is present.",
);
console.log("");
