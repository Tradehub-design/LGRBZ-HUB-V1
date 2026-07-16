import type {
  PortfolioDividendBuildInput,
  PortfolioDividendDataQuality,
  PortfolioDividendEvent,
  PortfolioDividendSnapshot,
  PortfolioDividendTotals,
} from "./contracts";

import {
  PORTFOLIO_DIVIDEND_SCHEMA_VERSION,
} from "./contracts";

import {
  normaliseDividendHoldingSummary,
  normaliseDividendMonth,
  normalisePortfolioDividendEvent,
} from "./normalise";

import {
  percentage,
  roundMoney,
  sumFinite,
} from "../money";

function stableDividendSnapshotId(
  portfolioSnapshotId:
    string,
  generatedAt:
    string,
  eventIds:
    readonly string[],
): string {
  const value = [
    portfolioSnapshotId,
    generatedAt,
    ...[...eventIds].sort(),
  ].join("|");

  let hash =
    0x811c9dc5;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^=
      value.charCodeAt(index);

    hash =
      Math.imul(
        hash,
        0x01000193,
      ) >>> 0;
  }

  return `DIVIDEND-${hash
    .toString(16)
    .padStart(8, "0")
    .toUpperCase()}`;
}

function eventTimestamp(
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

  return Number.isFinite(
    timestamp,
  )
    ? timestamp
    : Number.MAX_SAFE_INTEGER;
}

function sortEvents(
  events:
    readonly PortfolioDividendEvent[],
): PortfolioDividendEvent[] {
  return [...events].sort(
    (left, right) => {
      const difference =
        eventTimestamp(left) -
        eventTimestamp(right);

      if (difference !== 0) {
        return difference;
      }

      return left.id.localeCompare(
        right.id,
      );
    },
  );
}

function nextDividendEvent(
  events:
    readonly PortfolioDividendEvent[],
): PortfolioDividendEvent | null {
  return (
    sortEvents(
      events.filter(
        (event) =>
          event.isUpcoming &&
          (
            event.expectedCashAud ??
            0
          ) >= 0,
      ),
    )[0] ??
    null
  );
}

function buildTotals(
  input:
    PortfolioDividendBuildInput,
  events:
    readonly PortfolioDividendEvent[],
  holdingSummaries:
    PortfolioDividendSnapshot["holdingSummaries"],
): PortfolioDividendTotals {
  const securitiesMarketValueAud =
    input.portfolio.totals
      .securitiesMarketValueAud;

  const openCostBaseAud =
    input.portfolio.totals
      .openCostBaseAud;

  const forwardTwelveMonthIncomeAud =
    roundMoney(
      input.providerSummary
        .forwardTwelveMonthIncome,
    );

  const trailingTwelveMonthIncomeAud =
    roundMoney(
      input.providerSummary
        .trailingTwelveMonthIncome,
    );

  const announcedForwardIncomeAud =
    roundMoney(
      input.providerSummary
        .announcedForwardIncome,
    );

  const forecastForwardIncomeAud =
    roundMoney(
      input.providerSummary
        .forecastForwardIncome,
    );

  const receivedCurrentFinancialYearAud =
    roundMoney(
      input.providerSummary
        .receivedCurrentFinancialYear,
    );

  const projectedFrankingCreditsAud =
    roundMoney(
      input.providerSummary
        .projectedFrankingCredits,
    );

  const estimatedWithholdingTaxAud =
    sumFinite(
      events.map(
        (event) =>
          event.withholdingTaxAud,
      ),
    );

  const estimatedTaxAud =
    sumFinite(
      events.map(
        (event) =>
          event.estimatedTaxAud,
      ),
    );

  return {
    trailingTwelveMonthIncomeAud,

    forwardTwelveMonthIncomeAud,

    announcedForwardIncomeAud,

    forecastForwardIncomeAud,

    receivedCurrentFinancialYearAud,

    monthlyForwardIncomeAud:
      roundMoney(
        forwardTwelveMonthIncomeAud /
        12,
      ),

    projectedFrankingCreditsAud,

    estimatedWithholdingTaxAud,

    estimatedTaxAud,

    portfolioDividendYieldPercent:
      securitiesMarketValueAud > 0
        ? percentage(
            forwardTwelveMonthIncomeAud,
            securitiesMarketValueAud,
            0,
          )
        : null,

    portfolioYieldOnCostPercent:
      openCostBaseAud > 0
        ? percentage(
            forwardTwelveMonthIncomeAud,
            openCostBaseAud,
            0,
          )
        : null,

    securitiesMarketValueAud,

    openCostBaseAud,

    eventCount:
      events.length,

    historicalEventCount:
      events.filter(
        (event) =>
          event.isHistorical,
      ).length,

    upcomingEventCount:
      events.filter(
        (event) =>
          event.isUpcoming,
      ).length,

    announcedEventCount:
      events.filter(
        (event) =>
          event.isAnnounced,
      ).length,

    forecastEventCount:
      events.filter(
        (event) =>
          event.isForecast,
      ).length,

    receivedEventCount:
      events.filter(
        (event) =>
          event.isReceived,
      ).length,

    holdingCount:
      input.portfolio
        .openHoldings.length,

    incomeHoldingCount:
      holdingSummaries.filter(
        (holding) =>
          holding
            .forwardTwelveMonthIncomeAud >
            0 ||
          holding
            .trailingTwelveMonthIncomeAud >
            0,
      ).length,
  };
}

