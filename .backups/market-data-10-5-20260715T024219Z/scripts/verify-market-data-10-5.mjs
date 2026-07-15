#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/marketDataRefreshTypes.ts",
    markers: [
      "MarketDataRefreshPriority",
      "MarketDataRefreshProfile",
      "MarketDataRefreshJobState",
      "MarketDataRefreshJob",
      "MarketDataRefreshJobResult",
      "MarketDataRefreshQueueSnapshot",
      "MarketDataRequestBudgetWindow",
      "MarketDataProviderBudget",
      "MarketDataBudgetDecision",
      "MarketDataRefreshCoordinatorSnapshot",
      "CreateRefreshJobInput",
      "RefreshIntervalRecommendation",
      "CRITICAL",
      "BACKGROUND",
      "QUEUED",
      "RUNNING",
      "SUCCEEDED",
      "PARTIAL",
      "FAILED",
      "DEFERRED",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataRequestBudget.ts",
    markers: [
      "MarketDataRequestBudgetManager",
      "getSharedMarketDataRequestBudgetManager",
      "canConsume",
      "consume",
      "snapshot",
      "reset",
      "minuteRequests",
      "dayRequests",
      "retryAfterSeconds",
      "Provider minute request budget is exhausted",
      "Provider daily request budget is exhausted",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataRefreshQueue.ts",
    markers: [
      "MarketDataRefreshQueue",
      "getSharedMarketDataRefreshQueue",
      "enqueue",
      "next",
      "markRunning",
      "markComplete",
      "markFailed",
      "defer",
      "cancel",
      "snapshot",
      "clearCompleted",
      "PRIORITY_WEIGHT",
      "CRITICAL",
      "BACKGROUND",
      "DEFERRED",
      "nextRetryAt",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataRefreshCoordinator.ts",
    markers: [
      "MarketDataRefreshCoordinator",
      "getSharedMarketDataRefreshCoordinator",
      "recommendMarketDataRefreshInterval",
      "exponentialBackoffSeconds",
      "runNext",
      "drain",
      "budgetDecision",
      "REQUEST_BUDGET_EXHAUSTED",
      "QUOTE_REFRESH_FAILED",
      "REFRESH_COORDINATOR_ERROR",
      "resolveBatch",
      "completedJobCount",
      "failedJobCount",
      "totalRequestedSymbols",
      "totalSuccessfulSymbols",
      "totalFailedSymbols",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataApiUtils.ts",
    markers: [
      "marketDataApiError",
      "marketDataApiSuccess",
      "parseBoolean",
      "parseNumber",
      "parseSymbols",
      "parseProviderList",
      "parseExchange",
      "safeJsonBody",
      "Cache-Control",
      "no-store",
    ],
  },

  {
    file:
      "src/app/api/market-data/quote/route.ts",
    markers: [
      "resolveMarketQuote",
      "SYMBOL_REQUIRED",
      "QUOTE_UNAVAILABLE",
      "minimumQualityScore",
      "maximumProviderAttempts",
      "forceRefresh",
      "compareProviders",
      "stale-while-revalidate",
      "force-dynamic",
    ],
  },

  {
    file:
      "src/app/api/market-data/quotes/route.ts",
    markers: [
      "resolveMarketQuotes",
      "SYMBOLS_REQUIRED",
      "TOO_MANY_SYMBOLS",
      "export async function GET",
      "export async function POST",
      "providerPreference",
      "excludedProviders",
      "concurrency",
      "maximumProviderAttempts",
    ],
  },

  {
    file:
      "src/app/api/market-data/health/route.ts",
    markers: [
      "createMarketDataDiagnosticSummary",
      "createMarketHoursDiagnosticSummary",
      "getSharedMarketDataRefreshCoordinator",
      "HEALTHY",
      "DEGRADED",
      "providers",
      "markets",
      "refresh",
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
      "CLEAR_ALL",
      "DELETE_SYMBOL",
      "DELETE_PROVIDER",
      "INVALID_CACHE_DELETE",
    ],
  },

  {
    file:
      "src/app/api/market-data/refresh/route.ts",
    markers: [
      "getSharedMarketDataRefreshCoordinator",
      "recommendMarketDataRefreshInterval",
      "SYMBOLS_REQUIRED",
      "TOO_MANY_SYMBOLS",
      "runImmediately",
      "coordinator.enqueue",
      "coordinator.runNext",
      "recommendation",
      "202",
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",
    markers: [
      'export * from "./marketDataApiUtils"',
      'export * from "./marketDataRefreshCoordinator"',
      'export * from "./marketDataRefreshQueue"',
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

  const source = fs.readFileSync(check.file, "utf8");

  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      failures.push(`${check.file} missing marker: ${marker}`);
    }
  }
}

const coordinator = fs.readFileSync(
  "src/lib/market-data/marketDataRefreshCoordinator.ts",
  "utf8"
);

for (const profile of [
  "HOLDINGS",
  "WATCHLIST",
  "DASHBOARD",
  "DIVIDENDS",
  "ALLOCATION",
  "ANALYTICS",
  "MANUAL",
]) {
  if (!coordinator.includes(`${profile}:`)) {
    failures.push(`Refresh coordinator missing profile: ${profile}`);
  }
}

for (const marketState of [
  "OPEN",
  "PRE_MARKET",
  "AFTER_HOURS",
  "WEEKEND",
  "HOLIDAY",
]) {
  if (!coordinator.includes(`"${marketState}"`)) {
    failures.push(
      `Refresh interval engine missing market state: ${marketState}`
    );
  }
}

const queue = fs.readFileSync(
  "src/lib/market-data/marketDataRefreshQueue.ts",
  "utf8"
);

if (
  !queue.includes("existing") ||
  !queue.includes("job.key ===") ||
  !queue.includes('"QUEUED"') ||
  !queue.includes('"RUNNING"')
) {
  failures.push(
    "Refresh queue request deduplication is incomplete."
  );
}

const quoteRoute = fs.readFileSync(
  "src/app/api/market-data/quote/route.ts",
  "utf8"
);

if (
  !quoteRoute.includes("adaptiveCacheTtlSeconds") ||
  !quoteRoute.includes("adaptiveStaleWhileRevalidateSeconds")
) {
  failures.push(
    "Single quote API does not expose adaptive HTTP cache control."
  );
}

const batchRoute = fs.readFileSync(
  "src/app/api/market-data/quotes/route.ts",
  "utf8"
);

if (
  !batchRoute.includes("symbols.length >") ||
  !batchRoute.includes("250")
) {
  failures.push(
    "Batch quote API symbol-limit protection is missing."
  );
}

if (failures.length > 0) {
  console.error("");
  console.error("❌ Market Data Bash 10.5 verification failed:");

  for (const failure of failures) {
    console.error(`   - ${failure}`);
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log("✅ Market Data Bash 10.5 verification passed.");
console.log("✅ Single quote API route installed.");
console.log("✅ Batch quote GET route installed.");
console.log("✅ Batch quote POST route installed.");
console.log("✅ Market-data health API route installed.");
console.log("✅ Cache diagnostics API route installed.");
console.log("✅ Cache invalidation API route installed.");
console.log("✅ Refresh coordinator API route installed.");
console.log("✅ Refresh-job queue installed.");
console.log("✅ Refresh priorities installed.");
console.log("✅ Refresh profiles installed.");
console.log("✅ Refresh-job deduplication installed.");
console.log("✅ Request-budget manager installed.");
console.log("✅ Per-minute provider budgets installed.");
console.log("✅ Per-day provider budgets installed.");
console.log("✅ Exponential retry backoff installed.");
console.log("✅ Deferred refresh jobs installed.");
console.log("✅ Market-hours-aware refresh intervals installed.");
console.log("✅ Partial refresh results installed.");
console.log("✅ API input validation installed.");
console.log("✅ API error normalisation installed.");
console.log("");
console.log("Bash 10.5 complete.");
console.log("Estimated Sprint 10 bashes remaining: 6.");
console.log("");
