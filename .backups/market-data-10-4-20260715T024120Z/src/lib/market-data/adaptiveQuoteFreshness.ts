import type {
  QuoteFreshness,
  QuoteQualityThresholds,
} from "./marketDataTypes";
import {
  classifyQuoteFreshness,
  quoteAgeSeconds,
} from "./quoteQuality";
import {
  createMarketSessionSnapshot,
} from "./marketClock";
import type {
  AdaptiveQuoteFreshnessInput,
  AdaptiveQuoteFreshnessResult,
  MarketSessionType,
} from "./marketSessionTypes";

function normaliseDate(
  value:
    string |
    number |
    Date,
  fallback:
    Date
): Date {
  if (
    value instanceof Date &&
    !Number.isNaN(
      value.getTime()
    )
  ) {
    return value;
  }

  if (
    typeof value ===
    "number"
  ) {
    const timestamp =
      value <
      10_000_000_000
        ? value *
          1_000
        : value;

    const date =
      new Date(
        timestamp
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date;
    }
  }

  if (
    typeof value ===
      "string" &&
    value.trim()
  ) {
    const numeric =
      Number(
        value
      );

    if (
      Number.isFinite(
        numeric
      ) &&
      /^\d+$/.test(
        value.trim()
      )
    ) {
      return normaliseDate(
        numeric,
        fallback
      );
    }

    const date =
      new Date(
        value
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date;
    }
  }

  return fallback;
}

function thresholdsForLatency({
  thresholds,
  latencyClass,
  sessionType,
}: {
  thresholds:
    QuoteQualityThresholds;

  latencyClass:
    AdaptiveQuoteFreshnessInput[
      "latencyClass"
    ];

  sessionType:
    MarketSessionType;
}): QuoteQualityThresholds {
  if (
    latencyClass ===
    "REAL_TIME"
  ) {
    return {
      ...thresholds,
    };
  }

  if (
    latencyClass ===
    "DELAYED"
  ) {
    return {
      freshSeconds:
        Math.max(
          thresholds
            .freshSeconds,
          300
        ),

      acceptableSeconds:
        Math.max(
          thresholds
            .acceptableSeconds,
          900
        ),

      delayedSeconds:
        Math.max(
          thresholds
            .delayedSeconds,
          1_800
        ),

      staleSeconds:
        Math.max(
          thresholds
            .staleSeconds,
          7_200
        ),

      expiredSeconds:
        Math.max(
          thresholds
            .expiredSeconds,
          43_200
        ),
    };
  }

  if (
    latencyClass ===
    "END_OF_DAY"
  ) {
    return {
      freshSeconds:
        sessionType ===
          "CLOSED"
          ? 43_200
          : 3_600,

      acceptableSeconds:
        86_400,

      delayedSeconds:
        172_800,

      staleSeconds:
        259_200,

      expiredSeconds:
        604_800,
    };
  }

  if (
    latencyClass ===
    "INDICATIVE"
  ) {
    return {
      freshSeconds:
        Math.max(
          thresholds
            .freshSeconds,
          300
        ),

      acceptableSeconds:
        Math.max(
          thresholds
            .acceptableSeconds,
          1_800
        ),

      delayedSeconds:
        Math.max(
          thresholds
            .delayedSeconds,
          7_200
        ),

      staleSeconds:
        Math.max(
          thresholds
            .staleSeconds,
          21_600
        ),

      expiredSeconds:
        Math.max(
          thresholds
            .expiredSeconds,
          86_400
        ),
    };
  }

  return {
    ...thresholds,
  };
}

