import {
  providerById,
} from "./providerRegistry";
import type {
  MarketDataBudgetDecision,
  MarketDataProviderBudget,
  MarketDataRequestBudgetWindow,
} from "./marketDataRefreshTypes";
import type {
  MarketDataProviderId,
} from "./marketDataTypes";

type ProviderUsage = {
  minuteStartedAt: number;
  minuteRequests: number;
  minuteSymbols: number;

  dayStartedAt: number;
  dayRequests: number;
  daySymbols: number;
};

const MINUTE_MS =
  60_000;

const DAY_MS =
  86_400_000;

function iso(
  timestamp: number
): string {
  return new Date(
    timestamp
  ).toISOString();
}

function windowSnapshot({
  startedAt,
  durationMs,
  maximumRequests,
  usedRequests,
  maximumSymbols,
  usedSymbols,
}: {
  startedAt: number;
  durationMs: number;
  maximumRequests: number;
  usedRequests: number;
  maximumSymbols: number;
  usedSymbols: number;
}): MarketDataRequestBudgetWindow {
  return {
    windowStartedAt:
      iso(
        startedAt
      ),

    windowEndsAt:
      iso(
        startedAt +
        durationMs
      ),

    maximumRequests,

    usedRequests,

    remainingRequests:
      Math.max(
        0,
        maximumRequests -
        usedRequests
      ),

    maximumSymbols,

    usedSymbols,

    remainingSymbols:
      Math.max(
        0,
        maximumSymbols -
        usedSymbols
      ),
  };
}

function defaultMinuteLimit(
  provider:
    MarketDataProviderId
): number {
  const definition =
    providerById(
      provider
    );

  return (
    definition
      ?.rateLimitPerMinute ||
    60
  );
}

function defaultDayLimit(
  provider:
    MarketDataProviderId
): number {
  const definition =
    providerById(
      provider
    );

  return (
    definition
      ?.rateLimitPerDay ||
    50_000
  );
}

export class MarketDataRequestBudgetManager {
  private readonly usage =
    new Map<
      MarketDataProviderId,
      ProviderUsage
    >();

  private normaliseUsage(
    provider:
      MarketDataProviderId,
    now:
      number
  ): ProviderUsage {
    const existing =
      this.usage.get(
        provider
      );

    if (
      !existing
    ) {
      const created:
        ProviderUsage = {
        minuteStartedAt:
          now,

        minuteRequests:
          0,

        minuteSymbols:
          0,

        dayStartedAt:
          now,

        dayRequests:
          0,

        daySymbols:
          0,
      };

      this.usage.set(
        provider,
        created
      );

      return created;
    }

    const updated = {
      ...existing,
    };

    if (
      now -
      updated.minuteStartedAt >=
      MINUTE_MS
    ) {
      updated.minuteStartedAt =
        now;

      updated.minuteRequests =
        0;

      updated.minuteSymbols =
        0;
    }

    if (
      now -
      updated.dayStartedAt >=
      DAY_MS
    ) {
      updated.dayStartedAt =
        now;

      updated.dayRequests =
        0;

      updated.daySymbols =
        0;
    }

    this.usage.set(
      provider,
      updated
    );

    return updated;
  }

