import {
  cacheKeyMatchesProvider,
  cacheKeyMatchesSymbol,
} from "./marketDataCacheKeys";
import type {
  MarketDataCacheBatchReadResult,
  MarketDataCacheEntryType,
  MarketDataCacheEvent,
  MarketDataCachePolicy,
  MarketDataCacheReadResult,
  MarketDataCacheSnapshot,
  MarketDataCacheState,
  MarketDataCacheStatistics,
  MarketDataCacheWriteInput,
  MarketDataMemoryCacheOptions,
  MarketDataPersistentCacheAdapter,
  MarketDataQuoteCacheEntry,
} from "./marketDataCacheTypes";

const DEFAULT_CACHE_POLICY:
  MarketDataCachePolicy = {
    ttlSeconds:
      120,

    staleWhileRevalidateSeconds:
      900,

    negativeTtlSeconds:
      60,

    maximumEntries:
      2_000,

    maximumEntryAgeSeconds:
      86_400,

    allowStale:
      true,

    allowExpiredFallback:
      false,

    persist:
      false,
  };

function clamp(
  value: number,
  minimum = 0,
  maximum = Number.POSITIVE_INFINITY
): number {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
}

function round(
  value: number,
  digits = 2
): number {
  const multiplier =
    10 ** digits;

  return (
    Math.round(
      value *
      multiplier
    ) /
    multiplier
  );
}

function percentage(
  value: number,
  total: number
): number {
  if (
    total <=
    0
  ) {
    return 0;
  }

  return round(
    (
      value /
      total
    ) *
      100
  );
}

function isoDate(
  date: Date
): string {
  return date.toISOString();
}

function dateFromIso(
  value: string
): Date {
  const date =
    new Date(
      value
    );

  return Number.isNaN(
    date.getTime()
  )
    ? new Date(0)
    : date;
}

function ageSeconds(
  createdAt: string,
  now:
    Date
): number {
  return Math.max(
    0,
    Math.floor(
      (
        now.getTime() -
        dateFromIso(
          createdAt
        ).getTime()
      ) /
      1_000
    )
  );
}

function secondsUntil(
  future:
    string,
  now:
    Date
): number {
  return Math.max(
    0,
    Math.floor(
      (
        dateFromIso(
          future
        ).getTime() -
        now.getTime()
      ) /
      1_000
    )
  );
}

function estimateByteSize(
  value: unknown
): number {
  try {
    return new TextEncoder()
      .encode(
        JSON.stringify(
          value
        )
      )
      .length;
  } catch {
    return 0;
  }
}

function cacheState(
  entry:
    MarketDataQuoteCacheEntry,
  now:
    Date
): MarketDataCacheState {
  if (
    entry.metadata.entryType ===
    "NEGATIVE_QUOTE"
  ) {
    if (
      now.getTime() <=
      dateFromIso(
        entry.metadata.expiresAt
      ).getTime()
    ) {
      return "NEGATIVE";
    }

    return "EXPIRED";
  }

  if (
    now.getTime() <=
    dateFromIso(
      entry.metadata.expiresAt
    ).getTime()
  ) {
    return "FRESH";
  }

  if (
    now.getTime() <=
    dateFromIso(
      entry.metadata.staleUntil
    ).getTime()
  ) {
    return "STALE";
  }

  return "EXPIRED";
}

function emptyStatistics():
  MarketDataCacheStatistics {
  return {
    generatedAt:
      new Date()
        .toISOString(),

    entryCount:
      0,

    quoteEntryCount:
      0,

    negativeEntryCount:
      0,

    freshEntryCount:
      0,

    staleEntryCount:
      0,

    expiredEntryCount:
      0,

    totalReads:
      0,

    totalWrites:
      0,

    totalDeletes:
      0,

    totalClears:
      0,

    totalEvictions:
      0,

    hitCount:
      0,

    missCount:
      0,

    staleHitCount:
      0,

    expiredHitCount:
      0,

    negativeHitCount:
      0,

    hitRate:
      0,

    missRate:
      0,

    requestDeduplicationCount:
      0,

    requestCoalescingCount:
      0,

    estimatedByteSize:
      0,

    oldestEntryAt:
      null,

    newestEntryAt:
      null,

    entriesByProvider:
      {},

    entriesBySource:
      {},
  };
}

