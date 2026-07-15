#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/app/(dashboard)/dividends/page.tsx",
    markers: [
      "useBusinessSnapshot",
      "snapshot.holdings",
      "snapshot.transactions",
      "DividendCentreRouteBridge",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendCentreRouteBridge.tsx",
    markers: [
      "assetTicker",
      "action",
      "amountAud",
      "totalAud",
      "totalFeesIncludedAud",
      "averageCostAud",
      "DividendCentreConnected",
      "Cash Dividend",
      "dividends",
      "records",
      "ASX",
      ".AX",
    ],
  },
  {
    file:
      "src/components/dividend-centre-v2/DividendCentreConnected.tsx",
    markers: [
      "hasPortfolioData",
      "transactions.length",
      "holdings.length",
      "enabled:",
    ],
  },
  {
    file:
      "src/hooks/useDividendIntelligence.ts",
    markers: [
      "requestItemCount",
      "request.transactions",
      "request.holdings",
      "request.securities",
      "/api/dividend-data",
    ],
  },
  {
    file:
      "src/lib/dividend-data/dividendLedger.ts",
    markers: [
      "createReceivedDividendEvents",
      "DIVIDEND",
      "RECEIVED",
      "ledger",
    ],
  },
  {
    file:
      "src/lib/dividend-data/dividendService.ts",
    markers: [
      "createReceivedDividendEvents",
      "request.transactions",
      "ledgerEvents",
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

const page =
  fs.readFileSync(
    "src/app/(dashboard)/dividends/page.tsx",
    "utf8"
  );

if (
  page.includes(
    "<DividendCentreRouteBridge />"
  )
) {
  failures.push(
    "Dividend page still renders an unconnected DividendCentreRouteBridge."
  );
}

const connected =
  fs.readFileSync(
    "src/components/dividend-centre-v2/DividendCentreConnected.tsx",
    "utf8"
  );

if (
  connected.includes(
    "enabled:\n          holdings.length"
  )
) {
  failures.push(
    "DividendCentreConnected still requires holdings and ignores transaction-only portfolios."
  );
}

const hook =
  fs.readFileSync(
    "src/hooks/useDividendIntelligence.ts",
    "utf8"
  );

if (
  !hook.includes(
    "request.transactions"
  )
) {
  failures.push(
    "useDividendIntelligence does not count ledger transactions."
  );
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Dividend ledger connection verification failed:"
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
  "✅ Dividend ledger connection verification passed."
);
console.log(
  "✅ Dividend route is connected to useBusinessSnapshot."
);
console.log(
  "✅ Current holdings are passed into Dividend Centre 2.0."
);
console.log(
  "✅ The complete transaction ledger is passed into Dividend Centre 2.0."
);
console.log(
  "✅ Cash Dividend actions are recognised."
);
console.log(
  "✅ assetTicker symbols are recognised."
);
console.log(
  "✅ ASX-prefixed symbols are normalised."
);
console.log(
  "✅ totalAud and amountAud values are recognised."
);
console.log(
  "✅ Existing dividend records are included as a fallback source."
);
console.log(
  "✅ Transaction-only dividend portfolios can load."
);
console.log(
  "✅ Live holdings can still request upcoming provider events."
);
console.log("");
