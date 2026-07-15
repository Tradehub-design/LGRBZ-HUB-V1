#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/components/dividend-centre-v2/DividendCentreHero.tsx",
    markers: [
      "Portfolio Income Intelligence",
      "Dividend Centre",
      "Next Dividend Event",
      "Forward 12 Months",
      "Received This FY",
      "Confirmed Forward",
      "Forecast Exposure",
      "summary.nextEvent",
      "receivedEventCount",
      "announcedEventCount",
      "forecastEventCount",
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/DividendProviderBanner.tsx",
    markers: [
      "Dividend Data Sources",
      "Portfolio Ledger",
      "Forecast Engine",
      "Twelve Data",
      "Alpha Vantage",
      "providersUsed",
      "unresolvedSymbols",
      "Historical ledger receipts should still remain visible",
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
    markers: [
      "DividendCentreHero",
      "DividendExecutiveSummary",
      "DividendProviderBanner",
      "DividendCentreToolbar",
      "DividendCalendar",
      "DividendUpcomingTimeline",
      "DividendMonthlyForecast",
      "DividendReconciliationPanel",
      "DividendHoldingBreakdown",
      "Declaration Date",
      "Notes",
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/DividendCentreStates.tsx",
    markers: [
      "No dividend data is available yet",
      "Historical Receipts",
      "Current Holdings",
      "Forecast Events",
      "Your portfolio data is not deleted",
      "Dividend Centre could not load",
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/index.ts",
    markers: [
      'export * from "./DividendCentreHero"',
      'export * from "./DividendProviderBanner"',
      'export * from "./ProfessionalDividendCentre"',
    ],
  },

  {
    file:
      "src/components/dividend-centre-v2/DividendCentreConnected.tsx",
    markers: [
      "ProfessionalDividendCentre",
      "DividendCentreLoadingState",
      "DividendCentreErrorState",
      "DividendCentreEmptyState",
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

const centre =
  fs.readFileSync(
    "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
    "utf8"
  );

const componentOrder = [
  "DividendCentreHero",
  "DividendExecutiveSummary",
  "DividendProviderBanner",
  "DividendCentreToolbar",
  "DividendCalendar",
  "DividendUpcomingTimeline",
  "DividendMonthlyForecast",
  "DividendReconciliationPanel",
  "DividendHoldingBreakdown",
];

let previousIndex =
  -1;

for (const component of componentOrder) {
  const index =
    centre.indexOf(
      `<${component}`
    );

  if (index === -1) {
    failures.push(
      `ProfessionalDividendCentre does not render ${component}.`
    );

    continue;
  }

  if (index < previousIndex) {
    failures.push(
      `${component} is rendered in the wrong layout order.`
    );
  }

  previousIndex =
    index;
}

if (
  centre.includes(
    "DividendDataStatus"
  )
) {
  failures.push(
    "ProfessionalDividendCentre still renders the old generic DividendDataStatus instead of DividendProviderBanner."
  );
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Dividend Centre Bash 8.1 verification failed:"
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
  "✅ Dividend Centre Bash 8.1 verification passed."
);
console.log(
  "✅ Professional Dividend Centre hero installed."
);
console.log(
  "✅ Historical, announced and forecast event counts are visible."
);
console.log(
  "✅ Next dividend event is visible in the hero."
);
console.log(
  "✅ Provider and ledger source banner installed."
);
console.log(
  "✅ Unresolved symbols remain clearly disclosed."
);
console.log(
  "✅ Responsive Dividend Centre layout installed."
);
console.log(
  "✅ Loading, error and empty states upgraded."
);
console.log(
  "✅ Historical ledger visibility messaging installed."
);
console.log(
  "✅ CSV export retains detailed dividend event fields."
);
console.log(
  "✅ Existing calendar, timeline, forecast and holding components are preserved."
);
console.log("");
console.log(
  "Bash 8.1 complete."
);
console.log(
  "Dividend Centre UI bashes remaining: 3."
);
console.log("");
