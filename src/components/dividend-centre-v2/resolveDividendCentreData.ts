import type {
  DividendEligibility,
  DividendEvent,
  DividendEventStatus,
} from "@/lib/dividend-data";
import type {
  DividendCalendarMarker,
  DividendCentreFilter,
  DividendCentreResolvedData,
  DividendReconciliationSummary,
  DividendTimelineRow,
} from "./dividendCentreTypes";

function eventDate(
  event: DividendEvent
) {
  return (
    event.paymentDate ||
    event.exDate ||
    event.recordDate ||
    event.declarationDate
  );
}

function eligibilityForEvent(
  event: DividendEvent,
  eligibility:
    DividendEligibility[]
) {
  return eligibility.find(
    (entry) =>
      entry.symbol ===
        event.symbol &&
      (
        (
          entry.paymentDate ||
          ""
        ) ===
          (
            event.paymentDate ||
            ""
          )
      ) &&
      (
        (
          entry.exDate ||
          ""
        ) ===
          (
            event.exDate ||
            ""
          )
      )
  );
}

function createTimeline(
  events: DividendEvent[],
  eligibility:
    DividendEligibility[]
): DividendTimelineRow[] {
  return events
    .map(
      (
        event
      ): DividendTimelineRow => {
        const matched =
          eligibilityForEvent(
            event,
            eligibility
          );

        return {
          id:
            event.id,
          symbol:
            event.symbol,
          displaySymbol:
            event.displaySymbol,
          date:
            eventDate(event),
          exDate:
            event.exDate,
          paymentDate:
            event.paymentDate,
          amount:
            matched?.expectedCash ??
            null,
          dividendPerShare:
            event.dividendPerShare,
          eligibleQuantity:
            matched?.eligibleQuantity ??
            0,
          currency:
            event.currency,
          status:
            event.status,
          confidence:
            event.confidence,
          frankingCredit:
            matched?.frankingCredit ??
            0,
        };
      }
    )
    .sort(
      (
        left,
        right
      ) => {
        if (
          !left.date &&
          !right.date
        ) {
          return 0;
        }

        if (!left.date) {
          return 1;
        }

        if (!right.date) {
          return -1;
        }

        return (
          new Date(
            left.date
          ).getTime() -
          new Date(
            right.date
          ).getTime()
        );
      }
    );
}

function createCalendarMarkers(
  events: DividendEvent[],
  eligibility:
    DividendEligibility[]
): DividendCalendarMarker[] {
  const markers:
    DividendCalendarMarker[] = [];

  for (
    const event of events
  ) {
    const matched =
      eligibilityForEvent(
        event,
        eligibility
      );

    const amount =
      matched?.expectedCash ??
      null;

    const addMarker = (
      date: string | null,
      markerType:
        DividendCalendarMarker["markerType"],
      label: string
    ) => {
      if (!date) {
        return;
      }

      markers.push({
        id:
          `${event.id}-${markerType}`,
        date,
        symbol:
          event.displaySymbol,
        label,
        markerType,
        status:
          event.status,
        amount,
        currency:
          event.currency,
        confidence:
          event.confidence,
      });
    };

    addMarker(
      event.declarationDate,
      "DECLARATION_DATE",
      "Declared"
    );

    addMarker(
      event.exDate,
      "EX_DATE",
      "Ex-dividend"
    );

    addMarker(
      event.recordDate,
      "RECORD_DATE",
      "Record"
    );

    addMarker(
      event.paymentDate,
      "PAYMENT_DATE",
      "Payment"
    );
  }

  return markers.sort(
    (
      left,
      right
    ) =>
      new Date(
        left.date
      ).getTime() -
      new Date(
        right.date
      ).getTime()
  );
}

function createReconciliation(
  timeline:
    DividendTimelineRow[]
): DividendReconciliationSummary {
  const announced =
    timeline.filter(
      (row) =>
        row.status ===
        "ANNOUNCED"
    );

  const forecast =
    timeline.filter(
      (row) =>
        row.status ===
        "FORECAST"
    );

  const received =
    timeline.filter(
      (row) =>
        row.status ===
        "RECEIVED"
    );

  const announcedAmount =
    announced.reduce(
      (
        total,
        row
      ) =>
        total +
        (
          row.amount ||
          0
        ),
      0
    );

  const forecastAmount =
    forecast.reduce(
      (
        total,
        row
      ) =>
        total +
        (
          row.amount ||
          0
        ),
      0
    );

  const receivedAmount =
    received.reduce(
      (
        total,
        row
      ) =>
        total +
        (
          row.amount ||
          0
        ),
      0
    );

  let matchedEventCount =
    0;

  for (
    const receivedRow of
    received
  ) {
    const matched =
      announced.some(
        (announcedRow) => {
          if (
            announcedRow.symbol !==
            receivedRow.symbol
          ) {
            return false;
          }

          if (
            !announcedRow.date ||
            !receivedRow.date
          ) {
            return false;
          }

          const distance =
            Math.abs(
              new Date(
                announcedRow.date
              ).getTime() -
              new Date(
                receivedRow.date
              ).getTime()
            );

          return (
            distance <=
            45 *
              86_400_000
          );
        }
      );

    if (matched) {
      matchedEventCount +=
        1;
    }
  }

  return {
    announcedAmount,
    forecastAmount,
    receivedAmount,
    outstandingAmount:
      Math.max(
        0,
        announcedAmount -
        receivedAmount
      ),
    matchedEventCount,
    unmatchedReceivedCount:
      Math.max(
        0,
        received.length -
        matchedEventCount
      ),
  };
}

export function resolveDividendCentreData(
  events: DividendEvent[],
  eligibility:
    DividendEligibility[],
  filter:
    DividendCentreFilter
): DividendCentreResolvedData {
  const filteredEvents =
    filter === "ALL"
      ? events
      : events.filter(
          (event) =>
            event.status ===
            filter
        );

  const timeline =
    createTimeline(
      filteredEvents,
      eligibility
    );

  return {
    events,
    eligibility,
    filteredEvents,
    timeline,
    calendarMarkers:
      createCalendarMarkers(
        filteredEvents,
        eligibility
      ),
    reconciliation:
      createReconciliation(
        createTimeline(
          events,
          eligibility
        )
      ),
  };
}

export function countDividendStatuses(
  events: DividendEvent[]
): Record<
  DividendCentreFilter,
  number
> {
  const result: Record<
    DividendCentreFilter,
    number
  > = {
    ALL:
      events.length,
    ANNOUNCED: 0,
    FORECAST: 0,
    RECEIVED: 0,
    CANCELLED: 0,
    UNKNOWN: 0,
  };

  for (
    const event of events
  ) {
    const status =
      event.status as DividendEventStatus;

    result[status] +=
      1;
  }

  return result;
}
