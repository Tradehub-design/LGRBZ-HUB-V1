import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const routes = [
  "src/app/(dashboard)/dashboard/page.tsx",
  "src/app/(dashboard)/holdings/page.tsx",
  "src/app/(dashboard)/portfolio-allocation/page.tsx",
  "src/app/(dashboard)/portfolio-health/page.tsx",
  "src/app/(dashboard)/performance-attribution/page.tsx",
  "src/app/(dashboard)/dividends/page.tsx",
  "src/app/(dashboard)/dividend-forecast/page.tsx",
  "src/app/(dashboard)/analytics/page.tsx",
  "src/app/(dashboard)/reports/page.tsx",
  "src/app/(dashboard)/tax/page.tsx",
];

const forbiddenRules = [
  {
    pattern:
      /useSeedPortfolio/,

    label:
      "seed portfolio hook",
  },

  {
    pattern:
      /useDashboardData/,

    label:
      "legacy dashboard hook",
  },

  {
    pattern:
      /Math\.random\s*\(/,

    label:
      "non-deterministic portfolio value",
  },

  {
    pattern:
      /mock(?:Portfolio|Analytics|Reports|Tax)/,

    label:
      "mock data source",
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
      "route-level dividend calculation",
  },

  {
    pattern:
      /calculateTaxPayable\s*\(/,

    label:
      "invented route-level tax payable calculation",
  },

  {
    pattern:
      /calculateCgtDiscount\s*\(/,

    label:
      "invented route-level CGT discount",
  },

  {
    pattern:
      /hardcoded portfolio/i,

    label:
      "hardcoded portfolio value",
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
];

for (
  const relativePath of
  routes
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
      `Missing final route: ${relativePath}`,
    );

    continue;
  }

  const content =
    fs.readFileSync(
      absolutePath,
      "utf8",
    );

  for (
    const rule of
    forbiddenRules
  ) {
    if (
      rule.pattern.test(
        content,
      )
    ) {
      failures.push(
        `${relativePath}: ${rule.label}`,
      );
    }
  }
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "Final Portfolio Engine route scan FAILED:",
  );
  console.error("");

  for (
    const failure of
    failures
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
  "Final Portfolio Engine route scan passed.",
);
console.log("");
console.log(
  "No legacy, mock, placeholder or route-level portfolio calculation path was detected.",
);
console.log("");
