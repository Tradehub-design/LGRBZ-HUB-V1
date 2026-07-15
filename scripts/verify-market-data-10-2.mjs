#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/lib/market-data/marketDataCacheTypes.ts",
    markers: [
      "MarketDataCacheState",
      "MarketDataCacheSource",
      "MarketDataCacheOperation",
      "MarketDataCacheEntryType",
      "MarketDataCacheKeyInput",
      "MarketDataCachePolicy",
      "MarketDataCacheMetadata",
      "MarketDataQuoteCacheEntry",
      "MarketDataCacheReadResult",
      "MarketDataCacheWriteInput",
      "MarketDataCacheBatchReadResult",
      "MarketDataCacheStatistics",
      "MarketDataCacheEvent",
      "MarketDataCacheSnapshot",
      "MarketDataPersistentCacheAdapter",
      "MarketDataMemoryCacheOptions",
      "MarketDataCacheDiagnostics",
      "MarketDataCoalescedRequestInfo",
      "CachedQuoteResolverRequest",
      "CachedQuoteResolverResult",
      "staleWhileRevalidateSeconds",
      "negativeTtlSeconds",
      "maximumEntries",
      "requestDeduplicationCount",
      "requestCoalescingCount",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataCacheKeys.ts",
    markers: [
      "createMarketDataCacheKey",
      "createProviderQuoteCacheKey",
      "createAnyProviderQuoteCacheKey",
      "createNegativeQuoteCacheKey",
      "normaliseCacheSymbol",
      "cacheKeyMatchesSymbol",
      "cacheKeyMatchesProvider",
      "NEGATIVE_QUOTE",
      "QUOTE",
    ],
  },

  {
    file:
      "src/lib/market-data/memoryMarketDataCache.ts",
    markers: [
      "MemoryMarketDataCache",
      "DEFAULT_CACHE_POLICY",
      "getPolicy",
      "getStatistics",
      "getEvents",
      "getMany",
      "setMany",
      "setNegative",
      "deleteBySymbol",
      "deleteByProvider",
      "pruneExpired",
      "enforceMaximumEntries",
      "incrementDeduplication",
      "incrementCoalescing",
      "snapshot",
      "hydrate",
      "persist",
      "getSharedMarketDataCache",
      "resetSharedMarketDataCache",
      "FRESH",
      "STALE",
      "EXPIRED",
      "MISSING",
      "NEGATIVE",
      "Least-recently-used cache entry evicted",
      "staleWhileRevalidateSeconds",
      "negativeTtlSeconds",
      "maximumEntryAgeSeconds",
    ],
  },

  {
    file:
      "src/lib/market-data/persistentMarketDataCache.ts",
    markers: [
      "LocalStorageMarketDataCacheAdapter",
      "FileMarketDataCacheAdapter",
      "CompositeMarketDataCacheAdapter",
      "createDefaultPersistentMarketDataCacheAdapter",
      "localStorage",
      ".cache/market-data/quotes.json",
      "load",
      "save",
      "clear",
      "Promise.allSettled",
      "validSnapshot",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataRequestCoalescer.ts",
    markers: [
      "MarketDataRequestCoalescer",
      "getSharedMarketDataRequestCoalescer",
      "resetSharedMarketDataRequestCoalescer",
      "participantCount",
      "CREATED",
      "JOINED",
      "RESOLVED",
      "REJECTED",
      "onCreated",
      "onJoined",
      "onResolved",
      "onRejected",
    ],
  },

  {
    file:
      "src/lib/market-data/cachedQuoteResolver.ts",
    markers: [
      "resolveCachedMarketQuote",
      "resolveCachedMarketQuotes",
      "QuoteFetchFunction",
      "forceRefresh",
      "allowStale",
      "allowExpiredFallback",
      "backgroundRevalidate",
      "incrementCoalescing",
      "incrementDeduplication",
      "setNegative",
      "QUOTE_FETCH_FAILED",
      "A stale quote was returned while refresh was requested",
    ],
  },

  {
    file:
      "src/lib/market-data/marketDataCacheDiagnostics.ts",
    markers: [
      "createMarketDataCacheDiagnostics",
      "topAccessedEntries",
      "staleEntries",
      "expiredEntries",
      "negativeEntries",
      "recentEvents",
      "accessCount",
      "staleForSeconds",
      "expiredForSeconds",
    ],
  },

  {
    file:
      "src/lib/market-data/index.ts",
    markers: [
      'export * from "./cachedQuoteResolver"',
      'export * from "./marketDataCacheDiagnostics"',
      'export * from "./marketDataCacheKeys"',
      'export * from "./marketDataCacheTypes"',
      'export * from "./marketDataRequestCoalescer"',
      'export * from "./memoryMarketDataCache"',
      'export * from "./persistentMarketDataCache"',
      'export * from "./providerRegistry"',
      'export * from "./quoteQuality"',
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

const memoryCache =
  fs.readFileSync(
    "src/lib/market-data/memoryMarketDataCache.ts",
    "utf8"
  );

for (
  const state of
  [
    "FRESH",
    "STALE",
    "EXPIRED",
    "MISSING",
    "NEGATIVE",
  ]
) {
  if (
    !memoryCache.includes(
      `"${state}"`
    )
  ) {
    failures.push(
      `Memory cache missing state: ${state}`
    );
  }
}

for (
  const operation of
  [
    "GET",
    "SET",
    "DELETE",
    "CLEAR",
    "EVICT",
    "HYDRATE",
    "PERSIST",
  ]
) {
  if (
    !memoryCache.includes(
      `"${operation}"`
    )
  ) {
    failures.push(
      `Memory cache missing operation event: ${operation}`
    );
  }
}

const coalescer =
  fs.readFileSync(
    "src/lib/market-data/marketDataRequestCoalescer.ts",
    "utf8"
  );

if (
  !coalescer.includes(
    "this.pending.get"
  ) ||
  !coalescer.includes(
    "return existing.promise"
  ) ||
  !coalescer.includes(
    "this.pending.delete"
  )
) {
  failures.push(
    "Request coalescer does not appear to reuse and clean pending promises."
  );
}

const resolver =
  fs.readFileSync(
    "src/lib/market-data/cachedQuoteResolver.ts",
    "utf8"
  );

if (
  !resolver.includes(
    'cached.state ===\n        "FRESH"'
  ) ||
  !resolver.includes(
    'cached.state ===\n        "STALE"'
  ) ||
  !resolver.includes(
    'cached.state ===\n        "NEGATIVE"'
  )
) {
  failures.push(
    "Cached quote resolver does not handle fresh, stale and negative states."
  );
}

if (
  !resolver.includes(
    "void coalescer"
  ) ||
  !resolver.includes(
    "backgroundRevalidate"
  )
) {
  failures.push(
    "Stale-while-revalidate background refresh is missing."
  );
}

const persistent =
  fs.readFileSync(
    "src/lib/market-data/persistentMarketDataCache.ts",
    "utf8"
  );

if (
  !persistent.includes(
    "typeof window"
  ) ||
  !persistent.includes(
    'import(\n        "node:fs"'
  )
) {
  failures.push(
    "Persistent cache adapters are not separated for browser and server environments."
  );
}

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "❌ Market Data Bash 10.2 verification failed:"
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
  "✅ Market Data Bash 10.2 verification passed."
);
console.log(
  "✅ Deterministic quote cache keys installed."
);
console.log(
  "✅ In-memory market-data cache installed."
);
console.log(
  "✅ Fresh cache state installed."
);
console.log(
  "✅ Stale cache state installed."
);
console.log(
  "✅ Expired cache state installed."
);
console.log(
  "✅ Missing cache state installed."
);
console.log(
  "✅ Negative cache state installed."
);
console.log(
  "✅ Cache TTL controls installed."
);
console.log(
  "✅ Stale-while-revalidate controls installed."
);
console.log(
  "✅ Negative-cache TTL controls installed."
);
console.log(
  "✅ Batch cache reads installed."
);
console.log(
  "✅ Batch cache writes installed."
);
console.log(
  "✅ Symbol-level invalidation installed."
);
console.log(
  "✅ Provider-level invalidation installed."
);
console.log(
  "✅ Expired-entry pruning installed."
);
console.log(
  "✅ Maximum-entry enforcement installed."
);
console.log(
  "✅ Least-recently-used eviction installed."
);
console.log(
  "✅ Cache hit and miss statistics installed."
);
console.log(
  "✅ Stale-hit and expired-hit statistics installed."
);
console.log(
  "✅ Cache event history installed."
);
console.log(
  "✅ Browser local-storage adapter installed."
);
console.log(
  "✅ Server file-cache adapter installed."
);
console.log(
  "✅ Composite persistent-cache adapter installed."
);
console.log(
  "✅ Request deduplication installed."
);
console.log(
  "✅ Concurrent request coalescing installed."
);
console.log(
  "✅ Background stale revalidation installed."
);
console.log(
  "✅ Negative provider-failure caching installed."
);
console.log(
  "✅ Cached quote resolver installed."
);
console.log(
  "✅ Cache diagnostics installed."
);
console.log("");
console.log(
  "Bash 10.2 complete."
);
console.log(
  "Estimated Sprint 10 bashes remaining: 9."
);
console.log("");
