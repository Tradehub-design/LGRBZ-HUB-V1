import {
  createMarketSessionSnapshot,
} from "./marketClock";
import {
  createProviderQuoteCacheKey,
} from "./marketDataCacheKeys";
import type {
  MarketDataProviderAdapter,
  MultiProviderBatchQuoteRequest,
  MultiProviderBatchQuoteResult,
  MultiProviderQuoteAttempt,
  MultiProviderQuoteRequest,
  MultiProviderQuoteResult,
} from "./marketDataAdapterTypes";
import type {
  MarketDataProviderDefinition,
  NormalisedMarketQuote,
  ProviderHealthStore,
} from "./marketDataTypes";
import {
  createProviderHealthStore,
  healthForProvider,
  updateProviderHealthStore,
} from "./providerHealth";
import {
  DEFAULT_MARKET_DATA_PROVIDERS,
} from "./providerRegistry";
import {
  providerFallbackOrder,
  selectMarketDataProvider,
} from "./providerSelector";
import {
  createMarketDataSymbol,
} from "./providerSymbolMapper";
import {
  resolveCachedMarketQuote,
} from "./cachedQuoteResolver";
import {
  getSharedMarketDataCache,
} from "./memoryMarketDataCache";
import {
  getSharedMarketDataRequestCoalescer,
} from "./marketDataRequestCoalescer";
import {
  getSharedProviderAdapterRegistry,
} from "./adapters/providerAdapterRegistry";





function stableProviderResultError(
  value: unknown
): string {
  if (
    value &&
    typeof value === "object" &&
    "error" in value
  ) {
    const error =
      (
        value as {
          error?: unknown;
        }
      ).error;

    if (
      typeof error === "string"
    ) {
      return error;
    }

    if (
      error instanceof Error
    ) {
      return error.message;
    }
  }

  return "Market-data provider request failed.";
}

