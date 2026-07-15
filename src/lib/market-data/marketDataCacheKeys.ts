import type {
  MarketDataCacheKeyInput,
} from "./marketDataCacheTypes";

function normalisePart(
  value:
    string |
    null |
    undefined
): string {
  return String(
    value ||
    ""
  )
    .trim()
    .toUpperCase()
    .replace(
      /[^A-Z0-9:_-]+/g,
      "_"
    )
    .replace(
      /_+/g,
      "_"
    )
    .replace(
      /^_+|_+$/g,
      ""
    );
}

export function normaliseCacheSymbol(
  symbol: string
): string {
  return normalisePart(
    symbol
  );
}

export function createMarketDataCacheKey({
  namespace = "QUOTE",
  symbol,
  provider,
  currency,
  exchange,
  variant,
}: MarketDataCacheKeyInput): string {
  const parts = [
    normalisePart(
      namespace
    ) ||
      "QUOTE",

    normaliseCacheSymbol(
      symbol
    ),

    provider
      ? normalisePart(
          provider
        )
      : "ANY",

    currency
      ? normalisePart(
          currency
        )
      : null,

    exchange
      ? normalisePart(
          exchange
        )
      : null,

    variant
      ? normalisePart(
          variant
        )
      : null,
  ].filter(
    (
      value
    ): value is string =>
      Boolean(
        value
      )
  );

  return parts.join(
    "::"
  );
}

export function createProviderQuoteCacheKey(
  symbol: string,
  provider: NonNullable<
    MarketDataCacheKeyInput[
      "provider"
    ]
  >,
  variant?: string | null
): string {
  return createMarketDataCacheKey({
    namespace:
      "QUOTE",

    symbol,

    provider,

    variant,
  });
}

export function createAnyProviderQuoteCacheKey(
  symbol: string,
  variant?: string | null
): string {
  return createMarketDataCacheKey({
    namespace:
      "QUOTE",

    symbol,

    provider:
      null,

    variant,
  });
}

export function createNegativeQuoteCacheKey(
  symbol: string,
  provider: NonNullable<
    MarketDataCacheKeyInput[
      "provider"
    ]
  >
): string {
  return createMarketDataCacheKey({
    namespace:
      "NEGATIVE_QUOTE",

    symbol,

    provider,
  });
}

export function cacheKeyMatchesSymbol(
  key: string,
  symbol: string
): boolean {
  const normalisedSymbol =
    normaliseCacheSymbol(
      symbol
    );

  return key
    .split(
      "::"
    )
    .includes(
      normalisedSymbol
    );
}

export function cacheKeyMatchesProvider(
  key: string,
  provider: string
): boolean {
  const normalisedProvider =
    normalisePart(
      provider
    );

  return key
    .split(
      "::"
    )
    .includes(
      normalisedProvider
    );
}
