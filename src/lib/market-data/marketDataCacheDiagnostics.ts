import type {
  MarketDataCacheDiagnostics,
  MarketDataCacheState,
  MarketDataQuoteCacheEntry,
} from "./marketDataCacheTypes";
import {
  MemoryMarketDataCache,
} from "./memoryMarketDataCache";

function dateValue(
  value: string
): number {
  const timestamp =
    new Date(
      value
    ).getTime();

  return Number.isNaN(
    timestamp
  )
    ? 0
    : timestamp;
}

function ageSeconds(
  entry:
    MarketDataQuoteCacheEntry,
  now:
    Date
): number {
  return Math.max(
    0,
    Math.floor(
      (
        now.getTime() -
        dateValue(
          entry.metadata.createdAt
        )
      ) /
      1_000
    )
  );
}

function entryState(
  entry:
    MarketDataQuoteCacheEntry,
  now:
    Date
): MarketDataCacheState {
  if (
    entry.metadata.entryType ===
    "NEGATIVE_QUOTE"
  ) {
    return (
      now.getTime() <=
      dateValue(
        entry.metadata.expiresAt
      )
    )
      ? "NEGATIVE"
      : "EXPIRED";
  }

  if (
    now.getTime() <=
    dateValue(
      entry.metadata.expiresAt
    )
  ) {
    return "FRESH";
  }

  if (
    now.getTime() <=
    dateValue(
      entry.metadata.staleUntil
    )
  ) {
    return "STALE";
  }

  return "EXPIRED";
}

export function createMarketDataCacheDiagnostics(
  cache:
    MemoryMarketDataCache,
  now =
    new Date()
):
  MarketDataCacheDiagnostics {
  const entries =
    cache.values();

  const enriched =
    entries.map(
      (
        entry
      ) => ({
        entry,

        state:
          entryState(
            entry,
            now
          ),

        age:
          ageSeconds(
            entry,
            now
          ),
      })
    );

  return {
    generatedAt:
      now.toISOString(),

    policy:
      cache.getPolicy(),

    statistics:
      cache.getStatistics(
        now
      ),

    recentEvents:
      cache
        .getEvents()
        .slice(
          0,
          100
        ),

    topAccessedEntries:
      [...enriched]
        .sort(
          (
            left,
            right
          ) =>
            right.entry
              .metadata
              .accessCount -
            left.entry
              .metadata
              .accessCount
        )
        .slice(
          0,
          25
        )
        .map(
          (
            item
          ) => ({
            key:
              item.entry
                .metadata
                .key,

            symbol:
              item.entry
                .metadata
                .symbol,

            provider:
              item.entry
                .metadata
                .provider,

            state:
              item.state,

            accessCount:
              item.entry
                .metadata
                .accessCount,

            ageSeconds:
              item.age,

            byteSize:
              item.entry
                .metadata
                .byteSize,
          })
        ),

    staleEntries:
      enriched
        .filter(
          (
            item
          ) =>
            item.state ===
            "STALE"
        )
        .map(
          (
            item
          ) => ({
            key:
              item.entry
                .metadata
                .key,

            symbol:
              item.entry
                .metadata
                .symbol,

            provider:
              item.entry
                .metadata
                .provider,

            ageSeconds:
              item.age,

            staleForSeconds:
              Math.max(
                0,
                Math.floor(
                  (
                    now.getTime() -
                    dateValue(
                      item.entry
                        .metadata
                        .expiresAt
                    )
                  ) /
                  1_000
                )
              ),
          })
        ),

    expiredEntries:
      enriched
        .filter(
          (
            item
          ) =>
            item.state ===
            "EXPIRED"
        )
        .map(
          (
            item
          ) => ({
            key:
              item.entry
                .metadata
                .key,

            symbol:
              item.entry
                .metadata
                .symbol,

            provider:
              item.entry
                .metadata
                .provider,

            ageSeconds:
              item.age,

            expiredForSeconds:
              Math.max(
                0,
                Math.floor(
                  (
                    now.getTime() -
                    dateValue(
                      item.entry
                        .metadata
                        .staleUntil
                    )
                  ) /
                  1_000
                )
              ),
          })
        ),

    negativeEntries:
      enriched
        .filter(
          (
            item
          ) =>
            item.entry
              .metadata
              .entryType ===
            "NEGATIVE_QUOTE"
        )
        .map(
          (
            item
          ) => ({
            key:
              item.entry
                .metadata
                .key,

            symbol:
              item.entry
                .metadata
                .symbol,

            provider:
              item.entry
                .metadata
                .provider,

            errorCode:
              item.entry
                .metadata
                .errorCode,

            errorMessage:
              item.entry
                .metadata
                .errorMessage,

            ageSeconds:
              item.age,
          })
        ),
  };
}
