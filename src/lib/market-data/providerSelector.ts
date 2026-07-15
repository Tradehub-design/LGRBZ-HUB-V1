import {
  providerApiKeyConfigured,
  providerSupportsAssetType,
  providerSupportsCapability,
  providerSupportsExchange,
  providerSupportsRegion,
} from "./providerRegistry";
import {
  healthForProvider,
  providerCircuitAllowsRequest,
} from "./providerHealth";
import type {
  MarketDataProviderDefinition,
  ProviderHealthStore,
  ProviderSelectionCandidate,
  ProviderSelectionRequest,
  ProviderSelectionResult,
} from "./marketDataTypes";

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

function preferenceBonus(
  provider:
    MarketDataProviderDefinition,
  request:
    ProviderSelectionRequest
): number {
  const index =
    request.providerPreference?.indexOf(
      provider.id
    ) ??
    -1;

  if (
    index < 0
  ) {
    return 0;
  }

  return Math.max(
    5,
    25 -
    index *
      5
  );
}

function latencyEligibility(
  provider:
    MarketDataProviderDefinition,
  request:
    ProviderSelectionRequest
): {
  eligible:
    boolean;
  reason:
    string | null;
} {
  const capability =
    provider.capabilities.find(
      (
        item
      ) =>
        item.capability ===
        request.capability
    );

  if (
    !capability
  ) {
    return {
      eligible:
        false,

      reason:
        "Requested capability is not configured.",
    };
  }

  if (
    capability.latencyClass ===
      "DELAYED" &&
    request.allowDelayed ===
      false
  ) {
    return {
      eligible:
        false,

      reason:
        "Delayed data is not permitted for this request.",
    };
  }

  if (
    capability.latencyClass ===
      "INDICATIVE" &&
    request.allowIndicative ===
      false
  ) {
    return {
      eligible:
        false,

      reason:
        "Indicative data is not permitted for this request.",
    };
  }

  return {
    eligible:
      true,

    reason:
      null,
  };
}

function evaluateCandidate(
  provider:
    MarketDataProviderDefinition,
  healthStore:
    ProviderHealthStore,
  request:
    ProviderSelectionRequest,
  environment:
    Record<string, string | undefined>
): ProviderSelectionCandidate {
  const reasons:
    string[] = [];

  let eligible =
    true;

  if (
    !provider.enabled &&
    !request.allowDisabled
  ) {
    eligible =
      false;

    reasons.push(
      "Provider is disabled."
    );
  }

  if (
    request.excludedProviders?.includes(
      provider.id
    )
  ) {
    eligible =
      false;

    reasons.push(
      "Provider is explicitly excluded."
    );
  }

  if (
    !providerSupportsCapability(
      provider,
      request.capability
    )
  ) {
    eligible =
      false;

    reasons.push(
      "Provider does not support the requested capability."
    );
  }

  if (
    !providerSupportsAssetType(
      provider,
      request.assetType
    )
  ) {
    eligible =
      false;

    reasons.push(
      "Provider does not support the requested asset type."
    );
  }

  if (
    !providerSupportsRegion(
      provider,
      request.region
    )
  ) {
    eligible =
      false;

    reasons.push(
      "Provider does not support the requested region."
    );
  }

  if (
    !providerSupportsExchange(
      provider,
      request.exchange
    )
  ) {
    eligible =
      false;

    reasons.push(
      "Provider does not support the requested exchange."
    );
  }

  if (
    provider.requiresApiKey &&
    !providerApiKeyConfigured(
      provider,
      environment
    )
  ) {
    eligible =
      false;

    reasons.push(
      `Required environment key ${provider.environmentKey || "UNKNOWN"} is not configured.`
    );
  }

  const requiredBatchSize =
    request.requiredBatchSize ||
    request.symbols?.length ||
    1;

  if (
    requiredBatchSize > 1 &&
    !provider.supportsBatch
  ) {
    eligible =
      false;

    reasons.push(
      "Provider does not support batch requests."
    );
  }

  if (
    provider.maxBatchSize !== null &&
    requiredBatchSize >
      provider.maxBatchSize
  ) {
    eligible =
      false;

    reasons.push(
      `Required batch size ${requiredBatchSize} exceeds provider maximum ${provider.maxBatchSize}.`
    );
  }

  const latency =
    latencyEligibility(
      provider,
      request
    );

  if (
    !latency.eligible
  ) {
    eligible =
      false;

    if (
      latency.reason
    ) {
      reasons.push(
        latency.reason
      );
    }
  }

  const health =
    healthForProvider(
      healthStore,
      provider
    );

  if (
    !providerCircuitAllowsRequest(
      health
    )
  ) {
    eligible =
      false;

    reasons.push(
      "Provider circuit breaker is open."
    );
  }

  if (
    health.operationalState ===
    "UNHEALTHY"
  ) {
    reasons.push(
      "Provider health is currently unhealthy."
    );
  }

  if (
    health.operationalState ===
    "DEGRADED"
  ) {
    reasons.push(
      "Provider health is currently degraded."
    );
  }

  const priorityScore =
    clamp(
      100 -
      provider.priority
    );

  const batchBonus =
    requiredBatchSize > 1 &&
    provider.supportsBatch
      ? 10
      : 0;

  const healthyBonus =
    health.operationalState ===
    "HEALTHY"
      ? 10
      : 0;

  const degradedPenalty =
    health.operationalState ===
    "DEGRADED"
      ? 15
      : 0;

  const unhealthyPenalty =
    health.operationalState ===
    "UNHEALTHY"
      ? 40
      : 0;

  const rateLimitPenalty =
    health.rateLimited
      ? 25
      : 0;

  const timeoutPenalty =
    health.timedOut
      ? 15
      : 0;

  const score =
    clamp(
      health.healthScore *
        0.5 +
      priorityScore *
        0.3 +
      preferenceBonus(
        provider,
        request
      ) +
      batchBonus +
      healthyBonus -
      degradedPenalty -
      unhealthyPenalty -
      rateLimitPenalty -
      timeoutPenalty
    );

  if (
    eligible
  ) {
    reasons.push(
      `Eligible with selection score ${score.toFixed(1)}.`
    );
  }

  return {
    provider,
    health,
    eligible,
    score,
    reasons,
  };
}

export function selectMarketDataProvider(
  providers:
    MarketDataProviderDefinition[],
  healthStore:
    ProviderHealthStore,
  request:
    ProviderSelectionRequest,
  environment:
    Record<string, string | undefined> =
      process.env
): ProviderSelectionResult {
  const candidates =
    providers
      .map(
        (
          provider
        ) =>
          evaluateCandidate(
            provider,
            healthStore,
            request,
            environment
          )
      )
      .sort(
        (
          left,
          right
        ) => {
          if (
            left.eligible !==
            right.eligible
          ) {
            return left.eligible
              ? -1
              : 1;
          }

          if (
            right.score !==
            left.score
          ) {
            return (
              right.score -
              left.score
            );
          }

          return (
            left.provider.priority -
            right.provider.priority
          );
        }
      );

  return {
    selected:
      candidates.find(
        (
          candidate
        ) =>
          candidate.eligible
      ) ||
      null,

    candidates,

    request,

    generatedAt:
      new Date()
        .toISOString(),
  };
}

export function providerFallbackOrder(
  selection:
    ProviderSelectionResult
): MarketDataProviderDefinition[] {
  return selection.candidates
    .filter(
      (
        candidate
      ) =>
        candidate.eligible
    )
    .map(
      (
        candidate
      ) =>
        candidate.provider
    );
}
