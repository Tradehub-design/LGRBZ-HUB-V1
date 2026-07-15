import type {
  LiveQuoteApiEnvelope,
  LiveQuoteBatchFetchInput,
  LiveQuoteBatchFetchResult,
  LiveQuoteBatchResponse,
  LiveQuoteFetchInput,
  LiveQuoteFetchResult,
  LiveQuoteSingleResponse,
  LiveQuoteSymbolOptions,
} from "./liveQuoteClientTypes";
import type {
  MarketDataProviderId,
} from "../marketDataTypes";

function normaliseSymbol(
  value: string
): string {
  return value
    .trim()
    .toUpperCase();
}

function uniqueSymbols(
  values: string[]
): string[] {
  return Array.from(
    new Set(
      values
        .map(
          normaliseSymbol
        )
        .filter(
          Boolean
        )
    )
  );
}

function providerString(
  providers:
    MarketDataProviderId[] |
    undefined
): string | null {
  if (
    !providers ||
    providers.length ===
    0
  ) {
    return null;
  }

  return providers.join(
    ","
  );
}

function appendOptions(
  parameters: URLSearchParams,
  options:
    LiveQuoteSymbolOptions |
    undefined,
  forceRefresh:
    boolean
): void {
  if (
    options?.exchange
  ) {
    parameters.set(
      "exchange",
      options.exchange
    );
  }

  if (
    options?.currency
  ) {
    parameters.set(
      "currency",
      options.currency
    );
  }

  const providers =
    providerString(
      options?.providers
    );

  if (
    providers
  ) {
    parameters.set(
      "providers",
      providers
    );
  }

  parameters.set(
    "allowDelayed",
    String(
      options?.allowDelayed ??
      true
    )
  );

  parameters.set(
    "allowIndicative",
    String(
      options?.allowIndicative ??
      false
    )
  );

  parameters.set(
    "allowStale",
    String(
      options?.allowStale ??
      true
    )
  );

  parameters.set(
    "allowExpiredFallback",
    String(
      options?.allowExpiredFallback ??
      true
    )
  );

  parameters.set(
    "compareProviders",
    String(
      options?.compareProviders ??
      false
    )
  );

  parameters.set(
    "forceRefresh",
    String(
      forceRefresh
    )
  );

  parameters.set(
    "minimumQualityScore",
    String(
      options?.minimumQualityScore ??
      45
    )
  );

  parameters.set(
    "maximumProviderAttempts",
    String(
      options?.maximumProviderAttempts ??
      3
    )
  );

  parameters.set(
    "timeoutMs",
    String(
      options?.timeoutMs ??
      8_000
    )
  );
}

async function readEnvelope<T>(
  response: Response
): Promise<
  LiveQuoteApiEnvelope<T>
> {
  let payload:
    LiveQuoteApiEnvelope<T>;

  try {
    payload =
      await response.json() as
        LiveQuoteApiEnvelope<T>;
  } catch {
    throw new Error(
      `Market-data API returned invalid JSON with status ${response.status}.`
    );
  }

  if (
    !response.ok ||
    !payload.ok
  ) {
    throw new Error(
      payload.error?.message ||
      `Market-data API request failed with status ${response.status}.`
    );
  }

  return payload;
}

