import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const files = [
  "src/app/(dashboard)/dashboard/page.tsx",
  "src/app/(dashboard)/portfolio-allocation/page.tsx",
  "src/app/(dashboard)/portfolio-health/page.tsx",
  "src/app/(dashboard)/performance-attribution/page.tsx",
  "src/app/(dashboard)/dividends/page.tsx",
  "src/app/(dashboard)/dividend-forecast/page.tsx",
  "src/core/portfolio-engine/dashboard/build.ts",
  "src/core/portfolio-engine/dashboard/reconcile.ts",
  "src/core/portfolio-engine/dashboard/health.ts",
  "src/core/portfolio-engine/dashboard/attribution.ts",
];

const forbidden = [
  {
    pattern:
      /Math\.random\s*\(/,

    label:
      "non-deterministic value generation",
  },

  {
    pattern:
      /useSeedPortfolio/,

    label:
      "seed portfolio data path",
  },

  {
    pattern:
      /useDashboardData/,

    label:
      "legacy dashboard hook",
  },

  {
    pattern:
      /mock portfolio/i,

    label:
      "mock portfolio value",
  },

  {
    pattern:
      /sample portfolio/i,

    label:
      "sample portfolio value",
  },

  {
    pattern:
      /placeholder portfolio/i,

    label:
      "placeholder portfolio value",
  },

  {
    pattern:
      /fake market value/i,

    label:
      "fake market value",
  },

  {
    pattern:
      /hardcoded portfolio value/i,

    label:
      "hardcoded portfolio value",
  },

  {
    pattern:
      /hardcoded total return/i,

    label:
      "hardcoded total return",
  },

  {
    pattern:
      /hardcoded dividend income/i,

    label:
      "hardcoded dividend income",
  },

  {
    pattern:
      /calculatePortfolioAllocation\s*\(/,

    label:
      "route-level allocation calculation",
  },

  {
    pattern:
      /calculateDividendForecast\s*\(/,

    label:
      "route-level dividend forecast calculation",
  },
];

for (const relativePath of files) {
  const absolutePath =
    path.join(
      root,
      relativePath,
    );

  if (!fs.existsSync(absolutePath)) {
    failures.push(
      `Missing route-scan file: ${relativePath}`,
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
    "Sprint P5 route scan FAILED:",
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
  "Sprint P5 route scan passed.",
);
console.log("");
console.log(
  "No mock, placeholder, legacy or independent portfolio calculation path was detected in the unified P5 routes.",
);
console.log("");
