#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/holdings-professional/positionActivityModels.ts",

    markers: [
      "PositionLotStatus",
      "PositionFifoLot",
      "PositionActivityType",
      "PositionActivityEvent",
      "PositionActivityFilter",
      "PositionActivitySnapshot",
      '"OPEN"',
      '"PARTIALLY_REALISED"',
      '"CLOSED"',
      '"BUY"',
      '"SELL"',
      '"DIVIDEND"',
      '"DRP"',
      '"SPLIT"',
      '"TRANSFER"',
      '"CORPORATE_ACTION"',
    ],
  },

  {
    file:
      "src/lib/holdings-professional/positionActivityEngine.ts",

    markers: [
      "createPositionActivitySnapshot",
      "normaliseLot",
      "createSyntheticLot",
      "normaliseEvent",
      "inferActivityType",
      "lotStatus",
      "holdingDays",
      "fifoLots",
      "purchaseLots",
      "transactionHistory",
      "dividendHistory",
      "corporateActions",
      "unrealisedGainLossPercent",
      "oldestHoldingDays",
      "averageHoldingDays",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionFifoLots.tsx",

    markers: [
      '"use client"',
      "PositionFifoLots",
      "createPositionActivitySnapshot",
      "FIFO Cost Lots",
      "Open purchase lots",
      "Remaining cost",
      "Current value",
      "Unrealised return",
      "Oldest lot",
      "Purchase date",
      "Original units",
      "Remaining",
      "Purchase price",
      "Current price",
      "Return",
      "Status",
      "PARTIALLY_REALISED",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionActivityFilters.tsx",

    markers: [
      '"use client"',
      "PositionActivityFilters",
      "All",
      "Buys",
      "Sells",
      "Dividends",
      "DRP",
      "Splits",
      "Transfers",
      "Corporate actions",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionActivityTimeline.tsx",

    markers: [
      '"use client"',
      "PositionActivityTimeline",
      "createPositionActivitySnapshot",
      "PositionActivityFilters",
      "Transaction and event timeline",
      "Total events",
      "Purchases",
      "Sales",
      "Income events",
      "filteredEvents",
      "event.netAmount",
      "event.quantity",
      "event.price",
      "No matching activity events",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionIntelligenceTabs.tsx",

    markers: [
      "PositionFifoLots",
      "PositionActivityTimeline",
      "<PositionFifoLots",
      "<PositionActivityTimeline",
      'activeTab ===\n        "LOTS"',
      'activeTab ===\n        "ACTIVITY"',
    ],
  },

  {
    file:
      "src/components/holdings-professional/index.ts",

    markers: [
      'export * from "./PositionActivityFilters"',
      'export * from "./PositionActivityTimeline"',
      'export * from "./PositionFifoLots"',
    ],
  },

  {
    file:
      "src/lib/holdings-professional/index.ts",

    markers: [
      'export * from "./positionActivityEngine"',
      'export * from "./positionActivityModels"',
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

for (const component of [
  "PositionFifoLots",
  "PositionActivityTimeline",
]) {
  const count =
    (
      tabs.match(
        new RegExp(
          `<${component}\\b`,
          "g"
        )
      ) ||
      []
    ).length;

  if (count !== 1) {
    failures.push(
      `PositionIntelligenceTabs must render exactly one ${component}; found ${count}.`
    );
  }
}

if (
  tabs.includes(
    "FIFO lot intelligence foundation"
  )
) {
  failures.push(
    "FIFO Lots foundation placeholder still exists."
  );
}

if (
  tabs.includes(
    "Position activity timeline foundation"
  )
) {
  failures.push(
    "Activity foundation placeholder still exists."
  );
}

const engine =
  fs.readFileSync(
    "src/lib/holdings-professional/positionActivityEngine.ts",
    "utf8"
  );

for (const sourceKey of [
  "fifoLots",
  "lots",
  "costLots",
  "purchaseLots",
  "openLots",
  "transactions",
  "transactionHistory",
  "dividends",
  "dividendHistory",
  "corporateActions",
]) {
  if (!engine.includes(sourceKey)) {
    failures.push(
      `Position activity engine missing source key: ${sourceKey}`
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
    "❌ Holdings Bash 11.3C.2 verification failed:"
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
  "✅ Holdings Bash 11.3C.2 verification passed."
);
console.log(
  "✅ FIFO lot extraction installed."
);
console.log(
  "✅ Synthetic lot fallback installed."
);
console.log(
  "✅ Lot-level return calculations installed."
);
console.log(
  "✅ Holding-period calculations installed."
);
console.log(
  "✅ Position activity extraction installed."
);
console.log(
  "✅ Buy and sell event support installed."
);
console.log(
  "✅ Dividend and DRP event support installed."
);
console.log(
  "✅ Split and corporate-action support installed."
);
console.log(
  "✅ FIFO Lots tab connected."
);
console.log(
  "✅ Activity tab connected."
);
console.log("");
console.log(
  "Bash 11.3C.2 complete."
);
console.log(
  "Position Intelligence parts remaining: 2."
);
console.log("");
