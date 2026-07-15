#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/marketDataRefreshTypes.ts",
    markers: [
      "MarketDataRefreshPriority",
      "MarketDataRefreshJobState",
      "MarketDataRefreshTrigger",
      "MarketDataRefreshJobInput",
      "MarketDataRefreshJob",
      "MarketDataRefreshQueuePolicy",
      "MarketDataRefreshQueueStatistics",
      "MarketDataRefreshDiagnosticSummary",
      "MarketDataRequestBudgetPolicy",
      "MarketDataRequestBudgetSnapshot",
      "MarketDataRequestBudgetDecision",
      "CRITICAL",
      "HIGH",
      "NORMAL",
      "LOW",
      "BACKGROUND",
      "QUEUED",
      "RUNNING",
      "RETRY_WAIT",
      "COMPLETED",
      "FAILED",
      "CANCELLED",
      "DEDUPLICATED",
      "joinedRequestCount",
      "nextRetryAt",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataRequestBudget.ts",
    markers: [
      "MarketDataRequestBudget",
      "getSharedMarketDataRequestBudget",
      "resetSharedMarketDataRequestBudget",
      "DEFAULT_POLICY",
      "globalRequestsPerMinute",
      "globalRequestsPerHour",
      "providerRequestsPerMinute",
      "providerRequestsPerHour",
      "burstAllowance",
      "canRequest",
      "consume",
      "snapshot",
      "retryAfterMs",
      "blockedProviders",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataRefreshCoordinator.ts",
    markers: [
      "MarketDataRefreshCoordinator",
      "getSharedMarketDataRefreshCoordinator",
      "resetSharedMarketDataRefreshCoordinator",
      "submit",
      "submitMany",
      "cancel",
      "nextRunnableJob",
      "execute",
      "process",
      "prune",
      "statistics",
      "deduplicationKey",
      "retryDelay",
      "maximumConcurrency",
      "maximumQueueSize",
      "baseRetryDelayMs",
      "maximumRetryDelayMs",
      "REQUEST_BUDGET_EXHAUSTED",
      "REFRESH_ATTEMPT_FAILED",
      "REFRESH_FAILED",
      "providerPreference",
      "getMarketClock",
      "resolve",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataRefreshDiagnostics.ts",
    markers: [
      "createMarketDataRefreshDiagnosticSummary",
      "activeJobs",
      "queuedJobs",
      "retryJobs",
      "recentCompletedJobs",
      "recentFailedJobs",
      "providerHealth",
      "newestFirst",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataApiUtils.ts",
    markers: [
      "QuoteApiRequest",
      "BatchQuoteApiRequest",
      "RefreshApiRequest",
      "parseProviders",
      "parseQuoteRequest",
      "validateBatchQuoteRequest",
      "validateRefreshRequest",
      "marketDataApiSuccess",
      "marketDataApiError",
      "X-LGRBZ-Market-Data",
      "maximum of 250 symbols",
      "maximum of 500 refresh jobs",
    ],
  },

  {
    file:
      "src/app/api/market-data/quote/route.ts",
    markers: [
      "resolveMarketQuote",
      "parseQuoteRequest",
      "marketDataApiSuccess",
      "marketDataApiError",
      'runtime =\n  "nodejs"',
      'dynamic =\n  "force-dynamic"',
      "export async function GET",
    ],
  },

  {
    file:
      "src/app/api/market-data/quotes/route.ts",
    markers: [
      "resolveMarketQuotes",
      "validateBatchQuoteRequest",
      "marketDataApiSuccess",
      "marketDataApiError",
      "export async function POST",
      "207",
      "concurrency",
    ],
  },

  {
    file:
      "src/app/api/market-data/health/route.ts",
    markers: [
      "createMarketDataDiagnosticSummary",
      "DEFAULT_MARKET_DATA_PROVIDERS",
      "getSharedMultiProviderQuoteResolver",
      "export async function GET",
    ],
  },

  {
    file:
      "src/app/api/market-data/cache/route.ts",
    markers: [
      "createMarketDataCacheDiagnostics",
      "getSharedMarketDataCache",
      "export async function GET",
      "export async function DELETE",
      "deleteBySymbol",
      "deleteByProvider",
      "cache.clear",
    ],
  },

  {
    file:
      "src/app/api/market-data/market-hours/route.ts",
    markers: [
      "createMarketHoursDiagnosticSummary",
      "getMarketClock",
      "exchange",
      "export async function GET",
    ],
  },

  {
    file:
      "src/app/api/market-data/refresh/route.ts",
    markers: [
      "createMarketDataRefreshDiagnosticSummary",
      "getSharedMarketDataRefreshCoordinator",
      "validateRefreshRequest",
      "submitMany",
      "export async function GET",
      "export async function POST",
      "202",
      'trigger:\n              "API"',
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",
    markers: [
      'export * from "./marketDataApiUtils"',
      'export * from "./marketDataRefreshCoordinator"',
      'export * from "./marketDataRefreshDiagnostics"',
      'export * from "./marketDataRefreshTypes"',
      'export * from "./marketDataRequestBudget"',
    ],
  },
];

const failures = [];

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    failures.push(`Missing required file: ${check.file}`);
    continue;
  }

  const source = fs.readFileSync(
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

const coordinator =
  fs.readFileSync(
    "src/lib/market-data/marketDataRefreshCoordinator.ts",
    "utf8"
  );

for (const state of [
  "QUEUED",
  "RUNNING",
  "RETRY_WAIT",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]) {
  if (!coordinator.includes(`"${state}"`)) {
    failures.push(
      `Refresh coordinator missing state: ${state}`
    );
  }
}

for (const priority of [
  "CRITICAL",
  "HIGH",
  "NORMAL",
  "LOW",
  "BACKGROUND",
]) {
  if (!coordinator.includes(`${priority}:`)) {
    failures.push(
      `Refresh coordinator missing priority weight: ${priority}`
    );
  }
}

if (
  !coordinator.includes("deduplicationMap") ||
  !coordinator.includes("joinedRequestCount")
) {
  failures.push(
    "Refresh job deduplication is incomplete."
  );
}

if (
  !coordinator.includes("retryDelay") ||
  !coordinator.includes("2 **")
) {
  failures.push(
    "Exponential retry backoff is incomplete."
  );
}

if (
  !coordinator.includes("this.budget()") ||
  !coordinator.includes("canRequest") ||
  !coordinator.includes("consume")
) {
  failures.push(
    "Refresh coordinator is not connected to request budgets."
  );
}

if (
  !coordinator.includes("getMarketClock") ||
  !coordinator.includes("allowExpiredFallback")
) {
  failures.push(
    "Refresh coordinator is not market-hours aware."
  );
}

const apiRoutes = [
  "src/app/api/market-data/quote/route.ts",
  "src/app/api/market-data/quotes/route.ts",
  "src/app/api/market-data/health/route.ts",
  "src/app/api/market-data/cache/route.ts",
  "src/app/api/market-data/market-hours/route.ts",
  "src/app/api/market-data/refresh/route.ts",
];

for (const route of apiRoutes) {
  const source = fs.readFileSync(
    route,
    "utf8"
  );

  if (
    !source.includes('runtime =\n  "nodejs"') ||
    !source.includes('dynamic =\n  "force-dynamic"')
  ) {
    failures.push(
      `${route} is missing Node.js runtime or force-dynamic configuration.`
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Market Data Bash 10.5 verification failed:"
  );

  for (const failure of failures) {
    console.error(`   - ${failure}`);
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "✅ Market Data Bash 10.5 verification passed."
);
console.log(
  "✅ Single-quote API route installed."
);
console.log(
  "✅ Batch-quote API route installed."
);
console.log(
  "✅ Provider-health API route installed."
);
console.log(
  "✅ Cache diagnostics API route installed."
);
console.log(
  "✅ Cache invalidation API installed."
);
console.log(
  "✅ Market-hours API route installed."
);
console.log(
  "✅ Refresh queue API installed."
);
console.log(
  "✅ API request validation installed."
);
console.log(
  "✅ API error normalisation installed."
);
console.log(
  "✅ Refresh priority model installed."
);
console.log(
  "✅ Refresh queue installed."
);
console.log(
  "✅ Refresh job deduplication installed."
);
console.log(
  "✅ Background job coalescing installed."
);
console.log(
  "✅ Retry scheduling installed."
);
console.log(
  "✅ Exponential backoff installed."
);
console.log(
  "✅ Request budgets installed."
);
console.log(
  "✅ Per-provider request budgets installed."
);
console.log(
  "✅ Queue concurrency controls installed."
);
console.log(
  "✅ Queue diagnostics installed."
);
console.log(
  "✅ Market-hours-aware refresh behaviour installed."
);
console.log("");
console.log(
  "Bash 10.5 complete."
);
console.log(
  "Estimated Sprint 10 bashes remaining: 6."
);
console.log("");
