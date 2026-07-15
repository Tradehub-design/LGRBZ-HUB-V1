#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/holdings-professional/positionDividendModels.ts",

    markers: [
      "PositionDividendStatus",
      "PositionDividendEvent",
      "PositionDividendYear",
      "PositionDividendMonth",
      "PositionDividendSnapshot",
      '"ANNOUNCED"',
      '"EXPECTED"',
      '"FORECAST"',
      '"PAID"',
      '"CANCELLED"',
      "forwardAnnualIncome",
      "currentYield",
      "yieldOnCost",
      "incomeContribution",
      "compoundAnnualGrowth",
      "daysUntilNextPayment",
    ],
  },

  {
    file:
      "src/lib/holdings-professional/positionDividendEngine.ts",

    markers: [
      "createPositionDividendSnapshot",
      "normaliseDividend",
      "syntheticForwardEvent",
      "createAnnualHistory",
      "createMonthlyProfile",
      "compoundAnnualGrowth",
      "inferStatus",
      "defaultConfidence",
      "daysUntil",
      "dividendHistory",
      "distributions",
      "upcomingDividends",
      "forecastDividends",
      "frankingCredit",
      "withholdingTax",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionDividendIntelligence.tsx",

    markers: [
      '"use client"',
      "PositionDividendIntelligence",
      "createPositionDividendSnapshot",
      "Forward annual income",
      "Current yield",
      "Yield on cost",
      "Latest income growth",
      "Monthly average",
      "Portfolio income contribution",
      "Forecast confidence",
      "Upcoming payments",
      "PositionIncomeHistoryChart",
      "PositionMonthlyIncomeProfile",
      "PositionUpcomingDividends",
      "PositionDividendHistoryTable",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionIncomeHistoryChart.tsx",

    markers: [
      '"use client"',
      "PositionIncomeHistoryChart",
      "ResponsiveContainer",
      "BarChart",
      "Annual dividend income",
      "Income History",
      "netIncome",
      "growthPercent",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionMonthlyIncomeProfile.tsx",

    markers: [
      '"use client"',
      "PositionMonthlyIncomeProfile",
      "Monthly income profile",
      "Payment Seasonality",
      "month.netIncome",
      "maximum",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionUpcomingDividends.tsx",

    markers: [
      '"use client"',
      "PositionUpcomingDividends",
      "Future dividend payments",
      "Upcoming Income",
      "Next ex-date",
      "Next payment",
      "event.amountPerShare",
      "event.confidence",
      "No future dividend payments are dated",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionDividendHistoryTable.tsx",

    markers: [
      '"use client"',
      "PositionDividendHistoryTable",
      "Historical dividends",
      "Payment History",
      "Payment date",
      "Ex-dividend",
      "Quantity",
      "Per share",
      "Gross",
      "Tax withheld",
      "Franking credits",
      "Net income",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionIntelligenceTabs.tsx",

    markers: [
      "createHoldingsVisualSnapshot",
      "PositionDividendIntelligence",
      "const portfolioSnapshot =",
      "<PositionDividendIntelligence",
      "portfolioSnapshot={",
      'activeTab ===\n        "DIVIDENDS"',
    ],
  },

  {
    file:
      "src/components/holdings-professional/index.ts",

    markers: [
      'export * from "./PositionDividendHistoryTable"',
      'export * from "./PositionDividendIntelligence"',
      'export * from "./PositionIncomeHistoryChart"',
      'export * from "./PositionMonthlyIncomeProfile"',
      'export * from "./PositionUpcomingDividends"',
    ],
  },

  {
    file:
      "src/lib/holdings-professional/index.ts",

    markers: [
      'export * from "./positionDividendEngine"',
      'export * from "./positionDividendModels"',
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

const tabs =
  fs.readFileSync(
    "src/components/holdings-professional/PositionIntelligenceTabs.tsx",
    "utf8"
  );

const dividendCount =
  (
    tabs.match(
      /<PositionDividendIntelligence\b/g
    ) ||
    []
  ).length;

if (dividendCount !== 1) {
  failures.push(
    `PositionIntelligenceTabs must render exactly one PositionDividendIntelligence; found ${dividendCount}.`
  );
}

if (
  tabs.includes(
    "Position dividend intelligence foundation"
  )
) {
  failures.push(
    "Dividend intelligence foundation placeholder still exists."
  );
}

const engine =
  fs.readFileSync(
    "src/lib/holdings-professional/positionDividendEngine.ts",
    "utf8"
  );

for (const sourceKey of [
  "dividends",
  "dividendHistory",
  "distributions",
  "incomeHistory",
  "upcomingDividends",
  "upcomingPayments",
  "forecastDividends",
]) {
  if (!engine.includes(sourceKey)) {
    failures.push(
      `Position dividend engine missing source key: ${sourceKey}`
    );
  }
}

for (const status of [
  "ANNOUNCED",
  "EXPECTED",
  "FORECAST",
  "PAID",
  "CANCELLED",
]) {
  if (!engine.includes(status)) {
    failures.push(
      `Position dividend engine missing status: ${status}`
    );
  }
}

for (const indexFile of [
  "src/components/holdings-professional/index.ts",
  "src/lib/holdings-professional/index.ts",
]) {
  const exports =
    fs.readFileSync(
      indexFile,
      "utf8"
    )
      .split(/\r?\n/)
      .map(
        line =>
          line.trim()
      )
      .filter(
        line =>
          line.startsWith(
            "export "
          )
      );

  if (
    new Set(
      exports
    ).size !==
    exports.length
  ) {
    failures.push(
      `${indexFile} contains duplicate exports.`
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Holdings Bash 11.3C.3 verification failed:"
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
  "✅ Holdings Bash 11.3C.3 verification passed."
);
console.log(
  "✅ Position dividend extraction installed."
);
console.log(
  "✅ Historical dividend income installed."
);
console.log(
  "✅ Upcoming dividend payments installed."
);
console.log(
  "✅ Payment confidence installed."
);
console.log(
  "✅ Next-payment countdown installed."
);
console.log(
  "✅ Yield on cost installed."
);
console.log(
  "✅ Dividend growth calculations installed."
);
console.log(
  "✅ Annual income chart installed."
);
console.log(
  "✅ Monthly income profile installed."
);
console.log(
  "✅ Dividend history table installed."
);
console.log(
  "✅ Dividends tab connected."
);
console.log("");
console.log(
  "Bash 11.3C.3 complete."
);
console.log(
  "Position Intelligence parts remaining: 1."
);
console.log("");
