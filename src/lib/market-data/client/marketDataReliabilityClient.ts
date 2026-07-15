"use client";

import type {
  MarketDataApiEnvelope,
  MarketDataCacheDiagnostic,
  MarketDataClientDiagnostic,
  MarketDataEndpointDiagnostic,
  MarketDataEnvironmentDiagnostic,
  MarketDataProviderDiagnostic,
  MarketDataRefreshDiagnostic,
  MarketDataReliabilitySnapshot,
  MarketDataReliabilityStatus,
} from "../marketDataReliabilityTypes";
import {
  useLiveQuoteStore,
} from "./liveQuoteStore";

type UnknownRecord =
  Record<string, unknown>;

type EndpointDefinition = {
  key: string;
  label: string;
  path: string;
};

const ENDPOINTS:
  EndpointDefinition[] = [
    {
      key: "health",
      label: "Provider health",
      path: "/api/market-data/health",
    },
    {
      key: "CACHE",
      label: "Quote cache",
      path: "/api/market-data/cache",
    },
    {
      key: "refresh",
      label: "Refresh coordinator",
      path: "/api/market-data/refresh",
    },
    {
      key: "market-hours",
      label: "Market hours",
      path: "/api/market-data/market-hours",
    },
  ];

function record(
  value: unknown
): UnknownRecord {
  return (
    value &&
    typeof value === "object"
      ? value
      : {}
  ) as UnknownRecord;
}

function array(
  value: unknown
): unknown[] {
  return Array.isArray(value)
    ? value
    : [];
}

