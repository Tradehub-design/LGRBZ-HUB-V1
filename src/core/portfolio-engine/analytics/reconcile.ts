import type {
  ValidationIssue,
} from "../contracts";

import type {
  PortfolioAnalyticsSnapshot,
} from "./contracts";

import {
  approximatelyEqual,
  sumFinite,
} from "../money";

export type PortfolioAnalyticsReconciliation = {
  valid: boolean;

  issues:
    ValidationIssue[];

  holdingReturnAud: number;
  analyticsReturnAud: number;

  sectorReturnAud: number;
  countryReturnAud: number;
  strategyReturnAud: number;

  holdingMarketValueAud: number;
  analyticsMarketValueAud: number;
};

function issue(
  message: string,
  field: string,
  suppliedValue: unknown,
): ValidationIssue {
  return {
    code:
      "INCONSISTENT_AMOUNT",

    severity:
      "error",

    message,

    field,

    suppliedValue,
  };
}

export function reconcilePortfolioAnalytics(
  analytics:
    PortfolioAnalyticsSnapshot,
  tolerance =
    0.02,
): PortfolioAnalyticsReconciliation {
  const issues:
    ValidationIssue[] = [];

  const holdingReturnAud =
    sumFinite(
      analytics.holdings.map(
        (holding) =>
          holding.totalReturnAud,
      ),
    );

  const sectorReturnAud =
    sumFinite(
      analytics.performanceBySector.map(
        (bucket) =>
          bucket.totalReturnAud,
      ),
    );

  const countryReturnAud =
    sumFinite(
      analytics.performanceByCountry.map(
        (bucket) =>
          bucket.totalReturnAud,
      ),
    );

  const strategyReturnAud =
    sumFinite(
      analytics.performanceByStrategy.map(
        (bucket) =>
          bucket.totalReturnAud,
      ),
    );

  const holdingMarketValueAud =
    sumFinite(
      analytics.holdings.map(
        (holding) =>
          holding.marketValueAud,
      ),
    );

  for (
    const [
      label,
      value,
    ] of [
      [
        "holdings",
        holdingReturnAud,
      ],

      [
        "sector",
        sectorReturnAud,
      ],

      [
        "country",
        countryReturnAud,
      ],

      [
        "strategy",
        strategyReturnAud,
      ],
    ] as const
  ) {
    if (
      !approximatelyEqual(
        value,
        analytics.totals
          .totalReturnAud,
        tolerance,
      )
    ) {
      issues.push(
        issue(
          `${label} analytics return does not reconcile with canonical total return.`,
          `${label}.totalReturnAud`,
          {
            analytics:
              value,

            canonical:
              analytics.totals
                .totalReturnAud,
          },
        ),
      );
    }
  }

  if (
    !approximatelyEqual(
      holdingMarketValueAud,
      analytics.totals
        .securitiesMarketValueAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Analytics holding market value does not reconcile with canonical market value.",
        "holdings.marketValueAud",
        {
          holdings:
            holdingMarketValueAud,

          canonical:
            analytics.totals
              .securitiesMarketValueAud,
        },
      ),
    );
  }

  return {
    valid:
      issues.length === 0,

    issues,

    holdingReturnAud,

    analyticsReturnAud:
      analytics.totals
        .totalReturnAud,

    sectorReturnAud,

    countryReturnAud,

    strategyReturnAud,

    holdingMarketValueAud,

    analyticsMarketValueAud:
      analytics.totals
        .securitiesMarketValueAud,
  };
}
