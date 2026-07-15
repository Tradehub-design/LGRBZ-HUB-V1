import type {
  MarketDataProviderDefinition,
  MarketDataProviderId,
  ProviderCircuitState,
  ProviderHealthSnapshot,
  ProviderHealthStore,
  ProviderOperationalState,
  ProviderRequestResult,
} from "./marketDataTypes";

const CIRCUIT_FAILURE_THRESHOLD =
  4;

const CIRCUIT_RETRY_SECONDS =
  120;

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

function percentage(
  value: number,
  total: number
): number {
  if (
    total <= 0
  ) {
    return 0;
  }

  return round(
    (
      value /
      total
    ) *
    100
  );
}

function defaultHealthSnapshot(
  provider: MarketDataProviderDefinition
): ProviderHealthSnapshot {
  return {
    provider:
      provider.id,

    operationalState:
      provider.enabled
        ? "UNKNOWN"
        : "DISABLED",

    circuitState:
      "CLOSED",

    healthScore:
      provider.enabled
        ? 75
        : 0,

    requestCount:
      0,

    successCount:
      0,

    failureCount:
      0,

    successRate:
      0,

    failureRate:
      0,

    averageLatencyMs:
      0,

    latestLatencyMs:
      null,

    consecutiveFailures:
      0,

    consecutiveSuccesses:
      0,

    lastRequestAt:
      null,

    lastSuccessAt:
      null,

    lastFailureAt:
      null,

    circuitOpenedAt:
      null,

    circuitRetryAt:
      null,

    rateLimited:
      false,

    timedOut:
      false,

    latestErrorCode:
      null,

    latestErrorMessage:
      null,
  };
}

export function createProviderHealthStore(
  providers:
    MarketDataProviderDefinition[]
): ProviderHealthStore {
  return {
    generatedAt:
      new Date()
        .toISOString(),

    providers:
      Object.fromEntries(
        providers.map(
          (
            provider
          ) => [
            provider.id,
            defaultHealthSnapshot(
              provider
            ),
          ]
        )
      ),
  };
}

function operationalStateForScore(
  score: number,
  enabled: boolean
): ProviderOperationalState {
  if (
    !enabled
  ) {
    return "DISABLED";
  }

  if (
    score >= 75
  ) {
    return "HEALTHY";
  }

  if (
    score >= 45
  ) {
    return "DEGRADED";
  }

  return "UNHEALTHY";
}

function calculateHealthScore(
  snapshot:
    ProviderHealthSnapshot,
  provider:
    MarketDataProviderDefinition
): number {
  if (
    !provider.enabled
  ) {
    return 0;
  }

  if (
    snapshot.requestCount ===
    0
  ) {
    return 75;
  }

  const successComponent =
    snapshot.successRate;

  const latencyTarget =
    Math.max(
      250,
      provider.defaultTimeoutMs *
      0.35
    );

  const latencyComponent =
    snapshot.averageLatencyMs <=
    latencyTarget
      ? 100
      : clamp(
          100 -
          (
            (
              snapshot.averageLatencyMs -
              latencyTarget
            ) /
            provider.defaultTimeoutMs
          ) *
            100
        );

  const consecutiveFailurePenalty =
    Math.min(
      50,
      snapshot.consecutiveFailures *
      12
    );

  const rateLimitPenalty =
    snapshot.rateLimited
      ? 25
      : 0;

  const timeoutPenalty =
    snapshot.timedOut
      ? 20
      : 0;

  const circuitPenalty =
    snapshot.circuitState ===
    "OPEN"
      ? 70
      : snapshot.circuitState ===
          "HALF_OPEN"
        ? 20
        : 0;

  return round(
    clamp(
      successComponent *
        0.65 +
      latencyComponent *
        0.35 -
      consecutiveFailurePenalty -
      rateLimitPenalty -
      timeoutPenalty -
      circuitPenalty
    )
  );
}

function updatedCircuitState(
  snapshot:
    ProviderHealthSnapshot,
  successful:
    boolean,
  now:
    Date
): {
  state:
    ProviderCircuitState;
  openedAt:
    string | null;
  retryAt:
    string | null;
} {
  if (
    successful
  ) {
    return {
      state:
        "CLOSED",

      openedAt:
        null,

      retryAt:
        null,
    };
  }

  const nextConsecutiveFailures =
    snapshot.consecutiveFailures +
    1;

  if (
    nextConsecutiveFailures >=
    CIRCUIT_FAILURE_THRESHOLD
  ) {
    return {
      state:
        "OPEN",

      openedAt:
        now.toISOString(),

      retryAt:
        new Date(
          now.getTime() +
          CIRCUIT_RETRY_SECONDS *
            1_000
        ).toISOString(),
    };
  }

  return {
    state:
      snapshot.circuitState,

    openedAt:
      snapshot.circuitOpenedAt,

    retryAt:
      snapshot.circuitRetryAt,
  };
}

