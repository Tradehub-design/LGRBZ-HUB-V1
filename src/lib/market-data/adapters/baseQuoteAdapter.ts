import {
  createAdapterError,
  isMarketDataAdapterError,
} from "../marketDataHttpClient";
import type {
  MarketDataAdapterError,
  MarketDataProviderAdapter,
  ProviderBatchQuoteRequest,
  ProviderBatchQuoteResult,
  ProviderQuoteFailure,
  ProviderQuoteRequest,
  ProviderQuoteResult,
  ProviderQuoteSuccess,
} from "../marketDataAdapterTypes";
import type {
  MarketDataProviderDefinition,
  MarketDataProviderId,
  MarketDataSymbol,
  NormalisedMarketQuote,
  ProviderRequestResult,
  RawMarketQuote,
} from "../marketDataTypes";
import {
  normaliseMarketQuote,
} from "../quoteQuality";
import {
  symbolForProvider,
} from "../providerSymbolMapper";

function nowIso():
  string {
  return new Date()
    .toISOString();
}

export function providerRequestResult({
  provider,
  startedAt,
  finishedAt,
  successful,
  symbolCount,
  successfulSymbolCount,
  failedSymbolCount,
  statusCode = null,
  error = null,
}: {
  provider: MarketDataProviderId;
  startedAt: string;
  finishedAt: string;
  successful: boolean;
  symbolCount: number;
  successfulSymbolCount: number;
  failedSymbolCount: number;
  statusCode?: number | null;
  error?: MarketDataAdapterError | null;
}): ProviderRequestResult {
  const started =
    new Date(
      startedAt
    ).getTime();

  const finished =
    new Date(
      finishedAt
    ).getTime();

  return {
    provider,
    successful,

    startedAt,
    finishedAt,

    latencyMs:
      Math.max(
        0,
        finished -
        started
      ),

    symbolCount,
    successfulSymbolCount,
    failedSymbolCount,

    statusCode,

    errorCode:
      error?.code ||
      null,

    errorMessage:
      error?.message ||
      null,

    rateLimited:
      error?.rateLimited ||
      false,

    timedOut:
      error?.timedOut ||
      false,
  };
}

