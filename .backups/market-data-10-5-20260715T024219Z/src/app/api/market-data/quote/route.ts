import {
  resolveMarketQuote,
} from "@/lib/market-data/multiProviderQuoteResolver";
import {
  marketDataApiError,
  marketDataApiSuccess,
  parseBoolean,
  parseExchange,
  parseNumber,
  parseProviderList,
} from "@/lib/market-data/marketDataApiUtils";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export async function GET(
  request:
    Request
) {
  const url =
    new URL(
      request.url
    );

  const symbol =
    url.searchParams
      .get(
        "symbol"
      )
      ?.trim()
      .toUpperCase();

  if (
    !symbol
  ) {
    return marketDataApiError(
      "SYMBOL_REQUIRED",
      "A symbol query parameter is required.",
      400
    );
  }

  const result =
    await resolveMarketQuote({
      symbol,

      exchange:
        parseExchange(
          url.searchParams.get(
            "exchange"
          )
        ),

      currency:
        url.searchParams.get(
          "currency"
        ),

      providerPreference:
        parseProviderList(
          url.searchParams.get(
            "providers"
          )
        ),

      excludedProviders:
        parseProviderList(
          url.searchParams.get(
            "excludeProviders"
          )
        ),

      allowDelayed:
        parseBoolean(
          url.searchParams.get(
            "allowDelayed"
          ),
          true
        ),

      allowIndicative:
        parseBoolean(
          url.searchParams.get(
            "allowIndicative"
          ),
          false
        ),

      allowStale:
        parseBoolean(
          url.searchParams.get(
            "allowStale"
          ),
          true
        ),

      allowExpiredFallback:
        parseBoolean(
          url.searchParams.get(
            "allowExpiredFallback"
          ),
          true
        ),

      forceRefresh:
        parseBoolean(
          url.searchParams.get(
            "forceRefresh"
          ),
          false
        ),

      compareProviders:
        parseBoolean(
          url.searchParams.get(
            "compareProviders"
          ),
          false
        ),

      minimumQualityScore:
        parseNumber(
          url.searchParams.get(
            "minimumQualityScore"
          ),
          45,
          0,
          100
        ),

      maximumProviderAttempts:
        parseNumber(
          url.searchParams.get(
            "maximumProviderAttempts"
          ),
          3,
          1,
          10
        ),

      timeoutMs:
        parseNumber(
          url.searchParams.get(
            "timeoutMs"
          ),
          8_000,
          1_000,
          30_000
        ),
    });

  if (
    !result.successful ||
    !result.quote
  ) {
    return marketDataApiError(
      "QUOTE_UNAVAILABLE",
      `No usable quote was available for ${symbol}.`,
      503,
      {
        attempts:
          result.attempts,

        warnings:
          result.warnings,

        errors:
          result.errors,
      }
    );
  }

  return marketDataApiSuccess(
    result,
    {
      cacheControl:
        result.quote
          .adaptiveCacheTtlSeconds
          ? `private, max-age=${result.quote.adaptiveCacheTtlSeconds}, stale-while-revalidate=${result.quote.adaptiveStaleWhileRevalidateSeconds || 0}`
          : "private, max-age=60, stale-while-revalidate=300",
    }
  );
}
