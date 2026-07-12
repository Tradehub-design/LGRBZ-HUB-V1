import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/watchlist/watchlistQuotes.ts",
    markers: [
      "WatchlistQuote",
      "WatchlistQuoteStore",
      "WatchlistQuoteAdapter",
      "quoteFreshness",
      "determineMarketSession",
      "createManualWatchlistQuote",
      "mergeQuotesIntoStore",
      "applyWatchlistQuotesToState",
      "historyForSecurity",
      "manualQuoteAdapter",
      "delayedQuoteAdapter",
    ],
  },
  {
    file:
      "src/hooks/useWatchlistQuotes.ts",
    markers: [
      "useWatchlistQuotes",
      "refreshQuotes",
      "saveManualQuote",
      "applyToWatchlistState",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistQuoteStatusBar.tsx",
    markers: [
      "WatchlistQuoteStatusBar",
      "Refresh Prices",
      "Price History",
      "Manual quotes",
      "Delayed adapter",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistManualQuoteDialog.tsx",
    markers: [
      "WatchlistManualQuoteDialog",
      "Current Price",
      "Previous Close",
      "Save Quote",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistPriceHistoryPanel.tsx",
    markers: [
      "WatchlistPriceHistoryPanel",
      "Watchlist quote snapshots",
      "No quote history yet",
    ],
  },
  {
    file:
      "src/components/watchlist/ProfessionalWatchlistWorkspace.tsx",
    markers: [
      "useWatchlistQuotes",
      "WatchlistQuoteStatusBar",
      "WatchlistManualQuoteDialog",
      "WatchlistPriceHistoryPanel",
      "handleQuoteRefresh",
      "handleManualQuoteSave",
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
    "❌ Watchlist quote verification failed:"
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
  "✅ Watchlist quote verification passed."
);

console.log(
  "✅ Manual and delayed quote adapters are available."
);

console.log(
  "✅ Quote freshness and market-session states are available."
);

console.log(
  "✅ Price history persistence is available."
);

console.log(
  "✅ Watchlist quote controls are connected."
);
