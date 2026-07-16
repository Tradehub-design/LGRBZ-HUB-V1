import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const scanFiles = [
  "src/app/(dashboard)/dividends/page.tsx",
  "src/app/(dashboard)/dividend-forecast/page.tsx",
  "src/core/portfolio-engine/dividends/contracts.ts",
  "src/core/portfolio-engine/dividends/eligibility.ts",
  "src/core/portfolio-engine/dividends/deduplicate.ts",
  "src/core/portfolio-engine/dividends/tax.ts",
  "src/core/portfolio-engine/dividends/normalise.ts",
  "src/core/portfolio-engine/dividends/snapshot.ts",
  "src/core/portfolio-engine/dividends/reconcile.ts",
  "src/core/portfolio-engine/dividends/audit.ts",
  "src/core/portfolio-engine/client/usePortfolioDividendEngine.ts",
  "src/core/portfolio-engine/adapters/dividend-intelligence-adapter.ts",
];

const forbidden = [
  {
    pattern:
      /Math\.random\s*\(/,

    label:
      "Math.random dividend logic",
  },

  {
    pattern:
      /mock dividend/i,

    label:
      "mock dividend data",
  },

  {
    pattern:
      /sample dividend/i,

    label:
      "sample dividend data",
  },

  {
    pattern:
      /placeholder dividend/i,

    label:
      "placeholder dividend data",
  },

  {
    pattern:
      /fake annual income/i,

    label:
      "fake annual dividend income",
  },

  {
    pattern:
      /hardcoded dividend yield/i,

    label:
      "hardcoded dividend yield",
  },

  {
    pattern:
      /hardcoded forecast income/i,

    label:
      "hardcoded forecast income",
  },

  {
    pattern:
      /useSeedPortfolio/,

    label:
      "seed portfolio dividend source",
  },

  {
    pattern:
      /calculateDividendForecast\s*\(/,

    label:
      "page-level dividend forecast calculation",
  },

  {
    pattern:
      /calculateDividendYield\s*\(/,

    label:
      "page-level dividend yield calculation",
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
    "Sprint P4 placeholder scan FAILED:",
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
  "Sprint P4 placeholder scan passed.",
);
console.log("");
console.log(
  "No mock, placeholder, independent or non-deterministic dividend path was detected.",
);
console.log("");
