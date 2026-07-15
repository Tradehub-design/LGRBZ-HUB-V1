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



type RefreshCoordinatorDiagnosticSurface = {
  getJobs?: () => unknown[];
  getPolicy?: () => unknown;

  statistics?: unknown;
  jobs?: unknown[];
  policy?: unknown;
};

function coordinatorJobs(
  coordinator: unknown
): unknown[] {
  const surface =
    coordinator as
      RefreshCoordinatorDiagnosticSurface;

  if (
    typeof surface.getJobs ===
    "function"
  ) {
    const jobs =
      surface.getJobs();

    return Array.isArray(jobs)
      ? jobs
      : [];
  }

  return Array.isArray(
    surface.jobs
  )
    ? surface.jobs
    : [];
}

function coordinatorPolicy(
  coordinator: unknown
): unknown {
  const surface =
    coordinator as
      RefreshCoordinatorDiagnosticSurface;

  return (
    typeof surface.getPolicy ===
    "function"
  )
    ? surface.getPolicy()
    : surface.policy ??
      null;
}

function coordinatorStatistics(
  coordinator: unknown
): unknown {
  const surface =
    coordinator as
      RefreshCoordinatorDiagnosticSurface;

  return surface.statistics ??
    null;
}


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
    coordinatorJobs(coordinator);

  return {
    generatedAt:
      new Date()
        .toISOString(),

    policy:
      coordinatorPolicy(coordinator),

    statistics:
      coordinatorStatistics(coordinator)(),

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