export function updateProviderHealth(
  snapshot:
    ProviderHealthSnapshot,
  result:
    ProviderRequestResult,
  provider:
    MarketDataProviderDefinition
): ProviderHealthSnapshot {
  const now =
    new Date(
      result.finishedAt
    );

  const requestCount =
    snapshot.requestCount +
    1;

  const successCount =
    snapshot.successCount +
    (
      result.successful
        ? 1
        : 0
    );

  const failureCount =
    snapshot.failureCount +
    (
      result.successful
        ? 0
        : 1
    );

  const averageLatencyMs =
    (
      snapshot.averageLatencyMs *
        snapshot.requestCount +
      result.latencyMs
    ) /
    requestCount;

  const consecutiveFailures =
    result.successful
      ? 0
      : snapshot.consecutiveFailures +
        1;

  const consecutiveSuccesses =
    result.successful
      ? snapshot.consecutiveSuccesses +
        1
      : 0;

  const circuit =
    updatedCircuitState(
      snapshot,
      result.successful,
      now
    );

  const intermediate:
    ProviderHealthSnapshot = {
    ...snapshot,

    provider:
      provider.id,

    circuitState:
      circuit.state,

    requestCount,
    successCount,
    failureCount,

    successRate:
      percentage(
        successCount,
        requestCount
      ),

    failureRate:
      percentage(
        failureCount,
        requestCount
      ),

    averageLatencyMs:
      round(
        averageLatencyMs
      ),

    latestLatencyMs:
      round(
        result.latencyMs
      ),

    consecutiveFailures,
    consecutiveSuccesses,

    lastRequestAt:
      result.finishedAt,

    lastSuccessAt:
      result.successful
        ? result.finishedAt
        : snapshot.lastSuccessAt,

    lastFailureAt:
      result.successful
        ? snapshot.lastFailureAt
        : result.finishedAt,

    circuitOpenedAt:
      circuit.openedAt,

    circuitRetryAt:
      circuit.retryAt,

    rateLimited:
      Boolean(
        result.rateLimited
      ),

    timedOut:
      Boolean(
        result.timedOut
      ),

    latestErrorCode:
      result.successful
        ? null
        : result.errorCode ||
          null,

    latestErrorMessage:
      result.successful
        ? null
        : result.errorMessage ||
          null,
  };

  const healthScore =
    calculateHealthScore(
      intermediate,
      provider
    );

  return {
    ...intermediate,

    healthScore,

    operationalState:
      operationalStateForScore(
        healthScore,
        provider.enabled
      ),
  };
}

export function updateProviderHealthStore(
  store:
    ProviderHealthStore,
  result:
    ProviderRequestResult,
  provider:
    MarketDataProviderDefinition
): ProviderHealthStore {
  const current =
    store.providers[
      provider.id
    ] ||
    defaultHealthSnapshot(
      provider
    );

  return {
    generatedAt:
      new Date()
        .toISOString(),

    providers: {
      ...store.providers,

      [
        provider.id
      ]:
        updateProviderHealth(
          current,
          result,
          provider
        ),
    },
  };
}

export function providerCircuitAllowsRequest(
  snapshot:
    ProviderHealthSnapshot,
  now =
    new Date()
): boolean {
  if (
    snapshot.circuitState ===
    "CLOSED"
  ) {
    return true;
  }

  if (
    snapshot.circuitState ===
    "HALF_OPEN"
  ) {
    return true;
  }

  if (
    !snapshot.circuitRetryAt
  ) {
    return false;
  }

  return (
    now.getTime() >=
    new Date(
      snapshot.circuitRetryAt
    ).getTime()
  );
}

export function prepareProviderHalfOpen(
  snapshot:
    ProviderHealthSnapshot,
  now =
    new Date()
): ProviderHealthSnapshot {
  if (
    snapshot.circuitState !==
    "OPEN"
  ) {
    return snapshot;
  }

  if (
    !providerCircuitAllowsRequest(
      snapshot,
      now
    )
  ) {
    return snapshot;
  }

  return {
    ...snapshot,

    circuitState:
      "HALF_OPEN",
  };
}

export function healthForProvider(
  store:
    ProviderHealthStore,
  provider:
    MarketDataProviderDefinition
): ProviderHealthSnapshot {
  return (
    store.providers[
      provider.id
    ] ||
    defaultHealthSnapshot(
      provider
    )
  );
}

export function resetProviderHealth(
  provider:
    MarketDataProviderDefinition
): ProviderHealthSnapshot {
  return defaultHealthSnapshot(
    provider
  );
}

export function providerHealthMap(
  store:
    ProviderHealthStore
): Map<
  MarketDataProviderId,
  ProviderHealthSnapshot
> {
  return new Map(
    Object.values(
      store.providers
    ).map(
      (
        snapshot
      ) => [
        snapshot.provider,
        snapshot,
      ]
    )
  );
}