export class MemoryMarketDataCache {
  private readonly entries =
    new Map<
      string,
      MarketDataQuoteCacheEntry
    >();

  private readonly events:
    MarketDataCacheEvent[] = [];

  private readonly policy:
    MarketDataCachePolicy;

  private readonly persistentAdapter:
    MarketDataPersistentCacheAdapter | null;

  private readonly eventLimit:
    number;

  private statistics:
    MarketDataCacheStatistics =
      emptyStatistics();

  private hydrated =
    false;

  constructor(
    options:
      MarketDataMemoryCacheOptions = {}
  ) {
    this.policy = {
      ...DEFAULT_CACHE_POLICY,
      ...options.policy,
    };

    this.persistentAdapter =
      options.persistentAdapter ||
      null;

    this.eventLimit =
      Math.max(
        25,
        options.eventLimit ||
          250
      );

    if (
      options.autoHydrate
    ) {
      void this.hydrate();
    }
  }

  getPolicy():
    MarketDataCachePolicy {
    return {
      ...this.policy,
    };
  }

  isHydrated():
    boolean {
    return this.hydrated;
  }

  size():
    number {
    return this.entries.size;
  }

  keys():
    string[] {
    return Array.from(
      this.entries.keys()
    );
  }

  values():
    MarketDataQuoteCacheEntry[] {
    return Array.from(
      this.entries.values()
    );
  }

  getEvents():
    MarketDataCacheEvent[] {
    return [
      ...this.events,
    ];
  }

  getStatistics(
    now =
      new Date()
  ):
    MarketDataCacheStatistics {
    return this.recalculateStatistics(
      now
    );
  }

  private recordEvent(
    event:
      Omit<
        MarketDataCacheEvent,
        "id" |
        "timestamp"
      >
  ): void {
    this.events.unshift({
      id:
        [
          Date.now(),
          Math.random()
            .toString(
              36
            )
            .slice(
              2
            ),
        ].join(
          "-"
        ),

      timestamp:
        new Date()
          .toISOString(),

      ...event,
    });

    if (
      this.events.length >
      this.eventLimit
    ) {
      this.events.splice(
        this.eventLimit
      );
    }
  }

