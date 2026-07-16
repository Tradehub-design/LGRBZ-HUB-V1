import type {
  PortfolioSnapshot,
  ValidationIssue,
} from "../contracts";

import type {
  PortfolioDividendEvent,
  PortfolioDividendSnapshot,
} from "./contracts";

import {
  approximatelyEqual,
  percentage,
  roundMoney,
  sumFinite,
} from "../money";

import {
  quantityOwnedBeforeExDate,
} from "./eligibility";

export type DividendAuditResult = {
  valid: boolean;

  issues:
    ValidationIssue[];

  eligibilityCheckedCount:
    number;

  eligibilityMismatchCount:
    number;

  duplicateEventCount:
    number;

  forecastOverlapCount:
    number;

  eventForwardIncomeAud:
    number;

  holdingForwardIncomeAud:
    number;

  monthlyForwardIncomeAud:
    number;

  portfolioForwardIncomeAud:
    number;

  expectedPortfolioYieldPercent:
    number | null;

  actualPortfolioYieldPercent:
    number | null;

  expectedYieldOnCostPercent:
    number | null;

  actualYieldOnCostPercent:
    number | null;

  eventFrankingCreditsAud:
    number;

  eventWithholdingTaxAud:
    number;
};

function issue(input: {
  severity?: ValidationIssue["severity"];
  message: string;
  field: string;
  suppliedValue?: unknown;
}): ValidationIssue {
  return {
    code:
      "INCONSISTENT_AMOUNT",

    severity:
      input.severity ??
      "error",

    message:
      input.message,

    field:
      input.field,

    suppliedValue:
      input.suppliedValue,
  };
}

function canonicalSymbol(
  value: string,
): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\.AX$/, "");
}

function eventDateValue(
  event:
    PortfolioDividendEvent,
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

function dividendIdentity(
  event:
    PortfolioDividendEvent,
): string {
  return [
    canonicalSymbol(
      event.symbol,
    ),

    event.exDate ||
      event.paymentDate ||
      event.recordDate ||
      "",

    roundMoney(
      event.dividendPerShare ??
      0,
      6,
    ).toFixed(6),

    event.currency
      .trim()
      .toUpperCase(),
  ].join("::");
}

function forwardWindowEvents(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendEvent[] {
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
        eventDateValue(event);

      return (
        !event.isReceived &&
        Number.isFinite(now) &&
        timestamp >= now &&
        timestamp <= end
      );
    },
  );
}

function eventDatesClose(
  left:
    PortfolioDividendEvent,
  right:
    PortfolioDividendEvent,
): boolean {
  const leftTimestamp =
    Date.parse(
      left.exDate ||
      left.paymentDate ||
      "",
    );

  const rightTimestamp =
    Date.parse(
      right.exDate ||
      right.paymentDate ||
      "",
    );

  if (
    !Number.isFinite(
      leftTimestamp,
    ) ||
    !Number.isFinite(
      rightTimestamp,
    )
  ) {
    return false;
  }

  return (
    Math.abs(
      leftTimestamp -
      rightTimestamp,
    ) <=
    14 *
    86_400_000
  );
}

function auditEligibility(input: {
  portfolio:
    PortfolioSnapshot;

  dividend:
    PortfolioDividendSnapshot;
}): {
  issues:
    ValidationIssue[];

  checked:
    number;

  mismatch:
    number;
} {
  const issues:
    ValidationIssue[] = [];

  let checked =
    0;

  let mismatch =
    0;

  for (
    const event of
    input.dividend.events
  ) {
    if (
      !event.securityId ||
      !event.exDate
    ) {
      continue;
    }

    checked += 1;

    const ownership =
      quantityOwnedBeforeExDate({
        portfolio:
          input.portfolio,

        securityId:
          event.securityId,

        symbol:
          event.symbol,

        exDate:
          event.exDate,
      });

    if (
      !approximatelyEqual(
        ownership.eligibleQuantity,
        event.eligibleQuantity,
        0.000001,
      )
    ) {
      mismatch += 1;

      issues.push(
        issue({
          message:
            `${event.displaySymbol} eligible quantity does not match canonical ownership before the ex-dividend date.`,

          field:
            "event.eligibleQuantity",

          suppliedValue: {
            eventId:
              event.id,

            exDate:
              event.exDate,

            canonicalQuantity:
              ownership.eligibleQuantity,

            eventQuantity:
              event.eligibleQuantity,
          },
        }),
      );
    }
  }

  return {
    issues,

    checked,

    mismatch,
  };
}

