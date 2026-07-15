import type {
  MarketDataProviderId,
} from "./marketDataTypes";
import type {
  MarketDataRequestBudgetDecision,
  MarketDataRequestBudgetPolicy,
  MarketDataRequestBudgetSnapshot,
} from "./marketDataRefreshTypes";

type RequestTimestamp = {
  provider: MarketDataProviderId;
  timestamp: number;
};

const DEFAULT_POLICY:
  MarketDataRequestBudgetPolicy = {
    globalRequestsPerMinute: 180,
    globalRequestsPerHour: 5_000,

    providerRequestsPerMinute: {
      YAHOO_FINANCE: 120,
      FINNHUB: 55,
      TWELVE_DATA: 8,
      ALPHA_VANTAGE: 5,
      POLYGON: 5,
      MARKETSTACK: 60,
      STOOQ: 30,
      COINGECKO: 25,
      MANUAL: 1_000,
      CACHE: 10_000,
    },

    providerRequestsPerHour: {
      YAHOO_FINANCE: 2_500,
      FINNHUB: 900,
      TWELVE_DATA: 700,
      ALPHA_VANTAGE: 400,
      POLYGON: 250,
      MARKETSTACK: 1_000,
      STOOQ: 500,
      COINGECKO: 800,
      MANUAL: 10_000,
      CACHE: 100_000,
    },

    burstAllowance: 3,
  };

function clamp(
  value: number,
  minimum = 0
): number {
  return Math.max(
    minimum,
    value
  );
}

export class MarketDataRequestBudget {
  private readonly requests:
    RequestTimestamp[] = [];

  private readonly policy:
    MarketDataRequestBudgetPolicy;

  constructor(
    policy:
      Partial<MarketDataRequestBudgetPolicy> = {}
  ) {
    this.policy = {
      ...DEFAULT_POLICY,
      ...policy,

      providerRequestsPerMinute: {
        ...DEFAULT_POLICY.providerRequestsPerMinute,
        ...policy.providerRequestsPerMinute,
      },

      providerRequestsPerHour: {
        ...DEFAULT_POLICY.providerRequestsPerHour,
        ...policy.providerRequestsPerHour,
      },
    };
  }

  getPolicy():
    MarketDataRequestBudgetPolicy {
    return {
      ...this.policy,

      providerRequestsPerMinute: {
        ...this.policy.providerRequestsPerMinute,
      },

      providerRequestsPerHour: {
        ...this.policy.providerRequestsPerHour,
      },
    };
  }

  private prune(
    now:
      number
  ): void {
    const cutoff =
      now -
      3_600_000;

    let index =
      0;

    while (
      index <
        this.requests.length &&
      this.requests[index].timestamp <
        cutoff
    ) {
      index +=
        1;
    }

    if (
      index >
      0
    ) {
      this.requests.splice(
        0,
        index
      );
    }
  }

  private usage(
    provider:
      MarketDataProviderId,
    now:
      number
  ): {
    globalMinute:
      number;

    globalHour:
      number;

    providerMinute:
      number;

    providerHour:
      number;
  } {
    this.prune(
      now
    );

    const minuteCutoff =
      now -
      60_000;

    const globalMinute =
      this.requests.filter(
        (
          request
        ) =>
          request.timestamp >=
          minuteCutoff
      ).length;

    const providerMinute =
      this.requests.filter(
        (
          request
        ) =>
          request.provider ===
            provider &&
          request.timestamp >=
            minuteCutoff
      ).length;

    const providerHour =
      this.requests.filter(
        (
          request
        ) =>
          request.provider ===
          provider
      ).length;

    return {
      globalMinute,
      globalHour:
        this.requests.length,
      providerMinute,
      providerHour,
    };
  }

  snapshot(
    now =
      new Date()
  ):
    MarketDataRequestBudgetSnapshot {
    const timestamp =
      now.getTime();

    this.prune(
      timestamp
    );

    const providers =
      Array.from(
        new Set([
          ...Object.keys(
            this.policy
              .providerRequestsPerMinute
          ),

          ...Object.keys(
            this.policy
              .providerRequestsPerHour
          ),
        ])
      ) as
        MarketDataProviderId[];

    const minuteCutoff =
      timestamp -
      60_000;

    const globalMinuteUsed =
      this.requests.filter(
        (
          request
        ) =>
          request.timestamp >=
          minuteCutoff
      ).length;

    const globalHourUsed =
      this.requests.length;

    const providerMinuteUsed:
      Record<string, number> =
        {};

    const providerMinuteRemaining:
      Record<string, number> =
        {};

    const providerHourUsed:
      Record<string, number> =
        {};

    const providerHourRemaining:
      Record<string, number> =
        {};

    const blockedProviders:
      MarketDataProviderId[] =
        [];

    for (
      const provider of
      providers
    ) {
      const minuteLimit =
        this.policy
          .providerRequestsPerMinute[
            provider
          ] ??
        this.policy
          .globalRequestsPerMinute;

      const hourLimit =
        this.policy
          .providerRequestsPerHour[
            provider
          ] ??
        this.policy
          .globalRequestsPerHour;

      const minuteUsed =
        this.requests.filter(
          (
            request
          ) =>
            request.provider ===
              provider &&
            request.timestamp >=
              minuteCutoff
        ).length;

      const hourUsed =
        this.requests.filter(
          (
            request
          ) =>
            request.provider ===
            provider
        ).length;

      providerMinuteUsed[
        provider
      ] =
        minuteUsed;

      providerMinuteRemaining[
        provider
      ] =
        clamp(
          minuteLimit -
          minuteUsed
        );

      providerHourUsed[
        provider
      ] =
        hourUsed;

      providerHourRemaining[
        provider
      ] =
        clamp(
          hourLimit -
          hourUsed
        );

      if (
        minuteUsed >=
          minuteLimit ||
        hourUsed >=
          hourLimit
      ) {
        blockedProviders.push(
          provider
        );
      }
    }

    return {
      generatedAt:
        now.toISOString(),

      globalMinuteUsed,

      globalMinuteRemaining:
        clamp(
          this.policy
            .globalRequestsPerMinute -
          globalMinuteUsed
        ),

      globalHourUsed,

      globalHourRemaining:
        clamp(
          this.policy
            .globalRequestsPerHour -
          globalHourUsed
        ),

      providerMinuteUsed,
      providerMinuteRemaining,

      providerHourUsed,
      providerHourRemaining,

      blockedProviders,
    };
  }