export async function fetchLiveMarketQuote({
  symbol,
  options,
  forceRefresh =
    false,
  signal,
}: LiveQuoteFetchInput): Promise<LiveQuoteFetchResult> {
  const canonical =
    normaliseSymbol(
      symbol
    );

  if (
    !canonical
  ) {
    return {
      symbol:
        canonical,

      quote:
        null,

      successful:
        false,

      errorCode:
        "SYMBOL_REQUIRED",

      errorMessage:
        "A market symbol is required.",

      warnings:
        [],
    };
  }

  const parameters =
    new URLSearchParams();

  parameters.set(
    "symbol",
    canonical
  );

  appendOptions(
    parameters,
    options,
    forceRefresh
  );

  try {
    const response =
      await fetch(
        `/api/market-data/quote?${parameters.toString()}`,
        {
          method:
            "GET",

          signal,

          cache:
            "no-store",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

    const envelope =
      await readEnvelope<LiveQuoteSingleResponse>(
        response
      );

    const data =
      envelope.data;

    if (
      !data ||
      !data.successful ||
      !data.quote
    ) {
      return {
        symbol:
          canonical,

        quote:
          null,

        successful:
          false,

        errorCode:
          "QUOTE_UNAVAILABLE",

        errorMessage:
          `No usable quote was returned for ${canonical}.`,

        warnings:
          data?.warnings ||
          [],
      };
    }

    return {
      symbol:
        canonical,

      quote:
        data.quote,

      successful:
        true,

      errorCode:
        null,

      errorMessage:
        null,

      warnings:
        data.warnings ||
        [],
    };
  } catch (
    error
  ) {
    if (
      error instanceof DOMException &&
      error.name ===
      "AbortError"
    ) {
      return {
        symbol:
          canonical,

        quote:
          null,

        successful:
          false,

        errorCode:
          "REQUEST_ABORTED",

        errorMessage:
          "The quote request was cancelled.",

        warnings:
          [],
      };
    }

    return {
      symbol:
        canonical,

      quote:
        null,

      successful:
        false,

      errorCode:
        "QUOTE_REQUEST_FAILED",

      errorMessage:
        error instanceof Error
          ? error.message
          : "Unknown quote request failure.",

      warnings:
        [],
    };
  }
}

export async function fetchLiveMarketQuotes({
  symbols,
  options,
  forceRefresh =
    false,
  concurrency =
    6,
  signal,
}: LiveQuoteBatchFetchInput): Promise<LiveQuoteBatchFetchResult> {
  const canonicalSymbols =
    uniqueSymbols(
      symbols
    );

  if (
    canonicalSymbols.length ===
    0
  ) {
    return {
      results:
        [],

      successfulSymbols:
        [],

      failedSymbols:
        [],

      successfulCount:
        0,

      failedCount:
        0,

      partial:
        false,
    };
  }

  try {
    const response =
      await fetch(
        "/api/market-data/quotes",
        {
          method:
            "POST",

          signal,

          cache:
            "no-store",

          headers: {
            Accept:
              "application/json",

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              symbols:
                canonicalSymbols,

              exchange:
                options?.exchange ||
                "UNKNOWN",

              currency:
                options?.currency ||
                null,

              providerPreference:
                options?.providers ||
                [],

              allowDelayed:
                options?.allowDelayed ??
                true,

              allowIndicative:
                options?.allowIndicative ??
                false,

              allowStale:
                options?.allowStale ??
                true,

              allowExpiredFallback:
                options?.allowExpiredFallback ??
                true,

              forceRefresh,

              compareProviders:
                options?.compareProviders ??
                false,

              minimumQualityScore:
                options?.minimumQualityScore ??
                45,

              maximumProviderAttempts:
                options?.maximumProviderAttempts ??
                3,

              timeoutMs:
                options?.timeoutMs ??
                8_000,

              concurrency:
                Math.max(
                  1,
                  Math.min(
                    20,
                    concurrency
                  )
                ),
            }),
        }
      );

    const envelope =
      await readEnvelope<LiveQuoteBatchResponse>(
        response
      );

    const data =
      envelope.data;

    if (
      !data
    ) {
      throw new Error(
        "Batch quote API did not return data."
      );
    }

    const resultBySymbol =
      new Map(
        data.results.map(
          (
            result
          ) => [
            normaliseSymbol(
              result.symbol.canonical
            ),
            result,
          ]
        )
      );

    const results =
      canonicalSymbols.map(
        (
          symbol
        ): LiveQuoteFetchResult => {
          const result =
            resultBySymbol.get(
              symbol
            );

          if (
            !result ||
            !result.successful ||
            !result.quote
          ) {
            return {
              symbol,

              quote:
                null,

              successful:
                false,

              errorCode:
                "QUOTE_UNAVAILABLE",

              errorMessage:
                `No usable quote was returned for ${symbol}.`,

              warnings:
                result?.warnings ||
                [],
            };
          }

          return {
            symbol,

            quote:
              result.quote,

            successful:
              true,

            errorCode:
              null,

            errorMessage:
              null,

            warnings:
              result.warnings ||
              [],
          };
        }
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
        );

    return {
      results,

      successfulSymbols,
      failedSymbols,

      successfulCount:
        successfulSymbols.length,

      failedCount:
        failedSymbols.length,

      partial:
        successfulSymbols.length >
          0 &&
        failedSymbols.length >
          0,
    };
  } catch (
    error
  ) {
    const aborted =
      error instanceof DOMException &&
      error.name ===
      "AbortError";

    const message =
      aborted
        ? "The quote request was cancelled."
        : error instanceof Error
          ? error.message
          : "Unknown batch quote request failure.";

    const errorCode =
      aborted
        ? "REQUEST_ABORTED"
        : "BATCH_QUOTE_REQUEST_FAILED";

    return {
      results:
        canonicalSymbols.map(
          (
            symbol
          ) => ({
            symbol,

            quote:
              null,

            successful:
              false,

            errorCode,

            errorMessage:
              message,

            warnings:
              [],
          })
        ),

      successfulSymbols:
        [],

      failedSymbols:
        canonicalSymbols,

      successfulCount:
        0,

      failedCount:
        canonicalSymbols.length,

      partial:
        false,
    };
  }
}