function auditDuplicateEvents(
  events:
    readonly PortfolioDividendEvent[],
): {
  issues:
    ValidationIssue[];

  duplicateCount:
    number;
} {
  const issues:
    ValidationIssue[] = [];

  const identities =
    new Set<string>();

  let duplicateCount =
    0;

  for (const event of events) {
    const identity =
      dividendIdentity(event);

    if (identities.has(identity)) {
      duplicateCount += 1;

      issues.push(
        issue({
          message:
            "Duplicate canonical dividend event remains after deduplication.",

          field:
            "events",

          suppliedValue:
            identity,
        }),
      );
    }

    identities.add(identity);
  }

  return {
    issues,

    duplicateCount,
  };
}

function auditForecastOverlap(
  events:
    readonly PortfolioDividendEvent[],
): {
  issues:
    ValidationIssue[];

  overlapCount:
    number;
} {
  const issues:
    ValidationIssue[] = [];

  const announced =
    events.filter(
      (event) =>
        event.isAnnounced,
    );

  let overlapCount =
    0;

  for (
    const forecast of
    events.filter(
      (event) =>
        event.isForecast,
    )
  ) {
    const overlapping =
      announced.find(
        (announcedEvent) =>
          canonicalSymbol(
            announcedEvent.symbol,
          ) ===
            canonicalSymbol(
              forecast.symbol,
            ) &&
          eventDatesClose(
            announcedEvent,
            forecast,
          ),
      );

    if (!overlapping) {
      continue;
    }

    overlapCount += 1;

    issues.push(
      issue({
        message:
          `${forecast.displaySymbol} forecast event overlaps an announced dividend event and may be double-counted.`,

        field:
          "forecastEvents",

        suppliedValue: {
          forecastId:
            forecast.id,

          announcedId:
            overlapping.id,
        },
      }),
    );
  }

  return {
    issues,

    overlapCount,
  };
}

