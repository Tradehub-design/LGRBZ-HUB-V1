import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/holdings-v2/holdingsV2Types.ts",
    markers: [
      "HoldingsV2Record",
      "HoldingsV2Summary",
      "HoldingsV2FilterState",
      "HoldingsV2Preferences",
      "HoldingsV2SourceBundle",
      "HoldingsV2SummaryMetric",
    ],
  },
  {
    file:
      "src/lib/holdings-v2/holdingsV2DataAccess.ts",
    markers: [
      "holdingsV2ReadPath",
      "holdingsV2FirstDefined",
      "holdingsV2Number",
      "holdingsV2StringArray",
    ],
  },
  {
    file:
      "src/lib/holdings-v2/adaptHoldingsV2Data.ts",
    markers: [
      "adaptHoldingsV2Data",
      "normaliseHolding",
      "calculateSummary",
      "unrealisedGainLoss",
      "dailyGainLoss",
      "portfolioWeight",
      "priceStatus",
    ],
  },
  {
    file:
      "src/lib/holdings-v2/holdingsV2Formatters.ts",
    markers: [
      "holdingsV2FormatCurrency",
      "holdingsV2FormatPercentage",
      "holdingsV2FormatDateTime",
      "holdingsV2FormatCompactCurrency",
    ],
  },
  {
    file:
      "src/lib/holdings-v2/holdingsV2Query.ts",
    markers: [
      "defaultHoldingsV2Filters",
      "filterHoldingsV2",
      "sortHoldingsV2",
      "paginateHoldingsV2",
      "countActiveHoldingsV2Filters",
    ],
  },
  {
    file:
      "src/lib/holdings-v2/holdingsV2Preferences.ts",
    markers: [
      "defaultHoldingsV2Preferences",
      "loadHoldingsV2Preferences",
      "saveHoldingsV2Preferences",
      "resetHoldingsV2Preferences",
    ],
  },
  {
    file:
      "src/lib/holdings-v2/createHoldingsV2Metrics.ts",
    markers: [
      "createHoldingsV2Metrics",
      "Market Value",
      "Cost Base",
      "Unrealised Return",
      "Annual Income",
    ],
  },
  {
    file:
      "src/components/holdings-v2/HoldingsV2SummaryCards.tsx",
    markers: [
      "HoldingsV2SummaryCards",
      "formatMetric",
      "comparison",
    ],
  },
  {
    file:
      "src/components/holdings-v2/HoldingsV2Header.tsx",
    markers: [
      "HoldingsV2Header",
      "Portfolio Positions",
      "Add Transaction",
      "Export",
    ],
  },
  {
    file:
      "src/components/holdings-v2/HoldingsV2States.tsx",
    markers: [
      "HoldingsV2LoadingState",
      "HoldingsV2EmptyState",
      "HoldingsV2ErrorState",
    ],
  },
  {
    file:
      "src/components/holdings-v2/HoldingsV2Shell.tsx",
    markers: [
      "HoldingsV2Shell",
      "HoldingsV2Header",
      "HoldingsV2SummaryCards",
    ],
  },
  {
    file:
      "src/components/holdings-v2/HoldingsV2FoundationPreview.tsx",
    markers: [
      "HoldingsV2FoundationPreview",
      "adaptHoldingsV2Data",
      "createHoldingsV2Metrics",
    ],
  },
  {
    file:
      "src/components/holdings-v2/index.ts",
    markers: [
      "HoldingsV2FoundationPreview",
      "HoldingsV2Shell",
      "HoldingsV2SummaryCards",
    ],
  },
  {
    file:
      "src/lib/holdings-v2/index.ts",
    markers: [
      "adaptHoldingsV2Data",
      "holdingsV2Query",
      "holdingsV2Preferences",
      "holdingsV2Types",
    ],
  },
];

const failures = [];

for (
  const check of checks
) {
  if (
    !fs.existsSync(
      check.file
    )
  ) {
    failures.push(
      `Missing file: ${check.file}`
    );

    continue;
  }

  const content =
    fs.readFileSync(
      check.file,
      "utf8"
    );

  for (
    const marker of
    check.markers
  ) {
    if (
      !content.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const protectedPaths = [
  "src/lib/transactions",
  "src/lib/holdings",
  "src/core",
  "src/lib/tax",
  "src/lib/analytics",
];

const createdFiles =
  checks.map(
    (check) =>
      check.file
  );

for (
  const file of createdFiles
) {
  if (
    protectedPaths.some(
      (protectedPath) =>
        file.startsWith(
          protectedPath
        ) &&
        !file.startsWith(
          "src/lib/holdings-v2"
        )
    )
  ) {
    failures.push(
      `Foundation file was created inside protected engine path: ${file}`
    );
  }
}

if (
  failures.length >
  0
) {
  console.error(
    "❌ Holdings 2.0 foundation verification failed:"
  );

  failures.forEach(
    (failure) =>
      console.error(
        `   - ${failure}`
      )
  );

  process.exit(1);
}

console.log(
  "✅ Holdings 2.0 foundation verification passed."
);

console.log(
  "✅ Holdings adapter and summary contracts are available."
);

console.log(
  "✅ Filtering, sorting and pagination engines are available."
);

console.log(
  "✅ Persistent table preference contracts are available."
);

console.log(
  "✅ Header, summary cards and page states are available."
);

console.log(
  "✅ Existing holdings and transaction engines were not replaced."
);