function numberValue(
  value: unknown,
  fallback = 0
): number {
  const parsed =
    Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function booleanValue(
  value: unknown
): boolean {
  return Boolean(value);
}

function stringValue(
  value: unknown,
  fallback = ""
): string {
  return typeof value === "string"
    ? value
    : fallback;
}

function rate(
  successful: number,
  failed: number
): number {
  const total =
    successful +
    failed;

  return total > 0
    ? (
        successful /
        total
      ) *
      100
    : 100;
}

function reliabilityStatus({
  critical,
  degraded,
}: {
  critical: boolean;
  degraded: boolean;
}): MarketDataReliabilityStatus {
  if (critical) {
    return "CRITICAL";
  }

  if (degraded) {
    return "DEGRADED";
  }

  return "HEALTHY";
}

async function requestEnvelope(
  path: string,
  signal?: AbortSignal
): Promise<{
  responseStatus: number;
  durationMs: number;
  envelope:
    MarketDataApiEnvelope<unknown>;
}> {
  const started =
    performance.now();

  const response =
    await fetch(
      path,
      {
        method: "GET",
        cache: "no-store",
        signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

  const durationMs =
    Math.round(
      performance.now() -
      started
    );

  let envelope:
    MarketDataApiEnvelope<unknown>;

  try {
    envelope =
      await response.json() as
        MarketDataApiEnvelope<unknown>;
  } catch {
    envelope = {
      ok: false,
      generatedAt:
        new Date()
          .toISOString(),
      error: {
        code: "INVALID_JSON",
        message:
          "The endpoint did not return valid JSON.",
      },
    };
  }

  return {
    responseStatus:
      response.status,

    durationMs,

    envelope,
  };
}

async function diagnoseEndpoint(
  endpoint:
    EndpointDefinition,
  signal?: AbortSignal
): Promise<{
  diagnostic:
    MarketDataEndpointDiagnostic;

  data: unknown;
}> {
  try {
    const result =
      await requestEnvelope(
        endpoint.path,
        signal
      );

    const online =
      result.responseStatus >= 200 &&
      result.responseStatus < 300 &&
      result.envelope.ok;

    const degraded =
      result.responseStatus >= 200 &&
      result.responseStatus < 500;

    return {
      diagnostic: {
        ...endpoint,

        status:
          online
            ? "ONLINE"
            : degraded
              ? "DEGRADED"
              : "OFFLINE",

        responseStatus:
          result.responseStatus,

        durationMs:
          result.durationMs,

        message:
          online
            ? "Endpoint responded successfully."
            : result.envelope.error?.message ||
              "Endpoint returned an unsuccessful response.",

        testedAt:
          new Date()
            .toISOString(),
      },

      data:
        result.envelope.data,
    };
  } catch (error) {
    const aborted =
      error instanceof DOMException &&
      error.name === "AbortError";

    return {
      diagnostic: {
        ...endpoint,

        status:
          aborted
            ? "UNTESTED"
            : "OFFLINE",

        responseStatus:
          null,

        durationMs:
          null,

        message:
          aborted
            ? "Endpoint test was cancelled."
            : error instanceof Error
              ? error.message
              : "Unknown endpoint failure.",

        testedAt:
          new Date()
            .toISOString(),
      },

      data:
        null,
    };
  }
}

function providerDiagnostics(
  healthData: unknown
): MarketDataProviderDiagnostic[] {
  const root =
    record(healthData);

  const providerRoot =
    record(
      root.providers
    );

  const rows =
    array(
      providerRoot.providers ||
      providerRoot.providerHealth ||
      root.providers
    );

  return rows.map(
    (
      value
    ) => {
      const row =
        record(value);

      const successfulRequests =
        numberValue(
          row.successfulRequests ??
          row.successCount ??
          row.successes
        );

      const failedRequests =
        numberValue(
          row.failedRequests ??
          row.failureCount ??
          row.failures
        );

      const configured =
        booleanValue(
          row.configured ??
          row.hasCredentials ??
          row.enabled
        );

      const enabled =
        row.enabled === undefined
          ? true
          : booleanValue(
              row.enabled
            );

      const circuitOpen =
        booleanValue(
          row.circuitOpen ??
          row.isCircuitOpen
        );

      const successRate =
        numberValue(
          row.successRate,
          rate(
            successfulRequests,
            failedRequests
          )
        );

      const status =
        reliabilityStatus({
          critical:
            circuitOpen ||
            (
              successfulRequests +
              failedRequests >
              0 &&
              successRate <
              25
            ),

          degraded:
            !configured ||
            successRate <
            80,
        });

      return {
        provider:
          stringValue(
            row.provider ??
            row.id ??
            row.name,
            "UNKNOWN"
          ),

        status,

        enabled,
        configured,

        successfulRequests,
        failedRequests,

        successRate,

        averageLatencyMs:
          row.averageLatencyMs ===
          null ||
          row.averageLatencyMs ===
          undefined
            ? null
            : numberValue(
                row.averageLatencyMs
              ),

        lastSuccessAt:
          stringValue(
            row.lastSuccessAt,
            ""
          ) ||
          null,

        lastFailureAt:
          stringValue(
            row.lastFailureAt,
            ""
          ) ||
          null,

        circuitOpen,

        message:
          circuitOpen
            ? "Provider circuit breaker is open."
            : !configured
              ? "Provider credentials are not configured."
              : successRate < 80
                ? "Provider success rate is below target."
                : "Provider is operating normally.",
      };
    }
  );
}

function cacheDiagnostic(
  cacheData: unknown
): MarketDataCacheDiagnostic {
  const root =
    record(cacheData);

  const statistics =
    record(
      root.statistics ||
      root.summary ||
      root
    );

  const entryCount =
    numberValue(
      statistics.entryCount ??
      statistics.totalEntries ??
      statistics.size
    );

  const freshEntryCount =
    numberValue(
      statistics.freshEntryCount ??
      statistics.freshEntries
    );

  const staleEntryCount =
    numberValue(
      statistics.staleEntryCount ??
      statistics.staleEntries
    );

  const expiredEntryCount =
    numberValue(
      statistics.expiredEntryCount ??
      statistics.expiredEntries
    );

  const hitCount =
    numberValue(
      statistics.hitCount ??
      statistics.hits
    );

  const missCount =
    numberValue(
      statistics.missCount ??
      statistics.misses
    );

  const hitRate =
    numberValue(
      statistics.hitRate,
      rate(
        hitCount,
        missCount
      )
    );

  const status =
    reliabilityStatus({
      critical:
        entryCount > 0 &&
        expiredEntryCount ===
        entryCount,

      degraded:
        staleEntryCount > 0 ||
        expiredEntryCount > 0 ||
        hitRate < 30,
    });

  return {
    status,

    entryCount,
    freshEntryCount,
    staleEntryCount,
    expiredEntryCount,

    hitCount,
    missCount,
    hitRate,

    message:
      status === "HEALTHY"
        ? "Quote cache is operating normally."
        : status === "DEGRADED"
          ? "Quote cache contains stale entries or has a low hit rate."
          : "Quote cache requires immediate attention.",
  };
}

function refreshDiagnostic(
  refreshData: unknown
): MarketDataRefreshDiagnostic {
  const root =
    record(refreshData);

  const coordinator =
    record(
      root.refresh ||
      root.coordinator ||
      root
    );

  const queue =
    record(
      coordinator.queue
    );

  const queuedCount =
    numberValue(
      queue.queuedCount ??
      coordinator.queuedCount
    );

  const runningCount =
    numberValue(
      queue.runningCount ??
      coordinator.runningCount
    );

  const completedCount =
    numberValue(
      coordinator.completedJobCount ??
      queue.succeededCount ??
      queue.completedCount
    );

  const failedCount =
    numberValue(
      coordinator.failedJobCount ??
      queue.failedCount
    );

  const deferredCount =
    numberValue(
      queue.deferredCount ??
      queue.retryWaitJobCount
    );

  const totalRequestedSymbols =
    numberValue(
      coordinator.totalRequestedSymbols
    );

  const totalSuccessfulSymbols =
    numberValue(
      coordinator.totalSuccessfulSymbols
    );

  const totalFailedSymbols =
    numberValue(
      coordinator.totalFailedSymbols
    );

  const successRate =
    rate(
      totalSuccessfulSymbols,
      totalFailedSymbols
    );

  const status =
    reliabilityStatus({
      critical:
        failedCount > 10 &&
        completedCount === 0,

      degraded:
        failedCount > 0 ||
        deferredCount > 0 ||
        successRate < 80,
    });

  return {
    status,

    queuedCount,
    runningCount,
    completedCount,
    failedCount,
    deferredCount,

    totalRequestedSymbols,
    totalSuccessfulSymbols,
    totalFailedSymbols,

    successRate,

    message:
      status === "HEALTHY"
        ? "Background refresh is operating normally."
        : status === "DEGRADED"
          ? "Some refresh jobs have failed or been deferred."
          : "Refresh coordination requires immediate attention.",
  };
}

function clientDiagnostic():
  MarketDataClientDiagnostic {
  const diagnostics =
    useLiveQuoteStore
      .getState()
      .diagnostics();

  const status =
    reliabilityStatus({
      critical:
        diagnostics.trackedSymbolCount >
          0 &&
        diagnostics.successCount ===
          0 &&
        diagnostics.errorCount >
          0,

      degraded:
        diagnostics.errorCount > 0 ||
        diagnostics.staleQuoteCount > 0 ||
        diagnostics.expiredQuoteCount > 0 ||
        diagnostics.offlineCount > 0,
    });

  return {
    status,

    trackedSymbolCount:
      diagnostics.trackedSymbolCount,

    loadingCount:
      diagnostics.loadingCount,

    refreshingCount:
      diagnostics.refreshingCount,

    successCount:
      diagnostics.successCount,

    errorCount:
      diagnostics.errorCount,

    offlineCount:
      diagnostics.offlineCount,

    liveQuoteCount:
      diagnostics.liveQuoteCount,

    delayedQuoteCount:
      diagnostics.delayedQuoteCount,

    staleQuoteCount:
      diagnostics.staleQuoteCount,

    expiredQuoteCount:
      diagnostics.expiredQuoteCount,

    averageQualityScore:
      diagnostics.averageQualityScore,

    averageConfidenceScore:
      diagnostics.averageConfidenceScore,

    message:
      status === "HEALTHY"
        ? "Client quote state is healthy."
        : status === "DEGRADED"
          ? "Some client quotes are delayed, stale, expired or unavailable."
          : "Client quote state requires immediate attention.",
  };
}

function environmentDiagnostics(
  healthData: unknown
): MarketDataEnvironmentDiagnostic[] {
  const root =
    record(healthData);

  const providerRoot =
    record(
      root.providers
    );

  const environment =
    array(
      providerRoot.environment ||
      root.environment
    );

  if (environment.length > 0) {
    return environment.map(
      (
        value
      ) => {
        const row =
          record(value);

        return {
          key:
            stringValue(
              row.key ??
              row.name,
              "UNKNOWN"
            ),

          label:
            stringValue(
              row.label ??
              row.name ??
              row.key,
              "Unknown setting"
            ),

          configured:
            booleanValue(
              row.configured ??
              row.present
            ),

          secret:
            row.secret === undefined
              ? true
              : booleanValue(
                  row.secret
                ),

          message:
            stringValue(
              row.message,
              booleanValue(
                row.configured ??
                row.present
              )
                ? "Configured."
                : "Not configured."
            ),
        };
      }
    );
  }

  return [];
}

function emptyCache():
  MarketDataCacheDiagnostic {
  return {
    status: "UNKNOWN",

    entryCount: 0,
    freshEntryCount: 0,
    staleEntryCount: 0,
    expiredEntryCount: 0,

    hitCount: 0,
    missCount: 0,
    hitRate: 0,

    message:
      "Cache diagnostics were unavailable.",
  };
}

function emptyRefresh():
  MarketDataRefreshDiagnostic {
  return {
    status: "UNKNOWN",

    queuedCount: 0,
    runningCount: 0,
    completedCount: 0,
    failedCount: 0,
    deferredCount: 0,

    totalRequestedSymbols: 0,
    totalSuccessfulSymbols: 0,
    totalFailedSymbols: 0,

    successRate: 0,

    message:
      "Refresh diagnostics were unavailable.",
  };
}

export async function fetchMarketDataReliabilitySnapshot(
  signal?: AbortSignal
): Promise<MarketDataReliabilitySnapshot> {
  const results =
    await Promise.all(
      ENDPOINTS.map(
        (
          endpoint
        ) =>
          diagnoseEndpoint(
            endpoint,
            signal
          )
      )
    );

  const endpoints =
    results.map(
      (
        result
      ) =>
        result.diagnostic
    );

  const dataByKey =
    Object.fromEntries(
      results.map(
        (
          result
        ) => [
          result.diagnostic.key,
          result.data,
        ]
      )
    );

  const providers =
    providerDiagnostics(
      dataByKey.health
    );

  const cache =
    dataByKey.cache
      ? cacheDiagnostic(
          dataByKey.cache
        )
      : emptyCache();

  const refreshSource =
    dataByKey.refresh ||
    dataByKey.health;

  const refresh =
    refreshSource
      ? refreshDiagnostic(
          refreshSource
        )
      : emptyRefresh();

  const client =
    clientDiagnostic();

  const environment =
    environmentDiagnostics(
      dataByKey.health
    );

  const statuses:
    MarketDataReliabilityStatus[] = [
      ...providers.map(
        (
          provider
        ) =>
          provider.status
      ),
      cache.status,
      refresh.status,
      client.status,
    ];

  const healthyCount =
    statuses.filter(
      (
        status
      ) =>
        status === "HEALTHY"
    ).length;

  const degradedCount =
    statuses.filter(
      (
        status
      ) =>
        status === "DEGRADED"
    ).length;

  const criticalCount =
    statuses.filter(
      (
        status
      ) =>
        status === "CRITICAL"
    ).length;

  const unknownCount =
    statuses.filter(
      (
        status
      ) =>
        status === "UNKNOWN"
    ).length;

  const endpointOnlineCount =
    endpoints.filter(
      (
        endpoint
      ) =>
        endpoint.status ===
        "ONLINE"
    ).length;

  const status:
    MarketDataReliabilityStatus =
      criticalCount > 0 ||
      endpointOnlineCount === 0
        ? "CRITICAL"
        : degradedCount > 0 ||
            endpointOnlineCount <
            endpoints.length
          ? "DEGRADED"
          : "HEALTHY";

  const warnings: string[] = [];

  for (const endpoint of endpoints) {
    if (
      endpoint.status !==
      "ONLINE"
    ) {
      warnings.push(
        `${endpoint.label}: ${endpoint.message}`
      );
    }
  }

  for (const provider of providers) {
    if (
      provider.status !==
      "HEALTHY"
    ) {
      warnings.push(
        `${provider.provider}: ${provider.message}`
      );
    }
  }

  if (
    cache.status !==
    "HEALTHY"
  ) {
    warnings.push(
      cache.message
    );
  }

  if (
    refresh.status !==
    "HEALTHY"
  ) {
    warnings.push(
      refresh.message
    );
  }

  if (
    client.status !==
    "HEALTHY"
  ) {
    warnings.push(
      client.message
    );
  }

  return {
    generatedAt:
      new Date()
        .toISOString(),

    status,

    summary: {
      healthyCount,
      degradedCount,
      criticalCount,
      unknownCount,

      endpointOnlineCount,

      endpointTotalCount:
        endpoints.length,

      configuredProviderCount:
        providers.filter(
          (
            provider
          ) =>
            provider.configured
        ).length,

      providerCount:
        providers.length,
    },

    endpoints,
    providers,
    cache,
    refresh,
    client,
    environment,

    warnings:
      Array.from(
        new Set(
          warnings
        )
      ),
  };
}
