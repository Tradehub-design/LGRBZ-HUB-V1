#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/holdings-professional/holdingsTableModels.ts",

    markers: [
      "HoldingsPerformanceFilter",
      "HoldingsIncomeFilter",
      "HoldingsQuoteFilter",
      "HoldingsSortDirection",
      "HoldingsSortKey",
      "HoldingsColumnKey",
      "HoldingsTableFilters",
      "HoldingsTableState",
      "HoldingsTableResult",
      "defaultHoldingsColumns",
      '"PROFITABLE"',
      '"LOSING"',
      '"HIGH_YIELD"',
      '"QUOTE_STATUS"',
    ],
  },

  {
    file:
      "src/lib/holdings-professional/holdingsTableEngine.ts",

    markers: [
      "createHoldingsTableResult",
      "exportHoldingsCsv",
      "includesSearch",
      "matchesPerformance",
      "matchesIncome",
      "matchesQuote",
      "sortValue",
      "activeFilterCount",
      "availableSectors",
      "availableCountries",
      "allFilteredRows",
      "totalPages",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsFilterBar.tsx",

    markers: [
      '"use client"',
      "HoldingsFilterBar",
      "Search ticker",
      "All performance",
      "Profitable",
      "Below cost",
      "Dividend holdings",
      "Yield ≥ 4%",
      "All quote states",
      "Sectors",
      "Countries",
      "Clear all",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsColumnMenu.tsx",

    markers: [
      '"use client"',
      "HoldingsColumnMenu",
      "Visible columns",
      "MARKET_VALUE",
      "DAILY_CHANGE",
      "TOTAL_RETURN",
      "DIVIDEND_YIELD",
      "QUOTE_STATUS",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsMobileCard.tsx",

    markers: [
      '"use client"',
      "HoldingsMobileCard",
      "Market value",
      "Weight",
      "Today",
      "Total return",
      "annualIncome",
      "quoteStatus",
      "/holdings?symbol=",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsTablePagination.tsx",

    markers: [
      '"use client"',
      "HoldingsTablePagination",
      "First page",
      "Previous page",
      "Next page",
      "Last page",
      "Page",
      "Rows",
    ],
  },

  {
    file:
      "src/components/holdings-professional/InstitutionalHoldingsTable.tsx",

    markers: [
      '"use client"',
      "InstitutionalHoldingsTable",
      "Professional Holdings Table",
      "Institutional Position Ledger",
      "createHoldingsTableResult",
      "exportHoldingsCsv",
      "HoldingsFilterBar",
      "HoldingsColumnMenu",
      "HoldingsMobileCard",
      "HoldingsTablePagination",
      "sticky top-0",
      "Market value",
      "Total return",
      "Dividend yield",
      "Annual income",
      "Export CSV",
      "No holdings match",
      "Clear filters",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsCommandCentre.tsx",

    markers: [
      "InstitutionalHoldingsTable",
      "<InstitutionalHoldingsTable",
      "snapshot={",
    ],
  },

  {
    file:
      "src/components/holdings-professional/index.ts",

    markers: [
      'export * from "./HoldingsColumnMenu"',
      'export * from "./HoldingsFilterBar"',
      'export * from "./HoldingsMobileCard"',
      'export * from "./HoldingsTablePagination"',
      'export * from "./InstitutionalHoldingsTable"',
    ],
  },

  {
    file:
      "src/lib/holdings-professional/index.ts",

    markers: [
      'export * from "./holdingsTableEngine"',
      'export * from "./holdingsTableModels"',
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

const commandCentre =
  fs.readFileSync(
    "src/components/holdings-professional/HoldingsCommandCentre.tsx",
    "utf8"
  );

const tableCount =
  (
    commandCentre.match(
      /<InstitutionalHoldingsTable\b/g
    ) ||
    []
  ).length;

if (tableCount !== 1) {
  failures.push(
    `HoldingsCommandCentre must render exactly one InstitutionalHoldingsTable; found ${tableCount}.`
  );
}

const table =
  fs.readFileSync(
    "src/components/holdings-professional/InstitutionalHoldingsTable.tsx",
    "utf8"
  );

for (const feature of [
  "setFilters",
  "setSortKey",
  "setSortDirection",
  "setPage",
  "setPageSize",
  "setVisibleColumns",
  "downloadCsv",
  "handleSort",
]) {
  if (!table.includes(feature)) {
    failures.push(
      `InstitutionalHoldingsTable missing interaction: ${feature}`
    );
  }
}

const engine =
  fs.readFileSync(
    "src/lib/holdings-professional/holdingsTableEngine.ts",
    "utf8"
  );

for (const filter of [
  "PROFITABLE",
  "LOSING",
  "OUTPERFORMERS",
  "UNDERPERFORMERS",
  "DIVIDEND",
  "NO_DIVIDEND",
  "HIGH_YIELD",
  "PRICED",
  "STALE",
  "ESTIMATED",
]) {
  if (!engine.includes(filter)) {
    failures.push(
      `Holdings table engine missing filter: ${filter}`
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Holdings Bash 11.3B verification failed:"
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
  "✅ Holdings Bash 11.3B verification passed."
);
console.log(
  "✅ Institutional holdings table installed."
);
console.log(
  "✅ Advanced search installed."
);
console.log(
  "✅ Sector and country filters installed."
);
console.log(
  "✅ Performance and income filters installed."
);
console.log(
  "✅ Quote-status filters installed."
);
console.log(
  "✅ Column controls installed."
);
console.log(
  "✅ Sortable columns installed."
);
console.log(
  "✅ Pagination installed."
);
console.log(
  "✅ CSV export installed."
);
console.log(
  "✅ Mobile holdings cards installed."
);
console.log("");
console.log(
  "Bash 11.3B complete."
);
console.log(
  "Professional Holdings Sprint remaining: 3."
);
console.log("");
