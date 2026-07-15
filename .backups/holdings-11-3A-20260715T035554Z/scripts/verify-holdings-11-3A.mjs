#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const holdingsPage =
  'src/app/(dashboard)/holdings/page.tsx';

const checks = [
  {
    file:
      "src/lib/holdings-professional/holdingsVisualModels.ts",

    markers: [
      "HoldingsVisualPosition",
      "HoldingsVisualSector",
      "HoldingsVisualSnapshot",
      "marketValue",
      "costBasis",
      "gainLossPercent",
      "dailyChangePercent",
      "annualIncome",
      "dividendYield",
      "portfolioWeight",
      "pricingCoverage",
      "averageQuoteQuality",
      "largestPosition",
      "bestPerformer",
      "worstPerformer",
    ],
  },

  {
    file:
      "src/lib/holdings-professional/holdingsVisualEngine.ts",

    markers: [
      "createHoldingsVisualSnapshot",
      "normalisePosition",
      "safePercent",
      "portfolioWeight",
      "largestPositionWeight",
      "topFiveWeight",
      "profitableCount",
      "losingCount",
      "pricingCoverage",
      "sectorMap",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsCommandCentre.tsx",

    markers: [
      '"use client"',
      "HoldingsCommandCentre",
      "createHoldingsVisualSnapshot",
      "Holdings Command Centre",
      "Professional position intelligence",
      "Market value",
      "Cost basis",
      "Annual income",
      "Top-five weight",
      "Total return",
      "Dividend yield",
      "Largest position",
      "Pricing coverage",
      "HoldingsTreemap",
      "HoldingsPositionRanking",
      "HoldingsSectorHeatmap",
      "Profitable positions",
      "Positions below cost",
      "Best performer",
      "Monthly income",
      'href="/transactions"',
      'href="/portfolio-allocation"',
      'href="/portfolio-health"',
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsTreemap.tsx",

    markers: [
      '"use client"',
      "HoldingsTreemap",
      "Portfolio Treemap",
      "Position Map",
      "portfolioWeight",
      "gainLossPercent",
      "/holdings?symbol=",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsSectorHeatmap.tsx",

    markers: [
      '"use client"',
      "HoldingsSectorHeatmap",
      "Sector Heatmap",
      "Sector Intelligence",
      "holdingCount",
      "gainLossPercent",
      "portfolio-allocation",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsPositionRanking.tsx",

    markers: [
      '"use client"',
      "HoldingsPositionRanking",
      "Largest Holdings",
      "Position Ranking",
      "marketValue",
      "portfolioWeight",
      "gainLossPercent",
      "#holdings-table",
    ],
  },

  {
    file:
      holdingsPage,

    markers: [
      "HoldingsCommandCentre",
      "<HoldingsCommandCentre holdings={",
    ],
  },

  {
    file:
      "src/components/holdings-professional/index.ts",

    markers: [
      'export * from "./HoldingsCommandCentre"',
      'export * from "./HoldingsPositionRanking"',
      'export * from "./HoldingsSectorHeatmap"',
      'export * from "./HoldingsTreemap"',
    ],
  },

  {
    file:
      "src/lib/holdings-professional/index.ts",

    markers: [
      'export * from "./holdingsVisualEngine"',
      'export * from "./holdingsVisualModels"',
    ],
  },
];

const failures = [];

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    failures.push(
      `Missing required file: ${check.file}`
    );

    continue;
  }

  const source =
    fs.readFileSync(
      check.file,
      "utf8"
    );

  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const pageSource =
  fs.readFileSync(
    holdingsPage,
    "utf8"
  );

const commandCentreCount =
  (
    pageSource.match(
      /<HoldingsCommandCentre holdings=\{/g
    ) ||
    []
  ).length;

if (commandCentreCount !== 1) {
  failures.push(
    `Holdings page must render exactly one HoldingsCommandCentre; found ${commandCentreCount}.`
  );
}

const commandCentre =
  fs.readFileSync(
    "src/components/holdings-professional/HoldingsCommandCentre.tsx",
    "utf8"
  );

for (const component of [
  "HoldingsTreemap",
  "HoldingsPositionRanking",
  "HoldingsSectorHeatmap",
]) {
  const count =
    (
      commandCentre.match(
        new RegExp(
          `<${component}\\b`,
          "g"
        )
      ) ||
      []
    ).length;

  if (count !== 1) {
    failures.push(
      `HoldingsCommandCentre must render exactly one ${component}; found ${count}.`
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Holdings Bash 11.3A verification failed:"
  );

  for (const failure of failures) {
    console.error(
      `   - ${failure}`
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "✅ Holdings Bash 11.3A verification passed."
);
console.log(
  "✅ Professional Holdings command centre installed."
);
console.log(
  "✅ Holdings visual normalisation engine installed."
);
console.log(
  "✅ Portfolio treemap foundation installed."
);
console.log(
  "✅ Sector heatmap foundation installed."
);
console.log(
  "✅ Position ranking installed."
);
console.log(
  "✅ Concentration intelligence installed."
);
console.log(
  "✅ Pricing coverage installed."
);
console.log(
  "✅ Existing Holdings page preserved."
);
console.log("");
console.log(
  "Bash 11.3A complete."
);
console.log(
  "Professional Holdings Sprint remaining: 4."
);
console.log("");