  private recalculateStatistics(
    now =
      new Date()
  ):
    MarketDataCacheStatistics {
    const previous = {
      totalReads:
        this.statistics.totalReads,

      totalWrites:
        this.statistics.totalWrites,

      totalDeletes:
        this.statistics.totalDeletes,

      totalClears:
        this.statistics.totalClears,

      totalEvictions:
        this.statistics.totalEvictions,

      hitCount:
        this.statistics.hitCount,

      missCount:
        this.statistics.missCount,

      staleHitCount:
        this.statistics.staleHitCount,

      expiredHitCount:
        this.statistics.expiredHitCount,

      negativeHitCount:
        this.statistics.negativeHitCount,

      requestDeduplicationCount:
        this.statistics.requestDeduplicationCount,

      requestCoalescingCount:
        this.statistics.requestCoalescingCount,
    };

    const values =
      Array.from(
        this.entries.values()
      );

    const states =
      values.map(
        (
          entry
        ) => ({
          entry,
          state:
            cacheState(
              entry,
              now
            ),
        })
      );

    const entriesByProvider:
      Record<string, number> =
        {};

    const entriesBySource:
      Record<string, number> =
        {};

    for (
      const entry of
      values
    ) {
      const provider =
        entry.metadata.provider ||
        "UNKNOWN";

      entriesByProvider[
        provider
      ] =
        (
          entriesByProvider[
            provider
          ] ||
          0
        ) +
        1;

      entriesBySource[
        entry.metadata.source
      ] =
        (
          entriesBySource[
            entry.metadata.source
          ] ||
          0
        ) +
        1;
    }

    const totalReads =
      previous.totalReads;

    const hitCount =
      previous.hitCount;

    const missCount =
      previous.missCount;

    const createdDates =
      values.map(
        (
          entry
        ) =>
          entry.metadata.createdAt
      );

    this.statistics = {
      generatedAt:
        now.toISOString(),

      entryCount:
        values.length,

      quoteEntryCount:
        values.filter(
          (
            entry
          ) =>
            entry.metadata.entryType ===
            "QUOTE"
        ).length,

      negativeEntryCount:
        values.filter(
          (
            entry
          ) =>
            entry.metadata.entryType ===
            "NEGATIVE_QUOTE"
        ).length,

      freshEntryCount:
        states.filter(
          (
            item
          ) =>
            item.state ===
            "FRESH"
        ).length,

      staleEntryCount:
        states.filter(
          (
            item
          ) =>
            item.state ===
            "STALE"
        ).length,

      expiredEntryCount:
        states.filter(
          (
            item
          ) =>
            item.state ===
            "EXPIRED"
        ).length,

      ...previous,

      hitRate:
        percentage(
          hitCount,
          totalReads
        ),

      missRate:
        percentage(
          missCount,
          totalReads
        ),

      estimatedByteSize:
        values.reduce(
          (
            total,
            entry
          ) =>
            total +
            entry.metadata.byteSize,
          0
        ),

      oldestEntryAt:
        createdDates.length >
        0
          ? [
              ...createdDates,
            ].sort()[
              0
            ]
          : null,

      newestEntryAt:
        createdDates.length >
        0
          ? [
              ...createdDates,
            ].sort()
              .reverse()[
              0
            ]
          : null,

      entriesByProvider,

      entriesBySource,
    };

    return {
      ...this.statistics,

      entriesByProvider: {
        ...this.statistics
          .entriesByProvider,
      },

      entriesBySource: {
        ...this.statistics
          .entriesBySource,
      },
    };
  }

  private touchEntry(
    entry:
      MarketDataQuoteCacheEntry,
    now:
      Date
  ):
    MarketDataQuoteCacheEntry {
    const updated = {
      ...entry,

      metadata: {
        ...entry.metadata,

        lastAccessedAt:
          now.toISOString(),

        accessCount:
          entry.metadata.accessCount +
          1,
      },
    };

    this.entries.set(
      entry.metadata.key,
      updated
    );

    return updated;
  }

  private readMessage(
    state:
      MarketDataCacheState
  ): string {
    if (
      state ===
      "FRESH"
    ) {
      return "Fresh quote returned from cache.";
    }

    if (
      state ===
      "STALE"
    ) {
      return "Stale quote returned while background revalidation is recommended.";
    }

    if (
      state ===
      "EXPIRED"
    ) {
      return "Expired cache entry found.";
    }

    if (
      state ===
      "NEGATIVE"
    ) {
      return "Negative cache entry prevents an immediate provider retry.";
    }

    return "Cache entry not found.";
  }

