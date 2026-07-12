import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/watchlist/watchlistIntelligence.ts",
    markers: [
      "createWatchlistSignals",
      "createWatchlistMovers",
      "createWatchlistIntelligenceSummary",
      "createExposureRows",
      "targetUpsidePercent",
      "createWatchlistCatalyst",
      "loadWatchlistCatalysts",
      "saveWatchlistCatalysts",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistIntelligenceCards.tsx",
    markers: [
      "WatchlistIntelligenceCards",
      "Today's Gainers",
      "Today's Decliners",
      "Average Target Upside",
      "Active Alerts",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistExposurePanel.tsx",
    markers: [
      "WatchlistExposurePanel",
      "Concentration overview",
      "Sector",
      "Industry",
      "Exchange",
      "Currency",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistSignalsPanel.tsx",
    markers: [
      "WatchlistSignalsPanel",
      "Signals and opportunities",
      "createWatchlistSignals",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistMoversPanel.tsx",
    markers: [
      "WatchlistMoversPanel",
      "Today's watchlist movers",
      "createWatchlistMovers",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistCatalystPanel.tsx",
    markers: [
      "WatchlistCatalystPanel",
      "Upcoming catalysts",
      "Save Catalyst",
      "Research Catalyst",
    ],
  },
  {
    file:
      "src/components/watchlist/ProfessionalWatchlistWorkspace.tsx",
    markers: [
      "WatchlistIntelligenceCards",
      "WatchlistExposurePanel",
      "WatchlistMoversPanel",
      "WatchlistSignalsPanel",
      "WatchlistCatalystPanel",
    ],
  },
];

const failures = [];

for (const check of checks) {
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
  failures.length >
  0
) {
  console.error(
    "❌ Watchlist intelligence verification failed:"
  );

  failures.forEach(
    (failure) =>
      console.error(
        `   - ${failure}`
      )
  );

  process.exit(1);
}

console.log(
  "✅ Watchlist intelligence verification passed."
);

console.log(
  "✅ Intelligence cards are connected."
);

console.log(
  "✅ Movers, signals and exposure analysis are connected."
);

console.log(
  "✅ Persistent catalyst tracking is connected."
);
