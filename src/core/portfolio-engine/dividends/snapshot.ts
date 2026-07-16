import type {
  PortfolioDividendBuildInput,
  PortfolioDividendDataQuality,
  PortfolioDividendEvent,
  PortfolioDividendHoldingSummary,
  PortfolioDividendMonth,
  PortfolioDividendSnapshot,
  PortfolioDividendTotals,
} from "./contracts";

import {
  PORTFOLIO_DIVIDEND_SCHEMA_VERSION,
} from "./contracts";

import {
  normalisePortfolioDividendEvent,
} from "./normalise";

import {
  deduplicatePortfolioDividendEvents,
} from "./deduplicate";

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

  return Number.isFinite(timestamp)
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
          event.eligibleQuantity >
            0 &&
          (
            event.expectedCashAud ??
            0
          ) > 0,
      ),
    )[0] ??
    null
  );
}

function monthKey(
  event:
    PortfolioDividendEvent,
): string | null {
  const date =
    event.paymentDate ||
    event.exDate;

  if (!date) {
    return null;
  }

  const timestamp =
    Date.parse(date);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return new Date(timestamp)
    .toISOString()
    .slice(0, 7);
}

function monthLabel(
  key:
    string,
): string {
  const timestamp =
    Date.parse(
      `${key}-01T00:00:00.000Z`,
    );

  if (!Number.isFinite(timestamp)) {
    return key;
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      month:
        "short",

      year:
        "numeric",

      timeZone:
        "UTC",
    },
  ).format(
    new Date(timestamp),
  );
}

function buildMonthlyForecast(
  events:
    readonly PortfolioDividendEvent[],
  generatedAt:
    string,
): PortfolioDividendMonth[] {
  const start =
    new Date(generatedAt);

  start.setUTCDate(1);
  start.setUTCHours(
    0,
    0,
    0,
    0,
  );

  const months =
    new Map<
      string,
      PortfolioDividendMonth
    >();

  for (
    let index = 0;
    index < 12;
    index += 1
  ) {
    const date =
      new Date(start);

    date.setUTCMonth(
      start.getUTCMonth() +
      index,
    );

    const key =
      date
        .toISOString()
        .slice(0, 7);

    months.set(
      key,
      {
        month:
          key,

        label:
          monthLabel(key),

        announcedIncomeAud:
          0,

        forecastIncomeAud:
          0,

        receivedIncomeAud:
          0,

        totalIncomeAud:
          0,

        frankingCreditsAud:
          0,

        estimatedTaxAud:
          0,

        eventCount:
          0,
      },
    );
  }

  for (const event of events) {
    const key =
      monthKey(event);

    if (!key) {
      continue;
    }

    const month =
      months.get(key);

    if (!month) {
      continue;
    }

    const cash =
      event.expectedCashAud ??
      0;

    if (event.isReceived) {
      month.receivedIncomeAud =
        roundMoney(
          month.receivedIncomeAud +
          cash,
        );
    } else if (
      event.isAnnounced
    ) {
      month.announcedIncomeAud =
        roundMoney(
          month.announcedIncomeAud +
          cash,
        );
    } else if (
      event.isForecast
    ) {
      month.forecastIncomeAud =
        roundMoney(
          month.forecastIncomeAud +
          cash,
        );
    }

    month.totalIncomeAud =
      roundMoney(
        month.announcedIncomeAud +
        month.forecastIncomeAud +
        month.receivedIncomeAud,
      );

    month.frankingCreditsAud =
      roundMoney(
        month.frankingCreditsAud +
        event.frankingCreditAud,
      );

    month.estimatedTaxAud =
      roundMoney(
        month.estimatedTaxAud +
        event.estimatedTaxAud,
      );

    month.eventCount += 1;
  }

  return Array.from(
    months.values(),
  );
}

