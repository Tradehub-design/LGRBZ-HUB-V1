import type {
  CurrencyCode,
  MarketCode,
  PortfolioHolding,
  QuoteQuality,
  QuoteSnapshot,
  QuoteSource,
} from "../contracts";

import type {
  MarketDataExchange,
  NormalisedMarketQuote,
  QuoteFreshness,
} from "@/lib/market-data/marketDataTypes";

import {
  roundMoney,
} from "../money";

function canonicalCurrency(
  value: string | null,
  fallback: CurrencyCode,
): CurrencyCode {
  const currency =
    String(value ?? "")
      .trim()
      .toUpperCase();

  const supported:
    readonly CurrencyCode[] = [
      "AUD",
      "USD",
      "NZD",
      "GBP",
      "EUR",
      "CAD",
      "JPY",
      "HKD",
      "SGD",
      "CHF",
      "CNY",
    ];

  return (
    supported as readonly string[]
  ).includes(currency)
    ? currency as CurrencyCode
    : fallback;
}

function canonicalMarket(
  exchange: MarketDataExchange,
  fallback: MarketCode,
): MarketCode {
  switch (exchange) {
    case "ASX":
      return "ASX";

    case "NASDAQ":
    case "NYSE":
    case "NYSE_ARCA":
    case "AMEX":
    case "OTC":
      return "US";

    default:
      return fallback;
  }
}

function quoteQuality(
  quote: NormalisedMarketQuote,
): QuoteQuality {
  if (
    quote.isExpired ||
    quote.freshness === "EXPIRED"
  ) {
    return "UNAVAILABLE";
  }

  if (
    quote.isStale ||
    quote.freshness === "STALE"
  ) {
    return "STALE";
  }

  if (
    quote.isDelayed ||
    quote.freshness === "DELAYED"
  ) {
    return "DELAYED";
  }

  if (
    quote.isIndicative
  ) {
    return "FALLBACK";
  }

  return "LIVE";
}

function quoteSource(
  quote: NormalisedMarketQuote,
): QuoteSource {
  const provider =
    String(
      quote.provider ?? "",
    )
      .trim()
      .toUpperCase();

  const source =
    String(
      quote.source ?? "",
    )
      .trim()
      .toUpperCase();

  if (
    provider === "CACHE" ||
    source.includes("CACHE")
  ) {
    return "CACHE";
  }

  if (
    source.includes("PREVIOUS_CLOSE") ||
    source.includes("PREVIOUS CLOSE") ||
    source.includes("EOD")
  ) {
    return "PREVIOUS_CLOSE";
  }

  if (
    quote.isExpired ||
    !quote.isUsable ||
    quote.price <= 0
  ) {
    return "UNAVAILABLE";
  }

  return "LIVE";
}

function usablePrice(
  quote: NormalisedMarketQuote,
): number {
  if (
    !quote.isUsable ||
    quote.isExpired ||
    !Number.isFinite(quote.price) ||
    quote.price <= 0
  ) {
    return 0;
  }

  return roundMoney(
    quote.price,
  );
}

function usablePreviousClose(
  quote: NormalisedMarketQuote,
): number | null {
  if (
    quote.previousClose === null ||
    !Number.isFinite(
      quote.previousClose,
    ) ||
    quote.previousClose <= 0
  ) {
    return null;
  }

  return roundMoney(
    quote.previousClose,
  );
}

function cacheExpiry(
  quote: NormalisedMarketQuote,
): string | null {
  const ttlSeconds =
    quote.adaptiveCacheTtlSeconds;

  if (
    ttlSeconds === null ||
    ttlSeconds === undefined ||
    !Number.isFinite(ttlSeconds) ||
    ttlSeconds <= 0
  ) {
    return null;
  }

  const receivedAt =
    Date.parse(
      quote.receivedAt,
    );

  if (!Number.isFinite(receivedAt)) {
    return null;
  }

  return new Date(
    receivedAt +
    ttlSeconds * 1000,
  ).toISOString();
}

export function normalisedMarketQuoteToPortfolioQuote(
  holding: PortfolioHolding,
  quote: NormalisedMarketQuote,
): QuoteSnapshot {
  const resolvedSource =
    quoteSource(quote);

  const resolvedPrice =
    usablePrice(quote);

  const market =
    canonicalMarket(
      quote.exchange,
      holding.security.market,
    );

  const currency =
    canonicalCurrency(
      quote.currency,
      holding.currency,
    );

  return {
    securityId:
      holding.security.securityId,

    ticker:
      holding.security.ticker,

    quoteTicker:
      holding.security.quoteTicker,

    market,

    currency,

    price:
      resolvedPrice,

    previousClose:
      usablePreviousClose(quote),

    source:
      resolvedSource,

    quality:
      quoteQuality(quote),

    provider:
      String(
        quote.provider ??
        "UNKNOWN",
      ),

    quotedAt:
      quote.quoteTimestamp ||
      null,

    receivedAt:
      quote.receivedAt,

    cacheExpiresAt:
      cacheExpiry(quote),

    error:
      resolvedSource === "UNAVAILABLE"
        ? quote.warnings.join("; ") ||
          `No usable market quote was returned for ${holding.security.ticker}.`
        : undefined,
  };
}

export function createPortfolioQuoteRecord(
  holdings: readonly PortfolioHolding[],
  quoteBySymbol:
    Readonly<
      Record<
        string,
        NormalisedMarketQuote | null
      >
    >,
): Record<string, QuoteSnapshot> {
  const result:
    Record<string, QuoteSnapshot> = {};

  for (const holding of holdings) {
    const quoteTicker =
      holding.security.quoteTicker
        .trim()
        .toUpperCase();

    const displayTicker =
      holding.security.ticker
        .trim()
        .toUpperCase();

    const quote =
      quoteBySymbol[
        quoteTicker
      ] ??
      quoteBySymbol[
        displayTicker
      ] ??
      null;

    if (!quote) {
      continue;
    }

    const adapted =
      normalisedMarketQuoteToPortfolioQuote(
        holding,
        quote,
      );

    /**
     * Unusable provider responses are not passed into the Portfolio Engine as
     * valid zero quotes. Omitting them allows the engine to continue down its
     * safe fallback chain.
     */
    if (
      adapted.source === "UNAVAILABLE" ||
      adapted.price <= 0
    ) {
      continue;
    }

    result[
      holding.security.securityId
    ] = adapted;
  }

  return result;
}

export function quoteRecordCount(
  quotes:
    Readonly<
      Record<string, QuoteSnapshot>
    >,
): number {
  return Object.keys(
    quotes,
  ).length;
}

export function quoteFreshnessRank(
  freshness: QuoteFreshness,
): number {
  switch (freshness) {
    case "FRESH":
      return 6;

    case "ACCEPTABLE":
      return 5;

    case "DELAYED":
      return 4;

    case "STALE":
      return 3;

    case "EXPIRED":
      return 2;

    case "UNKNOWN":
      return 1;
  }
}
