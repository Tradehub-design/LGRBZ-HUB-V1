import {
  exchangeTradingSession,
} from "./exchangeTradingSessions";
import {
  getMarketClock,
} from "./marketClock";
import type {
  AdaptiveQuoteFreshnessInput,
  AdaptiveQuoteFreshnessPolicy,
  AdaptiveQuoteFreshnessResult,
  MarketClockState,
} from "./marketHoursTypes";
import type {
  QuoteFreshness,
} from "./marketDataTypes";
import {
  classifyQuoteFreshness,
  quoteAgeSeconds,
} from "./quoteQuality";

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
    const milliseconds =
      value <
      10_000_000_000
        ? value *
          1_000
        : value;

    const date =
      new Date(
        milliseconds
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date;
    }
  }

  const date =
    new Date(
      value
    );

  return Number.isNaN(
    date.getTime()
  )
    ? fallback
    : date;
}

function marketStatePolicy(
  state:
    MarketClockState,
  providerStale:
    number,
  providerExpire:
    number,
  defaultTtl:
    number,
  closedTtl:
    number,
  staleWhileRevalidate:
    number
): AdaptiveQuoteFreshnessPolicy {
  if (
    state ===
    "OPEN"
  ) {
    return {
      freshSeconds:
        Math.min(
          120,
          providerStale
        ),

      acceptableSeconds:
        Math.min(
          300,
          Math.max(
            120,
            providerStale
          )
        ),

      delayedSeconds:
        Math.min(
          900,
          Math.max(
            300,
            providerStale *
            2
          )
        ),

      staleSeconds:
        Math.max(
          900,
          providerStale
        ),

      expiredSeconds:
        Math.max(
          3_600,
          providerExpire
        ),

      cacheTtlSeconds:
        Math.min(
          defaultTtl,
          120
        ),

      staleWhileRevalidateSeconds:
        Math.min(
          staleWhileRevalidate,
          900
        ),

      allowStale:
        false,

      allowExpiredFallback:
        false,

      reason:
        "The exchange is open, so current pricing requires strict freshness.",
    };
  }

  if (
    state ===
      "PRE_MARKET" ||
    state ===
      "AFTER_HOURS"
  ) {
    return {
      freshSeconds:
        Math.max(
          180,
          providerStale
        ),

      acceptableSeconds:
        Math.max(
          600,
          providerStale *
          2
        ),

      delayedSeconds:
        Math.max(
          1_800,
          providerStale *
          4
        ),

      staleSeconds:
        Math.max(
          7_200,
          providerStale *
          8
        ),

      expiredSeconds:
        Math.max(
          43_200,
          providerExpire
        ),

      cacheTtlSeconds:
        Math.max(
          120,
          defaultTtl
        ),

      staleWhileRevalidateSeconds:
        Math.max(
          1_800,
          staleWhileRevalidate
        ),

      allowStale:
        true,

      allowExpiredFallback:
        false,

      reason:
        "The exchange is outside regular hours, so recent session pricing remains usable with a clear label.",
    };
  }

  if (
    state ===
      "HOLIDAY" ||
    state ===
      "WEEKEND"
  ) {
    return {
      freshSeconds:
        Math.max(
          3_600,
          providerStale
        ),

      acceptableSeconds:
        Math.max(
          21_600,
          providerStale *
          4
        ),

      delayedSeconds:
        Math.max(
          86_400,
          providerStale *
          12
        ),

      staleSeconds:
        Math.max(
          259_200,
          providerExpire
        ),

      expiredSeconds:
        Math.max(
          604_800,
          providerExpire *
          2
        ),

      cacheTtlSeconds:
        Math.max(
          closedTtl,
          3_600
        ),

      staleWhileRevalidateSeconds:
        Math.max(
          staleWhileRevalidate,
          7_200
        ),

      allowStale:
        true,

      allowExpiredFallback:
        true,

      reason:
        "The exchange is closed for a weekend or holiday, so the latest official close remains suitable for valuation.",
    };
  }

  return {
    freshSeconds:
      Math.max(
        900,
        providerStale
      ),

    acceptableSeconds:
      Math.max(
        3_600,
        providerStale *
        2
      ),

    delayedSeconds:
      Math.max(
        21_600,
        providerStale *
        6
      ),

    staleSeconds:
      Math.max(
        86_400,
        providerExpire
      ),

    expiredSeconds:
      Math.max(
        259_200,
        providerExpire *
        2
      ),

    cacheTtlSeconds:
      Math.max(
        closedTtl,
        defaultTtl
      ),

    staleWhileRevalidateSeconds:
      Math.max(
        staleWhileRevalidate,
        3_600
      ),

    allowStale:
      true,

    allowExpiredFallback:
      true,

    reason:
      "The exchange is closed, so the most recent official session price may remain valid.",
  };
}

