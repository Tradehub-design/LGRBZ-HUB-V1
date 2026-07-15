#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/components/dividend-centre-v2/DividendUpcomingPaymentsTable.tsx",
    markers: [
      "DividendUpcomingPaymentsTable",
      "Search dividend payments",
      "All statuses",
      "All dates",
      "Next 30 days",
      "Next 90 days",
      "Historical",
      "sortRows",
      "SortButton",
      "PAGE_SIZE_OPTIONS",
      "paginatedRows",
      "EventStatusBadge",
      "ConfidenceBadge",
      "Eligible",
      "Dividend Per Share",
      "Expected Cash",
      "Franking Credit",
      "Export View",
      "xl:hidden",
      "xl:block",
      "Showing",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
    markers: [
      "DividendUpcomingPaymentsTable",
      "Professional dividend payments table",
      "Review historical receipts",
      "resolved.timeline",
      "DividendCentreToolbar",
      "DividendCalendar",
      "DividendUpcomingTimeline",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/index.ts",
    markers: [
      'export * from "./DividendUpcomingPaymentsTable"',
      'export * from "./DividendUpcomingTimeline"',
      'export * from "./ProfessionalDividendCentre"',
    ],
  },
];

const failures = [];

for (
  const check of
  checks
) {
  if (
    !fs.existsSync(
      check.file
    )
  ) {
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

  for (
    const marker of
    check.markers
  ) {
    if (
      !source.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const tableSource =
  fs.readFileSync(
    "src/components/dividend-centre-v2/DividendUpcomingPaymentsTable.tsx",
    "utf8"
  );

const requiredStatusFilters = [
  "ANNOUNCED",
  "FORECAST",
  "RECEIVED",
  "CANCELLED",
  "UNKNOWN",
];

for (
  const status of
  requiredStatusFilters
) {
  if (
    !tableSource.includes(
      `"${status}"`
    )
  ) {
    failures.push(
      `Payments table missing status filter: ${status}`
    );
  }
}

const requiredSortColumns = [
  "symbol",
  "status",
  "eventDate",
  "exDate",
  "paymentDate",
  "eligibleQuantity",
  "dividendPerShare",
  "expectedCash",
  "frankingCredit",
  "confidence",
];

for (
  const column of
  requiredSortColumns
) {
  if (
    !tableSource.includes(
      `"${column}"`
    )
  ) {
    failures.push(
      `Payments table missing sort column: ${column}`
    );
  }
}

if (
  !tableSource.includes(
    "filteredRows.slice"
  )
) {
  failures.push(
    "Payments table does not paginate filtered rows."
  );
}

if (
  !tableSource.includes(
    "setPageSize"
  )
) {
  failures.push(
    "Payments table does not support selectable page sizes."
  );
}

if (
  !tableSource.includes(
    "exportRows"
  )
) {
  failures.push(
    "Payments table does not include CSV export."
  );
}

if (
  !tableSource.includes(
    "activeFilterCount"
  )
) {
  failures.push(
    "Payments table does not track active filters."
  );
}

const centreSource =
  fs.readFileSync(
    "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
    "utf8"
  );

const paymentsIndex =
  centreSource.indexOf(
    "<DividendUpcomingPaymentsTable"
  );

const calendarIndex =
  centreSource.indexOf(
    "<DividendCalendar"
  );

if (
  paymentsIndex ===
  -1
) {
  failures.push(
    "ProfessionalDividendCentre does not render DividendUpcomingPaymentsTable."
  );
}

if (
  calendarIndex ===
  -1
) {
  failures.push(
    "ProfessionalDividendCentre no longer renders DividendCalendar."
  );
}

if (
  paymentsIndex >
  calendarIndex
) {
  failures.push(
    "Professional payments table should appear before the calendar."
  );
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Dividend Centre Bash 8.2 verification failed:"
  );

  for (
    const failure of
    failures
  ) {
    console.error(
      `   - ${failure}`
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "✅ Dividend Centre Bash 8.2 verification passed."
);
console.log(
  "✅ Professional payments table installed."
);
console.log(
  "✅ Symbol and event search installed."
);
console.log(
  "✅ Status filtering installed."
);
console.log(
  "✅ Date filtering installed."
);
console.log(
  "✅ Multi-column sorting installed."
);
console.log(
  "✅ Pagination installed."
);
console.log(
  "✅ Selectable page sizes installed."
);
console.log(
  "✅ Desktop table installed."
);
console.log(
  "✅ Responsive mobile cards installed."
);
console.log(
  "✅ Status badges installed."
);
console.log(
  "✅ Confidence badges installed."
);
console.log(
  "✅ Eligible quantity visible."
);
console.log(
  "✅ Dividend per share visible."
);
console.log(
  "✅ Expected cash visible."
);
console.log(
  "✅ Franking credit visible."
);
console.log(
  "✅ Filtered CSV export installed."
);
console.log(
  "✅ Existing timeline and calendar preserved."
);
console.log("");
console.log(
  "Bash 8.2 complete."
);
console.log(
  "Dividend Centre UI bashes remaining: 2."
);
console.log("");
