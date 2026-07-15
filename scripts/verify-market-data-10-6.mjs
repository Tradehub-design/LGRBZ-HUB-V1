#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/client/liveQuoteClientTypes.ts",
    markers: [
      "LiveQuoteRequestState",
      "LiveQuoteRefreshReason",
      "LiveQuoteApiEnvelope",
      "LiveQuoteSymbolOptions",
      "LiveQuotePollingOptions",
      "LiveQuoteStoreEntry",
      "LiveQuoteBatchResponse",
      "LiveQuoteSingleResponse",
      "LiveQuoteFetchInput",
      "LiveQuoteBatchFetchInput",
      "LiveQuoteFetchResult",
      "LiveQuoteBatchFetchResult",
      "LiveQuoteStatusDescriptor",
      "LiveQuoteClientDiagnosticSummary",
      "IDLE",
      "LOADING",
      "REFRESHING",
      "SUCCESS",
      "ERROR",
      "OFFLINE",
      "PAUSED",
      "VISIBILITY",
      "NETWORK_RESTORED",
    ],
  },

  {
    file:
      "src/lib/market-data/client/liveQuoteApiClient.ts",
    markers: [
      "fetchLiveMarketQuote",
      "fetchLiveMarketQuotes",
      "readEnvelope",
      "appendOptions",
      "/api/market-data/quote",
      "/api/market-data/quotes",
      "forceRefresh",
      "compareProviders",
      "minimumQualityScore",
      "maximumProviderAttempts",
      "REQUEST_ABORTED",
      "QUOTE_REQUEST_FAILED",
      "BATCH_QUOTE_REQUEST_FAILED",
      'cache:\n            "no-store"',
    ],
  },

  {
    file:
      "src/lib/market-data/client/liveQuoteStore.ts",
    markers: [
      '"use client"',
      "useLiveQuoteStore",
      "subscribeWithSelector",
      "activeControllers",
      "ensureEntry",
      "refreshQuote",
      "refreshQuotes",
      "cancelQuote",
      "cancelQuotes",
      "removeQuote",
      "clearQuotes",
      "markPaused",
      "markOffline",
      "diagnostics",
      "REQUEST_ABORTED",
      "OFFLINE",
      "REFRESHING",
      "activeRequestId",
      "requestCount",
      "successCount",
      "failureCount",
      "staleReadCount",
      "liveQuoteEntry",
      "liveQuoteEntries",
    ],
  },

  {
    file:
      "src/lib/market-data/client/liveQuoteStatus.ts",
    markers: [
      "describeLiveQuote",
      "describeLiveQuoteEntry",
      "liveQuoteNeedsRefresh",
      "liveQuoteDisplayTimestamp",
      "Live price",
      "Delayed price",
      "Stale price",
      "Expired price",
      "Indicative price",
      "qualityGrade",
      "ageSeconds",
    ],
  },

  {
    file:
      "src/lib/market-data/client/liveQuoteDiagnostics.ts",
    markers: [
      "createLiveQuoteClientDiagnostics",
      "trackedSymbolCount",
      "loadingCount",
      "refreshingCount",
      "liveQuoteCount",
      "delayedQuoteCount",
      "staleQuoteCount",
      "expiredQuoteCount",
      "indicativeQuoteCount",
      "activeRequestCount",
      "totalRequests",
      "totalSuccesses",
      "totalFailures",
      "averageQualityScore",
      "averageConfidenceScore",
      "providers",
      "freshness",
    ],
  },

  {
    file:
      "src/hooks/usePageVisibility.ts",
    markers: [
      '"use client"',
      "usePageVisibility",
      "visibilitychange",
      "document.visibilityState",
      "visible",
    ],
  },

  {
    file:
      "src/hooks/useNetworkStatus.ts",
    markers: [
      '"use client"',
      "useNetworkStatus",
      "navigator.onLine",
      '"online"',
      '"offline"',
    ],
  },

  {
    file:
      "src/hooks/useLiveMarketQuote.ts",
    markers: [
      '"use client"',
      "useLiveMarketQuote",
      "UseLiveMarketQuoteOptions",
      "pollingInterval",
      "usePageVisibility",
      "useNetworkStatus",
      "refreshQuote",
      "refreshOnMount",
      "pauseWhenHidden",
      "pauseWhenOffline",
      "refreshWhenVisible",
      "refreshWhenOnline",
      "marketOpenIntervalMs",
      "marketClosedIntervalMs",
      "backgroundIntervalMs",
      "NETWORK_RESTORED",
      "VISIBILITY",
      "forceRefresh",
      "cancel",
    ],
  },

  {
    file:
      "src/hooks/useLiveMarketQuotes.ts",
    markers: [
      '"use client"',
      "useLiveMarketQuotes",
      "UseLiveMarketQuotesOptions",
      "canonicalSymbols",
      "refreshQuotes",
      "quoteBySymbol",
      "statusBySymbol",
      "errorCount",
      "refreshOnMount",
      "pauseWhenHidden",
      "pauseWhenOffline",
      "marketOpenIntervalMs",
      "marketClosedIntervalMs",
      "NETWORK_RESTORED",
      "VISIBILITY",
      "forceRefresh",
      "cancel",
    ],
  },

  {
    file:
      "src/hooks/usePortfolioLiveQuotes.ts",
    markers: [
      '"use client"',
      "usePortfolioLiveQuotes",
      "PortfolioQuotePosition",
      "useLiveMarketQuotes",
      "marketValue",
      "costBasis",
      "gainLoss",
      "gainLossPercent",
      "pricingCoveragePercent",
      "pricedPositionCount",
      "unpricedPositionCount",
      "qualityScore",
      "freshness",
    ],
  },

  {
    file:
      "src/lib/market-data/client/index.ts",
    markers: [
      'export * from "./liveQuoteApiClient"',
      'export * from "./liveQuoteClientTypes"',
      'export * from "./liveQuoteDiagnostics"',
      'export * from "./liveQuoteStatus"',
      'export * from "./liveQuoteStore"',
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",
    markers: [
      'export * from "./client"',
      'export * from "./multiProviderQuoteResolver"',
      'export * from "./marketDataRefreshCoordinator"',
      'export * from "./marketDataApiUtils"',
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
      `Missing required file: ${check.file}`
    );

    continue;
  }

  const source =
    fs.readFileSync(
      check.file,
      "utf8"
    );

  for (
    const marker of
    check.markers
  ) {
    if (
      !source.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const store =
  fs.readFileSync(
    "src/lib/market-data/client/liveQuoteStore.ts",
    "utf8"
  );

if (
  !store.includes(
    "new AbortController"
  ) ||
  !store.includes(
    ".abort()"
  )
) {
  failures.push(
    "Live quote store request cancellation is incomplete."
  );
}

if (
  !store.includes(
    "activeControllers"
  ) ||
  !store.includes(
    "An existing quote request is already active."
  )
) {
  failures.push(
    "Live quote store request deduplication is incomplete."
  );
}

if (
  !store.includes(
    "result.successful"
  ) ||
  !store.includes(
    "successfulEntry"
  ) ||
  !store.includes(
    "failedEntry"
  )
) {
  failures.push(
    "Live quote result state handling is incomplete."
  );
}

const singleHook =
  fs.readFileSync(
    "src/hooks/useLiveMarketQuote.ts",
    "utf8"
  );

if (
  !singleHook.includes(
    "window.setInterval"
  ) ||
  !singleHook.includes(
    "window.clearInterval"
  )
) {
  failures.push(
    "Single live quote polling is incomplete."
  );
}

if (
  !singleHook.includes(
    "previousVisibleRef"
  ) ||
  !singleHook.includes(
    "previousOnlineRef"
  )
) {
  failures.push(
    "Single live quote visibility or network restoration logic is incomplete."
  );
}

const multiHook =
  fs.readFileSync(
    "src/hooks/useLiveMarketQuotes.ts",
    "utf8"
  );

if (
  !multiHook.includes(
    "anyOpen"
  ) ||
  !multiHook.includes(
    "marketOpenIntervalMs"
  ) ||
  !multiHook.includes(
    "marketClosedIntervalMs"
  )
) {
  failures.push(
    "Multi quote adaptive polling interval is incomplete."
  );
}

const portfolioHook =
  fs.readFileSync(
    "src/hooks/usePortfolioLiveQuotes.ts",
    "utf8"
  );

if (
  !portfolioHook.includes(
    "position.quantity *"
  ) ||
  !portfolioHook.includes(
    "pricingCoveragePercent"
  )
) {
  failures.push(
    "Portfolio live valuation calculations are incomplete."
  );
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Market Data Bash 10.6 verification failed:"
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
  "✅ Market Data Bash 10.6 verification passed."
);
console.log(
  "✅ Shared live quote client types installed."
);
console.log(
  "✅ Single quote API client installed."
);
console.log(
  "✅ Batch quote API client installed."
);
console.log(
  "✅ Zustand live quote store installed."
);
console.log(
  "✅ Per-symbol quote state installed."
);
console.log(
  "✅ Request cancellation installed."
);
console.log(
  "✅ Request deduplication installed."
);
console.log(
  "✅ Concurrent refresh protection installed."
);
console.log(
  "✅ Offline quote retention installed."
);
console.log(
  "✅ Visibility-aware polling installed."
);
console.log(
  "✅ Network-restored refresh installed."
);
console.log(
  "✅ Adaptive market-open polling installed."
);
console.log(
  "✅ Adaptive market-closed polling installed."
);
console.log(
  "✅ Background polling installed."
);
console.log(
  "✅ Single live quote hook installed."
);
console.log(
  "✅ Multi-symbol live quote hook installed."
);
console.log(
  "✅ Portfolio live quote hook installed."
);
console.log(
  "✅ Portfolio market-value calculation installed."
);
console.log(
  "✅ Portfolio gain/loss calculation installed."
);
console.log(
  "✅ Portfolio pricing coverage installed."
);
console.log(
  "✅ Quote status descriptors installed."
);
console.log(
  "✅ Quote timestamp formatting installed."
);
console.log(
  "✅ Client quote diagnostics installed."
);
console.log("");
console.log(
  "Bash 10.6 complete."
);
console.log(
  "Estimated Sprint 10 bashes remaining: 5."
);
console.log("");
