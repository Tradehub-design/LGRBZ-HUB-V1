import {
  providerApiKeyConfigured,
  providerSupportsCapability,
} from "./providerRegistry";
import {
  healthForProvider,
} from "./providerHealth";
import type {
  MarketDataDiagnosticSummary,
  MarketDataProviderDefinition,
  ProviderHealthStore,
} from "./marketDataTypes";

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

export function createMarketDataDiagnosticSummary(
  providers:
    MarketDataProviderDefinition[],
  healthStore:
    ProviderHealthStore,
  environment:
    Record<string, string | undefined> =
      process.env
): MarketDataDiagnosticSummary {
  const rows =
    providers.map(
      (
        provider
      ) => {
        const health =
          healthForProvider(
            healthStore,
            provider
          );

        return {
          id:
            provider.id,

          name:
            provider.name,

          enabled:
            provider.enabled,

          priority:
            provider.priority,

          operationalState:
            health.operationalState,

          circuitState:
            health.circuitState,

          healthScore:
            health.healthScore,

          averageLatencyMs:
            health.averageLatencyMs,

          apiKeyConfigured:
            providerApiKeyConfigured(
              provider,
              environment
            ),

          capabilities:
            provider.capabilities
              .filter(
                (
                  capability
                ) =>
                  capability.supported
              )
              .map(
                (
                  capability
                ) =>
                  capability.capability
              ),
        };
      }
    );

  const enabledRows =
    rows.filter(
      (
        row
      ) =>
        row.enabled
    );

  const providersRequiringKeys =
    providers.filter(
      (
        provider
      ) =>
        provider.requiresApiKey
    );

  const configuredApiKeyCount =
    providersRequiringKeys.filter(
      (
        provider
      ) =>
        providerApiKeyConfigured(
          provider,
          environment
        )
    ).length;

  return {
    generatedAt:
      new Date()
        .toISOString(),

    providerCount:
      providers.length,

    enabledProviderCount:
      enabledRows.length,

    healthyProviderCount:
      rows.filter(
        (
          row
        ) =>
          row.operationalState ===
          "HEALTHY"
      ).length,

    degradedProviderCount:
      rows.filter(
        (
          row
        ) =>
          row.operationalState ===
          "DEGRADED"
      ).length,

    unhealthyProviderCount:
      rows.filter(
        (
          row
        ) =>
          row.operationalState ===
          "UNHEALTHY"
      ).length,

    openCircuitCount:
      rows.filter(
        (
          row
        ) =>
          row.circuitState ===
          "OPEN"
      ).length,

    averageHealthScore:
      round(
        average(
          enabledRows.map(
            (
              row
            ) =>
              row.healthScore
          )
        )
      ),

    averageLatencyMs:
      round(
        average(
          enabledRows
            .filter(
              (
                row
              ) =>
                row.averageLatencyMs >
                0
            )
            .map(
              (
                row
              ) =>
                row.averageLatencyMs
            )
        )
      ),

    quoteProviderCount:
      providers.filter(
        (
          provider
        ) =>
          providerSupportsCapability(
            provider,
            "QUOTE"
          )
      ).length,

    dividendProviderCount:
      providers.filter(
        (
          provider
        ) =>
          providerSupportsCapability(
            provider,
            "DIVIDENDS"
          )
      ).length,

    batchProviderCount:
      providers.filter(
        (
          provider
        ) =>
          provider.supportsBatch
      ).length,

    configuredApiKeyCount,

    missingApiKeyCount:
      Math.max(
        0,
        providersRequiringKeys.length -
        configuredApiKeyCount
      ),

    providers:
      rows,
  };
}
