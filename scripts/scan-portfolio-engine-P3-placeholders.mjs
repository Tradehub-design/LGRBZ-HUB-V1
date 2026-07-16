import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const scanFiles = [
  "src/app/(dashboard)/holdings/page.tsx",
  "src/app/(dashboard)/live-prices/page.tsx",
  "src/core/portfolio-engine/adapters/live-market-quote-adapter.ts",
  "src/core/portfolio-engine/client/useLivePortfolioEngineSnapshot.ts",
  "src/core/portfolio-engine/client/portfolio-quote-retention.ts",
  "src/core/portfolio-engine/client/market-data-reconciliation.ts",
];

const forbidden = [
  {
    pattern:
      /Math\.random\s*\(/,

    label:
      "Math.random portfolio or pricing logic",
  },

  {
    pattern:
      /mock portfolio/i,

    label:
      "mock portfolio data",
  },

  {
    pattern:
      /mock quote/i,

    label:
      "mock quote data",
  },

  {
    pattern:
      /placeholder price/i,

    label:
      "placeholder price data",
  },

  {
    pattern:
      /fake market value/i,

    label:
      "fake market value",
  },

  {
    pattern:
      /Current values use cost basis only/i,

    label:
      "cost-basis-only valuation placeholder",
  },

  {
    pattern:
      /Market price engine placeholder/i,

    label:
      "market-price engine placeholder",
  },

  {
    pattern:
      /calculateHoldingsFromLedger/,

    label:
      "legacy holdings calculator",
  },
];

const failures = [];

for (const relativePath of scanFiles) {
  const absolutePath =
    path.join(
      root,
      relativePath,
    );

  if (!fs.existsSync(absolutePath)) {
    failures.push(
      `Missing scan file: ${relativePath}`,
    );

    continue;
  }

  const content =
    fs.readFileSync(
      absolutePath,
      "utf8",
    );

  for (const rule of forbidden) {
    if (rule.pattern.test(content)) {
      failures.push(
        `${relativePath}: ${rule.label}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Sprint P3 placeholder scan FAILED:",
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
  "Sprint P3 placeholder scan passed.",
);
console.log("");
console.log(
  "No mock, placeholder or legacy pricing path was detected in the P3 portfolio pages and engine boundary.",
);
console.log("");
