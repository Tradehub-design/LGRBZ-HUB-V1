import {
  getMarketClock,
} from "./marketClock";
import type {
  CreateRefreshJobInput,
  MarketDataRefreshCoordinatorSnapshot,
  MarketDataRefreshJob,
  MarketDataRefreshJobResult,
  MarketDataRefreshProfile,
  RefreshIntervalRecommendation,
} from "./marketDataRefreshTypes";
import type {
  MarketDataExchange,
  MarketDataProviderId,
} from "./marketDataTypes";
import {
  getSharedMarketDataRefreshQueue,
  MarketDataRefreshQueue,
} from "./marketDataRefreshQueue";
import {
  getSharedMarketDataRequestBudgetManager,
  MarketDataRequestBudgetManager,
} from "./marketDataRequestBudget";
import {
  getSharedMultiProviderQuoteResolver,
  MultiProviderQuoteResolver,
} from "./multiProviderQuoteResolver";

function exponentialBackoffSeconds(
  attempt:
    number,
  baseSeconds =
    5,
  maximumSeconds =
    900
): number {
  const jitter =
    Math.floor(
      Math.random() *
      5
    );

  return Math.min(
    maximumSeconds,
    baseSeconds *
      2 **
      Math.max(
        0,
        attempt -
        1
      ) +
      jitter
  );
}

function uniqueProviders(
  providers:
    MarketDataProviderId[]
): MarketDataProviderId[] {
  return Array.from(
    new Set(
      providers
    )
  );
}

export function recommendMarketDataRefreshInterval({
  exchange,
  profile,
  now =
    new Date(),
}: {
  exchange:
    MarketDataExchange;

  profile:
    MarketDataRefreshProfile;

  now?: Date;
}): RefreshIntervalRecommendation {
  const clock =
    getMarketClock(
      exchange,
      now
    );

  const profileMultiplier:
    Record<
      MarketDataRefreshProfile,
      number
    > = {
    HOLDINGS:
      1,

    WATCHLIST:
      0.75,

    DASHBOARD:
      1,

    DIVIDENDS:
      10,

    ALLOCATION:
      2,

    ANALYTICS:
      5,

    MANUAL:
      1,
  };

  const multiplier =
    profileMultiplier[
      profile
    ];

  if (
    clock.state ===
    "OPEN"
  ) {
    return {
      exchange,
      profile,

      marketState:
        clock.state,

      intervalSeconds:
        Math.max(
          30,
          Math.round(
            60 *
            multiplier
          )
        ),

      urgency:
        profile ===
        "WATCHLIST"
          ? "FAST"
          : "NORMAL",

      reason:
        "Exchange is open; refresh live portfolio pricing frequently.",
    };
  }

  if (
    clock.state ===
      "PRE_MARKET" ||
    clock.state ===
      "AFTER_HOURS"
  ) {
    return {
      exchange,
      profile,

      marketState:
        clock.state,

      intervalSeconds:
        Math.max(
          120,
          Math.round(
            300 *
            multiplier
          )
        ),

      urgency:
        "NORMAL",

      reason:
        "Extended-hours trading is active; refresh less frequently than regular trading.",
    };
  }

  if (
    clock.state ===
      "WEEKEND" ||
    clock.state ===
      "HOLIDAY"
  ) {
    return {
      exchange,
      profile,

      marketState:
        clock.state,

      intervalSeconds:
        Math.max(
          3_600,
          Math.round(
            21_600 *
            multiplier
          )
        ),

      urgency:
        "PAUSED",

      reason:
        "Exchange is closed for a weekend or holiday; retain the latest official close.",
    };
  }

  return {
    exchange,
    profile,

    marketState:
      clock.state,

    intervalSeconds:
      Math.max(
        900,
        Math.round(
          3_600 *
          multiplier
        )
      ),

    urgency:
      "RELAXED",

    reason:
      "Exchange is closed; background refresh can run at a relaxed interval.",
  };
}

export class MarketDataRefreshCoordinator {
  private active =
    false;

  private completedJobCount =
    0;

  private failedJobCount =
    0;

  private totalRequestedSymbols =
    0;

  private totalSuccessfulSymbols =
    0;

