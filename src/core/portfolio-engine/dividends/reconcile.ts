import type {
  ValidationIssue,
} from "../contracts";

import type {
  PortfolioDividendSnapshot,
} from "./contracts";

import {
  approximatelyEqual,
  percentage,
  roundMoney,
  sumFinite,
} from "../money";

export type DividendReconciliationResult = {
  valid: boolean;

  issues:
    ValidationIssue[];

  eventForwardIncomeAud:
    number;

  snapshotForwardIncomeAud:
    number;

  holdingForwardIncomeAud:
    number;

  monthlyForwardIncomeAud:
    number;

  announcedForwardIncomeAud:
    number;

  forecastForwardIncomeAud:
    number;

  eventFrankingCreditsAud:
    number;

  snapshotFrankingCreditsAud:
    number;

  eventWithholdingTaxAud:
    number;

  snapshotWithholdingTaxAud:
    number;

  expectedDividendYieldPercent:
    number | null;

  expectedYieldOnCostPercent:
    number | null;
};

function issue(
  message:
    string,
  field:
    string,
  suppliedValue:
    unknown,
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

function eventTimestamp(
  event:
    PortfolioDividendSnapshot["events"][number],
): number {
  const value =
    event.paymentDate ||
    event.exDate ||
    event.recordDate ||
    event.declarationDate ||
    event.receivedAt;

  const timestamp =
    Date.parse(value);

  return Number.isFinite(timestamp)
    ? timestamp
    : Number.MAX_SAFE_INTEGER;
}

function forwardEvents(
  snapshot:
    PortfolioDividendSnapshot,
) {
  const now =
    Date.parse(
      snapshot.generatedAt,
    );

  const end =
    now +
    365 *
    86_400_000;

  return snapshot.events.filter(
    (event) => {
      const timestamp =
        eventTimestamp(event);

      return (
        !event.isReceived &&
        timestamp >= now &&
        timestamp <= end
      );
    },
  );
}

export function reconcilePortfolioDividends(
  snapshot:
    PortfolioDividendSnapshot,
  tolerance =
    0.02,
): DividendReconciliationResult {
  const issues:
    ValidationIssue[] = [];

  const forward =
    forwardEvents(snapshot);

  const eventForwardIncomeAud =
    sumFinite(
      forward.map(
        (event) =>
          event.expectedCashAud ??
          0,
      ),
    );

  const announcedForwardIncomeAud =
    sumFinite(
      forward
        .filter(
          (event) =>
            event.isAnnounced,
        )
        .map(
          (event) =>
            event.expectedCashAud ??
            0,
        ),
    );

  const forecastForwardIncomeAud =
    sumFinite(
      forward
        .filter(
          (event) =>
            event.isForecast,
        )
        .map(
          (event) =>
            event.expectedCashAud ??
            0,
        ),
    );

  const holdingForwardIncomeAud =
    sumFinite(
      snapshot.holdingSummaries.map(
        (holding) =>
          holding
            .forwardTwelveMonthIncomeAud,
      ),
    );

  const monthlyForwardIncomeAud =
    sumFinite(
      snapshot.monthlyForecast.map(
        (month) =>
          month.announcedIncomeAud +
          month.forecastIncomeAud,
      ),
    );

  const eventFrankingCreditsAud =
    sumFinite(
      forward.map(
        (event) =>
          event.frankingCreditAud,
      ),
    );

  const eventWithholdingTaxAud =
    sumFinite(
      forward.map(
        (event) =>
          event.withholdingTaxAud,
      ),
    );

  if (
    !approximatelyEqual(
      eventForwardIncomeAud,
      snapshot.totals
        .forwardTwelveMonthIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Forward dividend event income does not reconcile with portfolio dividend totals.",
        "totals.forwardTwelveMonthIncomeAud",
        {
          events:
            eventForwardIncomeAud,

          totals:
            snapshot.totals
              .forwardTwelveMonthIncomeAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      announcedForwardIncomeAud,
      snapshot.totals
        .announcedForwardIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Announced forward event income does not reconcile with announced portfolio income.",
        "totals.announcedForwardIncomeAud",
        {
          events:
            announcedForwardIncomeAud,

          totals:
            snapshot.totals
              .announcedForwardIncomeAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      forecastForwardIncomeAud,
      snapshot.totals
        .forecastForwardIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Forecast event income does not reconcile with forecast portfolio income.",
        "totals.forecastForwardIncomeAud",
        {
          events:
            forecastForwardIncomeAud,

          totals:
            snapshot.totals
              .forecastForwardIncomeAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      holdingForwardIncomeAud,
      snapshot.totals
        .forwardTwelveMonthIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Holding dividend forecasts do not reconcile with portfolio dividend totals.",
        "holdingSummaries.forwardTwelveMonthIncomeAud",
        {
          holdings:
            holdingForwardIncomeAud,

          totals:
            snapshot.totals
              .forwardTwelveMonthIncomeAud,
        },
      ),
    );
  }

  if (
    snapshot.monthlyForecast.length >
      0 &&
    !approximatelyEqual(
      monthlyForwardIncomeAud,
      snapshot.totals
        .forwardTwelveMonthIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Monthly dividend forecast does not reconcile with forward twelve-month income.",
        "monthlyForecast",
        {
          monthly:
            monthlyForwardIncomeAud,

          totals:
            snapshot.totals
              .forwardTwelveMonthIncomeAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      eventFrankingCreditsAud,
      snapshot.totals
        .projectedFrankingCreditsAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Event franking credits do not reconcile with portfolio dividend totals.",
        "totals.projectedFrankingCreditsAud",
        {
          events:
            eventFrankingCreditsAud,

          totals:
            snapshot.totals
              .projectedFrankingCreditsAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      eventWithholdingTaxAud,
      snapshot.totals
        .estimatedWithholdingTaxAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Event withholding tax does not reconcile with portfolio dividend totals.",
        "totals.estimatedWithholdingTaxAud",
        {
          events:
            eventWithholdingTaxAud,

          totals:
            snapshot.totals
              .estimatedWithholdingTaxAud,
        },
      ),
    );
  }

  const expectedDividendYieldPercent =
    snapshot.totals
      .securitiesMarketValueAud >
    0
      ? percentage(
          snapshot.totals
            .forwardTwelveMonthIncomeAud,
          snapshot.totals
            .securitiesMarketValueAud,
          0,
        )
      : null;

  const expectedYieldOnCostPercent =
    snapshot.totals
      .openCostBaseAud >
    0
      ? percentage(
          snapshot.totals
            .forwardTwelveMonthIncomeAud,
          snapshot.totals
            .openCostBaseAud,
          0,
        )
      : null;

  if (
    expectedDividendYieldPercent !==
      null &&
    snapshot.totals
      .portfolioDividendYieldPercent !==
      null &&
    !approximatelyEqual(
      expectedDividendYieldPercent,
      snapshot.totals
        .portfolioDividendYieldPercent,
      0.0001,
    )
  ) {
    issues.push(
      issue(
        "Portfolio dividend yield does not reconcile with forward income and market value.",
        "totals.portfolioDividendYieldPercent",
        {
          expected:
            expectedDividendYieldPercent,

          actual:
            snapshot.totals
              .portfolioDividendYieldPercent,
        },
      ),
    );
  }

  if (
    expectedYieldOnCostPercent !==
      null &&
    snapshot.totals
      .portfolioYieldOnCostPercent !==
      null &&
    !approximatelyEqual(
      expectedYieldOnCostPercent,
      snapshot.totals
        .portfolioYieldOnCostPercent,
      0.0001,
    )
  ) {
    issues.push(
      issue(
        "Portfolio yield on cost does not reconcile with forward income and open cost base.",
        "totals.portfolioYieldOnCostPercent",
        {
          expected:
            expectedYieldOnCostPercent,

          actual:
            snapshot.totals
              .portfolioYieldOnCostPercent,
        },
      ),
    );
  }

  const duplicateIdentities =
    new Set<string>();

  for (const event of snapshot.events) {
    const identity = [
      event.symbol,
      event.exDate ||
        event.paymentDate,
      roundMoney(
        event.dividendPerShare ??
        0,
        6,
      ),
      event.currency,
    ].join("::");

    if (
      duplicateIdentities.has(
        identity,
      )
    ) {
      issues.push(
        issue(
          "Duplicate dividend event remains after canonical deduplication.",
          "events",
          identity,
        ),
      );
    }

    duplicateIdentities.add(
      identity,
    );
  }

  return {
    valid:
      issues.length === 0,

    issues,

    eventForwardIncomeAud,

    snapshotForwardIncomeAud:
      snapshot.totals
        .forwardTwelveMonthIncomeAud,

    holdingForwardIncomeAud,

    monthlyForwardIncomeAud,

    announcedForwardIncomeAud,

    forecastForwardIncomeAud,

    eventFrankingCreditsAud,

    snapshotFrankingCreditsAud:
      snapshot.totals
        .projectedFrankingCreditsAud,

    eventWithholdingTaxAud,

    snapshotWithholdingTaxAud:
      snapshot.totals
        .estimatedWithholdingTaxAud,

    expectedDividendYieldPercent,

    expectedYieldOnCostPercent,
  };
}

export function assertPortfolioDividendsReconcile(
  snapshot:
    PortfolioDividendSnapshot,
  tolerance =
    0.02,
): void {
  const result =
    reconcilePortfolioDividends(
      snapshot,
      tolerance,
    );

  if (result.valid) {
    return;
  }

  throw new Error(
    [
      "Portfolio dividend reconciliation failed:",
      ...result.issues.map(
        (entry) =>
          `- ${entry.message}`,
      ),
    ].join("\n"),
  );
}
