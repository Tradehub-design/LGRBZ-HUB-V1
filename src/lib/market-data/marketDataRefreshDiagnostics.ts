import {
  getSharedMarketDataRefreshCoordinator,
  MarketDataRefreshCoordinator,
} from "./marketDataRefreshCoordinator";
import type {
  MarketDataRefreshDiagnosticSummary,
} from "./marketDataRefreshTypes";
import {
  getSharedMultiProviderQuoteResolver,
} from "./multiProviderQuoteResolver";

function newestFirst<T extends {
  updatedAt: string;
}>(
  rows:
    T[]
): T[] {
  return [
    ...rows,
  ].sort(
    (
      left,
      right
    ) =>
      new Date(
        right.updatedAt
      ).getTime() -
      new Date(
        left.updatedAt
      ).getTime()
  );
}

export function createMarketDataRefreshDiagnosticSummary(
  coordinator:
    MarketDataRefreshCoordinator =
      getSharedMarketDataRefreshCoordinator()
):
  MarketDataRefreshDiagnosticSummary {
  const jobs =
    coordinator.getJobs();

  return {
    generatedAt:
      new Date()
        .toISOString(),

    policy:
      coordinator.getPolicy(),

    statistics:
      coordinator.statistics(),

    activeJobs:
      newestFirst(
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "RUNNING"
        )
      ),

    queuedJobs:
      newestFirst(
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "QUEUED"
        )
      ),

    retryJobs:
      newestFirst(
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "RETRY_WAIT"
        )
      ),

    recentCompletedJobs:
      newestFirst(
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "COMPLETED"
        )
      ).slice(
        0,
        50
      ),

    recentFailedJobs:
      newestFirst(
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "FAILED"
        )
      ).slice(
        0,
        50
      ),

    providerHealth:
      getSharedMultiProviderQuoteResolver()
        .getHealthStore(),
  };
}
