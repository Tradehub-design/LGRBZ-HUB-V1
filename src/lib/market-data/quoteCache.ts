import type {
  MarketQuote,
  QuoteCacheEntry,
} from "./marketDataTypes";
import {
  createMarketSymbolKey,
} from "./symbolNormaliser";

const quoteCache =
  new Map<
    string,
    QuoteCacheEntry
  >();

const DEFAULT_CACHE_MS =
  60_000;

const FALLBACK_MAX_AGE_MS =
  72 *
  60 *
  60 *
  1000;

export function cacheQuote(
  quote: MarketQuote,
  ttlMs =
    DEFAULT_CACHE_MS
) {
  if (
    !quote.isValid ||
    quote.price ===
      null
  ) {
    return;
  }

  const key =
    createMarketSymbolKey(
      quote.symbol
    );

  const now =
    Date.now();

  quoteCache.set(
    key,
    {
      quote,
      storedAt:
        now,
      expiresAt:
        now +
        ttlMs,
    }
  );
}

export function cacheQuotes(
  quotes: MarketQuote[],
  ttlMs =
    DEFAULT_CACHE_MS
) {
  for (
    const quote of
    quotes
  ) {
    cacheQuote(
      quote,
      ttlMs
    );
  }
}

export function getFreshCachedQuote(
  symbol: string
) {
  const entry =
    quoteCache.get(
      createMarketSymbolKey(
        symbol
      )
    );

  if (
    !entry ||
    Date.now() >
      entry.expiresAt
  ) {
    return null;
  }

  return {
    ...entry.quote,
    provider:
      "cache" as const,
    isFallback:
      false,
  };
}

export function getFallbackCachedQuote(
  symbol: string
) {
  const entry =
    quoteCache.get(
      createMarketSymbolKey(
        symbol
      )
    );

  if (!entry) {
    return null;
  }

  const age =
    Date.now() -
    entry.storedAt;

  if (
    age >
    FALLBACK_MAX_AGE_MS
  ) {
    return null;
  }

  return {
    ...entry.quote,
    provider:
      "cache" as const,
    freshness:
      "STALE" as const,
    confidence:
      "LOW" as const,
    isFallback:
      true,
    error:
      "Latest provider refresh failed. Showing the previous valid quote.",
  };
}

export function clearQuoteCache() {
  quoteCache.clear();
}

export function quoteCacheSize() {
  return quoteCache.size;
}
