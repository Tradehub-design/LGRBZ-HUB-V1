import {
  getSharedMarketDataRefreshCoordinator,
  type MarketDataRefreshCoordinator,
} from "./marketDataRefreshCoordinator";
import {
  getSharedMultiProviderQuoteResolver,
} from "./multiProviderQuoteResolver";
import type {
  MarketDataRefreshDiagnosticSummary,
  DiagnosticRefreshJob,
} from "./marketDataRefreshTypes";

type DiagnosticRefreshJob = {
  state?: string;
  updatedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
};

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
): DiagnosticRefreshJob[] {
  const surface =
    coordinatorSurface(
      coordinator
    );

  const value =
    typeof surface.getJobs === "function"
      ? surface.getJobs()
      : surface.jobs;

  return Array.isArray(value)
    ? value as DiagnosticRefreshJob[]
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
    DiagnosticRefreshJob[]
): DiagnosticRefreshJob[] {
  return [...jobs].sort(
    (
      left,
      right
    ) =>
      Date.parse(
        right.updatedAt ||
        right.createdAt ||
        ""
      ) -
      Date.parse(
        left.updatedAt ||
        left.createdAt ||
        ""
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
        String(job.state) === "RUNNING"
    );

  const queuedJobs =
    jobs.filter(
      job =>
        String(job.state) === "QUEUED"
    );

  const retryJobs =
    jobs.filter(
      job =>
        String(job.state) === "RETRY_WAIT"
    );

  const completedJobs =
    jobs.filter(
      job =>
        String(job.state) === "COMPLETED"
    );

  const failedJobs =
    jobs.filter(
      job =>
        String(job.state) === "FAILED"
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