function freshnessLabel(
  freshness:
    QuoteFreshness,
  state:
    MarketClockState
): string {
  if (
    freshness ===
    "FRESH"
  ) {
    return state ===
      "OPEN"
      ? "Live price"
      : "Latest session price";
  }

  if (
    freshness ===
    "ACCEPTABLE"
  ) {
    return state ===
      "OPEN"
      ? "Recent price"
      : "Latest close";
  }

  if (
    freshness ===
    "DELAYED"
  ) {
    return "Delayed price";
  }

  if (
    freshness ===
    "STALE"
  ) {
    return "Stale price";
  }

  if (
    freshness ===
    "EXPIRED"
  ) {
    return "Expired price";
  }

  return "Timestamp unknown";
}

function refreshUrgency(
  freshness:
    QuoteFreshness,
  state:
    MarketClockState
): AdaptiveQuoteFreshnessResult[
  "refreshUrgency"
] {
  if (
    freshness ===
    "EXPIRED"
  ) {
    return "IMMEDIATE";
  }

  if (
    freshness ===
      "STALE" &&
    state ===
      "OPEN"
  ) {
    return "IMMEDIATE";
  }

  if (
    freshness ===
    "STALE"
  ) {
    return "HIGH";
  }

  if (
    freshness ===
      "DELAYED" &&
    state ===
      "OPEN"
  ) {
    return "HIGH";
  }

  if (
    freshness ===
    "DELAYED"
  ) {
    return "MEDIUM";
  }

  if (
    freshness ===
      "ACCEPTABLE" &&
    state ===
      "OPEN"
  ) {
    return "LOW";
  }

  return "NONE";
}

export function createAdaptiveQuoteFreshness(
  input:
    AdaptiveQuoteFreshnessInput
): AdaptiveQuoteFreshnessResult {
  const now =
    input.now ||
    new Date();

  const definition =
    exchangeTradingSession(
      input.exchange
    );

  const marketClock =
    getMarketClock(
      input.exchange,
      now
    );

  const quoteTimestamp =
    normaliseDate(
      input.quoteTimestamp,
      now
    );

  const ageSeconds =
    quoteAgeSeconds(
      quoteTimestamp,
      now
    );

  const policy =
    marketStatePolicy(
      marketClock.state,
      input.providerStaleAfterSeconds,
      input.providerExpireAfterSeconds,
      definition.defaultQuoteTtlSeconds,
      definition.closedMarketQuoteTtlSeconds,
      definition.staleWhileRevalidateSeconds
    );

  const freshness =
    classifyQuoteFreshness(
      ageSeconds,
      {
        freshSeconds:
          policy.freshSeconds,

        acceptableSeconds:
          policy.acceptableSeconds,

        delayedSeconds:
          policy.delayedSeconds,

        staleSeconds:
          policy.staleSeconds,

        expiredSeconds:
          policy.expiredSeconds,
      }
    );

  const warnings:
    string[] =
      [];

  if (
    input.providerIsDelayed
  ) {
    warnings.push(
      "The selected provider reports delayed market data."
    );
  }

  if (
    input.providerIsIndicative
  ) {
    warnings.push(
      "The selected provider reports indicative market data."
    );
  }

  if (
    freshness ===
    "STALE"
  ) {
    warnings.push(
      "The quote is older than the preferred market-state threshold."
    );
  }

  if (
    freshness ===
    "EXPIRED"
  ) {
    warnings.push(
      "The quote is too old for normal valuation use."
    );
  }

  const closedMarket =
    [
      "CLOSED",
      "WEEKEND",
      "HOLIDAY",
    ].includes(
      marketClock.state
    );

  const acceptableForValuation =
    freshness ===
      "FRESH" ||
    freshness ===
      "ACCEPTABLE" ||
    freshness ===
      "DELAYED" ||
    (
      freshness ===
        "STALE" &&
      closedMarket &&
      policy.allowStale
    );

  const acceptableForLiveDisplay =
    marketClock.state ===
      "OPEN" &&
    (
      freshness ===
        "FRESH" ||
      freshness ===
        "ACCEPTABLE"
    ) &&
    !input.providerIsIndicative;

  const urgency =
    refreshUrgency(
      freshness,
      marketClock.state
    );

  const shouldRefresh =
    urgency !==
    "NONE";

  return {
    marketClock,
    policy,

    ageSeconds,
    freshness,

    isAcceptableForValuation:
      acceptableForValuation,

    isAcceptableForLiveDisplay:
      acceptableForLiveDisplay,

    shouldRefresh,
    refreshUrgency:
      urgency,

    displayLabel:
      freshnessLabel(
        freshness,
        marketClock.state
      ),

    explanation:
      `${policy.reason} Quote age is ${ageSeconds} seconds and is classified as ${freshness.toLowerCase()}.`,

    warnings:
      Array.from(
        new Set(
          warnings
        )
      ),
  };
}


/**
 * Compatibility alias for modules using the previous freshness function name.
 */
export function calculateAdaptiveQuoteFreshness(
  ...args: Parameters<
    typeof createAdaptiveQuoteFreshness
  >
): ReturnType<
  typeof createAdaptiveQuoteFreshness
> {
  return createAdaptiveQuoteFreshness(
    ...args
  );
}
