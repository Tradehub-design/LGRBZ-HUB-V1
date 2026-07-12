import type {
  MarketDataExchange,
  MarketDataProviderId,
  QuoteConfidence,
  QuoteFreshnessStatus,
} from "./marketDataTypes";

type FreshnessInput = {
  quotedAt: string | null;
  receivedAt?: string;
  exchange: MarketDataExchange;
  provider: MarketDataProviderId;
  isManual?: boolean;
  providerDelayMinutes?: number | null;
};

export type QuoteFreshnessResult = {
  freshness: QuoteFreshnessStatus;
  confidence: QuoteConfidence;
  delayMinutes: number | null;
  staleAfterMinutes: number;
};

const REAL_TIME_STALE_MINUTES =
  15;

const DELAYED_STALE_MINUTES =
  60;

const END_OF_DAY_STALE_MINUTES =
  36 * 60;

function minutesBetween(
  earlier: string,
  later: string
) {
  const earlierTime =
    new Date(
      earlier
    ).getTime();

  const laterTime =
    new Date(
      later
    ).getTime();

  if (
    Number.isNaN(
      earlierTime
    ) ||
    Number.isNaN(
      laterTime
    )
  ) {
    return null;
  }

  return Math.max(
    0,
    (
      laterTime -
      earlierTime
    ) /
      60_000
  );
}

export function evaluateQuoteFreshness({
  quotedAt,
  receivedAt =
    new Date().toISOString(),
  exchange,
  provider,
  isManual = false,
  providerDelayMinutes = null,
}: FreshnessInput): QuoteFreshnessResult {
  if (isManual) {
    return {
      freshness:
        "MANUAL",
      confidence:
        "LOW",
      delayMinutes:
        quotedAt
          ? minutesBetween(
              quotedAt,
              receivedAt
            )
          : null,
      staleAfterMinutes:
        END_OF_DAY_STALE_MINUTES,
    };
  }

  if (!quotedAt) {
    return {
      freshness:
        "UNAVAILABLE",
      confidence:
        "NONE",
      delayMinutes:
        null,
      staleAfterMinutes:
        REAL_TIME_STALE_MINUTES,
    };
  }

  const observedDelay =
    minutesBetween(
      quotedAt,
      receivedAt
    );

  const delayMinutes =
    providerDelayMinutes ??
    observedDelay;

  const asxLikelyDelayed =
    exchange === "ASX" &&
    (
      provider ===
        "alpha-vantage" ||
      (
        delayMinutes !==
          null &&
        delayMinutes >= 15
      )
    );

  const likelyEndOfDay =
    provider ===
      "alpha-vantage" &&
    delayMinutes !==
      null &&
    delayMinutes >=
      60;

  if (
    observedDelay !==
      null &&
    observedDelay >
      END_OF_DAY_STALE_MINUTES
  ) {
    return {
      freshness:
        "STALE",
      confidence:
        "LOW",
      delayMinutes,
      staleAfterMinutes:
        END_OF_DAY_STALE_MINUTES,
    };
  }

  if (likelyEndOfDay) {
    return {
      freshness:
        "END_OF_DAY",
      confidence:
        "MEDIUM",
      delayMinutes,
      staleAfterMinutes:
        END_OF_DAY_STALE_MINUTES,
    };
  }

  if (asxLikelyDelayed) {
    return {
      freshness:
        observedDelay !==
          null &&
        observedDelay >
          DELAYED_STALE_MINUTES
          ? "STALE"
          : "DELAYED",
      confidence:
        "MEDIUM",
      delayMinutes,
      staleAfterMinutes:
        DELAYED_STALE_MINUTES,
    };
  }

  if (
    observedDelay !==
      null &&
    observedDelay >
      REAL_TIME_STALE_MINUTES
  ) {
    return {
      freshness:
        "STALE",
      confidence:
        "LOW",
      delayMinutes,
      staleAfterMinutes:
        REAL_TIME_STALE_MINUTES,
    };
  }

  return {
    freshness:
      "REAL_TIME",
    confidence:
      "HIGH",
    delayMinutes,
    staleAfterMinutes:
      REAL_TIME_STALE_MINUTES,
  };
}

export function isQuoteUsable(
  price:
    | number
    | null
    | undefined
) {
  return (
    typeof price ===
      "number" &&
    Number.isFinite(
      price
    ) &&
    price > 0
  );
}
