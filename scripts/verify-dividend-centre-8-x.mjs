#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const failures = [];

const requiredFiles = [
  "src/components/dividend-centre-v2/DividendCentreHero.tsx",
  "src/components/dividend-centre-v2/DividendProviderBanner.tsx",
  "src/components/dividend-centre-v2/DividendUpcomingPaymentsTable.tsx",
  "src/components/dividend-centre-v2/DividendCalendar.tsx",
  "src/components/dividend-centre-v2/DividendAnalyticsDashboard.tsx",
  "src/components/dividend-centre-v2/DividendAnalyticsExport.tsx",
  "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
  "src/components/dividend-centre-v2/DividendCentreConnected.tsx",
  "src/components/dividend-centre-v2/DividendCentreRouteBridge.tsx",
  "src/components/dividend-centre-v2/DividendCentreStates.tsx",
  "src/components/dividend-centre-v2/DividendExecutiveSummary.tsx",
  "src/components/dividend-centre-v2/DividendUpcomingTimeline.tsx",
  "src/components/dividend-centre-v2/DividendMonthlyForecast.tsx",
  "src/components/dividend-centre-v2/DividendHoldingBreakdown.tsx",
  "src/components/dividend-centre-v2/DividendReconciliationPanel.tsx",
  "src/components/dividend-centre-v2/resolveDividendCentreData.ts",
  "src/hooks/useDividendIntelligence.ts",
  "src/app/(dashboard)/dividends/page.tsx",
];

for (
  const file of
  requiredFiles
) {
  if (
    !fs.existsSync(
      file
    )
  ) {
    failures.push(
      `Missing Dividend Centre file: ${file}`
    );
  }
}

const page =
  fs.existsSync(
    "src/app/(dashboard)/dividends/page.tsx"
  )
    ? fs.readFileSync(
        "src/app/(dashboard)/dividends/page.tsx",
        "utf8"
      )
    : "";

for (
  const marker of
  [
    "useBusinessSnapshot",
    "snapshot.holdings",
    "snapshot.transactions",
    "DividendCentreRouteBridge",
  ]
) {
  if (
    !page.includes(
      marker
    )
  ) {
    failures.push(
      `Dividend route missing live portfolio marker: ${marker}`
    );
  }
}

const bridge =
  fs.existsSync(
    "src/components/dividend-centre-v2/DividendCentreRouteBridge.tsx"
  )
    ? fs.readFileSync(
        "src/components/dividend-centre-v2/DividendCentreRouteBridge.tsx",
        "utf8"
      )
    : "";

for (
  const marker of
  [
    "assetTicker",
    "action",
    "amountAud",
    "totalAud",
    "Cash Dividend",
    "adaptHolding",
    "adaptTransaction",
  ]
) {
  if (
    !bridge.includes(
      marker
    )
  ) {
    failures.push(
      `Dividend ledger bridge missing marker: ${marker}`
    );
  }
}

const centre =
  fs.existsSync(
    "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx"
  )
    ? fs.readFileSync(
        "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
        "utf8"
      )
    : "";

const componentOrder = [
  "DividendCentreHero",
  "DividendExecutiveSummary",
  "DividendProviderBanner",
  "DividendCentreToolbar",
  "DividendUpcomingPaymentsTable",
  "DividendCalendar",
  "DividendUpcomingTimeline",
  "DividendMonthlyForecast",
  "DividendReconciliationPanel",
  "DividendAnalyticsDashboard",
  "DividendHoldingBreakdown",
  "DividendAnalyticsExport",
];

let previous =
  -1;

for (
  const component of
  componentOrder
) {
  const index =
    centre.indexOf(
      `<${component}`
    );

  if (
    index ===
    -1
  ) {
    failures.push(
      `ProfessionalDividendCentre does not render ${component}.`
    );

    continue;
  }

  if (
    index <
    previous
  ) {
    failures.push(
      `${component} is rendered in the wrong Dividend Centre order.`
    );
  }

  previous =
    index;
}

const calendar =
  fs.existsSync(
    "src/components/dividend-centre-v2/DividendCalendar.tsx"
  )
    ? fs.readFileSync(
        "src/components/dividend-centre-v2/DividendCalendar.tsx",
        "utf8"
      )
    : "";

for (
  const marker of
  [
    "EX_DATE",
    "PAYMENT_DATE",
    "RECORD_DATE",
    "DECLARATION_DATE",
    "Today",
    "Previous month",
    "Next month",
  ]
) {
  if (
    !calendar.includes(
      marker
    )
  ) {
    failures.push(
      `Interactive calendar missing marker: ${marker}`
    );
  }
}

const table =
  fs.existsSync(
    "src/components/dividend-centre-v2/DividendUpcomingPaymentsTable.tsx"
  )
    ? fs.readFileSync(
        "src/components/dividend-centre-v2/DividendUpcomingPaymentsTable.tsx",
        "utf8"
      )
    : "";

for (
  const marker of
  [
    "Search dividend payments",
    "All statuses",
    "Next 30 days",
    "Next 90 days",
    "Historical",
    "paginatedRows",
    "Export View",
  ]
) {
  if (
    !table.includes(
      marker
    )
  ) {
    failures.push(
      `Payments table missing marker: ${marker}`
    );
  }
}

const analytics =
  fs.existsSync(
    "src/components/dividend-centre-v2/DividendAnalyticsDashboard.tsx"
  )
    ? fs.readFileSync(
        "src/components/dividend-centre-v2/DividendAnalyticsDashboard.tsx",
        "utf8"
      )
    : "";

for (
  const marker of
  [
    "Monthly Income",
    "Holding Contribution",
    "Country Exposure",
    "Provider Analysis",
    "Forecast Reliance",
    "Income Consistency",
  ]
) {
  if (
    !analytics.includes(
      marker
    )
  ) {
    failures.push(
      `Analytics dashboard missing marker: ${marker}`
    );
  }
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Dividend Centre 8.x regression verification failed:"
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
  "✅ Dividend Centre 8.x regression verification passed."
);
console.log(
  "✅ Historical dividend ledger connection remains installed."
);
console.log(
  "✅ Current holdings remain connected."
);
console.log(
  "✅ Professional Dividend Centre layout remains installed."
);
console.log(
  "✅ Upcoming payments table remains installed."
);
console.log(
  "✅ Interactive dividend calendar remains installed."
);
console.log(
  "✅ Dividend analytics remain installed."
);
console.log(
  "✅ Dividend CSV exports remain installed."
);
console.log(
  "✅ Existing forecast, timeline and reconciliation remain installed."
);
console.log(
  `✅ Verified ${requiredFiles.length} core Dividend Centre files.`
);
console.log("");