export abstract class BaseMarketDataQuoteAdapter
implements MarketDataProviderAdapter {
  abstract readonly providerId:
    MarketDataProviderId;

  abstract getDefinition():
    MarketDataProviderDefinition;

  abstract fetchRawQuote(
    request: ProviderQuoteRequest,
    providerSymbol: MarketDataSymbol
  ): Promise<{
    quote: RawMarketQuote;
    statusCode?: number | null;
  }>;

  supports(
    symbol: MarketDataSymbol
  ): boolean {
    const definition =
      this.getDefinition();

    return (
      definition.enabled &&
      (
        definition.assetTypes.includes(
          symbol.assetType
        ) ||
        definition.assetTypes.includes(
          "UNKNOWN"
        )
      ) &&
      (
        definition.regions.includes(
          symbol.region
        ) ||
        definition.regions.includes(
          "GLOBAL"
        ) ||
        definition.regions.includes(
          "UNKNOWN"
        )
      ) &&
      (
        definition.exchanges.includes(
          symbol.exchange
        ) ||
        definition.exchanges.includes(
          "UNKNOWN"
        )
      )
    );
  }

  async quote(
    request: ProviderQuoteRequest
  ): Promise<ProviderQuoteResult> {
    const startedAt =
      nowIso();

    const definition =
      this.getDefinition();

    const providerSymbol =
      symbolForProvider(
        request.symbol,
        this.providerId
      );

    if (
      !this.supports(
        providerSymbol
      )
    ) {
      const finishedAt =
        nowIso();

      const error =
        createAdapterError(
          this.providerId,
          "UNSUPPORTED_SYMBOL",
          `${definition.name} does not support ${providerSymbol.canonical}.`,
          {
            retryable:
              false,
          }
        );

      const failure:
        ProviderQuoteFailure = {
        successful:
          false,

        provider:
          this.providerId,

        symbol:
          providerSymbol,

        error,

        requestResult:
          providerRequestResult({
            provider:
              this.providerId,

            startedAt,
            finishedAt,

            successful:
              false,

            symbolCount:
              1,

            successfulSymbolCount:
              0,

            failedSymbolCount:
              1,

            error,
          }),
      };

      return failure;
    }

    try {
      const response =
        await this.fetchRawQuote(
          request,
          providerSymbol
        );

      const finishedAt =
        nowIso();

      const quote:
        NormalisedMarketQuote =
          normaliseMarketQuote({
            quote: {
              ...response.quote,

              provider:
                this.providerId,

              receivedAt:
                response.quote
                  .receivedAt ||
                finishedAt,
            },

            provider:
              definition,

            symbol:
              providerSymbol,

            now:
              request.now ||
              new Date(),
          });

      if (
        !quote.isUsable
      ) {
        throw createAdapterError(
          this.providerId,
          "INVALID_RESPONSE",
          `${definition.name} returned an unusable quote for ${providerSymbol.canonical}.`,
          {
            statusCode:
              response.statusCode ||
              null,

            retryable:
              true,
          }
        );
      }

      const success:
        ProviderQuoteSuccess = {
        successful:
          true,

        provider:
          this.providerId,

        symbol:
          providerSymbol,

        rawQuote:
          response.quote,

        quote,

        requestResult:
          providerRequestResult({
            provider:
              this.providerId,

            startedAt,
            finishedAt,

            successful:
              true,

            symbolCount:
              1,

            successfulSymbolCount:
              1,

            failedSymbolCount:
              0,

            statusCode:
              response.statusCode ||
              null,
          }),
      };

      return success;
    } catch (
      rawError
    ) {
      const finishedAt =
        nowIso();

      const error =
        isMarketDataAdapterError(
          rawError
        )
          ? rawError
          : createAdapterError(
              this.providerId,
              "UNKNOWN",
              rawError instanceof Error
                ? rawError.message
                : `${definition.name} quote request failed.`,
              {
                rawError,
              }
            );

      return {
        successful:
          false,

        provider:
          this.providerId,

        symbol:
          providerSymbol,

        error,

        requestResult:
          providerRequestResult({
            provider:
              this.providerId,

            startedAt,
            finishedAt,

            successful:
              false,

            symbolCount:
              1,

            successfulSymbolCount:
              0,

            failedSymbolCount:
              1,

            statusCode:
              error.statusCode,

            error,
          }),
      };
    }
  }

  async quotes(
    request: ProviderBatchQuoteRequest
  ): Promise<ProviderBatchQuoteResult> {
    const startedAt =
      nowIso();

    const results:
      ProviderQuoteResult[] =
        [];

    const concurrency =
      6;

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
              this.quote({
                symbol,

                signal:
                  request.signal,

                environment:
                  request.environment,

                timeoutMs:
                  request.timeoutMs,

                now:
                  request.now,
              })
          )
        );

      results.push(
        ...groupResults
      );
    }

    const finishedAt =
      nowIso();

    const successfulCount =
      results.filter(
        (
          result
        ) =>
          result.successful
      ).length;

    const failedCount =
      results.length -
      successfulCount;

    return {
      provider:
        this.providerId,

      results,

      requestResult:
        providerRequestResult({
          provider:
            this.providerId,

          startedAt,
          finishedAt,

          successful:
            failedCount ===
            0,

          symbolCount:
            results.length,

          successfulSymbolCount:
            successfulCount,

          failedSymbolCount:
            failedCount,
        }),

      successful:
        successfulCount >
        0,

      partial:
        successfulCount >
          0 &&
        failedCount >
          0,

      successfulCount,
      failedCount,
    };
  }
}