  private totalFailedSymbols =
    0;

  private lastRunAt:
    string |
    null =
      null;

  private nextRunAt:
    string |
    null =
      null;

  constructor(
    private readonly queue:
      MarketDataRefreshQueue =
        getSharedMarketDataRefreshQueue(),

    private readonly resolver:
      MultiProviderQuoteResolver =
        getSharedMultiProviderQuoteResolver(),

    private readonly budgets:
      MarketDataRequestBudgetManager =
        getSharedMarketDataRequestBudgetManager()
  ) {}

  enqueue(
    input:
      CreateRefreshJobInput
  ): MarketDataRefreshJob {
    return this.queue.enqueue(
      input
    );
  }

  private budgetDecision(
    job:
      MarketDataRefreshJob
  ) {
    const providers =
      uniqueProviders(
        job.providerPreference
          .length >
        0
          ? job.providerPreference
          : [
              "YAHOO_FINANCE",
              "FINNHUB",
              "TWELVE_DATA",
              "ALPHA_VANTAGE",
            ]
      );

    for (
      const provider of
      providers
    ) {
      const decision =
        this.budgets
          .canConsume(
            provider,
            job.symbols.length
          );

      if (
        decision.allowed
      ) {
        return decision;
      }
    }

    return this.budgets
      .canConsume(
        providers[
          0
        ] ||
        "YAHOO_FINANCE",
        job.symbols.length
      );
  }