  get(
    key: string,
    options: {
      now?: Date;
      allowStale?: boolean;
      allowExpiredFallback?: boolean;
    } = {}
  ):
    MarketDataCacheReadResult {
    const startedAt =
      performance.now();

    const now =
      options.now ||
      new Date();

    const allowStale =
      options.allowStale ??
      this.policy.allowStale;

    const allowExpiredFallback =
      options.allowExpiredFallback ??
      this.policy.allowExpiredFallback;

    this.statistics.totalReads +=
      1;

    const entry =
      this.entries.get(
        key
      );

    if (
      !entry
    ) {
      this.statistics.missCount +=
        1;

      const result:
        MarketDataCacheReadResult = {
        key,
        state:
          "MISSING",
        source:
          "NONE",

        entry:
          null,
        quote:
          null,

        ageSeconds:
          null,

        remainingTtlSeconds:
          null,

        remainingStaleSeconds:
          null,

        shouldRevalidate:
          true,

        usable:
          false,

        message:
          this.readMessage(
            "MISSING"
          ),
      };

      this.recordEvent({
        operation:
          "GET",

        key,

        state:
          result.state,

        source:
          result.source,

        provider:
          null,

        symbol:
          null,

        success:
          false,

        durationMs:
          round(
            performance.now() -
            startedAt
          ),

        message:
          result.message,
      });

      this.recalculateStatistics(
        now
      );

      return result;
    }

    const touched =
      this.touchEntry(
        entry,
        now
      );

    const state =
      cacheState(
        touched,
        now
      );

    const age =
      ageSeconds(
        touched.metadata.createdAt,
        now
      );

    const remainingTtl =
      secondsUntil(
        touched.metadata.expiresAt,
        now
      );

    const remainingStale =
      secondsUntil(
        touched.metadata.staleUntil,
        now
      );

    let usable =
      false;

    let shouldRevalidate =
      false;

    if (
      state ===
      "FRESH"
    ) {
      usable =
        Boolean(
          touched.quote
        );

      this.statistics.hitCount +=
        1;
    } else if (
      state ===
      "STALE"
    ) {
      usable =
        allowStale &&
        Boolean(
          touched.quote
        );

      shouldRevalidate =
        true;

      this.statistics.hitCount +=
        usable
          ? 1
          : 0;

      this.statistics.missCount +=
        usable
          ? 0
          : 1;

      this.statistics.staleHitCount +=
        1;
    } else if (
      state ===
      "NEGATIVE"
    ) {
      usable =
        false;

      shouldRevalidate =
        false;

      this.statistics.hitCount +=
        1;

      this.statistics.negativeHitCount +=
        1;
    } else {
      usable =
        allowExpiredFallback &&
        Boolean(
          touched.quote
        );

      shouldRevalidate =
        true;

      this.statistics.hitCount +=
        usable
          ? 1
          : 0;

      this.statistics.missCount +=
        usable
          ? 0
          : 1;

      this.statistics.expiredHitCount +=
        1;
    }

    const result:
      MarketDataCacheReadResult = {
      key,
      state,

      source:
        touched.metadata.source,

      entry:
        touched,

      quote:
        usable
          ? touched.quote
          : null,

      ageSeconds:
        age,

      remainingTtlSeconds:
        remainingTtl,

      remainingStaleSeconds:
        remainingStale,

      shouldRevalidate,

      usable,

      message:
        this.readMessage(
          state
        ),
    };

    this.recordEvent({
      operation:
        "GET",

      key,

      state,

      source:
        touched.metadata.source,

      provider:
        touched.metadata.provider,

      symbol:
        touched.metadata.symbol,

      success:
        usable ||
        state ===
        "NEGATIVE",

      durationMs:
        round(
          performance.now() -
          startedAt
        ),

      message:
        result.message,
    });

    this.recalculateStatistics(
      now
    );

    return result;
  }

  getMany(
    keys: string[],
    options: {
      now?: Date;
      allowStale?: boolean;
      allowExpiredFallback?: boolean;
    } = {}
  ):
    MarketDataCacheBatchReadResult {
    const results =
      keys.map(
        (
          key
        ) =>
          this.get(
            key,
            options
          )
      );

    return {
      requestedKeys: [
        ...keys,
      ],

      results,

      freshCount:
        results.filter(
          (
            result
          ) =>
            result.state ===
            "FRESH"
        ).length,

      staleCount:
        results.filter(
          (
            result
          ) =>
            result.state ===
            "STALE"
        ).length,

      expiredCount:
        results.filter(
          (
            result
          ) =>
            result.state ===
            "EXPIRED"
        ).length,

      missingCount:
        results.filter(
          (
            result
          ) =>
            result.state ===
            "MISSING"
        ).length,

      negativeCount:
        results.filter(
          (
            result
          ) =>
            result.state ===
            "NEGATIVE"
        ).length,

      usableQuotes:
        results
          .map(
            (
              result
            ) =>
              result.quote
          )
          .filter(
            (
              quote
            ): quote is NonNullable<
              typeof quote
            > =>
              Boolean(
                quote
              )
          ),

      missingKeys:
        results
          .filter(
            (
              result
            ) =>
              result.state ===
                "MISSING" ||
              result.state ===
                "EXPIRED"
          )
          .map(
            (
              result
            ) =>
              result.key
          ),

      revalidateKeys:
        results
          .filter(
            (
              result
            ) =>
              result.shouldRevalidate
          )
          .map(
            (
              result
            ) =>
              result.key
          ),
    };
  }

