import type {
  MarketDataExchange,
  MarketDataProviderId,
  MarketQuote,
  NormalisedMarketSymbol,
} from "../marketDataTypes";
import {
  evaluateQuoteFreshness,
  isQuoteUsable,
} from "../quoteFreshness";



function stableMarketDataExchange(
  value: unknown
): MarketDataExchange {
  const exchange =
    String(
      value ||
      "UNKNOWN"
    )
      .trim()
      .toUpperCase()
      .replace(
        "NYSEARCA",
        "NYSE_ARCA"
      );

  return exchange as
    MarketDataExchange;
}

function stableQuoteConfidence(
  value: unknown
): QuoteConfidence {
  const confidence =
    String(
      value ||
      "NONE"
    )
      .trim()
      .toUpperCase();

  return confidence as
    QuoteConfidence;
}

function stableProviderId(
  value: unknown
): MarketDataProviderId {
  const provider =
    String(
      value ||
      "UNAVAILABLE"
    )
      .trim()
      .replace(
        /-/g,
        "_"
      )
      .toUpperCase();

  return provider as
    MarketDataProviderId;
}

export function safeNumber(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number =
    typeof value ===
    "number"
      ? value
      : Number(
          String(value)
            .replace(
              /,/g,
              ""
            )
            .trim()
        );

  return Number.isFinite(
    number
  )
    ? number
    : null;
}

export function safeDate(
  value: unknown
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value ===
      "number" &&
    Number.isFinite(value)
  ) {
    const milliseconds =
      value < 10_000_000_000
        ? value * 1000
        : value;

    const date =
      new Date(
        milliseconds
      );

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date.toISOString();
  }

  const date =
    new Date(
      String(value)
    );

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date.toISOString();
}

export function calculateChange(
  price: number | null,
  previousClose: number | null
) {
  if (
    !isQuoteUsable(
      price
    ) ||
    !isQuoteUsable(
      previousClose
    )
  ) {
    return {
      change:
        null,
      changePercent:
        null,
    };
  }

  const change =
    price -
    previousClose;

  return {
    change,
    changePercent:
      previousClose !== 0
        ? (
            change /
            previousClose
          ) *
          100
        : null,
  };
}

type CreateQuoteInput = {
  symbol: NormalisedMarketSymbol;
  provider: MarketDataProviderId;
  price: number | null;
  previousClose?: number | null;
  open?: number | null;
  dayHigh?: number | null;
  dayLow?: number | null;
  volume?: number | null;
  change?: number | null;
  changePercent?: number | null;
  quotedAt?: string | null;
  currency?: string | null;
  providerDelayMinutes?: number | null;
  error?: string | null;
};

export function createProviderQuote({
  symbol,
  provider,
  price,
  previousClose =
    null,
  open = null,
  dayHigh = null,
  dayLow = null,
  volume = null,
  change,
  changePercent,
  quotedAt = null,
  currency,
  providerDelayMinutes =
    null,
  error = null,
}: CreateQuoteInput): MarketQuote {
  const receivedAt =
    new Date().toISOString();

  const calculated =
    calculateChange(
      price,
      previousClose
    );

  const freshness =
    evaluateQuoteFreshness({
      quotedAt,
      receivedAt,
      exchange:
        stableMarketDataExchange(symbol.exchange),
      provider,
      providerDelayMinutes,
    });

  const valid =
    isQuoteUsable(
      price
    );

  return {
    symbol:
      symbol.canonicalSymbol,
    providerSymbol:
      symbol.providerSymbol,
    displaySymbol:
      symbol.displaySymbol,
    exchange:
      stableMarketDataExchange(symbol.exchange),
    currency:
      (
        currency ||
        symbol.currency
      ).toUpperCase(),

    price:
      valid
        ? price
        : null,
    previousClose,
    open,
    dayHigh,
    dayLow,
    volume,

    change:
      change ??
      calculated.change,
    changePercent:
      changePercent ??
      calculated.changePercent,

    quotedAt,
    receivedAt,
    provider,

    freshness:
      valid
        ? freshness.freshness
        : "UNAVAILABLE",
    confidence:
      valid
        ? freshness.confidence
        : stableQuoteConfidence("NONE"),
    delayMinutes:
      freshness.delayMinutes,
    staleAfterMinutes:
      freshness.staleAfterMinutes,

    isValid:
      valid,
    isFallback:
      false,
    error:
      valid
        ? error
        : error ??
          "Provider did not return a valid positive price.",
  };
}

export function createUnavailableQuote(
  symbol: NormalisedMarketSymbol,
  error: string
): MarketQuote {
  return createProviderQuote({
    symbol,
    provider:
      stableProviderId("UNAVAILABLE"),
    price:
      null,
    quotedAt:
      null,
    error,
  });
}

export function exchangeFromText(
  value: unknown,
  fallback: MarketDataExchange
): MarketDataExchange {
  const text =
    String(
      value ??
      ""
    )
      .trim()
      .toUpperCase();

  if (
    text.includes("ASX") ||
    text.includes("AUSTRALIA")
  ) {
    return "ASX";
  }

  if (
    text.includes("NASDAQ")
  ) {
    return "NASDAQ";
  }

  if (
    text.includes("NYSE")
  ) {
    return "NYSE";
  }

  if (
    text.includes("LONDON") ||
    text === "LSE"
  ) {
    return "LSE";
  }

  return fallback;
}
