import {
  getMarketClock,
} from "./marketClock";
import {
  getSharedMarketDataRequestBudget,
  MarketDataRequestBudget,
} from "./marketDataRequestBudget";
import type {
  MarketDataRefreshJob,
  MarketDataRefreshJobInput,
  MarketDataRefreshPriority,
  MarketDataRefreshQueuePolicy,
  MarketDataRefreshQueueStatistics,
} from "./marketDataRefreshTypes";
import type {
  MarketDataProviderId,
} from "./marketDataTypes";
import {
  getSharedMultiProviderQuoteResolver,
  MultiProviderQuoteResolver,
} from "./multiProviderQuoteResolver";

const DEFAULT_POLICY:
  MarketDataRefreshQueuePolicy = {
    maximumQueueSize:
      1_000,

    maximumConcurrency:
      6,

    defaultMaximumRetries:
      3,

    baseRetryDelayMs:
      2_000,

    maximumRetryDelayMs:
      120_000,

    completedJobRetentionMs:
      3_600_000,

    failedJobRetentionMs:
      7_200_000,

    marketOpenMinimumIntervalMs:
      30_000,

    marketClosedMinimumIntervalMs:
      900_000,
  };

const PRIORITY_WEIGHT:
  Record<
    MarketDataRefreshPriority,
    number
  > = {
    CRITICAL:
      500,

    HIGH:
      400,

    NORMAL:
      300,

    LOW:
      200,

    BACKGROUND:
      100,
  };

function nowIso():
  string {
  return new Date()
    .toISOString();
}

function createId():
  string {
  return [
    "refresh",
    Date.now(),
    Math.random()
      .toString(
        36
      )
      .slice(
        2,
        10
      ),
  ].join(
    "-"
  );
}

function normaliseSymbol(
  value:
    string
): string {
  return value
    .trim()
    .toUpperCase();
}

function deduplicationKey(
  input:
    MarketDataRefreshJobInput
): string {
  return [
    normaliseSymbol(
      input.symbol
    ),

    input.exchange ||
    "UNKNOWN",

    input.currency ||
    "ANY",

    input.compareProviders
      ? "COMPARE"
      : "BEST",

    input.forceRefresh
      ? "FORCE"
      : "CACHE_OK",
  ].join(
    "::"
  );
}

function retryDelay(
  attempt:
    number,
  policy:
    MarketDataRefreshQueuePolicy
): number {
  const exponential =
    policy.baseRetryDelayMs *
    2 **
      Math.max(
        0,
        attempt -
        1
      );

  const jitter =
    Math.floor(
      Math.random() *
      Math.max(
        250,
        exponential *
        0.2
      )
    );

  return Math.min(
    policy.maximumRetryDelayMs,
    exponential +
      jitter
  );
}

