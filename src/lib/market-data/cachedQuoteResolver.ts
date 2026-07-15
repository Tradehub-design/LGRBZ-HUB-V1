import type {
  CachedQuoteResolverRequest,
  CachedQuoteResolverResult,
  MarketDataCachePolicy,
} from "./marketDataCacheTypes";
import type {
  NormalisedMarketQuote,
} from "./marketDataTypes";
import {
  MemoryMarketDataCache,
  getSharedMarketDataCache,
} from "./memoryMarketDataCache";
import {
  MarketDataRequestCoalescer,
  getSharedMarketDataRequestCoalescer,
} from "./marketDataRequestCoalescer";

export type QuoteFetchFunction =
  (
    request:
      CachedQuoteResolverRequest
  ) =>
    Promise<
      NormalisedMarketQuote
    >;

type CachedQuoteResolverDependencies = {
  cache?:
    MemoryMarketDataCache;

  coalescer?:
    MarketDataRequestCoalescer;

  backgroundRevalidate?:
    boolean;
};

function mergePolicy(
  base:
    MarketDataCachePolicy,
  override:
    Partial<MarketDataCachePolicy> |
    undefined
):
  MarketDataCachePolicy {
  return {
    ...base,
    ...override,
  };
}

export async function resolveCachedMarketQuote(
  request:
    CachedQuoteResolverRequest,
  fetchQuote:
    QuoteFetchFunction,
  dependencies:
    CachedQuoteResolverDependencies = {}
):
  Promise<
    CachedQuoteResolverResult
  > {
  const cache =
    dependencies.cache ||
    getSharedMarketDataCache();

  const coalescer =
    dependencies.coalescer ||
    getSharedMarketDataRequestCoalescer();

  const policy =
    mergePolicy(
      cache.getPolicy(),
      request.policy
    );

  const allowStale =
    request.allowStale ??
    policy.allowStale;

  const allowExpiredFallback =
    request.allowExpiredFallback ??
    policy.allowExpiredFallback;

  if (
    !request.forceRefresh
  ) {
    const cached =
      cache.get(
        request.cacheKey,
        {
          allowStale,
          allowExpiredFallback,
        }
      );

    if (
      cached.state ===
        "FRESH" &&
      cached.quote
    ) {
      return {
        quote:
          cached.quote,

        cacheState:
          cached.state,

        cacheSource:
          cached.source,

        fromCache:
          true,

        refreshed:
          false,

        revalidationStarted:
          false,

        provider:
          request.provider,

        symbol:
          request.symbol,

        warnings: [
          ...cached.quote
            .warnings,
        ],
      };
    }

    if (
      cached.state ===
        "NEGATIVE"
    ) {
      return {
        quote:
          null,

        cacheState:
          cached.state,

        cacheSource:
          cached.source,

        fromCache:
          true,

        refreshed:
          false,

        revalidationStarted:
          false,

        provider:
          request.provider,

        symbol:
          request.symbol,

        warnings: [
          cached.entry
            ?.metadata
            .errorMessage ||
          "A recent provider failure is temporarily cached.",
        ],
      };
    }

    if (
      cached.state ===
        "STALE" &&
      cached.quote &&
      allowStale
    ) {
      let revalidationStarted =
        false;

      if (
        dependencies.backgroundRevalidate !==
        false
      ) {
        revalidationStarted =
          true;

        void coalescer
          .run(
            request.cacheKey,
            async () => {
              const quote =
                await fetchQuote(
                  request
                );

              cache.set({
                key:
                  request.cacheKey,

                symbol:
                  request.symbol,

                provider:
                  request.provider,

                quote,

                ttlSeconds:
                  policy.ttlSeconds,

                staleWhileRevalidateSeconds:
                  policy
                    .staleWhileRevalidateSeconds,
              });

              return quote;
            },
            {
              onJoined:
                () => {
                  cache
                    .incrementCoalescing();
                },

              onCreated:
                () => {
                  cache
                    .incrementDeduplication();
                },
            }
          )
          .catch(
            () => {
              // Background refresh failure leaves the stale entry available.
            }
          );
      }

      return {
        quote:
          cached.quote,

        cacheState:
          cached.state,

        cacheSource:
          cached.source,

        fromCache:
          true,

        refreshed:
          false,

        revalidationStarted,

        provider:
          request.provider,

        symbol:
          request.symbol,

        warnings: [
          ...cached.quote
            .warnings,

          "A stale quote was returned while refresh was requested.",
        ],
      };
    }
  }

  try {
    const quote =
      await coalescer.run(
        request.cacheKey,
        async () => {
          const freshQuote =
            await fetchQuote(
              request
            );

          cache.set({
            key:
              request.cacheKey,

            symbol:
              request.symbol,

            provider:
              request.provider,

            quote:
              freshQuote,

            ttlSeconds:
              policy.ttlSeconds,

            staleWhileRevalidateSeconds:
              policy
                .staleWhileRevalidateSeconds,
          });

          return freshQuote;
        },
        {
          onJoined:
            () => {
              cache
                .incrementCoalescing();
            },

          onCreated:
            () => {
              cache
                .incrementDeduplication();
            },
        }
      );

    return {
      quote,

      cacheState:
        "FRESH",

      cacheSource:
        "MEMORY",

      fromCache:
        false,

      refreshed:
        true,

      revalidationStarted:
        false,

      provider:
        request.provider,

      symbol:
        request.symbol,

      warnings: [
        ...quote.warnings,
      ],
    };
  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown market-data provider failure.";

    cache.setNegative({
      key:
        request.cacheKey,

      symbol:
        request.symbol,

      provider:
        request.provider,

      ttlSeconds:
        policy.negativeTtlSeconds,

      errorCode:
        "QUOTE_FETCH_FAILED",

      errorMessage:
        message,
    });

    const fallback =
      cache.get(
        request.cacheKey,
        {
          allowStale:
            true,

          allowExpiredFallback,
        }
      );

    if (
      fallback.quote
    ) {
      return {
        quote:
          fallback.quote,

        cacheState:
          fallback.state,

        cacheSource:
          fallback.source,

        fromCache:
          true,

        refreshed:
          false,

        revalidationStarted:
          false,

        provider:
          request.provider,

        symbol:
          request.symbol,

        warnings: [
          ...fallback.quote
            .warnings,

          `Provider refresh failed: ${message}`,
        ],
      };
    }

    return {
      quote:
        null,

      cacheState:
        "NEGATIVE",

      cacheSource:
        "MEMORY",

      fromCache:
        false,

      refreshed:
        false,

      revalidationStarted:
        false,

      provider:
        request.provider,

      symbol:
        request.symbol,

      warnings: [
        message,
      ],
    };
  }
}

export async function resolveCachedMarketQuotes(
  requests:
    CachedQuoteResolverRequest[],
  fetchQuote:
    QuoteFetchFunction,
  dependencies:
    CachedQuoteResolverDependencies = {}
):
  Promise<
    CachedQuoteResolverResult[]
  > {
  return Promise.all(
    requests.map(
      (
        request
      ) =>
        resolveCachedMarketQuote(
          request,
          fetchQuote,
          dependencies
        )
    )
  );
}
