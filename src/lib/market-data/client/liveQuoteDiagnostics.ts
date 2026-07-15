import type {
  LiveQuoteClientDiagnosticSummary,
  LiveQuoteStoreEntry,
} from "./liveQuoteClientTypes";

function average(
  values: number[]
): number {
  if (
    values.length ===
    0
  ) {
    return 0;
  }

  return (
    values.reduce(
      (
        total,
        value
      ) =>
        total +
        value,
      0
    ) /
    values.length
  );
}

function round(
  value: number,
  digits =
    2
): number {
  const multiplier =
    10 **
    digits;

  return (
    Math.round(
      value *
      multiplier
    ) /
    multiplier
  );
}

export function createLiveQuoteClientDiagnostics(
  entries:
    Record<
      string,
      LiveQuoteStoreEntry
    >
): LiveQuoteClientDiagnosticSummary {
  const rows =
    Object.values(
      entries
    );

  const quotes =
    rows
      .map(
        (
          entry
        ) =>
          entry.quote
      )
      .filter(
        (
          quote
        ): quote is NonNullable<
          typeof quote
        > =>
          Boolean(
            quote
          )
      );

  const providers:
    Record<
      string,
      number
    > =
      {};

  const freshness:
    Record<
      string,
      number
    > =
      {};

  for (
    const quote of
    quotes
  ) {
    providers[
      quote.provider
    ] =
      (
        providers[
          quote.provider
        ] ||
        0
      ) +
      1;

    freshness[
      quote.freshness
    ] =
      (
        freshness[
          quote.freshness
        ] ||
        0
      ) +
      1;
  }

  const countState =
    (
      state:
        LiveQuoteStoreEntry[
          "state"
        ]
    ) =>
      rows.filter(
        (
          entry
        ) =>
          entry.state ===
          state
      ).length;

  return {
    generatedAt:
      new Date()
        .toISOString(),

    trackedSymbolCount:
      rows.length,

    idleCount:
      countState(
        "IDLE"
      ),

    loadingCount:
      countState(
        "LOADING"
      ),

    refreshingCount:
      countState(
        "REFRESHING"
      ),

    successCount:
      countState(
        "SUCCESS"
      ),

    errorCount:
      countState(
        "ERROR"
      ),

    offlineCount:
      countState(
        "OFFLINE"
      ),

    pausedCount:
      countState(
        "PAUSED"
      ),

    liveQuoteCount:
      quotes.filter(
        (
          quote
        ) =>
          quote.latencyClass ===
            "REAL_TIME" &&
          !quote.isDelayed &&
          !quote.isStale &&
          !quote.isExpired
      ).length,

    delayedQuoteCount:
      quotes.filter(
        (
          quote
        ) =>
          quote.isDelayed
      ).length,

    staleQuoteCount:
      quotes.filter(
        (
          quote
        ) =>
          quote.isStale
      ).length,

    expiredQuoteCount:
      quotes.filter(
        (
          quote
        ) =>
          quote.isExpired
      ).length,

    indicativeQuoteCount:
      quotes.filter(
        (
          quote
        ) =>
          quote.isIndicative
      ).length,

    activeRequestCount:
      rows.filter(
        (
          entry
        ) =>
          Boolean(
            entry.activeRequestId
          )
      ).length,

    totalRequests:
      rows.reduce(
        (
          total,
          entry
        ) =>
          total +
          entry.requestCount,
        0
      ),

    totalSuccesses:
      rows.reduce(
        (
          total,
          entry
        ) =>
          total +
          entry.successCount,
        0
      ),

    totalFailures:
      rows.reduce(
        (
          total,
          entry
        ) =>
          total +
          entry.failureCount,
        0
      ),

    averageQualityScore:
      round(
        average(
          quotes.map(
            (
              quote
            ) =>
              quote.qualityScore
          )
        )
      ),

    averageConfidenceScore:
      round(
        average(
          quotes.map(
            (
              quote
            ) =>
              quote.confidenceScore
          )
        )
      ),

    providers,
    freshness,

    symbols:
      rows.map(
        (
          entry
        ) => ({
          symbol:
            entry.symbol,

          state:
            entry.state,

          provider:
            entry.quote?.provider ||
            null,

          freshness:
            entry.quote?.freshness ||
            null,

          qualityScore:
            entry.quote?.qualityScore ||
            null,

          confidenceScore:
            entry.quote?.confidenceScore ||
            null,

          lastSuccessAt:
            entry.lastSuccessAt,

          errorMessage:
            entry.errorMessage,
        })
      ),
  };
}
