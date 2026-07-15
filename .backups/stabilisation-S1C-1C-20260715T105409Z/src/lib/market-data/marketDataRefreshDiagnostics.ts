import {
  getSharedMarketDataRefreshCoordinator,
  type MarketDataRefreshCoordinator,
} from "./marketDataRefreshCoordinator";
import {
  getSharedMultiProviderQuoteResolver,
} from "./multiProviderQuoteResolver";
import type {
  MarketDataRefreshDiagnosticSummary,
  MarketDataRefreshJob,
} from "./marketDataRefreshTypes";

type CoordinatorSurface = {
  getJobs?: () => unknown;
  getPolicy?: () => unknown;
  getStatistics?: () => unknown;

  jobs?: unknown;
  policy?: unknown;
  statistics?: unknown;
};

function coordinatorSurface(
  coordinator:
    MarketDataRefreshCoordinator
): CoordinatorSurface {
  return coordinator as unknown as
    CoordinatorSurface;
}

function getJobs(
  coordinator:
    MarketDataRefreshCoordinator
): MarketDataRefreshJob[] {
  const surface =
    coordinatorSurface(
      coordinator
    );

  const value =
    typeof surface.getJobs === "function"
      ? surface.getJobs()
      : surface.jobs;

  return Array.isArray(value)
    ? value as MarketDataRefreshJob[]
    : [];
}

function getPolicy(
  coordinator:
    MarketDataRefreshCoordinator
): unknown {
  const surface =
    coordinatorSurface(
      coordinator
    );

  return typeof surface.getPolicy === "function"
    ? surface.getPolicy()
    : surface.policy ?? null;
}

function getStatistics(
  coordinator:
    MarketDataRefreshCoordinator
): unknown {
  const surface =
    coordinatorSurface(
      coordinator
    );

  return typeof surface.getStatistics === "function"
    ? surface.getStatistics()
    : surface.statistics ?? null;
}

function newestFirst(
  jobs:
    MarketDataRefreshJob[]
): MarketDataRefreshJob[] {
  return [...jobs].sort(
    (
      left,
      right
    ) =>
      Date.parse(
        right.updatedAt
      ) -
      Date.parse(
        left.updatedAt
      )
  );
}

export function createMarketDataRefreshDiagnosticSummary(
  coordinator:
    MarketDataRefreshCoordinator =
      getSharedMarketDataRefreshCoordinator()
): MarketDataRefreshDiagnosticSummary {
  const jobs =
    newestFirst(
      getJobs(
        coordinator
      )
    );

  const activeJobs =
    jobs.filter(
      job =>
        job.state === "RUNNING"
    );

  const queuedJobs =
    jobs.filter(
      job =>
        job.state === "QUEUED"
    );

  const retryJobs =
    jobs.filter(
      job =>
        job.state === "RETRY_WAIT"
    );

  const completedJobs =
    jobs.filter(
      job =>
        job.state === "COMPLETED"
    );

  const failedJobs =
    jobs.filter(
      job =>
        job.state === "FAILED"
    );

  return {
    generatedAt:
      new Date().toISOString(),

    policy:
      getPolicy(
        coordinator
      ),

    statistics:
      getStatistics(
        coordinator
      ),

    jobs,

    activeJobs,
    queuedJobs,
    retryJobs,

    completedJobs,
    failedJobs,

    recentCompletedJobs:
      completedJobs.slice(
        0,
        50
      ),

    recentFailedJobs:
      failedJobs.slice(
        0,
        50
      ),

    activeJobCount:
      activeJobs.length,

    queuedJobCount:
      queuedJobs.length,

    completedJobCount:
      completedJobs.length,

    failedJobCount:
      failedJobs.length,

    warnings:
      retryJobs.length > 0
        ? [
            `${retryJobs.length} refresh job(s) are waiting to retry.`,
          ]
        : [],

    providerHealth:
      getSharedMultiProviderQuoteResolver()
        .getHealthStore(),
  };
}