  set(
    input:
      MarketDataCacheWriteInput
  ):
    MarketDataQuoteCacheEntry {
    const startedAt =
      performance.now();

    const now =
      input.now ||
      new Date();

    const entryType:
      MarketDataCacheEntryType =
        input.entryType ||
        "QUOTE";

    const ttlSeconds =
      entryType ===
      "NEGATIVE_QUOTE"
        ? input.ttlSeconds ??
          this.policy
            .negativeTtlSeconds
        : input.ttlSeconds ??
          this.policy.ttlSeconds;

    const staleWhileRevalidateSeconds =
      entryType ===
      "NEGATIVE_QUOTE"
        ? 0
        : input
            .staleWhileRevalidateSeconds ??
          this.policy
            .staleWhileRevalidateSeconds;

    const createdAt =
      now;

    const expiresAt =
      new Date(
        now.getTime() +
        clamp(
          ttlSeconds
        ) *
          1_000
      );

    const staleUntil =
      new Date(
        expiresAt.getTime() +
        clamp(
          staleWhileRevalidateSeconds
        ) *
          1_000
      );

    const existing =
      this.entries.get(
        input.key
      );

    const draft:
      MarketDataQuoteCacheEntry = {
      metadata: {
        key:
          input.key,

        symbol:
          input.symbol,

        provider:
          input.provider ||
          input.quote?.provider ||
          null,

        entryType,

        createdAt:
          existing
            ?.metadata
            .createdAt ||
          isoDate(
            createdAt
          ),

        updatedAt:
          isoDate(
            now
          ),

        expiresAt:
          isoDate(
            expiresAt
          ),

        staleUntil:
          isoDate(
            staleUntil
          ),

        lastAccessedAt:
          isoDate(
            now
          ),

        accessCount:
          existing
            ?.metadata
            .accessCount ||
          0,

        byteSize:
          0,

        source:
          input.source ||
          "MEMORY",

        errorCode:
          input.errorCode ||
          null,

        errorMessage:
          input.errorMessage ||
          null,
      },

      quote:
        input.quote ||
        null,
    };

    draft.metadata.byteSize =
      estimateByteSize(
        draft
      );

    this.entries.set(
      input.key,
      draft
    );

    this.statistics.totalWrites +=
      1;

    this.recordEvent({
      operation:
        "SET",

      key:
        input.key,

      state:
        entryType ===
        "NEGATIVE_QUOTE"
          ? "NEGATIVE"
          : "FRESH",

      source:
        draft.metadata.source,

      provider:
        draft.metadata.provider,

      symbol:
        draft.metadata.symbol,

      success:
        true,

      durationMs:
        round(
          performance.now() -
          startedAt
        ),

      message:
        entryType ===
        "NEGATIVE_QUOTE"
          ? "Negative cache entry written."
          : "Quote cache entry written.",
    });

    this.enforceMaximumEntries(
      now
    );

    this.recalculateStatistics(
      now
    );

    if (
      this.policy.persist
    ) {
      void this.persist();
    }

    return draft;
  }

  setMany(
    inputs:
      MarketDataCacheWriteInput[]
  ):
    MarketDataQuoteCacheEntry[] {
    return inputs.map(
      (
        input
      ) =>
        this.set(
          input
        )
    );
  }

