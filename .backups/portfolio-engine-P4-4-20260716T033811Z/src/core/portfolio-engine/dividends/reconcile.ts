import type {
  ValidationIssue,
} from "../contracts";

import type {
  PortfolioDividendSnapshot,
} from "./contracts";

import {
  approximatelyEqual,
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

  eventFrankingCreditsAud:
    number;

  snapshotFrankingCreditsAud:
    number;
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

export function reconcilePortfolioDividends(
  snapshot:
    PortfolioDividendSnapshot,
  tolerance =
    0.02,
): DividendReconciliationResult {
  const issues:
    ValidationIssue[] = [];

  const forwardEvents =
    snapshot.events.filter(
      (event) =>
        event.isUpcoming &&
        !event.isReceived,
    );

  const eventForwardIncomeAud =
    sumFinite(
      forwardEvents.map(
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
      forwardEvents.map(
        (event) =>
          event.frankingCreditAud,
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

    eventFrankingCreditsAud,

    snapshotFrankingCreditsAud:
      snapshot.totals
        .projectedFrankingCreditsAud,
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
