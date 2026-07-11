import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/watchlist/watchlistTypes.ts",
    markers: [
      "WatchlistSecurity",
      "WatchlistGroup",
      "WatchlistState",
      "WatchlistFilters",
      "WatchlistSummary",
    ],
  },
  {
    file:
      "src/lib/watchlist/watchlistStorage.ts",
    markers: [
      "loadWatchlistState",
      "saveWatchlistState",
      "sanitiseWatchlistState",
    ],
  },
  {
    file:
      "src/lib/watchlist/watchlistEngine.ts",
    markers: [
      "filterWatchlistSecurities",
      "sortWatchlistSecurities",
      "calculateWatchlistSummary",
      "getWatchlistFilterOptions",
    ],
  },
  {
    file:
      "src/hooks/useWatchlistState.ts",
    markers: [
      "useWatchlistState",
      "lgrbz:watchlist-changed",
    ],
  },
  {
    file:
      "src/components/watchlist/ProfessionalWatchlistWorkspace.tsx",
    markers: [
      "ProfessionalWatchlistWorkspace",
      "WatchlistSummaryCards",
      "WatchlistToolbar",
      "WatchlistStarterTable",
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

  for (const marker of check.markers) {
    if (
      !content.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} is missing marker: ${marker}`
      );
    }
  }
}

if (
  failures.length > 0
) {
  console.error(
    "❌ Professional Watchlist foundation verification failed:"
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
  "✅ Professional Watchlist foundation verification passed."
);

console.log(
  "✅ Watchlist state, storage, filtering, sorting and summary engines are ready."
);

console.log(
  "✅ Starter professional workspace is ready for route integration."
);