function average(
  values:
    number[]
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

export class MarketDataRefreshCoordinator {
  private readonly jobs =
    new Map<
      string,
      MarketDataRefreshJob
    >();

  private readonly deduplicationMap =
    new Map<
      string,
      string
    >();

  private runningCount =
    0;

  private processing =
    false;

  private totalSubmitted =
    0;

  private totalCompleted =
    0;

  private totalFailed =
    0;

  private totalRetried =
    0;

  private totalCancelled =
    0;

  private totalDeduplicated =
    0;

  private readonly policy:
    MarketDataRefreshQueuePolicy;

  constructor(
    private readonly dependencies: {
      resolver?:
        MultiProviderQuoteResolver;

      requestBudget?:
        MarketDataRequestBudget;

      policy?:
        Partial<
          MarketDataRefreshQueuePolicy
        >;
    } = {}
  ) {
    this.policy = {
      ...DEFAULT_POLICY,
      ...dependencies.policy,
    };
  }

  getPolicy():
    MarketDataRefreshQueuePolicy {
    return {
      ...this.policy,
    };
  }

  private resolver():
    MultiProviderQuoteResolver {
    return (
      this.dependencies
        .resolver ||
      getSharedMultiProviderQuoteResolver()
    );
  }

  private budget():
    MarketDataRequestBudget {
    return (
      this.dependencies
        .requestBudget ||
      getSharedMarketDataRequestBudget()
    );
  }

  getJob(
    id:
      string
  ):
    MarketDataRefreshJob |
    null {
    return (
      this.jobs.get(
        id
      ) ||
      null
    );
  }

  getJobs():
    MarketDataRefreshJob[] {
    return Array.from(
      this.jobs.values()
    );
  }

  submit(
    input:
      MarketDataRefreshJobInput
  ):
    MarketDataRefreshJob {
    const key =
      deduplicationKey(
        input
      );

    const existingId =
      this.deduplicationMap.get(
        key
      );

    const existing =
      existingId
        ? this.jobs.get(
            existingId
          )
        : null;

    if (
      existing &&
      [
        "QUEUED",
        "RUNNING",
        "RETRY_WAIT",
      ].includes(
        existing.state
      )
    ) {
      const updated = {
        ...existing,

        joinedRequestCount:
          existing.joinedRequestCount +
          1,

        updatedAt:
          nowIso(),
      };

      this.jobs.set(
        existing.id,
        updated
      );

      this.totalDeduplicated +=
        1;

      return {
        ...updated,

        state:
          existing.state,
      };
    }

    if (
      this.jobs.size >=
      this.policy
        .maximumQueueSize
    ) {
      this.prune();

      if (
        this.jobs.size >=
        this.policy
          .maximumQueueSize
      ) {
        throw new Error(
          "Market-data refresh queue is full."
        );
      }
    }

    const timestamp =
      nowIso();

    const job:
      MarketDataRefreshJob = {
      id:
        createId(),

      deduplicationKey:
        key,

      input: {
        ...input,

        symbol:
          normaliseSymbol(
            input.symbol
          ),
      },

      state:
        "QUEUED",

      priority:
        input.priority ||
        "NORMAL",

      trigger:
        input.trigger ||
        "BACKGROUND",

      createdAt:
        timestamp,

      updatedAt:
        timestamp,

      startedAt:
        null,

      finishedAt:
        null,

      nextRetryAt:
        null,

      attemptCount:
        0,

      maximumRetries:
        input.maximumRetries ??
        this.policy
          .defaultMaximumRetries,

      result:
        null,

      selectedProvider:
        null,

      errorCode:
        null,

      errorMessage:
        null,

      durationMs:
        null,

      joinedRequestCount:
        0,
    };

    this.jobs.set(
      job.id,
      job
    );

    this.deduplicationMap.set(
      key,
      job.id
    );

    this.totalSubmitted +=
      1;

    void this.process();

    return job;
  }

  submitMany(
    inputs:
      MarketDataRefreshJobInput[]
  ):
    MarketDataRefreshJob[] {
    return inputs.map(
      (
        input
      ) =>
        this.submit(
          input
        )
    );
  }

  cancel(
    id:
      string
  ):
    boolean {
    const job =
      this.jobs.get(
        id
      );

    if (
      !job ||
      [
        "COMPLETED",
        "FAILED",
        "CANCELLED",
      ].includes(
        job.state
      )
    ) {
      return false;
    }

    this.jobs.set(
      id,
      {
        ...job,

        state:
          "CANCELLED",

        updatedAt:
          nowIso(),

        finishedAt:
          nowIso(),

        errorCode:
          "CANCELLED",

        errorMessage:
          "Refresh job was cancelled.",
      }
    );

    this.deduplicationMap.delete(
      job.deduplicationKey
    );

    this.totalCancelled +=
      1;

    return true;
  }

  private nextRunnableJob():
    MarketDataRefreshJob |
    null {
    const now =
      Date.now();

    const candidates =
      this.getJobs()
        .filter(
          (
            job
          ) => {
            if (
              job.state ===
              "QUEUED"
            ) {
              return true;
            }

            if (
              job.state ===
                "RETRY_WAIT" &&
              job.nextRetryAt
            ) {
              return (
                new Date(
                  job.nextRetryAt
                ).getTime() <=
                now
              );
            }

            return false;
          }
        )
        .sort(
          (
            left,
            right
          ) => {
            const priorityDifference =
              PRIORITY_WEIGHT[
                right.priority
              ] -
              PRIORITY_WEIGHT[
                left.priority
              ];

            if (
              priorityDifference !==
              0
            ) {
              return priorityDifference;
            }

            return (
              new Date(
                left.createdAt
              ).getTime() -
              new Date(
                right.createdAt
              ).getTime()
            );
          }
        );

    return (
      candidates[
        0
      ] ||
      null
    );
  }

  private providerCandidates(
    job:
      MarketDataRefreshJob
  ):
    MarketDataProviderId[] {
    return (
      job.input
        .providerPreference &&
      job.input
        .providerPreference
        .length >
        0
    )
      ? job.input
          .providerPreference
      : [
          "YAHOO_FINANCE",
          "FINNHUB",
          "TWELVE_DATA",
          "ALPHA_VANTAGE",
        ];
  }

  private async execute(
    job:
      MarketDataRefreshJob
  ): Promise<void> {
    const started =
      Date.now();

    const runningJob:
      MarketDataRefreshJob = {
      ...job,

      state:
        "RUNNING",

      startedAt:
        new Date(
          started
        ).toISOString(),

      updatedAt:
        new Date(
          started
        ).toISOString(),

      nextRetryAt:
        null,

      attemptCount:
        job.attemptCount +
        1,

      errorCode:
        null,

      errorMessage:
        null,
    };

    this.jobs.set(
      job.id,
      runningJob
    );

    this.runningCount +=
      1;

    try {
      const candidates =
        this.providerCandidates(
          runningJob
        );

      const availableProviders:
        MarketDataProviderId[] =
          [];

      let shortestRetry =
        Number.POSITIVE_INFINITY;

      for (
        const provider of
        candidates
      ) {
        const decision =
          this.budget()
            .canRequest(
              provider
            );

        if (
          decision.allowed
        ) {
          availableProviders.push(
            provider
          );
        } else {
          shortestRetry =
            Math.min(
              shortestRetry,
              decision.retryAfterMs
            );
        }
      }

      if (
        availableProviders.length ===
        0
      ) {
        const delay =
          Number.isFinite(
            shortestRetry
          )
            ? shortestRetry
            : this.policy
                .baseRetryDelayMs;

        this.jobs.set(
          job.id,
          {
            ...runningJob,

            state:
              "RETRY_WAIT",

            updatedAt:
              nowIso(),

            nextRetryAt:
              new Date(
                Date.now() +
                delay
              ).toISOString(),

            errorCode:
              "REQUEST_BUDGET_EXHAUSTED",

            errorMessage:
              "All preferred provider request budgets are exhausted.",
          }
        );

        this.totalRetried +=
          1;

        return;
      }

      for (
        const provider of
        availableProviders
      ) {
        this.budget()
          .consume(
            provider
          );
      }

      const marketClock =
        getMarketClock(
          runningJob.input
            .exchange ||
          "UNKNOWN"
        );

      const result =
        await this.resolver()
          .resolve({
            symbol:
              runningJob.input.symbol,

            assetType:
              runningJob.input.assetType,

            region:
              runningJob.input.region,

            exchange:
              runningJob.input.exchange,

            currency:
              runningJob.input.currency,

            providerPreference:
              availableProviders,

            excludedProviders:
              runningJob.input
                .excludedProviders,

            allowDelayed:
              true,

            allowIndicative:
              false,

            allowStale:
              marketClock.state !==
              "OPEN",

            allowExpiredFallback:
              marketClock.state ===
                "WEEKEND" ||
              marketClock.state ===
                "HOLIDAY",

            forceRefresh:
              runningJob.input
                .forceRefresh ??
              true,

            compareProviders:
              runningJob.input
                .compareProviders,

            minimumQualityScore:
              runningJob.input
                .minimumQualityScore,

            maximumProviderAttempts:
              runningJob.input
                .maximumProviderAttempts,

            timeoutMs:
              runningJob.input
                .timeoutMs,
          });

      const finished =
        Date.now();

      if (
        !result.successful ||
        !result.quote
      ) {
        throw new Error(
          result.errors[
            0
          ]?.message ||
          result.warnings[
            0
          ] ||
          "Market-data refresh did not return a usable quote."
        );
      }

      this.jobs.set(
        job.id,
        {
          ...runningJob,

          state:
            "COMPLETED",

          updatedAt:
            new Date(
              finished
            ).toISOString(),

          finishedAt:
            new Date(
              finished
            ).toISOString(),

          result:
            result.quote,

          selectedProvider:
            result.selectedProvider,

          durationMs:
            finished -
            started,

          errorCode:
            null,

          errorMessage:
            null,
        }
      );

      this.deduplicationMap.delete(
        job.deduplicationKey
      );

      this.totalCompleted +=
        1;
    } catch (
      error
    ) {
      const failedAt =
        Date.now();

      const latest =
        this.jobs.get(
          job.id
        ) ||
        runningJob;

      const canRetry =
        latest.attemptCount <=
        latest.maximumRetries;

      if (
        canRetry
      ) {
        const delay =
          retryDelay(
            latest.attemptCount,
            this.policy
          );

        this.jobs.set(
          job.id,
          {
            ...latest,

            state:
              "RETRY_WAIT",

            updatedAt:
              new Date(
                failedAt
              ).toISOString(),

            nextRetryAt:
              new Date(
                failedAt +
                delay
              ).toISOString(),

            errorCode:
              "REFRESH_ATTEMPT_FAILED",

            errorMessage:
              error instanceof Error
                ? error.message
                : "Unknown refresh failure.",

            durationMs:
              failedAt -
              started,
          }
        );

        this.totalRetried +=
          1;
      } else {
        this.jobs.set(
          job.id,
          {
            ...latest,

            state:
              "FAILED",

            updatedAt:
              new Date(
                failedAt
              ).toISOString(),

            finishedAt:
              new Date(
                failedAt
              ).toISOString(),

            errorCode:
              "REFRESH_FAILED",

            errorMessage:
              error instanceof Error
                ? error.message
                : "Unknown refresh failure.",

            durationMs:
              failedAt -
              started,
          }
        );

        this.deduplicationMap.delete(
          job.deduplicationKey
        );

        this.totalFailed +=
          1;
      }
    } finally {
      this.runningCount =
        Math.max(
          0,
          this.runningCount -
          1
        );

      queueMicrotask(
        () => {
          void this.process();
        }
      );
    }
  }

  async process():
    Promise<void> {
    if (
      this.processing
    ) {
      return;
    }

    this.processing =
      true;

    try {
      while (
        this.runningCount <
        this.policy
          .maximumConcurrency
      ) {
        const job =
          this.nextRunnableJob();

        if (
          !job
        ) {
          break;
        }

        void this.execute(
          job
        );
      }
    } finally {
      this.processing =
        false;
    }
  }

  prune(
    now =
      new Date()
  ):
    number {
    let removed =
      0;

    for (
      const [
        id,
        job,
      ] of
      this.jobs
    ) {
      if (
        !job.finishedAt
      ) {
        continue;
      }

      const age =
        now.getTime() -
        new Date(
          job.finishedAt
        ).getTime();

      const retention =
        job.state ===
          "FAILED"
          ? this.policy
              .failedJobRetentionMs
          : this.policy
              .completedJobRetentionMs;

      if (
        age >
        retention
      ) {
        this.jobs.delete(
          id
        );

        this.deduplicationMap.delete(
          job.deduplicationKey
        );

        removed +=
          1;
      }
    }

    return removed;
  }

  statistics():
    MarketDataRefreshQueueStatistics {
    const jobs =
      this.getJobs();

    const completedDurations =
      jobs
        .filter(
          (
            job
          ) =>
            job.durationMs !==
            null
        )
        .map(
          (
            job
          ) =>
            job.durationMs ||
            0
        );

    const attempts =
      jobs.map(
        (
          job
        ) =>
          job.attemptCount
      );

    const jobsByPriority:
      Record<string, number> =
        {};

    const jobsByTrigger:
      Record<string, number> =
        {};

    const jobsByProvider:
      Record<string, number> =
        {};

    for (
      const job of
      jobs
    ) {
      jobsByPriority[
        job.priority
      ] =
        (
          jobsByPriority[
            job.priority
          ] ||
          0
        ) +
        1;

      jobsByTrigger[
        job.trigger
      ] =
        (
          jobsByTrigger[
            job.trigger
          ] ||
          0
        ) +
        1;

      const provider =
        job.selectedProvider ||
        "UNSELECTED";

      jobsByProvider[
        provider
      ] =
        (
          jobsByProvider[
            provider
          ] ||
          0
        ) +
        1;
    }

    return {
      generatedAt:
        nowIso(),

      totalJobCount:
        jobs.length,

      queuedJobCount:
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "QUEUED"
        ).length,

      runningJobCount:
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "RUNNING"
        ).length,

      retryWaitJobCount:
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "RETRY_WAIT"
        ).length,

      completedJobCount:
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "COMPLETED"
        ).length,

      failedJobCount:
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "FAILED"
        ).length,

      cancelledJobCount:
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            "CANCELLED"
        ).length,

      deduplicatedJobCount:
        this.totalDeduplicated,

      totalSubmitted:
        this.totalSubmitted,

      totalCompleted:
        this.totalCompleted,

      totalFailed:
        this.totalFailed,

      totalRetried:
        this.totalRetried,

      totalCancelled:
        this.totalCancelled,

      totalDeduplicated:
        this.totalDeduplicated,

      averageDurationMs:
        average(
          completedDurations
        ),

      averageAttempts:
        average(
          attempts
        ),

      queueUtilisationPercentage:
        (
          jobs.length /
          this.policy
            .maximumQueueSize
        ) *
        100,

      concurrencyUtilisationPercentage:
        (
          this.runningCount /
          this.policy
            .maximumConcurrency
        ) *
        100,

      jobsByPriority,
      jobsByTrigger,
      jobsByProvider,
    };
  }
}

let sharedRefreshCoordinator:
  MarketDataRefreshCoordinator | null =
    null;

export function getSharedMarketDataRefreshCoordinator():
  MarketDataRefreshCoordinator {
  if (
    !sharedRefreshCoordinator
  ) {
    sharedRefreshCoordinator =
      new MarketDataRefreshCoordinator();
  }

  return sharedRefreshCoordinator;
}

export function resetSharedMarketDataRefreshCoordinator():
  MarketDataRefreshCoordinator {
  sharedRefreshCoordinator =
    new MarketDataRefreshCoordinator();

  return sharedRefreshCoordinator;
}
