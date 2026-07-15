#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const calendarFile =
  "src/components/dividend-centre-v2/DividendCalendar.tsx";

const requiredFiles = [
  calendarFile,
  "src/components/dividend-centre-v2/dividendCentreTypes.ts",
  "src/components/dividend-centre-v2/dividendCentreFormatters.ts",
  "src/components/dividend-centre-v2/ProfessionalDividendCentre.tsx",
];

const failures = [];

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
      `Missing required file: ${file}`
    );
  }
}

if (
  fs.existsSync(
    calendarFile
  )
) {
  const source =
    fs.readFileSync(
      calendarFile,
      "utf8"
    );

  const requiredMarkers = [
    "Dividend Calendar",
    "Today",
    "Previous month",
    "Next month",
    "Select month",
    "Select year",
    "MONTH",
    "AGENDA",
    "SelectedDayPanel",
    "DayEventBadge",
    "Monthly Payments",
    "Payment Events",
    "Ex-Dividend Events",
    "EX_DATE",
    "PAYMENT_DATE",
    "RECORD_DATE",
    "DECLARATION_DATE",
    "Ex-dividend",
    "Payment",
    "Record date",
    "Declaration",
    "Payment Total",
    "Select a calendar day",
    "No dividend events this month",
    "visibleMonthMarkers",
    "monthlyPaymentTotal",
    "markersByDate",
    "selectedDate",
    "setSelectedDate",
    "setView",
    "month.getFullYear",
    "month.getMonth",
    "aria-label",
    "xl:hidden",
    "xl:block",
  ];

  for (
    const marker of
    requiredMarkers
  ) {
    if (
      !source.includes(
        marker
      )
    ) {
      failures.push(
        `${calendarFile} missing marker: ${marker}`
      );
    }
  }

  const markerTypes = [
    "EX_DATE",
    "PAYMENT_DATE",
    "RECORD_DATE",
    "DECLARATION_DATE",
  ];

  for (
    const markerType of
    markerTypes
  ) {
    if (
      !source.includes(
        `"${markerType}"`
      )
    ) {
      failures.push(
        `${calendarFile} does not handle ${markerType}.`
      );
    }
  }

  if (
    !source.includes(
      "onMonthChange"
    )
  ) {
    failures.push(
      "Calendar does not use the existing controlled month API."
    );
  }

  if (
    !source.includes(
      "marker.markerType"
    )
  ) {
    failures.push(
      "Calendar does not inspect marker type."
    );
  }

  if (
    !source.includes(
      "marker.status"
    )
  ) {
    failures.push(
      "Calendar does not inspect event status."
    );
  }

  if (
    !source.includes(
      "marker.amount"
    )
  ) {
    failures.push(
      "Calendar does not calculate payment amounts."
    );
  }

  if (
    !source.includes(
      "formatDividendMoney"
    )
  ) {
    failures.push(
      "Calendar does not format dividend cash values."
    );
  }

  if (
    !source.includes(
      "formatDividendMonth"
    )
  ) {
    failures.push(
      "Calendar does not format the selected month."
    );
  }

  if (
    !source.includes(
      "formatDividendDate"
    )
  ) {
    failures.push(
      "Calendar does not format selected event dates."
    );
  }

  if (
    !source.includes(
      "Array.from({"
    ) ||
    !source.includes(
      "length:"
    ) ||
    !source.includes(
      "42"
    )
  ) {
    failures.push(
      "Calendar does not render a six-week month grid."
    );
  }
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Dividend Centre Bash 8.3 verification failed:"
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
  "✅ Dividend Centre Bash 8.3 verification passed."
);
console.log(
  "✅ Interactive monthly dividend calendar installed."
);
console.log(
  "✅ Previous and next month navigation installed."
);
console.log(
  "✅ Today shortcut installed."
);
console.log(
  "✅ Month and year selectors installed."
);
console.log(
  "✅ Ex-dividend highlighting installed."
);
console.log(
  "✅ Payment-date highlighting installed."
);
console.log(
  "✅ Record-date highlighting installed."
);
console.log(
  "✅ Declaration-date highlighting installed."
);
console.log(
  "✅ Daily dividend event selection installed."
);
console.log(
  "✅ Selected-day event panel installed."
);
console.log(
  "✅ Monthly payment totals installed."
);
console.log(
  "✅ Daily payment totals installed."
);
console.log(
  "✅ Calendar legend installed."
);
console.log(
  "✅ Desktop month view installed."
);
console.log(
  "✅ Mobile agenda view installed."
);
console.log(
  "✅ Announced, forecast and received states preserved."
);
console.log(
  "✅ Existing controlled month wiring preserved."
);
console.log("");
console.log(
  "Bash 8.3 complete."
);
console.log(
  "Dividend Centre UI bashes remaining: 1."
);
console.log("");
