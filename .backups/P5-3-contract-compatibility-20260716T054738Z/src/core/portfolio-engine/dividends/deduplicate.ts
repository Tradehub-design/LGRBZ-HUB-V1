import type {
  PortfolioDividendEvent,
} from "./contracts";

import {
  roundMoney,
} from "../money";

function canonicalSymbol(
  value: string,
): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\.AX$/, "");
}

function normalisedDate(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  const timestamp =
    Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return value.trim();
  }

  return new Date(timestamp)
    .toISOString()
    .slice(0, 10);
}

function eventPrimaryDate(
  event:
    PortfolioDividendEvent,
): string {
  return normalisedDate(
    event.exDate ||
    event.paymentDate ||
    event.recordDate ||
    event.declarationDate,
  );
}

function approximateDividend(
  value:
    number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "";
  }

  return roundMoney(
    value,
    6,
  ).toFixed(6);
}

function eventIdentity(
  event:
    PortfolioDividendEvent,
): string {
  return [
    canonicalSymbol(
      event.symbol,
    ),

    eventPrimaryDate(event),

    approximateDividend(
      event.dividendPerShare,
    ),

    event.currency
      .trim()
      .toUpperCase(),
  ].join("::");
}

function sourceStrength(
  event:
    PortfolioDividendEvent,
): number {
  if (event.isReceived) {
    return 700;
  }

  if (event.isAnnounced) {
    return 600;
  }

  if (
    event.provider !==
      "forecast" &&
    event.provider !==
      "PORTFOLIO_ENGINE" &&
    event.provider !==
      "RETAINED" &&
    event.provider !==
      "UNAVAILABLE"
  ) {
    return 500;
  }

  if (event.isForecast) {
    return 300;
  }

  return 100;
}

function confidenceStrength(
  event:
    PortfolioDividendEvent,
): number {
  switch (event.confidence) {
    case "HIGH":
      return 30;

    case "MEDIUM":
      return 20;

    case "LOW":
      return 10;

    case "UNKNOWN":
      return 0;
  }
}

function eventTimestamp(
  event:
    PortfolioDividendEvent,
): number {
  const timestamp =
    Date.parse(
      event.sourceUpdatedAt ||
      event.receivedAt,
    );

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}

function selectStrongerEvent(
  left:
    PortfolioDividendEvent,
  right:
    PortfolioDividendEvent,
): PortfolioDividendEvent {
  const leftStrength =
    sourceStrength(left) +
    confidenceStrength(left);

  const rightStrength =
    sourceStrength(right) +
    confidenceStrength(right);

  if (
    leftStrength !==
    rightStrength
  ) {
    return rightStrength >
      leftStrength
      ? right
      : left;
  }

  return eventTimestamp(right) >
    eventTimestamp(left)
    ? right
    : left;
}

function eventDatesAreClose(
  left:
    PortfolioDividendEvent,
  right:
    PortfolioDividendEvent,
  days =
    14,
): boolean {
  const leftDate =
    Date.parse(
      left.exDate ||
      left.paymentDate ||
      "",
    );

  const rightDate =
    Date.parse(
      right.exDate ||
      right.paymentDate ||
      "",
    );

  if (
    !Number.isFinite(leftDate) ||
    !Number.isFinite(rightDate)
  ) {
    return false;
  }

  return (
    Math.abs(
      leftDate -
      rightDate,
    ) <=
    days *
    86_400_000
  );
}

/**
 * Forecast events close to a real announced event for the same security are
 * suppressed. This prevents the same expected distribution being counted
 * once as announced income and again as modelled forecast income.
 */
function suppressForecastsCoveredByAnnouncements(
  events:
    readonly PortfolioDividendEvent[],
): PortfolioDividendEvent[] {
  const announced =
    events.filter(
      (event) =>
        event.isAnnounced ||
        (
          !event.isForecast &&
          !event.isReceived &&
          event.provider !==
            "forecast"
        ),
    );

  return events.filter(
    (event) => {
      if (!event.isForecast) {
        return true;
      }

      return !announced.some(
        (candidate) =>
          canonicalSymbol(
            candidate.symbol,
          ) ===
            canonicalSymbol(
              event.symbol,
            ) &&
          eventDatesAreClose(
            candidate,
            event,
          ),
      );
    },
  );
}

export function deduplicatePortfolioDividendEvents(
  events:
    readonly PortfolioDividendEvent[],
): PortfolioDividendEvent[] {
  const strongestByIdentity =
    new Map<
      string,
      PortfolioDividendEvent
    >();

  for (const event of events) {
    const identity =
      eventIdentity(event);

    const existing =
      strongestByIdentity.get(
        identity,
      );

    if (!existing) {
      strongestByIdentity.set(
        identity,
        event,
      );

      continue;
    }

    strongestByIdentity.set(
      identity,
      selectStrongerEvent(
        existing,
        event,
      ),
    );
  }

  return suppressForecastsCoveredByAnnouncements(
    Array.from(
      strongestByIdentity.values(),
    ),
  );
}