  setNegative(
    input: Omit<
      MarketDataCacheWriteInput,
      "quote" |
      "entryType"
    >
  ):
    MarketDataQuoteCacheEntry {
    return this.set({
      ...input,

      quote:
        null,

      entryType:
        "NEGATIVE_QUOTE",
    });
  }

  delete(
    key: string
  ):
    boolean {
    const startedAt =
      performance.now();

    const entry =
      this.entries.get(
        key
      );

    const deleted =
      this.entries.delete(
        key
      );

    if (
      deleted
    ) {
      this.statistics.totalDeletes +=
        1;
    }

    this.recordEvent({
      operation:
        "DELETE",

      key,

      state:
        entry
          ? cacheState(
              entry,
              new Date()
            )
          : "MISSING",

      source:
        entry
          ?.metadata
          .source ||
        "NONE",

      provider:
        entry
          ?.metadata
          .provider ||
        null,

      symbol:
        entry
          ?.metadata
          .symbol ||
        null,

      success:
        deleted,

      durationMs:
        round(
          performance.now() -
          startedAt
        ),

      message:
        deleted
          ? "Cache entry deleted."
          : "Cache entry was not found.",
    });

    this.recalculateStatistics();

    if (
      this.policy.persist
    ) {
      void this.persist();
    }

    return deleted;
  }

  deleteBySymbol(
    symbol: string
  ):
    number {
    const keys =
      this.keys()
        .filter(
          (
            key
          ) =>
            cacheKeyMatchesSymbol(
              key,
              symbol
            )
        );

    for (
      const key of
      keys
    ) {
      this.delete(
        key
      );
    }

    return keys.length;
  }

  deleteByProvider(
    provider: string
  ):
    number {
    const keys =
      this.keys()
        .filter(
          (
            key
          ) =>
            cacheKeyMatchesProvider(
              key,
              provider
            )
        );

    for (
      const key of
      keys
    ) {
      this.delete(
        key
      );
    }

    return keys.length;
  }

  clear(): void {
    const startedAt =
      performance.now();

    const count =
      this.entries.size;

    this.entries.clear();

    this.statistics.totalClears +=
      1;

    this.recordEvent({
      operation:
        "CLEAR",

      key:
        null,

      state:
        null,

      source:
        "MEMORY",

      provider:
        null,

      symbol:
        null,

      success:
        true,

      durationMs:
        round(
          performance.now() -
          startedAt
        ),

      message:
        `Cleared ${count} cache entries.`,
    });

    this.recalculateStatistics();

    if (
      this.policy.persist
    ) {
      void this.persist();
    }
  }

  pruneExpired(
    now =
      new Date()
  ):
    number {
    let removed =
      0;

    for (
      const [
        key,
        entry,
      ] of
      this.entries
    ) {
      const state =
        cacheState(
          entry,
          now
        );

      const age =
        ageSeconds(
          entry.metadata.createdAt,
          now
        );

      if (
        state ===
          "EXPIRED" ||
        age >
          this.policy
            .maximumEntryAgeSeconds
      ) {
        this.entries.delete(
          key
        );

        removed +=
          1;

        this.statistics.totalEvictions +=
          1;

        this.recordEvent({
          operation:
            "EVICT",

          key,

          state,

          source:
            entry.metadata.source,

          provider:
            entry.metadata.provider,

          symbol:
            entry.metadata.symbol,

          success:
            true,

          durationMs:
            0,

          message:
            "Expired cache entry evicted.",
        });
      }
    }

    this.recalculateStatistics(
      now
    );

    if (
      removed >
        0 &&
      this.policy.persist
    ) {
      void this.persist();
    }

    return removed;
  }