  canRequest(
    provider:
      MarketDataProviderId,
    now =
      new Date()
  ):
    MarketDataRequestBudgetDecision {
    const timestamp =
      now.getTime();

    const usage =
      this.usage(
        provider,
        timestamp
      );

    const providerMinuteLimit =
      this.policy
        .providerRequestsPerMinute[
          provider
        ] ??
      this.policy
        .globalRequestsPerMinute;

    const providerHourLimit =
      this.policy
        .providerRequestsPerHour[
          provider
        ] ??
      this.policy
        .globalRequestsPerHour;

    const burstAllowance =
      Math.max(
        0,
        this.policy
          .burstAllowance
      );

    const globalMinuteBlocked =
      usage.globalMinute >=
      this.policy
        .globalRequestsPerMinute +
        burstAllowance;

    const globalHourBlocked =
      usage.globalHour >=
      this.policy
        .globalRequestsPerHour;

    const providerMinuteBlocked =
      usage.providerMinute >=
      providerMinuteLimit +
        burstAllowance;

    const providerHourBlocked =
      usage.providerHour >=
      providerHourLimit;

    const allowed =
      !globalMinuteBlocked &&
      !globalHourBlocked &&
      !providerMinuteBlocked &&
      !providerHourBlocked;

    let reason =
      "Request budget is available.";

    let retryAfterMs =
      0;

    if (
      globalMinuteBlocked ||
      providerMinuteBlocked
    ) {
      reason =
        "Minute request budget has been exhausted.";

      const relevant =
        this.requests
          .filter(
            (
              request
            ) =>
              request.timestamp >=
                timestamp -
                  60_000 &&
              (
                globalMinuteBlocked ||
                request.provider ===
                  provider
              )
          )
          .sort(
            (
              left,
              right
            ) =>
              left.timestamp -
              right.timestamp
          )[
            0
          ];

      retryAfterMs =
        relevant
          ? Math.max(
              1_000,
              relevant.timestamp +
                60_000 -
                timestamp
            )
          : 60_000;
    } else if (
      globalHourBlocked ||
      providerHourBlocked
    ) {
      reason =
        "Hourly request budget has been exhausted.";

      const relevant =
        this.requests
          .filter(
            (
              request
            ) =>
              globalHourBlocked ||
              request.provider ===
                provider
          )
          .sort(
            (
              left,
              right
            ) =>
              left.timestamp -
              right.timestamp
          )[
            0
          ];

      retryAfterMs =
        relevant
          ? Math.max(
              60_000,
              relevant.timestamp +
                3_600_000 -
                timestamp
            )
          : 3_600_000;
    }

    return {
      allowed,
      provider,
      retryAfterMs,
      reason,
      snapshot:
        this.snapshot(
          now
        ),
    };
  }

  consume(
    provider:
      MarketDataProviderId,
    now =
      new Date()
  ):
    MarketDataRequestBudgetDecision {
    const decision =
      this.canRequest(
        provider,
        now
      );

    if (
      decision.allowed
    ) {
      this.requests.push({
        provider,
        timestamp:
          now.getTime(),
      });
    }

    return decision;
  }

  reset():
    void {
    this.requests.splice(
      0,
      this.requests.length
    );
  }
}

let sharedRequestBudget:
  MarketDataRequestBudget | null =
    null;

export function getSharedMarketDataRequestBudget():
  MarketDataRequestBudget {
  if (
    !sharedRequestBudget
  ) {
    sharedRequestBudget =
      new MarketDataRequestBudget();
  }

  return sharedRequestBudget;
}

export function resetSharedMarketDataRequestBudget():
  MarketDataRequestBudget {
  sharedRequestBudget =
    new MarketDataRequestBudget();

  return sharedRequestBudget;
}
