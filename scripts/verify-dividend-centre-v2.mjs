import fs from "node:fs";
import process from "node:process";

const DEFAULT_ROUTE =
  "src/app/(dashboard)/dividends/page.tsx";

const routePath =
  process.argv[2] ||
  DEFAULT_ROUTE;

const failures = [];

function readRequiredFile(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(
      `Missing required file: ${filePath}`
    );

    return null;
  }

  return fs.readFileSync(
    filePath,
    "utf8"
  );
}

function requireAllMarkers(
  filePath,
  markers
) {
  const content =
    readRequiredFile(
      filePath
    );

  if (content === null) {
    return;
  }

  for (const marker of markers) {
    if (!content.includes(marker)) {
      failures.push(
        `${filePath} missing marker: ${marker}`
      );
    }
  }
}

function requireOneMarker(
  filePath,
  markers,
  description
) {
  const content =
    readRequiredFile(
      filePath
    );

  if (content === null) {
    return;
  }

  const matched =
    markers.some(
      (marker) =>
        content.includes(marker)
    );

  if (!matched) {
    failures.push(
      `${filePath} missing ${description}: ${markers.join(
        " | "
      )}`
    );
  }
}

// -----------------------------------------------------------------------------
// Executive summary
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/DividendExecutiveSummary.tsx",
  [
    "Forward 12 Months",
    "Announced Income",
    "Received This FY",
    "Dividend Yield",
    "Franking Credits",
    "Next Event",
  ]
);

// -----------------------------------------------------------------------------
// Calendar renderer
//
// DividendCalendar receives already-normalized markers. It should not be
// required to contain the EX_DATE display label itself.
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/DividendCalendar.tsx",
  [
    "DividendCalendar",
    "DividendCalendarMarker",
    "marker.markerType",
    "\"PAYMENT_DATE\"",
    "marker.label",
    "marker.status",
    "marker.date",
    "Announced",
    "Forecast",
    "Received",
  ]
);

// -----------------------------------------------------------------------------
// Calendar marker model
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/dividendCentreTypes.ts",
  [
    "DividendCalendarMarkerType",
    "\"EX_DATE\"",
    "\"RECORD_DATE\"",
    "\"PAYMENT_DATE\"",
    "\"DECLARATION_DATE\"",
    "DividendCalendarMarker",
    "markerType",
  ]
);

// -----------------------------------------------------------------------------
// Calendar marker creation
//
// Ex-dividend and Payment labels belong in the resolver.
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/resolveDividendCentreData.ts",
  [
    "createCalendarMarkers",
    "event.exDate",
    "\"EX_DATE\"",
    "\"Ex-dividend\"",
    "event.recordDate",
    "\"RECORD_DATE\"",
    "event.paymentDate",
    "\"PAYMENT_DATE\"",
    "\"Payment\"",
    "event.declarationDate",
    "\"DECLARATION_DATE\"",
  ]
);

// -----------------------------------------------------------------------------
// Timeline
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/DividendUpcomingTimeline.tsx",
  [
    "Dividend Timeline",
    "eligible shares",
    "franking",
    "paymentDate",
    "exDate",
  ]
);

// -----------------------------------------------------------------------------
// Monthly forecast
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/DividendMonthlyForecast.tsx",
  [
    "Monthly Dividend Income",
    "announcedIncome",
    "forecastIncome",
    "frankingCredits",
  ]
);

// -----------------------------------------------------------------------------
// Holding contribution
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/DividendHoldingBreakdown.tsx",
  [
    "Dividend Contribution by Holding",
    "Forward Income",
    "Yield on Cost",
    "Next Payment",
    "Franking",
  ]
);

// -----------------------------------------------------------------------------
// Reconciliation
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/DividendReconciliationPanel.tsx",
  [
    "Forecast vs Received",
    "announcedAmount",
    "receivedAmount",
    "outstandingAmount",
    "matchedEventCount",
  ]
);

// -----------------------------------------------------------------------------
// Professional centre composition
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
  [
    "Portfolio Income Intelligence",
    "Dividend Centre",
    "DividendExecutiveSummary",
    "DividendCalendar",
    "DividendUpcomingTimeline",
    "DividendMonthlyForecast",
    "DividendHoldingBreakdown",
  ]
);

// -----------------------------------------------------------------------------
// Connected state
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/DividendCentreConnected.tsx",
  [
    "useDividendIntelligence",
    "DividendCentreLoadingState",
    "DividendCentreErrorState",
    "ProfessionalDividendCentre",
  ]
);

// -----------------------------------------------------------------------------
// Route bridge
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/DividendCentreRouteBridge.tsx",
  [
    "DividendCentreRouteBridge",
    "adaptHolding",
    "adaptTransaction",
    "DividendCentreConnected",
  ]
);

// -----------------------------------------------------------------------------
// Resolver architecture
// -----------------------------------------------------------------------------

requireAllMarkers(
  "src/components/dividend-centre-v2/resolveDividendCentreData.ts",
  [
    "resolveDividendCentreData",
    "createTimeline",
    "createCalendarMarkers",
    "createReconciliation",
    "countDividendStatuses",
  ]
);

// -----------------------------------------------------------------------------
// Route connection
// -----------------------------------------------------------------------------

const routeContent =
  readRequiredFile(
    routePath
  );

if (
  routeContent !== null &&
  !routeContent.includes(
    "DividendCentreRouteBridge"
  )
) {
  failures.push(
    `${routePath} is not connected to DividendCentreRouteBridge`
  );
}

requireOneMarker(
  routePath,
  [
    "<DividendCentreRouteBridge",
    "DividendCentreRouteBridge",
  ],
  "Dividend Centre route bridge"
);

// -----------------------------------------------------------------------------
// Final result
// -----------------------------------------------------------------------------

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Dividend Centre 2.0 verification failed:"
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
  "✅ Dividend Centre 2.0 verification passed."
);
console.log(
  "✅ Executive dividend summary is installed."
);
console.log(
  "✅ Calendar renderer is installed."
);
console.log(
  "✅ EX_DATE marker type is defined."
);
console.log(
  "✅ PAYMENT_DATE marker type is defined."
);
console.log(
  "✅ Ex-dividend markers are created by the resolver."
);
console.log(
  "✅ Payment markers are created by the resolver."
);
console.log(
  "✅ Upcoming dividend timeline is installed."
);
console.log(
  "✅ Monthly dividend forecast is installed."
);
console.log(
  "✅ Holding dividend contribution is installed."
);
console.log(
  "✅ Forecast-to-received reconciliation is installed."
);
console.log(
  "✅ Dividend Centre connected state is installed."
);
console.log(
  "✅ Dividend Centre route bridge is installed."
);
console.log(
  `✅ Verified route: ${routePath}`
);
console.log("");
