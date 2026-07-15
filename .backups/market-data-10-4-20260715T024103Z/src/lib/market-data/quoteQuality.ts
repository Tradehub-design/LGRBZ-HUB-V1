import type {
  MarketDataExchange,
  MarketDataLatencyClass,
  MarketDataProviderDefinition,
  NormalisedMarketQuote,
  QuoteFreshness,
  QuoteQualityGrade,
  QuoteQualityInput,
  QuoteQualityThresholds,
  QuoteTradingStatus,
  RawMarketQuote,
} from "./marketDataTypes";

const DEFAULT_THRESHOLDS:
  QuoteQualityThresholds = {
    freshSeconds: 120,
    acceptableSeconds: 300,
    delayedSeconds: 900,
    staleSeconds: 3_600,
    expiredSeconds: 86_400,
  };

function clamp(
  value: number,
  minimum = 0,
  maximum = 100
): number {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
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

function finiteNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function nullableFiniteNumber(
  value: unknown
): number | null {
  return finiteNumber(value)
    ? value
    : null;
}

function normaliseDate(
  value: string | number | Date | null | undefined,
  fallback: Date
): Date {
  if (
    value instanceof Date &&
    !Number.isNaN(value.getTime())
  ) {
    return value;
  }

  if (
    typeof value === "number"
  ) {
    const milliseconds =
      value < 10_000_000_000
        ? value * 1_000
        : value;

    const date =
      new Date(milliseconds);

    if (
      !Number.isNaN(date.getTime())
    ) {
      return date;
    }
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const numeric =
      Number(value);

    if (
      Number.isFinite(numeric) &&
      /^\d+$/.test(value.trim())
    ) {
      return normaliseDate(
        numeric,
        fallback
      );
    }

    const date =
      new Date(value);

    if (
      !Number.isNaN(date.getTime())
    ) {
      return date;
    }
  }

  return fallback;
}

function exchangeFromString(
  value: string | null | undefined
): MarketDataExchange {
  const normalized =
    String(value || "")
      .trim()
      .toUpperCase()
      .replace(/[\s.-]+/g, "_");

  const map:
    Record<string, MarketDataExchange> = {
      ASX: "ASX",
      AUSTRALIAN_SECURITIES_EXCHANGE: "ASX",

      NASDAQ: "NASDAQ",
      NMS: "NASDAQ",
      NGM: "NASDAQ",

      NYSE: "NYSE",
      NEW_YORK_STOCK_EXCHANGE: "NYSE",

      NYSE_ARCA: "NYSE_ARCA",
      ARCA: "NYSE_ARCA",

      AMEX: "AMEX",
      NYSE_AMERICAN: "AMEX",

      TSX: "TSX",
      TORONTO: "TSX",

      LSE: "LSE",
      LONDON: "LSE",

      NZX: "NZX",

      HKEX: "HKEX",
      HONG_KONG: "HKEX",

      TSE: "TSE",
      TOKYO: "TSE",

      CRYPTO: "CRYPTO",
      FOREX: "FOREX",
      FX: "FOREX",
      OTC: "OTC",
    };

  return map[
    normalized
  ] || "UNKNOWN";
}

function calculateChange(
  price: number,
  previousClose: number | null,
  suppliedChange: number | null
): number | null {
  if (
    suppliedChange !== null
  ) {
    return suppliedChange;
  }

  if (
    previousClose === null
  ) {
    return null;
  }

  return round(
    price -
    previousClose
  );
}

function calculateChangePercent(
  price: number,
  previousClose: number | null,
  suppliedPercent: number | null
): number | null {
  if (
    suppliedPercent !== null
  ) {
    return suppliedPercent;
  }

  if (
    previousClose === null ||
    previousClose === 0
  ) {
    return null;
  }

  return round(
    (
      (
        price -
        previousClose
      ) /
      previousClose
    ) *
    100
  );
}

export function quoteAgeSeconds(
  timestamp: Date,
  now = new Date()
): number {
  return Math.max(
    0,
    Math.floor(
      (
        now.getTime() -
        timestamp.getTime()
      ) /
      1_000
    )
  );
}

export function classifyQuoteFreshness(
  ageSeconds: number,
  thresholds:
    QuoteQualityThresholds =
      DEFAULT_THRESHOLDS
): QuoteFreshness {
  if (
    !Number.isFinite(ageSeconds) ||
    ageSeconds < 0
  ) {
    return "UNKNOWN";
  }

  if (
    ageSeconds <= thresholds.freshSeconds
  ) {
    return "FRESH";
  }

  if (
    ageSeconds <= thresholds.acceptableSeconds
  ) {
    return "ACCEPTABLE";
  }

  if (
    ageSeconds <= thresholds.delayedSeconds
  ) {
    return "DELAYED";
  }

  if (
    ageSeconds <= thresholds.expiredSeconds
  ) {
    return "STALE";
  }

  return "EXPIRED";
}

function latencyClass(
  quote: RawMarketQuote,
  provider: MarketDataProviderDefinition
): MarketDataLatencyClass {
  if (
    quote.isIndicative
  ) {
    return "INDICATIVE";
  }

  if (
    quote.isDelayed
  ) {
    return "DELAYED";
  }

  if (
    quote.latencyClass
  ) {
    return quote.latencyClass;
  }

  const quoteCapability =
    provider.capabilities.find(
      (
        capability
      ) =>
        capability.capability === "QUOTE" &&
        capability.supported
    );

  return (
    quoteCapability?.latencyClass ||
    "UNKNOWN"
  );
}

function tradingStatus(
  value: QuoteTradingStatus | null | undefined
): QuoteTradingStatus {
  return value || "UNKNOWN";
}

function freshnessScore(
  freshness: QuoteFreshness
): number {
  const scores:
    Record<QuoteFreshness, number> = {
      FRESH: 100,
      ACCEPTABLE: 85,
      DELAYED: 65,
      STALE: 35,
      EXPIRED: 0,
      UNKNOWN: 20,
    };

  return scores[freshness];
}

function latencyScore(
  value: MarketDataLatencyClass
): number {
  const scores:
    Record<MarketDataLatencyClass, number> = {
      REAL_TIME: 100,
      DELAYED: 75,
      END_OF_DAY: 55,
      INDICATIVE: 40,
      UNKNOWN: 35,
    };

  return scores[value];
}

function completenessScore(
  quote: RawMarketQuote
): number {
  const fields = [
    quote.price,
    quote.previousClose,
    quote.open,
    quote.high,
    quote.low,
    quote.change,
    quote.changePercent,
    quote.volume,
    quote.currency,
    quote.exchange,
    quote.timestamp,
  ];

  const present =
    fields.filter(
      (
        value
      ) =>
        value !== null &&
        value !== undefined &&
        value !== ""
    ).length;

  return (
    present /
    fields.length
  ) *
  100;
}

function consistencyScore(
  quote: RawMarketQuote,
  price: number,
  previousClose: number | null
): number {
  let score = 100;

  if (
    price <= 0
  ) {
    score -= 100;
  }

  if (
    finiteNumber(quote.high) &&
    finiteNumber(quote.low) &&
    quote.high < quote.low
  ) {
    score -= 40;
  }

  if (
    finiteNumber(quote.high) &&
    price > quote.high * 1.02
  ) {
    score -= 20;
  }

  if (
    finiteNumber(quote.low) &&
    price < quote.low * 0.98
  ) {
    score -= 20;
  }

  if (
    previousClose !== null &&
    previousClose <= 0
  ) {
    score -= 25;
  }

  return clamp(score);
}

export function quoteQualityGrade(
  score: number
): QuoteQualityGrade {
  if (
    score >= 90
  ) {
    return "A";
  }

  if (
    score >= 80
  ) {
    return "B";
  }

  if (
    score >= 70
  ) {
    return "C";
  }

  if (
    score >= 60
  ) {
    return "D";
  }

  if (
    score >= 45
  ) {
    return "E";
  }

  return "F";
}

function warningsForQuote({
  price,
  previousClose,
  freshness,
  latency,
  quote,
}: {
  price: number;
  previousClose: number | null;
  freshness: QuoteFreshness;
  latency: MarketDataLatencyClass;
  quote: RawMarketQuote;
}): string[] {
  const warnings: string[] = [];

  if (
    price <= 0
  ) {
    warnings.push(
      "Quote price is missing or not greater than zero."
    );
  }

  if (
    previousClose === null
  ) {
    warnings.push(
      "Previous close is unavailable."
    );
  }

  if (
    freshness === "DELAYED"
  ) {
    warnings.push(
      "Quote timestamp indicates delayed market data."
    );
  }

  if (
    freshness === "STALE"
  ) {
    warnings.push(
      "Quote is stale and should not be treated as current."
    );
  }

  if (
    freshness === "EXPIRED"
  ) {
    warnings.push(
      "Quote is expired and should not be used for live valuation."
    );
  }

  if (
    freshness === "UNKNOWN"
  ) {
    warnings.push(
      "Quote freshness could not be established."
    );
  }

  if (
    latency === "INDICATIVE"
  ) {
    warnings.push(
      "Quote is indicative rather than executable market data."
    );
  }

  if (
    latency === "END_OF_DAY"
  ) {
    warnings.push(
      "Quote represents end-of-day pricing."
    );
  }

  if (
    !quote.currency
  ) {
    warnings.push(
      "Quote currency is unavailable."
    );
  }

  if (
    !quote.exchange
  ) {
    warnings.push(
      "Quote exchange is unavailable."
    );
  }

  return Array.from(
    new Set(warnings)
  );
}

export function normaliseMarketQuote({
  quote,
  provider,
  symbol,
  now = new Date(),
  thresholds: thresholdOverrides = {},
}: QuoteQualityInput): NormalisedMarketQuote {
  const thresholds:
    QuoteQualityThresholds = {
    ...DEFAULT_THRESHOLDS,

    staleSeconds:
      provider.staleAfterSeconds,

    expiredSeconds:
      provider.expireAfterSeconds,

    ...thresholdOverrides,
  };

  const receivedAt =
    normaliseDate(
      quote.receivedAt,
      now
    );

  const quoteTimestamp =
    normaliseDate(
      quote.timestamp,
      receivedAt
    );

  const ageSeconds =
    quoteAgeSeconds(
      quoteTimestamp,
      now
    );

  const freshness =
    classifyQuoteFreshness(
      ageSeconds,
      thresholds
    );

  const price =
    nullableFiniteNumber(
      quote.price
    ) || 0;

  const previousClose =
    nullableFiniteNumber(
      quote.previousClose
    );

  const suppliedChange =
    nullableFiniteNumber(
      quote.change
    );

  const suppliedChangePercent =
    nullableFiniteNumber(
      quote.changePercent
    );

  const change =
    calculateChange(
      price,
      previousClose,
      suppliedChange
    );

  const changePercent =
    calculateChangePercent(
      price,
      previousClose,
      suppliedChangePercent
    );

  const quoteLatency =
    latencyClass(
      quote,
      provider
    );

  const quoteTradingStatus =
    tradingStatus(
      quote.tradingStatus
    );

  const freshnessComponent =
    freshnessScore(
      freshness
    );

  const latencyComponent =
    latencyScore(
      quoteLatency
    );

  const completenessComponent =
    completenessScore(
      quote
    );

  const consistencyComponent =
    consistencyScore(
      quote,
      price,
      previousClose
    );

  const qualityScore =
    round(
      clamp(
        freshnessComponent * 0.4 +
        latencyComponent * 0.2 +
        completenessComponent * 0.2 +
        consistencyComponent * 0.2
      )
    );

  const providerPriorityComponent =
    clamp(
      100 -
      provider.priority
    );

  const confidenceScore =
    round(
      clamp(
        qualityScore * 0.8 +
        providerPriorityComponent * 0.2
      )
    );

  const warnings =
    warningsForQuote({
      price,
      previousClose,
      freshness,
      latency:
        quoteLatency,
      quote,
    });

  const expired =
    freshness === "EXPIRED";

  const stale =
    freshness === "STALE" ||
    expired;

  const indicative =
    quoteLatency === "INDICATIVE";

  const delayed =
    quoteLatency === "DELAYED" ||
    freshness === "DELAYED";

  const usable =
    price > 0 &&
    !expired &&
    qualityScore >= 40;

  return {
    symbol:
      quote.symbol,

    canonicalSymbol:
      symbol?.canonical ||
      quote.symbol.trim().toUpperCase(),

    displaySymbol:
      symbol?.display ||
      quote.symbol
        .trim()
        .toUpperCase()
        .replace(
          /\.(AX|L|TO|NZ|HK)$/i,
          ""
        ),

    price:
      round(
        price,
        8
      ),

    previousClose:
      previousClose === null
        ? null
        : round(
            previousClose,
            8
          ),

    open:
      nullableFiniteNumber(
        quote.open
      ),

    high:
      nullableFiniteNumber(
        quote.high
      ),

    low:
      nullableFiniteNumber(
        quote.low
      ),

    change:
      change === null
        ? null
        : round(
            change,
            8
          ),

    changePercent:
      changePercent === null
        ? null
        : round(
            changePercent
          ),

    volume:
      nullableFiniteNumber(
        quote.volume
      ),

    marketCap:
      nullableFiniteNumber(
        quote.marketCap
      ),

    currency:
      quote.currency ||
      symbol?.currency ||
      null,

    exchange:
      symbol?.exchange ||
      exchangeFromString(
        quote.exchange
      ),

    quoteTimestamp:
      quoteTimestamp.toISOString(),

    receivedAt:
      receivedAt.toISOString(),

    ageSeconds,

    freshness,

    latencyClass:
      quoteLatency,

    tradingStatus:
      quoteTradingStatus,

    provider:
      quote.provider ||
      provider.id,

    source:
      quote.source ||
      provider.name,

    qualityScore,

    qualityGrade:
      quoteQualityGrade(
        qualityScore
      ),

    confidenceScore,

    isUsable:
      usable,

    isDelayed:
      delayed,

    isStale:
      stale,

    isExpired:
      expired,

    isIndicative:
      indicative,

    warnings,
  };
}
