import type {
  CreateRefreshJobInput,
  MarketDataRefreshJob,
  MarketDataRefreshJobState,
  MarketDataRefreshPriority,
  MarketDataRefreshQueueSnapshot,
} from "./marketDataRefreshTypes";

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

function uniqueSymbols(
  symbols:
    string[]
): string[] {
  return Array.from(
    new Set(
      symbols
        .map(
          (
            symbol
          ) =>
            symbol
              .trim()
              .toUpperCase()
        )
        .filter(
          Boolean
        )
    )
  );
}

function jobKey(
  input:
    CreateRefreshJobInput
): string {
  return [
    input.profile ||
      "MANUAL",

    input.exchange ||
      "UNKNOWN",

    uniqueSymbols(
      input.symbols
    )
      .sort()
      .join(
        ","
      ),

    input.forceRefresh
      ? "FORCE"
      : "NORMAL",
  ].join(
    "::"
  );
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

export class MarketDataRefreshQueue {
  private readonly jobs =
    new Map<
      string,
      MarketDataRefreshJob
    >();

  enqueue(
    input:
      CreateRefreshJobInput
  ): MarketDataRefreshJob {
    const symbols =
      uniqueSymbols(
        input.symbols
      );

    if (
      symbols.length ===
      0
    ) {
      throw new Error(
        "At least one market-data symbol is required."
      );
    }

    const key =
      jobKey({
        ...input,
        symbols,
      });

    const existing =
      Array.from(
        this.jobs.values()
      ).find(
        (
          job
        ) =>
          job.key ===
            key &&
          [
            "QUEUED",
            "RUNNING",
            "DEFERRED",
          ].includes(
            job.state
          )
      );

    if (
      existing
    ) {
      return existing;
    }

    const now =
      new Date();

    const job:
      MarketDataRefreshJob = {
      id:
        createId(),

      key,

      symbols,

      exchange:
        input.exchange ||
        "UNKNOWN",

      currency:
        input.currency ||
        null,

      profile:
        input.profile ||
        "MANUAL",

      priority:
        input.priority ||
        "NORMAL",

      forceRefresh:
        input.forceRefresh ||
        false,

      compareProviders:
        input.compareProviders ||
        false,

      maximumProviderAttempts:
        Math.max(
          1,
          input
            .maximumProviderAttempts ||
          3
        ),

      minimumQualityScore:
        Math.max(
          0,
          Math.min(
            100,
            input
              .minimumQualityScore ||
            45
          )
        ),

      providerPreference:
        input
          .providerPreference ||
        [],

      excludedProviders:
        input
          .excludedProviders ||
        [],

      createdAt:
        now.toISOString(),

      scheduledAt:
        input.scheduledAt ||
        now.toISOString(),

      startedAt:
        null,

      completedAt:
        null,

      state:
        "QUEUED",

      attempt:
        0,

      maximumAttempts:
        Math.max(
          1,
          input.maximumAttempts ||
          4
        ),

      retryAfterSeconds:
        null,

      nextRetryAt:
        null,

      timeoutMs:
        Math.max(
          1_000,
          input.timeoutMs ||
          8_000
        ),

      concurrency:
        Math.max(
          1,
          Math.min(
            20,
            input.concurrency ||
            6
          )
        ),

      errorCode:
        null,

      errorMessage:
        null,
    };

    this.jobs.set(
      job.id,
      job
    );

    return job;
  }

  next(
    now =
      new Date()
  ): MarketDataRefreshJob | null {
    return (
      Array.from(
        this.jobs.values()
      )
        .filter(
          (
            job
          ) =>
            [
              "QUEUED",
              "DEFERRED",
            ].includes(
              job.state
            ) &&
            new Date(
              job.nextRetryAt ||
              job.scheduledAt
            ).getTime() <=
              now.getTime()
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
                left.scheduledAt
              ).getTime() -
              new Date(
                right.scheduledAt
              ).getTime()
            );
          }
        )[
          0
        ] ||
      null
    );
  }

  update(
    id: string,
    patch:
      Partial<
        MarketDataRefreshJob
      >
  ): MarketDataRefreshJob | null {
    const existing =
      this.jobs.get(
        id
      );

    if (
      !existing
    ) {
      return null;
    }

    const updated = {
      ...existing,
      ...patch,

      id:
        existing.id,

      key:
        existing.key,
    };

    this.jobs.set(
      id,
      updated
    );

    return updated;
  }

  markRunning(
    id: string
  ): MarketDataRefreshJob | null {
    const existing =
      this.jobs.get(
        id
      );

    if (
      !existing
    ) {
      return null;
    }

    return this.update(
      id,
      {
        state:
          "RUNNING",

        startedAt:
          new Date()
            .toISOString(),

        attempt:
          existing.attempt +
          1,

        errorCode:
          null,

        errorMessage:
          null,
      }
    );
  }

  markComplete(
    id: string,
    state:
      Extract<
        MarketDataRefreshJobState,
        "SUCCEEDED" |
        "PARTIAL"
      >
  ): MarketDataRefreshJob | null {
    return this.update(
      id,
      {
        state,

        completedAt:
          new Date()
            .toISOString(),

        nextRetryAt:
          null,

        retryAfterSeconds:
          null,
      }
    );
  }

  markFailed(
    id: string,
    errorCode:
      string,
    errorMessage:
      string
  ): MarketDataRefreshJob | null {
    return this.update(
      id,
      {
        state:
          "FAILED",

        completedAt:
          new Date()
            .toISOString(),

        errorCode,
        errorMessage,
      }
    );
  }

  defer(
    id: string,
    retryAfterSeconds:
      number,
    errorCode:
      string,
    errorMessage:
      string
  ): MarketDataRefreshJob | null {
    const delay =
      Math.max(
        1,
        retryAfterSeconds
      );

    return this.update(
      id,
      {
        state:
          "DEFERRED",

        retryAfterSeconds:
          delay,

        nextRetryAt:
          new Date(
            Date.now() +
            delay *
            1_000
          ).toISOString(),

        errorCode,
        errorMessage,
      }
    );
  }

  cancel(
    id: string
  ): MarketDataRefreshJob | null {
    return this.update(
      id,
      {
        state:
          "CANCELLED",

        completedAt:
          new Date()
            .toISOString(),
      }
    );
  }

  get(
    id: string
  ): MarketDataRefreshJob | null {
    return (
      this.jobs.get(
        id
      ) ||
      null
    );
  }

  all():
    MarketDataRefreshJob[] {
    return Array.from(
      this.jobs.values()
    );
  }

  snapshot():
    MarketDataRefreshQueueSnapshot {
    const jobs =
      this.all();

    const count =
      (
        state:
          MarketDataRefreshJobState
      ) =>
        jobs.filter(
          (
            job
          ) =>
            job.state ===
            state
        ).length;

    return {
      generatedAt:
        new Date()
          .toISOString(),

      queuedCount:
        count(
          "QUEUED"
        ),

      runningCount:
        count(
          "RUNNING"
        ),

      succeededCount:
        count(
          "SUCCEEDED"
        ),

      partialCount:
        count(
          "PARTIAL"
        ),

      failedCount:
        count(
          "FAILED"
        ),

      deferredCount:
        count(
          "DEFERRED"
        ),

      jobs,
    };
  }

  clearCompleted():
    number {
    const removable =
      this.all()
        .filter(
          (
            job
          ) =>
            [
              "SUCCEEDED",
              "PARTIAL",
              "FAILED",
              "CANCELLED",
            ].includes(
              job.state
            )
        );

    for (
      const job of
      removable
    ) {
      this.jobs.delete(
        job.id
      );
    }

    return removable.length;
  }
}

let sharedRefreshQueue:
  MarketDataRefreshQueue |
  null =
    null;

export function getSharedMarketDataRefreshQueue():
  MarketDataRefreshQueue {
  if (
    !sharedRefreshQueue
  ) {
    sharedRefreshQueue =
      new MarketDataRefreshQueue();
  }

  return sharedRefreshQueue;
}