export function auditPortfolioDividends(input: {
  portfolio:
    PortfolioSnapshot;

  dividend:
    PortfolioDividendSnapshot;

  tolerance?:
    number;
}): DividendAuditResult {
  const tolerance =
    input.tolerance ??
    0.02;

  const issues:
    ValidationIssue[] = [];

  if (
    input.dividend
      .portfolioSnapshotId !==
    input.portfolio.snapshotId
  ) {
    issues.push(
      issue({
        message:
          "Dividend snapshot does not reference the active Portfolio Snapshot.",

        field:
          "portfolioSnapshotId",

        suppliedValue: {
          dividend:
            input.dividend
              .portfolioSnapshotId,

          portfolio:
            input.portfolio
              .snapshotId,
        },
      }),
    );
  }

  const eligibility =
    auditEligibility(input);

  issues.push(
    ...eligibility.issues,
  );

  const duplicateAudit =
    auditDuplicateEvents(
      input.dividend.events,
    );

  issues.push(
    ...duplicateAudit.issues,
  );

  const overlapAudit =
    auditForecastOverlap(
      input.dividend.events,
    );

  issues.push(
    ...overlapAudit.issues,
  );

  const forwardEvents =
    forwardWindowEvents(
      input.dividend,
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
      input.dividend
        .holdingSummaries
        .map(
          (holding) =>
            holding
              .forwardTwelveMonthIncomeAud,
        ),
    );

  const monthlyForwardIncomeAud =
    sumFinite(
      input.dividend
        .monthlyForecast
        .map(
          (month) =>
            month
              .announcedIncomeAud +
            month
              .forecastIncomeAud,
        ),
    );

  const portfolioForwardIncomeAud =
    input.dividend.totals
      .forwardTwelveMonthIncomeAud;

  if (
    !approximatelyEqual(
      eventForwardIncomeAud,
      portfolioForwardIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue({
        message:
          "Forward dividend events do not reconcile with portfolio forward income.",

        field:
          "totals.forwardTwelveMonthIncomeAud",

        suppliedValue: {
          events:
            eventForwardIncomeAud,

          portfolio:
            portfolioForwardIncomeAud,
        },
      }),
    );
  }

  if (
    !approximatelyEqual(
      holdingForwardIncomeAud,
      portfolioForwardIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue({
        message:
          "Holding dividend forecasts do not reconcile with portfolio forward income.",

        field:
          "holdingSummaries.forwardTwelveMonthIncomeAud",

        suppliedValue: {
          holdings:
            holdingForwardIncomeAud,

          portfolio:
            portfolioForwardIncomeAud,
        },
      }),
    );
  }

  if (
    input.dividend
      .monthlyForecast.length >
      0 &&
    !approximatelyEqual(
      monthlyForwardIncomeAud,
      portfolioForwardIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue({
        message:
          "Monthly dividend forecast does not reconcile with portfolio forward income.",

        field:
          "monthlyForecast",

        suppliedValue: {
          months:
            monthlyForwardIncomeAud,

          portfolio:
            portfolioForwardIncomeAud,
        },
      }),
    );
  }

  const expectedPortfolioYieldPercent =
    input.portfolio.totals
      .securitiesMarketValueAud >
    0
      ? percentage(
          portfolioForwardIncomeAud,
          input.portfolio.totals
            .securitiesMarketValueAud,
          0,
        )
      : null;

  const expectedYieldOnCostPercent =
    input.portfolio.totals
      .openCostBaseAud >
    0
      ? percentage(
          portfolioForwardIncomeAud,
          input.portfolio.totals
            .openCostBaseAud,
          0,
        )
      : null;

  if (
    expectedPortfolioYieldPercent !==
      null &&
    input.dividend.totals
      .portfolioDividendYieldPercent !==
      null &&
    !approximatelyEqual(
      expectedPortfolioYieldPercent,
      input.dividend.totals
        .portfolioDividendYieldPercent,
      0.0001,
    )
  ) {
    issues.push(
      issue({
        message:
          "Portfolio dividend yield does not reconcile with canonical market value.",

        field:
          "totals.portfolioDividendYieldPercent",

        suppliedValue: {
          expected:
            expectedPortfolioYieldPercent,

          actual:
            input.dividend.totals
              .portfolioDividendYieldPercent,
        },
      }),
    );
  }

  if (
    expectedYieldOnCostPercent !==
      null &&
    input.dividend.totals
      .portfolioYieldOnCostPercent !==
      null &&
    !approximatelyEqual(
      expectedYieldOnCostPercent,
      input.dividend.totals
        .portfolioYieldOnCostPercent,
      0.0001,
    )
  ) {
    issues.push(
      issue({
        message:
          "Portfolio yield on cost does not reconcile with canonical open cost base.",

        field:
          "totals.portfolioYieldOnCostPercent",

        suppliedValue: {
          expected:
            expectedYieldOnCostPercent,

          actual:
            input.dividend.totals
              .portfolioYieldOnCostPercent,
        },
      }),
    );
  }

  const eventFrankingCreditsAud =
    sumFinite(
      forwardEvents.map(
        (event) =>
          event.frankingCreditAud,
      ),
    );

  const eventWithholdingTaxAud =
    sumFinite(
      forwardEvents.map(
        (event) =>
          event.withholdingTaxAud,
      ),
    );

  if (
    !approximatelyEqual(
      eventFrankingCreditsAud,
      input.dividend.totals
        .projectedFrankingCreditsAud,
      tolerance,
    )
  ) {
    issues.push(
      issue({
        message:
          "Forward event franking credits do not reconcile with portfolio totals.",

        field:
          "totals.projectedFrankingCreditsAud",

        suppliedValue: {
          events:
            eventFrankingCreditsAud,

          portfolio:
            input.dividend.totals
              .projectedFrankingCreditsAud,
        },
      }),
    );
  }

  if (
    !approximatelyEqual(
      eventWithholdingTaxAud,
      input.dividend.totals
        .estimatedWithholdingTaxAud,
      tolerance,
    )
  ) {
    issues.push(
      issue({
        message:
          "Forward event withholding tax does not reconcile with portfolio totals.",

        field:
          "totals.estimatedWithholdingTaxAud",

        suppliedValue: {
          events:
            eventWithholdingTaxAud,

          portfolio:
            input.dividend.totals
              .estimatedWithholdingTaxAud,
        },
      }),
    );
  }

  return {
    valid:
      !issues.some(
        (entry) =>
          entry.severity ===
          "error",
      ),

    issues,

    eligibilityCheckedCount:
      eligibility.checked,

    eligibilityMismatchCount:
      eligibility.mismatch,

    duplicateEventCount:
      duplicateAudit
        .duplicateCount,

    forecastOverlapCount:
      overlapAudit
        .overlapCount,

    eventForwardIncomeAud,

    holdingForwardIncomeAud,

    monthlyForwardIncomeAud,

    portfolioForwardIncomeAud,

    expectedPortfolioYieldPercent,

    actualPortfolioYieldPercent:
      input.dividend.totals
        .portfolioDividendYieldPercent,

    expectedYieldOnCostPercent,

    actualYieldOnCostPercent:
      input.dividend.totals
        .portfolioYieldOnCostPercent,

    eventFrankingCreditsAud,

    eventWithholdingTaxAud,
  };
}

export function assertPortfolioDividendAudit(
  input:
    Parameters<
      typeof auditPortfolioDividends
    >[0],
): void {
  const result =
    auditPortfolioDividends(
      input,
    );

  if (result.valid) {
    return;
  }

  throw new Error(
    [
      "Portfolio dividend audit failed:",
      ...result.issues
        .filter(
          (entry) =>
            entry.severity ===
            "error",
        )
        .map(
          (entry) =>
            `- ${entry.message}`,
        ),
    ].join("\n"),
  );
}