  snapshot(
    provider:
      MarketDataProviderId,
    now =
      Date.now()
  ): MarketDataProviderBudget {
    const usage =
      this.normaliseUsage(
        provider,
        now
      );

    const minuteLimit =
      defaultMinuteLimit(
        provider
      );

    const dayLimit =
      defaultDayLimit(
        provider
      );

    const minute =
      windowSnapshot({
        startedAt:
          usage.minuteStartedAt,

        durationMs:
          MINUTE_MS,

        maximumRequests:
          minuteLimit,

        usedRequests:
          usage.minuteRequests,

        maximumSymbols:
          minuteLimit *
          100,

        usedSymbols:
          usage.minuteSymbols,
      });

    const day =
      windowSnapshot({
        startedAt:
          usage.dayStartedAt,

        durationMs:
          DAY_MS,

        maximumRequests:
          dayLimit,

        usedRequests:
          usage.dayRequests,

        maximumSymbols:
          dayLimit *
          100,

        usedSymbols:
          usage.daySymbols,
      });

    const minuteBlocked =
      minute.remainingRequests <=
      0;

    const dayBlocked =
      day.remainingRequests <=
      0;

    return {
      provider,
      minute,
      day,

      blocked:
        minuteBlocked ||
        dayBlocked,

      reason:
        minuteBlocked
          ? "Provider minute request budget is exhausted."
          : dayBlocked
            ? "Provider daily request budget is exhausted."
            : null,
    };
  }

  canConsume(
    provider:
      MarketDataProviderId,
    symbolCount:
      number,
    now =
      Date.now()
  ): MarketDataBudgetDecision {
    const budget =
      this.snapshot(
        provider,
        now
      );

    const requestedSymbols =
      Math.max(
        1,
        symbolCount
      );

    const minuteAllowed =
      budget.minute
        .remainingRequests >
      0 &&
      budget.minute
        .remainingSymbols >=
      requestedSymbols;

    const dayAllowed =
      budget.day
        .remainingRequests >
      0 &&
      budget.day
        .remainingSymbols >=
      requestedSymbols;

    const allowed =
      minuteAllowed &&
      dayAllowed;

    let retryAfterSeconds:
      number |
      null =
        null;

    let reason =
      "Provider request budget is available.";

    if (
      !minuteAllowed
    ) {
      retryAfterSeconds =
        Math.max(
          1,
          Math.ceil(
            (
              new Date(
                budget.minute
                  .windowEndsAt
              ).getTime() -
              now
            ) /
            1_000
          )
        );

      reason =
        "Provider minute request budget is exhausted.";
    } else if (
      !dayAllowed
    ) {
      retryAfterSeconds =
        Math.max(
          1,
          Math.ceil(
            (
              new Date(
                budget.day
                  .windowEndsAt
              ).getTime() -
              now
            ) /
            1_000
          )
        );

      reason =
        "Provider daily request budget is exhausted.";
    }

    return {
      allowed,
      provider,
      requestedSymbols,
      retryAfterSeconds,
      reason,
      budget,
    };
  }

  consume(
    provider:
      MarketDataProviderId,
    symbolCount:
      number,
    now =
      Date.now()
  ): MarketDataBudgetDecision {
    const decision =
      this.canConsume(
        provider,
        symbolCount,
        now
      );

    if (
      !decision.allowed
    ) {
      return decision;
    }

    const usage =
      this.normaliseUsage(
        provider,
        now
      );

    usage.minuteRequests +=
      1;

    usage.minuteSymbols +=
      Math.max(
        1,
        symbolCount
      );

    usage.dayRequests +=
      1;

    usage.daySymbols +=
      Math.max(
        1,
        symbolCount
      );

    this.usage.set(
      provider,
      usage
    );

    return {
      ...decision,

      budget:
        this.snapshot(
          provider,
          now
        ),
    };
  }

  reset(
    provider?:
      MarketDataProviderId
  ): void {
    if (
      provider
    ) {
      this.usage.delete(
        provider
      );

      return;
    }

    this.usage.clear();
  }

  all():
    MarketDataProviderBudget[] {
    return Array.from(
      this.usage.keys()
    ).map(
      (
        provider
      ) =>
        this.snapshot(
          provider
        )
    );
  }
}

let sharedBudgetManager:
  MarketDataRequestBudgetManager |
  null =
    null;

export function getSharedMarketDataRequestBudgetManager():
  MarketDataRequestBudgetManager {
  if (
    !sharedBudgetManager
  ) {
    sharedBudgetManager =
      new MarketDataRequestBudgetManager();
  }

  return sharedBudgetManager;
}
