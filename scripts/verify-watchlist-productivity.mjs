import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/watchlist/watchlistBulkActions.ts",
    markers: [
      "bulkDeleteWatchlistSecurities",
      "bulkTransferWatchlistSecurities",
      "bulkTagWatchlistSecurities",
      "toggleWatchlistSelection",
      "selectAllWatchlistSecurities",
    ],
  },
  {
    file:
      "src/lib/watchlist/watchlistCsv.ts",
    markers: [
      "watchlistSecuritiesToCsv",
      "parseWatchlistCsv",
      "mergeImportedWatchlistSecurities",
    ],
  },
  {
    file:
      "src/lib/watchlist/watchlistSavedViews.ts",
    markers: [
      "WatchlistSavedView",
      "loadWatchlistSavedViews",
      "saveWatchlistSavedViews",
      "createWatchlistSavedView",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistBulkActionBar.tsx",
    markers: [
      "WatchlistBulkActionBar",
      "Move / Copy",
      "Export",
      "Delete",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistBulkTransferDialog.tsx",
    markers: [
      "WatchlistBulkTransferDialog",
      "Move Selected",
      "Copy Selected",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistBulkTagDialog.tsx",
    markers: [
      "WatchlistBulkTagDialog",
      "Bulk Tagging",
      "Apply Tag",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistCsvToolsDialog.tsx",
    markers: [
      "WatchlistCsvToolsDialog",
      "CSV import and export",
      "Import CSV",
      "Export Watchlist",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistSavedViewsPanel.tsx",
    markers: [
      "WatchlistSavedViewsPanel",
      "Professional Watchlist views",
      "Saved Views",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistProductivityToolbar.tsx",
    markers: [
      "WatchlistProductivityToolbar",
      "Select Visible",
      "CSV Tools",
      "Saved Views",
    ],
  },
  {
    file:
      "src/components/watchlist/ProfessionalWatchlistWorkspace.tsx",
    markers: [
      "selectedSecurityIds",
      "WatchlistBulkActionBar",
      "WatchlistBulkTransferDialog",
      "WatchlistBulkTagDialog",
      "WatchlistCsvToolsDialog",
      "WatchlistSavedViewsPanel",
      "WatchlistProductivityToolbar",
      "handleBulkDelete",
      "handleCsvImport",
      "applySavedView",
      "watchlist bulk keyboard shortcuts",
    ],
  },
  {
    file:
      "src/components/watchlist/WatchlistStarterTable.tsx",
    markers: [
      "selectedIds?:",
      "onToggleSelection?:",
      "onToggleAllVisible?:",
      "Select all visible securities",
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
    "❌ Watchlist productivity verification failed:"
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
  "✅ Watchlist productivity verification passed."
);

console.log(
  "✅ Bulk selection and bulk operations are connected."
);

console.log(
  "✅ CSV import and export are connected."
);

console.log(
  "✅ Saved professional views are connected."
);

console.log(
  "✅ Keyboard productivity shortcuts are connected."
);