function buildHoldingSummaries(
  input:
    PortfolioDividendBuildInput,
  events:
    readonly PortfolioDividendEvent[],
  generatedAt:
    string,
): PortfolioDividendHoldingSummary[] {
  const now =
    Date.parse(generatedAt);

  const trailingStart =
    now -
    365 *
    86_400_000;

  const forwardEnd =
    now +
    365 *
    86_400_000;

  return input.portfolio
    .openHoldings
    .map(
      (
        holding,
      ): PortfolioDividendHoldingSummary => {
        const holdingEvents =
          events.filter(
            (event) =>
              event.securityId ===
              holding.security
                .securityId,
          );

        const trailingEvents =
          holdingEvents.filter(
            (event) => {
              const timestamp =
                eventTimestamp(event);

              return (
                event.isReceived &&
                timestamp >=
                  trailingStart &&
                timestamp <= now
              );
            },
          );

        const forwardEvents =
          holdingEvents.filter(
            (event) => {
              const timestamp =
                eventTimestamp(event);

              return (
                !event.isReceived &&
                timestamp >= now &&
                timestamp <=
                  forwardEnd
              );
            },
          );

        const trailingIncome =
          sumFinite(
            trailingEvents.map(
              (event) =>
                event.expectedCashAud ??
                0,
            ),
          );

        const announcedIncome =
          sumFinite(
            forwardEvents
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

        const forecastIncome =
          sumFinite(
            forwardEvents
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

        const forwardIncome =
          roundMoney(
            announcedIncome +
            forecastIncome,
          );

        const annualisedDividendPerShare =
          holding.quantity > 0
            ? roundMoney(
                forwardIncome /
                holding.quantity,
              )
            : 0;

        const futureSorted =
          sortEvents(
            forwardEvents,
          );

        return {
          holdingId:
            holding.holdingId,

          securityId:
            holding.security
              .securityId,

          symbol:
            holding.security.ticker,

          displaySymbol:
            holding.security.ticker,

          quantity:
            holding.quantity,

          marketValueAud:
            holding.valuation
              .marketValueAud,

          costBaseAud:
            holding.costBaseAud,

          trailingTwelveMonthIncomeAud:
            trailingIncome,

          forwardTwelveMonthIncomeAud:
            forwardIncome,

          announcedIncomeAud:
            announcedIncome,

          forecastIncomeAud:
            forecastIncome,

          receivedIncomeAud:
            trailingIncome,

          annualisedDividendPerShare,

          dividendYieldPercent:
            holding.valuation
              .marketValueAud > 0
              ? percentage(
                  forwardIncome,
                  holding.valuation
                    .marketValueAud,
                  0,
                )
              : null,

          yieldOnCostPercent:
            holding.costBaseAud > 0
              ? percentage(
                  forwardIncome,
                  holding.costBaseAud,
                  0,
                )
              : null,

          nextExDate:
            futureSorted.find(
              (event) =>
                Boolean(
                  event.exDate,
                ),
            )?.exDate ??
            null,

          nextPaymentDate:
            futureSorted.find(
              (event) =>
                Boolean(
                  event.paymentDate,
                ),
            )?.paymentDate ??
            null,

          projectedFrankingCreditsAud:
            sumFinite(
              forwardEvents.map(
                (event) =>
                  event.frankingCreditAud,
              ),
            ),

          estimatedWithholdingTaxAud:
            sumFinite(
              forwardEvents.map(
                (event) =>
                  event.withholdingTaxAud,
              ),
            ),

          eventCount:
            holdingEvents.length,

          quoteSource:
            holding.valuation
              .quoteSource,
        };
      },
    )
    .sort(
      (left, right) =>
        right
          .forwardTwelveMonthIncomeAud -
        left
          .forwardTwelveMonthIncomeAud,
    );
}

function buildTotals(
  input:
    PortfolioDividendBuildInput,
  events:
    readonly PortfolioDividendEvent[],
  holdingSummaries:
    readonly PortfolioDividendHoldingSummary[],
  generatedAt:
    string,
): PortfolioDividendTotals {
  const now =
    Date.parse(generatedAt);

  const trailingStart =
    now -
    365 *
    86_400_000;

  const forwardEnd =
    now +
    365 *
    86_400_000;

  const trailingEvents =
    events.filter(
      (event) => {
        const timestamp =
          eventTimestamp(event);

        return (
          event.isReceived &&
          timestamp >=
            trailingStart &&
          timestamp <= now
        );
      },
    );

  const forwardEvents =
    events.filter(
      (event) => {
        const timestamp =
          eventTimestamp(event);

        return (
          !event.isReceived &&
          timestamp >= now &&
          timestamp <=
            forwardEnd
        );
      },
    );

  const announcedForwardIncomeAud =
    sumFinite(
      forwardEvents
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
      forwardEvents
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

  const forwardTwelveMonthIncomeAud =
    roundMoney(
      announcedForwardIncomeAud +
      forecastForwardIncomeAud,
    );

  const trailingTwelveMonthIncomeAud =
    sumFinite(
      trailingEvents.map(
        (event) =>
          event.expectedCashAud ??
          0,
      ),
    );

  const securitiesMarketValueAud =
    input.portfolio.totals
      .securitiesMarketValueAud;

  const openCostBaseAud =
    input.portfolio.totals
      .openCostBaseAud;

  return {
    trailingTwelveMonthIncomeAud,

    forwardTwelveMonthIncomeAud,

    announcedForwardIncomeAud,

    forecastForwardIncomeAud,

    receivedCurrentFinancialYearAud:
      sumFinite(
        events
          .filter(
            (event) =>
              event.isReceived,
          )
          .map(
            (event) =>
              event.expectedCashAud ??
              0,
          ),
      ),

    monthlyForwardIncomeAud:
      roundMoney(
        forwardTwelveMonthIncomeAud /
        12,
      ),

    projectedFrankingCreditsAud:
      sumFinite(
        forwardEvents.map(
          (event) =>
            event.frankingCreditAud,
        ),
      ),

    estimatedWithholdingTaxAud:
      sumFinite(
        forwardEvents.map(
          (event) =>
            event.withholdingTaxAud,
        ),
      ),

    estimatedTaxAud:
      sumFinite(
        forwardEvents.map(
          (event) =>
            event.estimatedTaxAud,
        ),
      ),

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
      `${input.unresolvedSymbols.length} dividend symbol${
        input.unresolvedSymbols.length === 1
          ? ""
          : "s"
      } could not be resolved.`,
    );
  }

  if (
    input.retainedResponseUsed
  ) {
    warnings.push(
      "The last successful dividend response was retained because the latest provider request failed.",
    );
  }

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
    status = "EMPTY";
  } else if (
    errors.length > 0 &&
    events.length === 0
  ) {
    status = "ERROR";
  } else if (
    errors.length > 0 ||
    warnings.length > 0 ||
    input.retainedResponseUsed
  ) {
    status = "DEGRADED";
  } else {
    status = "READY";
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

    hasProviderData:
      input.providersUsed.length >
      0,

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

  const normalised =
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
    );

  const events =
    sortEvents(
      deduplicatePortfolioDividendEvents(
        normalised,
      ),
    );

  const holdingSummaries =
    buildHoldingSummaries(
      input,
      events,
      generatedAt,
    );

  const monthlyForecast =
    buildMonthlyForecast(
      events,
      generatedAt,
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
      generatedAt,
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