function staleReasonFor({
  freshness,
  marketOpen,
  latencyClass,
  ageSeconds,
}: {
  freshness:
    QuoteFreshness;

  marketOpen:
    boolean;

  latencyClass:
    AdaptiveQuoteFreshnessInput[
      "latencyClass"
    ];

  ageSeconds:
    number;
}): string | null {
  if (
    freshness ===
    "EXPIRED"
  ) {
    return `Quote is expired at ${ageSeconds} seconds old.`;
  }

  if (
    freshness ===
    "STALE"
  ) {
    return marketOpen
      ? "Quote is stale while the market is active."
      : "Quote is stale for the current closed-market valuation window.";
  }

  if (
    freshness ===
    "DELAYED"
  ) {
    return latencyClass ===
      "DELAYED"
      ? "Provider reports delayed market data."
      : "Quote age exceeds the preferred freshness window.";
  }

  if (
    freshness ===
    "UNKNOWN"
  ) {
    return "Quote freshness could not be determined.";
  }

  return null;
}

export function calculateAdaptiveQuoteFreshness({
  quoteTimestamp,
  receivedAt,
  exchange,
  latencyClass,
  explicitTradingStatus,
  now =
    new Date(),
  holidays = [],
  tradingHalted =
    false,
}: AdaptiveQuoteFreshnessInput): AdaptiveQuoteFreshnessResult {
  const receivedDate =
    receivedAt
      ? normaliseDate(
          receivedAt,
          now
        )
      : now;

  const quoteDate =
    normaliseDate(
      quoteTimestamp,
      receivedDate
    );

  const marketSession =
    createMarketSessionSnapshot({
      exchange,
      now,
      holidays,
      tradingHalted:
        tradingHalted ||
        explicitTradingStatus ===
          "HALTED",
    });

  const thresholds =
    thresholdsForLatency({
      thresholds:
        marketSession
          .thresholds,

      latencyClass,

      sessionType:
        marketSession
          .sessionType,
    });

  const ageSeconds =
    quoteAgeSeconds(
      quoteDate,
      now
    );

  const freshness =
    classifyQuoteFreshness(
      ageSeconds,
      thresholds
    );

  const warnings:
    string[] = [];

  if (
    marketSession
      .marketClosed
  ) {
    warnings.push(
      marketSession.message
    );
  }

  if (
    marketSession
      .tradingHalted
  ) {
    warnings.push(
      "Trading is halted; the latest available quote may remain unchanged."
    );
  }

  if (
    latencyClass ===
    "END_OF_DAY"
  ) {
    warnings.push(
      "End-of-day pricing is not suitable for intraday live-price display."
    );
  }

  if (
    latencyClass ===
    "INDICATIVE"
  ) {
    warnings.push(
      "Indicative pricing may differ from executable market prices."
    );
  }

  if (
    freshness ===
      "STALE" ||
    freshness ===
      "EXPIRED"
  ) {
    warnings.push(
      staleReasonFor({
        freshness,
        marketOpen:
          marketSession
            .marketOpen,

        latencyClass,

        ageSeconds,
      }) ||
      "Quote is stale."
    );
  }

  const acceptableForValuation =
    freshness ===
      "FRESH" ||
    freshness ===
      "ACCEPTABLE" ||
    (
      freshness ===
        "DELAYED" &&
      marketSession
        .marketClosed
    ) ||
    (
      freshness ===
        "STALE" &&
      marketSession
        .marketClosed &&
      latencyClass ===
        "END_OF_DAY"
    );

  const acceptableForLiveDisplay =
    marketSession
      .marketOpen &&
    (
      freshness ===
        "FRESH" ||
      freshness ===
        "ACCEPTABLE" ||
      (
        freshness ===
          "DELAYED" &&
        latencyClass ===
          "DELAYED"
      )
    ) &&
    latencyClass !==
      "END_OF_DAY" &&
    latencyClass !==
      "INDICATIVE";

  return {
    freshness,

    ageSeconds,

    thresholds,

    marketSession,

    marketAdjusted:
      true,

    acceptableForValuation,

    acceptableForLiveDisplay,

    staleReason:
      staleReasonFor({
        freshness,
        marketOpen:
          marketSession
            .marketOpen,

        latencyClass,

        ageSeconds,
      }),

    warnings:
      Array.from(
        new Set(
          warnings
        )
      ),
  };
}