  private enforceMaximumEntries(
    now =
      new Date()
  ): void {
    this.pruneExpired(
      now
    );

    const maximum =
      Math.max(
        1,
        this.policy
          .maximumEntries
      );

    if (
      this.entries.size <=
      maximum
    ) {
      return;
    }

    const ordered =
      Array.from(
        this.entries.values()
      )
        .sort(
          (
            left,
            right
          ) => {
            const accessDifference =
              dateFromIso(
                left.metadata
                  .lastAccessedAt
              ).getTime() -
              dateFromIso(
                right.metadata
                  .lastAccessedAt
              ).getTime();

            if (
              accessDifference !==
              0
            ) {
              return accessDifference;
            }

            return (
              left.metadata
                .accessCount -
              right.metadata
                .accessCount
            );
          }
        );

    const removeCount =
      this.entries.size -
      maximum;

    for (
      const entry of
      ordered.slice(
        0,
        removeCount
      )
    ) {
      this.entries.delete(
        entry.metadata.key
      );

      this.statistics.totalEvictions +=
        1;

      this.recordEvent({
        operation:
          "EVICT",

        key:
          entry.metadata.key,

        state:
          cacheState(
            entry,
            now
          ),

        source:
          entry.metadata.source,

        provider:
          entry.metadata.provider,

        symbol:
          entry.metadata.symbol,

        success:
          true,

        durationMs:
          0,

        message:
          "Least-recently-used cache entry evicted.",
      });
    }

    this.recalculateStatistics(
      now
    );
  }

  incrementDeduplication():
    void {
    this.statistics
      .requestDeduplicationCount +=
      1;
  }

  incrementCoalescing():
    void {
    this.statistics
      .requestCoalescingCount +=
      1;
  }

  snapshot(
    now =
      new Date()
  ):
    MarketDataCacheSnapshot {
    return {
      version:
        1,

      generatedAt:
        now.toISOString(),

      entries:
        this.values(),

      statistics:
        this.getStatistics(
          now
        ),
    };
  }

  async hydrate():
    Promise<number> {
    if (
      !this.persistentAdapter
    ) {
      this.hydrated =
        true;

      return 0;
    }

    const available =
      await this
        .persistentAdapter
        .available();

    if (
      !available
    ) {
      this.hydrated =
        true;

      return 0;
    }

    const startedAt =
      performance.now();

    const snapshot =
      await this
        .persistentAdapter
        .load();

    let count =
      0;

    if (
      snapshot
    ) {
      for (
        const entry of
        snapshot.entries
      ) {
        this.entries.set(
          entry.metadata.key,
          entry
        );

        count +=
          1;
      }
    }

    this.hydrated =
      true;

    this.recordEvent({
      operation:
        "HYDRATE",

      key:
        null,

      state:
        null,

      source:
        this.persistentAdapter
          .source,

      provider:
        null,

      symbol:
        null,

      success:
        true,

      durationMs:
        round(
          performance.now() -
          startedAt
        ),

      message:
        `Hydrated ${count} cache entries.`,
    });

    this.pruneExpired();

    return count;
  }

  async persist():
    Promise<boolean> {
    if (
      !this.persistentAdapter
    ) {
      return false;
    }

    const available =
      await this
        .persistentAdapter
        .available();

    if (
      !available
    ) {
      return false;
    }

    const startedAt =
      performance.now();

    await this
      .persistentAdapter
      .save(
        this.snapshot()
      );

    this.recordEvent({
      operation:
        "PERSIST",

      key:
        null,

      state:
        null,

      source:
        this.persistentAdapter
          .source,

      provider:
        null,

      symbol:
        null,

      success:
        true,

      durationMs:
        round(
          performance.now() -
          startedAt
        ),

      message:
        `Persisted ${this.entries.size} cache entries.`,
    });

    return true;
  }
}

let sharedMarketDataCache:
  MemoryMarketDataCache | null =
    null;

export function getSharedMarketDataCache():
  MemoryMarketDataCache {
  if (
    !sharedMarketDataCache
  ) {
    sharedMarketDataCache =
      new MemoryMarketDataCache();
  }

  return sharedMarketDataCache;
}

export function resetSharedMarketDataCache():
  MemoryMarketDataCache {
  sharedMarketDataCache =
    new MemoryMarketDataCache();

  return sharedMarketDataCache;
}
