import fs from "node:fs";
import process from "node:process";

const routePath =
  process.argv[2];

const checks = [
  {
    file:
      "src/components/dividend-centre-v2/DividendExecutiveSummary.tsx",
    markers: [
      "Forward 12 Months",
      "Announced Income",
      "Received This FY",
      "Dividend Yield",
      "Franking Credits",
      "Next Event",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendCalendar.tsx",
    markers: [
      "DividendCalendar",
      "Ex-dividend",
      "Payment",
      "Announced",
      "Forecast",
      "Received",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendUpcomingTimeline.tsx",
    markers: [
      "Dividend Timeline",
      "eligible shares",
      "franking",
      "paymentDate",
      "exDate",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendMonthlyForecast.tsx",
    markers: [
      "Monthly Dividend Income",
      "announcedIncome",
      "forecastIncome",
      "frankingCredits",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendHoldingBreakdown.tsx",
    markers: [
      "Dividend Contribution by Holding",
      "Forward Income",
      "Yield on Cost",
      "Next Payment",
      "Franking",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendReconciliationPanel.tsx",
    markers: [
      "Forecast vs Received",
      "announcedAmount",
      "receivedAmount",
      "outstandingAmount",
      "matchedEventCount",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
    markers: [
      "Portfolio Income Intelligence",
      "Dividend Centre",
      "DividendExecutiveSummary",
      "DividendCalendar",
      "DividendUpcomingTimeline",
      "DividendMonthlyForecast",
      "DividendHoldingBreakdown",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendCentreConnected.tsx",
    markers: [
      "useDividendIntelligence",
      "DividendCentreLoadingState",
      "DividendCentreErrorState",
      "ProfessionalDividendCentre",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendCentreRouteBridge.tsx",
    markers: [
      "DividendCentreRouteBridge",
      "adaptHolding",
      "adaptTransaction",
      "DividendCentreConnected",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/resolveDividendCentreData.ts",
    markers: [
      "resolveDividendCentreData",
      "createTimeline",
      "createCalendarMarkers",
      "createReconciliation",
      "countDividendStatuses",
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

if (
  !routePath ||
  !fs.existsSync(
    routePath
  )
) {
  failures.push(
    `Dividend route missing: ${routePath || "not supplied"}`
  );
} else {
  const routeContent =
    fs.readFileSync(
      routePath,
      "utf8"
    );

  if (
    !routeContent.includes(
      "DividendCentreRouteBridge"
    )
  ) {
    failures.push(
      `${routePath} is not connected to DividendCentreRouteBridge`
    );
  }
}

if (
  failures.length >
  0
) {
  console.error(
    "❌ Dividend Centre 2.0 verification failed:"
  );

  for (
    const failure of
    failures
  ) {
    console.error(
      `   - ${failure}`
    );
  }

  process.exit(1);
}

console.log(
  "✅ Dividend Centre 2.0 verification passed."
);

console.log(
  "✅ Executive dividend summary cards are installed."
);

console.log(
  "✅ Dividend calendar is installed."
);

console.log(
  "✅ Upcoming dividend timeline is installed."
);

console.log(
  "✅ Monthly income forecast is installed."
);

console.log(
  "✅ Holding income breakdown is installed."
);

console.log(
  "✅ Forecast-to-received reconciliation is installed."
);

console.log(
  "✅ Franking credit presentation is installed."
);

console.log(
  "✅ Dividend Centre route is connected."
);

console.log(
  `✅ Verified ${checks.length} Dividend Centre files.`
);
