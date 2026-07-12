import type {
  MarketDataProviderHealth,
  MarketDataProviderId,
} from "./marketDataTypes";

const providerNames: Record<
  MarketDataProviderId,
  string
> = {
  "twelve-data":
    "Twelve Data",
  finnhub:
    "Finnhub",
  "alpha-vantage":
    "Alpha Vantage",
  cache:
    "Local quote cache",
  manual:
    "Manual quote",
  unavailable:
    "Unavailable",
};

const healthRegistry =
  new Map<
    MarketDataProviderId,
    MarketDataProviderHealth
  >();

function createHealth(
  id: MarketDataProviderId,
  configured = false
): MarketDataProviderHealth {
  return {
    id,
    name:
      providerNames[id],
    configured,
    available:
      configured,
    lastAttemptAt:
      null,
    lastSuccessAt:
      null,
    lastFailureAt:
      null,
    lastLatencyMs:
      null,
    requestCount: 0,
    successCount: 0,
    failureCount: 0,
    successRate: 0,
    lastError:
      null,
  };
}

export function registerProviderConfiguration(
  id: MarketDataProviderId,
  configured: boolean
) {
  const current =
    healthRegistry.get(id) ??
    createHealth(
      id,
      configured
    );

  current.configured =
    configured;

  current.available =
    configured &&
    current.lastError ===
      null;

  healthRegistry.set(
    id,
    current
  );
}

export function recordProviderAttempt(
  id: MarketDataProviderId
) {
  const current =
    healthRegistry.get(id) ??
    createHealth(id);

  current.requestCount +=
    1;

  current.lastAttemptAt =
    new Date().toISOString();

  healthRegistry.set(
    id,
    current
  );
}

export function recordProviderSuccess(
  id: MarketDataProviderId,
  latencyMs: number
) {
  const current =
    healthRegistry.get(id) ??
    createHealth(id);

  current.successCount +=
    1;

  current.lastSuccessAt =
    new Date().toISOString();

  current.lastLatencyMs =
    latencyMs;

  current.available =
    true;

  current.lastError =
    null;

  current.successRate =
    current.requestCount >
    0
      ? (
          current.successCount /
          current.requestCount
        ) *
        100
      : 100;

  healthRegistry.set(
    id,
    current
  );
}

export function recordProviderFailure(
  id: MarketDataProviderId,
  latencyMs: number,
  error: unknown
) {
  const current =
    healthRegistry.get(id) ??
    createHealth(id);

  current.failureCount +=
    1;

  current.lastFailureAt =
    new Date().toISOString();

  current.lastLatencyMs =
    latencyMs;

  current.available =
    false;

  current.lastError =
    error instanceof Error
      ? error.message
      : String(error);

  current.successRate =
    current.requestCount >
    0
      ? (
          current.successCount /
          current.requestCount
        ) *
        100
      : 0;

  healthRegistry.set(
    id,
    current
  );
}

export function getProviderHealth():
  MarketDataProviderHealth[] {
  return Array.from(
    healthRegistry.values()
  ).sort(
    (
      left,
      right
    ) =>
      left.name.localeCompare(
        right.name
      )
  );
}