  async runNext():
    Promise<
      MarketDataRefreshJobResult |
      null
    > {
    if (
      this.active
    ) {
      return null;
    }

    const next =
      this.queue.next();

    if (
      !next
    ) {
      return null;
    }

    this.active =
      true;

    const running =
      this.queue.markRunning(
        next.id
      );

    if (
      !running
    ) {
      this.active =
        false;

      return null;
    }

    const startedMs =
      performance.now();

    this.lastRunAt =
      new Date()
        .toISOString();

    this.totalRequestedSymbols +=
      running.symbols.length;

    try {
      const budget =
        this.budgetDecision(
          running
        );

      if (
        !budget.allowed
      ) {
        const retryAfter =
          budget.retryAfterSeconds ||
          exponentialBackoffSeconds(
            running.attempt
          );

        const deferred =
          this.queue.defer(
            running.id,
            retryAfter,
            "REQUEST_BUDGET_EXHAUSTED",
            budget.reason
          ) ||
          running;

        this.nextRunAt =
          deferred.nextRetryAt;

        return {
          job:
            deferred,

          quotes:
            [],

          successfulSymbols:
            [],

          failedSymbols:
            [
              ...running.symbols,
            ],

          requestedCount:
            running.symbols.length,

          successfulCount:
            0,

          failedCount:
            running.symbols.length,

          durationMs:
            Math.round(
              performance.now() -
              startedMs
            ),

          warnings: [
            budget.reason,
          ],
        };
      }

      this.budgets.consume(
        budget.provider,
        running.symbols.length
      );

      const result =
        await this.resolver.resolveBatch({
          symbols:
            running.symbols,

          exchange:
            running.exchange,

          currency:
            running.currency,

          providerPreference:
            running.providerPreference,

          excludedProviders:
            running.excludedProviders,

          allowDelayed:
            true,

          allowIndicative:
            false,

          allowStale:
            true,

          allowExpiredFallback:
            true,

          forceRefresh:
            running.forceRefresh,

          compareProviders:
            running.compareProviders,

          minimumQualityScore:
            running.minimumQualityScore,

          maximumProviderAttempts:
            running.maximumProviderAttempts,

          concurrency:
            running.concurrency,

          timeoutMs:
            running.timeoutMs,
        });

      this.totalSuccessfulSymbols +=
        result.successfulCount;

      this.totalFailedSymbols +=
        result.failedCount;

      const state =
        result.failedCount ===
        0
          ? "SUCCEEDED"
          : result.successfulCount >
              0
            ? "PARTIAL"
            : "FAILED";

      let completedJob:
        MarketDataRefreshJob;

      if (
        state ===
        "FAILED" &&
        running.attempt <
        running.maximumAttempts
      ) {
        const retryAfter =
          exponentialBackoffSeconds(
            running.attempt
          );

        completedJob =
          this.queue.defer(
            running.id,
            retryAfter,
            "QUOTE_REFRESH_FAILED",
            "All quote providers failed. The refresh job was deferred."
          ) ||
          running;

        this.nextRunAt =
          completedJob
            .nextRetryAt;
      } else if (
        state ===
        "FAILED"
      ) {
        completedJob =
          this.queue.markFailed(
            running.id,
            "QUOTE_REFRESH_FAILED",
            "All quote providers failed after the maximum number of attempts."
          ) ||
          running;

        this.failedJobCount +=
          1;
      } else {
        completedJob =
          this.queue.markComplete(
            running.id,
            state
          ) ||
          running;

        this.completedJobCount +=
          1;
      }

      const warnings =
        Array.from(
          new Set(
            result.results.flatMap(
              (
                item
              ) =>
                item.warnings
            )
          )
        );

      return {
        job:
          completedJob,

        quotes:
          result.quotes,

        successfulSymbols:
          result.successfulSymbols,

        failedSymbols:
          result.failedSymbols,

        requestedCount:
          result.requestedCount,

        successfulCount:
          result.successfulCount,

        failedCount:
          result.failedCount,

        durationMs:
          Math.round(
            performance.now() -
            startedMs
          ),

        warnings,
      };
    } catch (
      error
    ) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown refresh coordinator error.";

      this.totalFailedSymbols +=
        running.symbols.length;

      if (
        running.attempt <
        running.maximumAttempts
      ) {
        const retryAfter =
          exponentialBackoffSeconds(
            running.attempt
          );

        const deferred =
          this.queue.defer(
            running.id,
            retryAfter,
            "REFRESH_COORDINATOR_ERROR",
            message
          ) ||
          running;

        this.nextRunAt =
          deferred.nextRetryAt;

        return {
          job:
            deferred,

          quotes:
            [],

          successfulSymbols:
            [],

          failedSymbols:
            [
              ...running.symbols,
            ],

          requestedCount:
            running.symbols.length,

          successfulCount:
            0,

          failedCount:
            running.symbols.length,

          durationMs:
            Math.round(
              performance.now() -
              startedMs
            ),

          warnings: [
            message,
          ],
        };
      }

      const failed =
        this.queue.markFailed(
          running.id,
          "REFRESH_COORDINATOR_ERROR",
          message
        ) ||
        running;

      this.failedJobCount +=
        1;

      return {
        job:
          failed,

        quotes:
          [],

        successfulSymbols:
          [],

        failedSymbols:
          [
            ...running.symbols,
          ],

        requestedCount:
          running.symbols.length,

        successfulCount:
          0,

        failedCount:
          running.symbols.length,

        durationMs:
          Math.round(
            performance.now() -
            startedMs
          ),

        warnings: [
          message,
        ],
      };
    } finally {
      this.active =
        false;
    }
  }

  async drain(
    maximumJobs =
      25
  ): Promise<
    MarketDataRefreshJobResult[]
  > {
    const results:
      MarketDataRefreshJobResult[] =
        [];

    for (
      let index =
        0;
      index <
        maximumJobs;
      index +=
        1
    ) {
      const result =
        await this.runNext();

      if (
        !result
      ) {
        break;
      }

      results.push(
        result
      );

      if (
        result.job.state ===
        "DEFERRED"
      ) {
        break;
      }
    }

    return results;
  }

  snapshot():
    MarketDataRefreshCoordinatorSnapshot {
    return {
      generatedAt:
        new Date()
          .toISOString(),

      active:
        this.active,

      queue:
        this.queue.snapshot(),

      completedJobCount:
        this.completedJobCount,

      failedJobCount:
        this.failedJobCount,

      totalRequestedSymbols:
        this.totalRequestedSymbols,

      totalSuccessfulSymbols:
        this.totalSuccessfulSymbols,

      totalFailedSymbols:
        this.totalFailedSymbols,

      lastRunAt:
        this.lastRunAt,

      nextRunAt:
        this.nextRunAt,

      budgets:
        this.budgets.all(),
    };
  }
}

let sharedRefreshCoordinator:
  MarketDataRefreshCoordinator |
  null =
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