function providerResultError(
  result: unknown
): string {
  if (
    result &&
    typeof result ===
      "object" &&
    "error" in result
  ) {
    const error =
      (
        result as {
          error?: unknown;
        }
      ).error;

    if (
      typeof error ===
      "string"
    ) {
      return error;
    }

    if (
      error instanceof Error
    ) {
      return error.message;
    }
  }

  return "Provider did not return a quote.";
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

function quoteRank(
  quote:
    NormalisedMarketQuote
): number {
  const usabilityBonus =
    quote.isUsable
      ? 25
      : 0;

  const freshnessBonus =
    quote.freshness ===
      "FRESH"
      ? 20
      : quote.freshness ===
          "ACCEPTABLE"
        ? 15
        : quote.freshness ===
            "DELAYED"
          ? 8
          : quote.freshness ===
              "STALE"
            ? 2
            : 0;

  const realTimeBonus =
    quote.latencyClass ===
      "REAL_TIME"
      ? 12
      : quote.latencyClass ===
          "DELAYED"
        ? 5
        : 0;

  const stalePenalty =
    quote.isStale
      ? 20
      : 0;

  const indicativePenalty =
    quote.isIndicative
      ? 10
      : 0;

  return round(
    quote.qualityScore *
      0.5 +
    quote.confidenceScore *
      0.5 +
    usabilityBonus +
    freshnessBonus +
    realTimeBonus -
    stalePenalty -
    indicativePenalty
  );
}

function bestQuote(
  attempts:
    MultiProviderQuoteAttempt[],
  minimumQualityScore:
    number
): NormalisedMarketQuote | null {
  return (
    attempts
      .map(
        (
          attempt
        ) =>
          attempt.quote
      )
      .filter(
        (
          quote
        ): quote is NormalisedMarketQuote =>
          Boolean(
            quote
          ) &&
          quote.isUsable &&
          quote.qualityScore >=
            minimumQualityScore
      )
      .sort(
        (
          left,
          right
        ) =>
          quoteRank(
            right
          ) -
          quoteRank(
            left
          )
      )[
        0
      ] ||
    null
  );
}

function candidateDefinition(
  providers:
    MarketDataProviderDefinition[],
  adapter:
    MarketDataProviderAdapter
): MarketDataProviderDefinition {
  return (
    providers.find(
      (
        provider
      ) =>
        provider.id ===
        adapter.providerId
    ) ||
    adapter.getDefinition()
  );
}

export class MultiProviderQuoteResolver {
  private healthStore:
    ProviderHealthStore;

  constructor(
    private readonly options: {
      providers?:
        MarketDataProviderDefinition[];

      healthStore?:
        ProviderHealthStore;
    } = {}
  ) {
    const providers =
      options.providers ||
      DEFAULT_MARKET_DATA_PROVIDERS;

    this.healthStore =
      options.healthStore ||
      createProviderHealthStore(
        providers
      );
  }

  getHealthStore():
    ProviderHealthStore {
    return this.healthStore;
  }

  setHealthStore(
    healthStore:
      ProviderHealthStore
  ): void {
    this.healthStore =
      healthStore;
  }

  async resolve(
    request:
      MultiProviderQuoteRequest
  ): Promise<MultiProviderQuoteResult> {
    const providers =
      this.options.providers ||
      DEFAULT_MARKET_DATA_PROVIDERS;

    const registry =
      getSharedProviderAdapterRegistry();

    const cache =
      getSharedMarketDataCache();

    const coalescer =
      getSharedMarketDataRequestCoalescer();

    const symbol =
      createMarketDataSymbol(
        request.symbol,
        {
          assetType:
            request.assetType,

          region:
            request.region,

          exchange:
            request.exchange,

          currency:
            request.currency,
        }
      );

    const marketSession =
      createMarketSessionSnapshot({
        exchange:
          symbol.exchange,

        now:
          request.now ||
          new Date(),
      });

    const selection =
      selectMarketDataProvider(
        providers,
        this.healthStore,
        {
          capability:
            "QUOTE",

          assetType:
            symbol.assetType,

          region:
            symbol.region,

          exchange:
            symbol.exchange,

          symbols: [
            symbol.canonical,
          ],

          allowDelayed:
            request.allowDelayed ??
            true,

          allowIndicative:
            request.allowIndicative ??
            false,

          providerPreference:
            request.providerPreference,

          excludedProviders:
            request.excludedProviders,
        },
        request.environment ||
        process.env
      );

    const fallbackOrder =
      providerFallbackOrder(
        selection
      ).filter(
        (
          provider
        ) =>
          registry.has(
            provider.id
          )
      );

    const maximumAttempts =
      Math.max(
        1,
        Math.min(
          request.maximumProviderAttempts ||
          fallbackOrder.length ||
          1,
          fallbackOrder.length ||
          1
        )
      );

    const compareProviders =
      request.compareProviders ??
      false;

    const minimumQualityScore =
      request.minimumQualityScore ??
      45;

    const attempts:
      MultiProviderQuoteAttempt[] =
        [];

    const warnings:
      string[] = [
        marketSession.message,
      ];

    const errors:
      MultiProviderQuoteResult[
        "errors"
      ] =
        [];

    for (
      const provider of
      fallbackOrder.slice(
        0,
        maximumAttempts
      )
    ) {
      const adapter =
        registry.get(
          provider.id
        );

      if (
        !adapter
      ) {
        continue;
      }

      const selectionCandidate =
        selection.candidates.find(
          (
            candidate
          ) =>
            candidate.provider.id ===
            provider.id
        );

      const healthBefore =
        healthForProvider(
          this.healthStore,
          provider
        );

      const startedAt =
        new Date()
          .toISOString();

      const startedMs =
        performance.now();

      const cacheKey =
        createProviderQuoteCacheKey(
          symbol.canonical,
          provider.id
        );

      let adapterResult:
        Awaited<
          ReturnType<
            MarketDataProviderAdapter[
              "quote"
            ]
          >
        > |
        null =
          null;

      const cachedResult =
        await resolveCachedMarketQuote(
          {
            cacheKey,

            symbol:
              symbol.canonical,

            provider:
              provider.id,

            forceRefresh:
              request.forceRefresh,

            allowStale:
              request.allowStale,

            allowExpiredFallback:
              request.allowExpiredFallback,
          },

          async () => {
            adapterResult =
              await adapter.quote({
                symbol,

                timeoutMs:
                  request.timeoutMs ||
                  provider.defaultTimeoutMs,

                environment:
                  request.environment,

                now:
                  request.now,
              });

            if (
              !adapterResult.successful
            ) {
              throw stableProviderResultError(adapterResult);
            }

            return adapterResult.quote;
          },

          {
            cache,
            coalescer,
            backgroundRevalidate:
              true,
          }
        );

      const finishedAt =
        new Date()
          .toISOString();

      const durationMs =
        round(
          performance.now() -
          startedMs
        );

      let requestResult =
        adapterResult
          ?.requestResult;

      if (
        !requestResult
      ) {
        requestResult = {
          provider:
            provider.id,

          successful:
            Boolean(
              cachedResult.quote
            ),

          startedAt,
          finishedAt,

          latencyMs:
            durationMs,

          symbolCount:
            1,

          successfulSymbolCount:
            cachedResult.quote
              ? 1
              : 0,

          failedSymbolCount:
            cachedResult.quote
              ? 0
              : 1,

          statusCode:
            null,

          errorCode:
            cachedResult.quote
              ? null
              : "QUOTE_FETCH_FAILED",

          errorMessage:
            cachedResult.quote
              ? null
              : cachedResult.warnings[
                  0
                ] ||
                "Quote resolution failed.",

          rateLimited:
            false,

          timedOut:
            false,
        };
      }

      this.healthStore =
        updateProviderHealthStore(
          this.healthStore,
          requestResult,
          candidateDefinition(
            providers,
            adapter
          )
        );

      const healthAfter =
        healthForProvider(
          this.healthStore,
          provider
        );

      const adapterError =
        adapterResult &&
        !adapterResult.successful
          ? stableProviderResultError(adapterResult)
          : null;

      if (
        adapterError
      ) {
        errors.push(
          adapterError
        );
      }

      warnings.push(
        ...cachedResult.warnings
      );

      attempts.push({
        provider:
          provider.id,

        startedAt,
        finishedAt,
        durationMs,

        successful:
          Boolean(
            cachedResult.quote
          ),

        quote:
          cachedResult.quote,

        error:
          adapterError,

        healthBefore,
        healthAfter,

        fromCache:
          cachedResult.fromCache,

        cacheState:
          cachedResult.cacheState,

        selectionScore:
          selectionCandidate
            ?.score ||
          0,

        selectionReasons:
          selectionCandidate
            ?.reasons ||
          [],
      });

      const acceptable =
        cachedResult.quote &&
        cachedResult.quote
          .qualityScore >=
          minimumQualityScore;

      if (
        acceptable &&
        !compareProviders
      ) {
        break;
      }
    }

    const quote =
      bestQuote(
        attempts,
        minimumQualityScore
      );

    const successfulAttempts =
      attempts.filter(
        (
          attempt
        ) =>
          attempt.successful
      );

    const selectedProvider =
      quote?.provider ||
      null;

    const firstAttemptProvider =
      attempts[
        0
      ]?.provider ||
      null;

    return {
      symbol,
      quote,

      successful:
        Boolean(
          quote
        ),

      selectedProvider,

      attempts,

      attemptedProviderCount:
        attempts.length,

      successfulProviderCount:
        successfulAttempts.length,

      failedProviderCount:
        attempts.length -
        successfulAttempts.length,

      fallbackUsed:
        Boolean(
          quote &&
          firstAttemptProvider &&
          selectedProvider !==
          firstAttemptProvider
        ),

      comparedProviders:
        compareProviders,

      healthStore:
        this.healthStore,

      warnings:
        Array.from(
          new Set(
            warnings
          )
        ),

      errors,

      generatedAt:
        new Date()
          .toISOString(),
    };
  }

  async resolveBatch(
    request:
      MultiProviderBatchQuoteRequest
  ): Promise<MultiProviderBatchQuoteResult> {
    const concurrency =
      Math.max(
        1,
        Math.min(
          request.concurrency ||
          6,
          20
        )
      );

    const results:
      MultiProviderQuoteResult[] =
        [];

    for (
      let index =
        0;
      index <
      request.symbols.length;
      index +=
      concurrency
    ) {
      const group =
        request.symbols.slice(
          index,
          index +
          concurrency
        );

      const groupResults =
        await Promise.all(
          group.map(
            (
              symbol
            ) =>
              this.resolve({
                symbol,

                assetType:
                  request.assetType,

                region:
                  request.region,

                exchange:
                  request.exchange,

                currency:
                  request.currency,

                providerPreference:
                  request.providerPreference,

                excludedProviders:
                  request.excludedProviders,

                allowDelayed:
                  request.allowDelayed,

                allowIndicative:
                  request.allowIndicative,

                allowStale:
                  request.allowStale,

                allowExpiredFallback:
                  request.allowExpiredFallback,

                forceRefresh:
                  request.forceRefresh,

                compareProviders:
                  request.compareProviders,

                minimumQualityScore:
                  request.minimumQualityScore,

                maximumProviderAttempts:
                  request.maximumProviderAttempts,

                timeoutMs:
                  request.timeoutMs,

                environment:
                  request.environment,
              })
          )
        );

      results.push(
        ...groupResults
      );
    }

    const quotes =
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
          ): quote is NormalisedMarketQuote =>
            Boolean(
              quote
            )
        );

    const successfulSymbols =
      results
        .filter(
          (
            result
          ) =>
            result.successful
        )
        .map(
          (
            result
          ) =>
            result.symbol
              .canonical
        );

    const failedSymbols =
      results
        .filter(
          (
            result
          ) =>
            !result.successful
        )
        .map(
          (
            result
          ) =>
            result.symbol
              .canonical
        );

    return {
      results,
      quotes,

      successfulSymbols,
      failedSymbols,

      requestedCount:
        request.symbols.length,

      successfulCount:
        successfulSymbols.length,

      failedCount:
        failedSymbols.length,

      partial:
        successfulSymbols.length >
          0 &&
        failedSymbols.length >
          0,

      healthStore:
        this.healthStore,

      generatedAt:
        new Date()
          .toISOString(),
    };
  }
}

let sharedMultiProviderQuoteResolver:
  MultiProviderQuoteResolver | null =
    null;

export function getSharedMultiProviderQuoteResolver():
  MultiProviderQuoteResolver {
  if (
    !sharedMultiProviderQuoteResolver
  ) {
    sharedMultiProviderQuoteResolver =
      new MultiProviderQuoteResolver();
  }

  return sharedMultiProviderQuoteResolver;
}

export function resetSharedMultiProviderQuoteResolver():
  MultiProviderQuoteResolver {
  sharedMultiProviderQuoteResolver =
    new MultiProviderQuoteResolver();

  return sharedMultiProviderQuoteResolver;
}

export async function resolveMarketQuote(
  request:
    MultiProviderQuoteRequest
): Promise<MultiProviderQuoteResult> {
  return getSharedMultiProviderQuoteResolver()
    .resolve(
      request
    );
}

export async function resolveMarketQuotes(
  request:
    MultiProviderBatchQuoteRequest
): Promise<MultiProviderBatchQuoteResult> {
  return getSharedMultiProviderQuoteResolver()
    .resolveBatch(
      request
    );
}
