import {
  resolveMarketQuotes,
} from "@/lib/market-data/multiProviderQuoteResolver";
import {
  marketDataApiError,
  marketDataApiSuccess,
  parseBoolean,
  parseExchange,
  parseNumber,
  parseProviderList,
  parseSymbols,
  safeJsonBody,
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

  const symbols =
    parseSymbols(
      url.searchParams.get(
        "symbols"
      )
    );

  if (
    symbols.length ===
    0
  ) {
    return marketDataApiError(
      "SYMBOLS_REQUIRED",
      "At least one symbol is required.",
      400
    );
  }

  if (
    symbols.length >
    250
  ) {
    return marketDataApiError(
      "TOO_MANY_SYMBOLS",
      "A maximum of 250 symbols is supported per request.",
      400
    );
  }

  const result =
    await resolveMarketQuotes({
      symbols,

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

      concurrency:
        parseNumber(
          url.searchParams.get(
            "concurrency"
          ),
          6,
          1,
          20
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

  return marketDataApiSuccess(
    result
  );
}

export async function POST(
  request:
    Request
) {
  const body =
    await safeJsonBody(
      request
    );

  const symbols =
    parseSymbols(
      body.symbols as
        string[] |
        string |
        undefined
    );

  if (
    symbols.length ===
    0
  ) {
    return marketDataApiError(
      "SYMBOLS_REQUIRED",
      "At least one symbol is required.",
      400
    );
  }

  if (
    symbols.length >
    250
  ) {
    return marketDataApiError(
      "TOO_MANY_SYMBOLS",
      "A maximum of 250 symbols is supported per request.",
      400
    );
  }

  const result =
    await resolveMarketQuotes({
      symbols,

      exchange:
        parseExchange(
          String(
            body.exchange ||
            "UNKNOWN"
          )
        ),

      currency:
        typeof body.currency ===
        "string"
          ? body.currency
          : null,

      providerPreference:
        parseProviderList(
          body.providerPreference as
            string[] |
            string |
            undefined
        ),

      excludedProviders:
        parseProviderList(
          body.excludedProviders as
            string[] |
            string |
            undefined
        ),

      allowDelayed:
        body.allowDelayed ===
        undefined
          ? true
          : Boolean(
              body.allowDelayed
            ),

      allowIndicative:
        Boolean(
          body.allowIndicative
        ),

      allowStale:
        body.allowStale ===
        undefined
          ? true
          : Boolean(
              body.allowStale
            ),

      allowExpiredFallback:
        body.allowExpiredFallback ===
        undefined
          ? true
          : Boolean(
              body.allowExpiredFallback
            ),

      forceRefresh:
        Boolean(
          body.forceRefresh
        ),

      compareProviders:
        Boolean(
          body.compareProviders
        ),

      minimumQualityScore:
        Math.max(
          0,
          Math.min(
            100,
            Number(
              body.minimumQualityScore ||
              45
            )
          )
        ),

      maximumProviderAttempts:
        Math.max(
          1,
          Math.min(
            10,
            Number(
              body.maximumProviderAttempts ||
              3
            )
          )
        ),

      concurrency:
        Math.max(
          1,
          Math.min(
            20,
            Number(
              body.concurrency ||
              6
            )
          )
        ),

      timeoutMs:
        Math.max(
          1_000,
          Math.min(
            30_000,
            Number(
              body.timeoutMs ||
              8_000
            )
          )
        ),
    });

  return marketDataApiSuccess(
    result
  );
}