function buildDataQuality(
  input:
    PortfolioDividendBuildInput,
  events:
    readonly PortfolioDividendEvent[],
): PortfolioDividendDataQuality {
  const warnings = [
    ...(input.warnings ?? []),
  ];

  const errors = [
    ...(input.errors ?? []),
  ];

  if (
    input.unresolvedSymbols.length >
    0
  ) {
    warnings.push(
      `${input.unresolvedSymbols.length} symbol${
        input.unresolvedSymbols.length === 1
          ? ""
          : "s"
      } could not be resolved by a configured dividend provider.`,
    );
  }

  if (
    input.retainedResponseUsed
  ) {
    warnings.push(
      "The last successful dividend response was retained because the latest provider request failed.",
    );
  }

  const hasProviderData =
    input.providersUsed.some(
      (provider) =>
        provider !== "ledger" &&
        provider !== "forecast" &&
        provider !== "manual" &&
        provider !== "UNAVAILABLE",
    );

  const hasForecastData =
    events.some(
      (event) =>
        event.isForecast ||
        event.isAnnounced,
    );

  const hasHistoricalData =
    events.some(
      (event) =>
        event.isHistorical ||
        event.isReceived,
    );

  let status:
    PortfolioDividendDataQuality["status"];

  if (
    input.portfolio.openHoldings
      .length === 0
  ) {
    status =
      "EMPTY";
  } else if (
    errors.length > 0 &&
    events.length === 0
  ) {
    status =
      "ERROR";
  } else if (
    errors.length > 0 ||
    warnings.length > 0 ||
    input.retainedResponseUsed
  ) {
    status =
      "DEGRADED";
  } else {
    status =
      "READY";
  }

  return {
    status,

    providerCount:
      input.providersUsed.length,

    unresolvedSymbolCount:
      input.unresolvedSymbols.length,

    retainedResponseUsed:
      input.retainedResponseUsed ??
      false,

    hasProviderData,

    hasForecastData,

    hasHistoricalData,

    warnings:
      Array.from(
        new Set(warnings),
      ),

    errors:
      Array.from(
        new Set(errors),
      ),
  };
}

export function buildPortfolioDividendSnapshot(
  input:
    PortfolioDividendBuildInput,
): PortfolioDividendSnapshot {
  const generatedAt =
    input.generatedAt ??
    new Date().toISOString();

  const events =
    sortEvents(
      input.events.map(
        (event) =>
          normalisePortfolioDividendEvent({
            portfolio:
              input.portfolio,

            event,

            eligibility:
              input.eligibility,

            now:
              generatedAt,
          }),
      ),
    );

  const holdingSummaries =
    input.providerSummary
      .holdingSummaries
      .map(
        (summary) =>
          normaliseDividendHoldingSummary({
            portfolio:
              input.portfolio,

            summary,
          }),
      )
      .filter(
        (
          summary,
        ): summary is NonNullable<
          typeof summary
        > =>
          Boolean(summary),
      )
      .sort(
        (left, right) =>
          right
            .forwardTwelveMonthIncomeAud -
          left
            .forwardTwelveMonthIncomeAud,
      );

  const monthlyForecast =
    input.providerSummary
      .monthlyForecast
      .map(
        normaliseDividendMonth,
      );

  const historicalEvents =
    events.filter(
      (event) =>
        event.isHistorical,
    );

  const upcomingEvents =
    events.filter(
      (event) =>
        event.isUpcoming,
    );

  const announcedEvents =
    events.filter(
      (event) =>
        event.isAnnounced,
    );

  const forecastEvents =
    events.filter(
      (event) =>
        event.isForecast,
    );

  const receivedEvents =
    events.filter(
      (event) =>
        event.isReceived,
    );

  const totals =
    buildTotals(
      input,
      events,
      holdingSummaries,
    );

  return {
    schemaVersion:
      PORTFOLIO_DIVIDEND_SCHEMA_VERSION,

    snapshotId:
      stableDividendSnapshotId(
        input.portfolio
          .snapshotId,
        generatedAt,
        events.map(
          (event) =>
            event.id,
        ),
      ),

    generatedAt,

    portfolioSnapshotId:
      input.portfolio
        .snapshotId,

    portfolioGeneratedAt:
      input.portfolio
        .generatedAt,

    baseCurrency:
      input.portfolio
        .baseCurrency,

    events,

    historicalEvents,

    upcomingEvents,

    announcedEvents,

    forecastEvents,

    receivedEvents,

    holdingSummaries,

    monthlyForecast,

    totals,

    nextEvent:
      nextDividendEvent(
        events,
      ),

    providersUsed:
      Array.from(
        new Set([
          ...input.providersUsed,
          "PORTFOLIO_ENGINE" as const,
          ...(
            input.retainedResponseUsed
              ? [
                  "RETAINED" as const,
                ]
              : []
          ),
        ]),
      ),

    unresolvedSymbols:
      [...input.unresolvedSymbols],

    dataQuality:
      buildDataQuality(
        input,
        events,
      ),
  };
}
