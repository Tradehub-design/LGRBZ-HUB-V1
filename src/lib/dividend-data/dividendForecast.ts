import type {
  DividendEvent,
  DividendFrequency,
} from "./dividendTypes";
import {
  createDividendId,
  inferDividendFrequency,
} from "./dividendUtils";

function monthsForFrequency(
  frequency:
    DividendFrequency
) {
  if (
    frequency === "MONTHLY"
  ) {
    return 1;
  }

  if (
    frequency === "QUARTERLY"
  ) {
    return 3;
  }

  if (
    frequency === "SEMI_ANNUAL"
  ) {
    return 6;
  }

  if (
    frequency === "ANNUAL"
  ) {
    return 12;
  }

  return 6;
}

function averageAmount(
  events: DividendEvent[]
) {
  const values =
    events
      .map(
        (event) =>
          event.dividendPerShare
      )
      .filter(
        (
          value
        ): value is number =>
          typeof value ===
            "number" &&
          Number.isFinite(
            value
          ) &&
          value > 0
      )
      .slice(-4);

  if (
    values.length ===
    0
  ) {
    return null;
  }

  return (
    values.reduce(
      (total, value) =>
        total + value,
      0
    ) /
    values.length
  );
}

function addMonths(
  value: string,
  months: number
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  date.setUTCMonth(
    date.getUTCMonth() +
      months
  );

  return date.toISOString();
}

export function createDividendForecastEvents(
  historicalEvents:
    DividendEvent[],
  forecastEndDate: string
) {
  const grouped =
    new Map<
      string,
      DividendEvent[]
    >();

  for (
    const event of
    historicalEvents
  ) {
    const current =
      grouped.get(
        event.symbol
      ) || [];

    current.push(
      event
    );

    grouped.set(
      event.symbol,
      current
    );
  }

  const end =
    new Date(
      forecastEndDate
    );

  const forecast:
    DividendEvent[] = [];

  for (
    const [
      symbol,
      events,
    ] of grouped
  ) {
    const ordered =
      [...events]
        .filter(
          (event) =>
            Boolean(
              event.exDate ||
              event.paymentDate
            )
        )
        .sort(
          (
            left,
            right
          ) =>
            new Date(
              left.exDate ||
              left.paymentDate ||
              ""
            ).getTime() -
            new Date(
              right.exDate ||
              right.paymentDate ||
              ""
            ).getTime()
        );

    const last =
      ordered[
        ordered.length - 1
      ];

    if (!last) {
      continue;
    }

    const frequency =
      inferDividendFrequency(
        ordered
      );

    const intervalMonths =
      monthsForFrequency(
        frequency
      );

    const amount =
      averageAmount(
        ordered
      );

    if (
      amount === null
    ) {
      continue;
    }

    let nextExDate =
      addMonths(
        last.exDate ||
        last.paymentDate ||
        "",
        intervalMonths
      );

    let sequence =
      0;

    while (
      nextExDate &&
      new Date(
        nextExDate
      ) <= end &&
      sequence < 24
    ) {
      const alreadyConfirmed =
        ordered.some(
          (event) => {
            const date =
              event.exDate ||
              event.paymentDate;

            if (!date) {
              return false;
            }

            return (
              Math.abs(
                new Date(
                  date
                ).getTime() -
                new Date(
                  nextExDate as string
                ).getTime()
              ) <
              21 *
                86_400_000
            );
          }
        );

      if (
        !alreadyConfirmed
      ) {
        forecast.push({
          id:
            createDividendId(
              "forecast",
              symbol,
              nextExDate,
              amount,
              sequence
            ),

          symbol:
            last.symbol,
          providerSymbol:
            last.providerSymbol,
          displaySymbol:
            last.displaySymbol,
          exchange:
            last.exchange,
          currency:
            last.currency,

          exDate:
            nextExDate,
          declarationDate:
            null,
          recordDate:
            null,
          paymentDate:
            addMonths(
              nextExDate,
              1
            ),

          dividendPerShare:
            amount,
          adjustedDividendPerShare:
            amount,

          status:
            "FORECAST",
          confidence:
            ordered.length >= 4
              ? "MEDIUM"
              : "LOW",
          provider:
            "forecast",

          frequency,
          isSpecial:
            false,

          frankingPercentage:
            last.frankingPercentage,
          taxRate:
            last.taxRate,

          sourceUpdatedAt:
            new Date().toISOString(),
          receivedAt:
            new Date().toISOString(),

          note:
            "Estimated from historical dividend frequency and average payment.",
        });
      }

      sequence += 1;

      nextExDate =
        addMonths(
          nextExDate,
          intervalMonths
        );
    }
  }

  return forecast;
}
