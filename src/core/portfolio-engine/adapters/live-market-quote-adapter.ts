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

const SUPPORTED_CURRENCIES:
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

function validPositiveNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
}

function canonicalCurrency(
  value: string | null,
  fallback: CurrencyCode,
): CurrencyCode {
  const currency =
    String(value ?? "")
      .trim()
      .toUpperCase();

  return (
    SUPPORTED_CURRENCIES as readonly string[]
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

function canonicalQuality(
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

  if (quote.isIndicative) {
    return "FALLBACK";
  }

  return "LIVE";
}

function providerRepresentsCache(
  quote: NormalisedMarketQuote,
): boolean {
  const provider =
    String(quote.provider ?? "")
      .trim()
      .toUpperCase();

  const source =
    String(quote.source ?? "")
      .trim()
      .toUpperCase();

  return (
    provider === "CACHE" ||
    source.includes("CACHE") ||
    source.includes("PERSISTED") ||
    source.includes("MEMORY")
  );
}

function providerRepresentsPreviousClose(
  quote: NormalisedMarketQuote,
): boolean {
  const source =
    String(quote.source ?? "")
      .trim()
      .toUpperCase();

  return (
    source.includes("PREVIOUS_CLOSE") ||
    source.includes("PREVIOUS CLOSE") ||
    source.includes("PREVIOUS-CLOSE") ||
    source.includes("END_OF_DAY") ||
    source.includes("END OF DAY") ||
    source === "EOD"
  );
}

function canonicalCurrentSource(
  quote: NormalisedMarketQuote,
): QuoteSource {
  if (providerRepresentsCache(quote)) {
    return "CACHE";
  }

  if (providerRepresentsPreviousClose(quote)) {
    return "PREVIOUS_CLOSE";
  }

  return "LIVE";
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
    Date.parse(quote.receivedAt);

  if (!Number.isFinite(receivedAt)) {
    return null;
  }

  return new Date(
    receivedAt +
    ttlSeconds * 1000,
  ).toISOString();
}

function quoteWarnings(
  quote: NormalisedMarketQuote,
): string | undefined {
  const warnings =
    Array.isArray(quote.warnings)
      ? quote.warnings
          .map((warning) =>
            String(warning ?? "").trim(),
          )
          .filter(Boolean)
      : [];

  return warnings.length > 0
    ? warnings.join("; ")
    : undefined;
}

function baseQuoteFields(
  holding: PortfolioHolding,
  quote: NormalisedMarketQuote,
) {
  return {
    securityId:
      holding.security.securityId,

    ticker:
      holding.security.ticker,

    quoteTicker:
      holding.security.quoteTicker,

    market:
      canonicalMarket(
        quote.exchange,
        holding.security.market,
      ),

    currency:
      canonicalCurrency(
        quote.currency,
        holding.currency,
      ),

    provider:
      String(
        quote.provider ??
        "UNKNOWN",
      ),

    receivedAt:
      quote.receivedAt,

    cacheExpiresAt:
      cacheExpiry(quote),
  };
}

function currentPriceQuote(
  holding: PortfolioHolding,
  quote: NormalisedMarketQuote,
): QuoteSnapshot | null {
  if (
    !quote.isUsable ||
    quote.isExpired ||
    !validPositiveNumber(quote.price)
  ) {
    return null;
  }

  return {
    ...baseQuoteFields(
      holding,
      quote,
    ),

    price:
      roundMoney(quote.price),

    previousClose:
      validPositiveNumber(
        quote.previousClose,
      )
        ? roundMoney(
            quote.previousClose,
          )
        : null,

    source:
      canonicalCurrentSource(
        quote,
      ),

    quality:
      canonicalQuality(
        quote,
      ),

    quotedAt:
      quote.quoteTimestamp ||
      null,

    error:
      quoteWarnings(quote),
  };
}

function previousCloseQuote(
  holding: PortfolioHolding,
  quote: NormalisedMarketQuote,
): QuoteSnapshot | null {
  if (
    !validPositiveNumber(
      quote.previousClose,
    )
  ) {
    return null;
  }

  return {
    ...baseQuoteFields(
      holding,
      quote,
    ),

    price:
      roundMoney(
        quote.previousClose,
      ),

    previousClose:
      roundMoney(
        quote.previousClose,
      ),

    source:
      "PREVIOUS_CLOSE",

    quality:
      quote.isExpired
        ? "STALE"
        : "FALLBACK",

    quotedAt:
      quote.quoteTimestamp ||
      null,

    error:
      [
        "Current provider price was unusable.",
        "The provider previous close was retained as the valuation price.",
        quoteWarnings(quote),
      ]
        .filter(Boolean)
        .join(" "),
  };
}

/**
 * Converts a provider quote into the strongest valid canonical price carried
 * by that provider response.
 *
 * A zero current price does not invalidate a valid previous close.
 */
export function normalisedMarketQuoteToPortfolioQuote(
  holding: PortfolioHolding,
  quote: NormalisedMarketQuote,
): QuoteSnapshot | null {
  return (
    currentPriceQuote(
      holding,
      quote,
    ) ??
    previousCloseQuote(
      holding,
      quote,
    )
  );
}

export function canonicalQuotePriority(
  quote: QuoteSnapshot,
): number {
  if (
    !validPositiveNumber(
      quote.price,
    )
  ) {
    return 0;
  }

  switch (quote.source) {
    case "LIVE":
      switch (quote.quality) {
        case "LIVE":
          return 600;

        case "DELAYED":
          return 560;

        case "STALE":
          return 470;

        case "FALLBACK":
          return 450;

        case "UNAVAILABLE":
          return 0;
      }

    case "CACHE":
      switch (quote.quality) {
        case "LIVE":
          return 540;

        case "DELAYED":
          return 520;

        case "STALE":
          return 460;

        case "FALLBACK":
          return 440;

        case "UNAVAILABLE":
          return 0;
      }

    case "PREVIOUS_CLOSE":
      return quote.quality === "STALE"
        ? 350
        : 400;

    case "TRANSACTION_FALLBACK":
      return 250;

    case "UNAVAILABLE":
      return 0;
  }
}

function quoteTimestampValue(
  quote: QuoteSnapshot,
): number {
  const quoted =
    quote.quotedAt
      ? Date.parse(quote.quotedAt)
      : Number.NaN;

  if (Number.isFinite(quoted)) {
    return quoted;
  }

  const received =
    Date.parse(quote.receivedAt);

  return Number.isFinite(received)
    ? received
    : 0;
}

/**
 * Selects the strongest quote. Timestamp is used only to break equivalent
 * quality ties.
 */
export function selectStrongestPortfolioQuote(
  quotes: readonly QuoteSnapshot[],
): QuoteSnapshot | null {
  const valid =
    quotes.filter(
      (quote) =>
        validPositiveNumber(
          quote.price,
        ) &&
        quote.source !== "UNAVAILABLE" &&
        quote.quality !== "UNAVAILABLE",
    );

  if (valid.length === 0) {
    return null;
  }

  return [...valid].sort(
    (left, right) => {
      const priorityDifference =
        canonicalQuotePriority(right) -
        canonicalQuotePriority(left);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        quoteTimestampValue(right) -
        quoteTimestampValue(left)
      );
    },
  )[0];
}

function lookupProviderQuote(
  holding: PortfolioHolding,
  quoteBySymbol:
    Readonly<
      Record<
        string,
        NormalisedMarketQuote | null
      >
    >,
): NormalisedMarketQuote | null {
  const candidates = [
    holding.security.quoteTicker,
    holding.security.ticker,
    holding.security.securityId,
  ]
    .map((value) =>
      String(value ?? "")
        .trim()
        .toUpperCase(),
    )
    .filter(Boolean);

  for (const candidate of candidates) {
    const quote =
      quoteBySymbol[candidate];

    if (quote) {
      return quote;
    }
  }

  return null;
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
    const providerQuote =
      lookupProviderQuote(
        holding,
        quoteBySymbol,
      );

    if (!providerQuote) {
      continue;
    }

    const adapted =
      normalisedMarketQuoteToPortfolioQuote(
        holding,
        providerQuote,
      );

    if (!adapted) {
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
  return Object.keys(quotes).length;
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
