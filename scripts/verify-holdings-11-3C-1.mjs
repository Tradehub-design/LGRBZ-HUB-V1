#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/holdings-professional/positionIntelligenceModels.ts",

    markers: [
      "PositionIntelligenceTab",
      "PositionIntelligenceHealthLevel",
      "PositionIntelligenceMetric",
      "PositionHealthIndicator",
      "PositionIntelligenceSummary",
      "PositionIntelligenceContextValue",
      "CreatePositionIntelligenceInput",
      '"OVERVIEW"',
      '"LOTS"',
      '"ACTIVITY"',
      '"DIVIDENDS"',
      '"ANALYTICS"',
      '"NOTES"',
    ],
  },

  {
    file:
      "src/lib/holdings-professional/positionIntelligenceEngine.ts",

    markers: [
      "createPositionIntelligence",
      "currentPrice",
      "averageCost",
      "realisedGainLoss",
      "unrealisedGainLoss",
      "totalReturn",
      "yieldOnCost",
      "incomeContribution",
      "healthScore",
      "healthIndicators",
      "generatedSummary",
      "CONCENTRATION",
      "PERFORMANCE",
      "INCOME",
      "DATA",
    ],
  },

  {
    file:
      "src/hooks/holdings-professional/usePositionIntelligenceDrawer.ts",

    markers: [
      '"use client"',
      "PositionIntelligenceContext",
      "usePositionIntelligenceDrawer",
      "useContext",
      "PositionIntelligenceProvider",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionIntelligenceProvider.tsx",

    markers: [
      '"use client"',
      "PositionIntelligenceProvider",
      "selectedPosition",
      "activeTab",
      "createPositionIntelligence",
      "openPosition",
      "closePosition",
      "PositionIntelligenceContext.Provider",
      "PositionIntelligenceDrawer",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionIntelligenceDrawer.tsx",

    markers: [
      '"use client"',
      "PositionIntelligenceDrawer",
      'role="dialog"',
      'aria-modal="true"',
      'aria-labelledby="position-intelligence-title"',
      "Escape",
      'document.body.style.overflow =',
      "Close position intelligence backdrop",
      "slide-in-from-right",
      "PositionIntelligenceHeader",
      "PositionIntelligenceMetrics",
      "PositionIntelligenceTabs",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionIntelligenceHeader.tsx",

    markers: [
      '"use client"',
      "PositionIntelligenceHeader",
      "position-intelligence-title",
      "Current price",
      "Rank #",
      "Market-data",
      "Close position intelligence",
      "today",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionIntelligenceMetrics.tsx",

    markers: [
      '"use client"',
      "PositionIntelligenceMetrics",
      "summary.metrics.map",
      "MARKET_VALUE",
      "UNREALISED_RETURN",
      "ANNUAL_INCOME",
      "QUOTE_QUALITY",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionHealthOverview.tsx",

    markers: [
      '"use client"',
      "PositionHealthOverview",
      "Position Health",
      "Risk and quality overview",
      "healthIndicators.map",
      "CONCENTRATION",
      "PERFORMANCE",
      "INCOME",
      "DATA",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionIntelligenceTabs.tsx",

    markers: [
      '"use client"',
      "PositionIntelligenceTabs",
      "Overview",
      "FIFO Lots",
      "Activity",
      "Dividends",
      "Analytics",
      "Notes",
      "Generated Position Summary",
      "FIFO lot intelligence foundation",
      "Position activity timeline foundation",
      "Position dividend intelligence foundation",
      "Position analytics foundation",
      "Position notes foundation",
    ],
  },

  {
    file:
      "src/components/holdings-professional/PositionQuickActions.tsx",

    markers: [
      '"use client"',
      "PositionQuickActions",
      "Quick actions",
      "Add transaction",
      "Sell shares",
      "View transactions",
      "View dividends",
      "Open analytics",
      "Export foundation",
    ],
  },

  {
    file:
      "src/components/holdings-professional/OpenPositionIntelligenceButton.tsx",

    markers: [
      '"use client"',
      "OpenPositionIntelligenceButton",
      "usePositionIntelligenceDrawer",
      "openPosition",
      "event.preventDefault",
      "event.stopPropagation",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsCommandCentre.tsx",

    markers: [
      "PositionIntelligenceProvider",
      "<PositionIntelligenceProvider",
      "snapshot={",
      "</PositionIntelligenceProvider>",
    ],
  },

  {
    file:
      "src/components/holdings-professional/InstitutionalHoldingsTable.tsx",

    markers: [
      "OpenPositionIntelligenceButton",
      "<OpenPositionIntelligenceButton",
      "position={",
    ],
  },

  {
    file:
      "src/components/holdings-professional/HoldingsMobileCard.tsx",

    markers: [
      "OpenPositionIntelligenceButton",
      "<OpenPositionIntelligenceButton",
      "position={",
    ],
  },

  {
    file:
      "src/components/holdings-professional/index.ts",

    markers: [
      'export * from "./OpenPositionIntelligenceButton"',
      'export * from "./PositionHealthOverview"',
      'export * from "./PositionIntelligenceDrawer"',
      'export * from "./PositionIntelligenceError"',
      'export * from "./PositionIntelligenceHeader"',
      'export * from "./PositionIntelligenceLoading"',
      'export * from "./PositionIntelligenceMetrics"',
      'export * from "./PositionIntelligenceProvider"',
      'export * from "./PositionIntelligenceTabs"',
      'export * from "./PositionQuickActions"',
    ],
  },

  {
    file:
      "src/lib/holdings-professional/index.ts",

    markers: [
      'export * from "./positionIntelligenceEngine"',
      'export * from "./positionIntelligenceModels"',
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

const providerOpenCount =
  (
    commandCentre.match(
      /<PositionIntelligenceProvider\b/g
    ) ||
    []
  ).length;

const providerCloseCount =
  (
    commandCentre.match(
      /<\/PositionIntelligenceProvider>/g
    ) ||
    []
  ).length;

if (
  providerOpenCount !== 1 ||
  providerCloseCount !== 1
) {
  failures.push(
    `HoldingsCommandCentre provider wrapper invalid: open=${providerOpenCount}, close=${providerCloseCount}.`
  );
}

const drawer =
  fs.readFileSync(
    "src/components/holdings-professional/PositionIntelligenceDrawer.tsx",
    "utf8"
  );

for (const feature of [
  "document.body.style.overflow",
  'event.key ===',
  '"Escape"',
  "window.addEventListener",
  "window.removeEventListener",
  "drawerRef.current",
  "closePosition",
]) {
  if (!drawer.includes(feature)) {
    failures.push(
      `Position drawer missing interaction: ${feature}`
    );
  }
}

const provider =
  fs.readFileSync(
    "src/components/holdings-professional/PositionIntelligenceProvider.tsx",
    "utf8"
  );

for (const interaction of [
  "setSelectedPosition",
  "setActiveTab",
  "createPositionIntelligence",
  "openPosition",
  "closePosition",
  "PositionIntelligenceDrawer",
]) {
  if (!provider.includes(interaction)) {
    failures.push(
      `Position provider missing integration: ${interaction}`
    );
  }
}

const table =
  fs.readFileSync(
    "src/components/holdings-professional/InstitutionalHoldingsTable.tsx",
    "utf8"
  );

const tableButtonCount =
  (
    table.match(
      /<OpenPositionIntelligenceButton\b/g
    ) ||
    []
  ).length;

if (tableButtonCount < 1) {
  failures.push(
    "InstitutionalHoldingsTable does not open Position Intelligence."
  );
}

const mobileCard =
  fs.readFileSync(
    "src/components/holdings-professional/HoldingsMobileCard.tsx",
    "utf8"
  );

const mobileButtonCount =
  (
    mobileCard.match(
      /<OpenPositionIntelligenceButton\b/g
    ) ||
    []
  ).length;

if (mobileButtonCount < 1) {
  failures.push(
    "HoldingsMobileCard does not open Position Intelligence."
  );
}

for (const indexFile of [
  "src/components/holdings-professional/index.ts",
  "src/lib/holdings-professional/index.ts",
]) {
  const lines =
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
      lines
    ).size !==
    lines.length
  ) {
    failures.push(
      `${indexFile} contains duplicate exports.`
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Holdings Bash 11.3C.1 verification failed:"
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
  "✅ Holdings Bash 11.3C.1 verification passed."
);
console.log(
  "✅ Position Intelligence drawer foundation installed."
);
console.log(
  "✅ Accessible dialog behaviour installed."
);
console.log(
  "✅ Escape-key closing installed."
);
console.log(
  "✅ Backdrop closing installed."
);
console.log(
  "✅ Body-scroll locking installed."
);
console.log(
  "✅ Position summary engine installed."
);
console.log(
  "✅ Position metrics installed."
);
console.log(
  "✅ Position Health indicators installed."
);
console.log(
  "✅ Generated position summary installed."
);
console.log(
  "✅ Position tabs installed."
);
console.log(
  "✅ Quick actions installed."
);
console.log(
  "✅ Institutional table integration installed."
);
console.log(
  "✅ Mobile-card integration installed."
);
console.log("");
console.log(
  "Bash 11.3C.1 complete."
);
console.log(
  "Position Intelligence parts remaining: 3."
);
console.log("");
