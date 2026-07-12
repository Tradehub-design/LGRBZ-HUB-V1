import type {
  DividendEligibility,
  DividendEvent,
  DividendHolding,
  DividendHoldingSummary,
  DividendPortfolioSummary,
  DividendTransaction,
  MonthlyDividendForecast,
} from "./dividendTypes";
import {
  isDateWithin,
} from "./dividendUtils";

function symbolMatch(
  left: string,
  right: string
) {
  const clean = (
    value: string
  ) =>
    value
      .trim()
      .toUpperCase()
      .replace(
        /\.AX$/,
        ""
      );

  return (
    clean(left) ===
    clean(right)
  );
}

function monthKey(
  value: string
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

  return [
    date.getUTCFullYear(),
    String(
      date.getUTCMonth() +
      1
    ).padStart(
      2,
      "0"
    ),
  ].join("-");
}

function financialYearStart(
  now: Date
) {
  const year =
    now.getUTCMonth() >= 6
      ? now.getUTCFullYear()
      : now.getUTCFullYear() -
        1;

  return new Date(
    Date.UTC(
      year,
      6,
      1
    )
  );
}

function receivedLedgerAmount(
  transactions:
    DividendTransaction[],
  startDate: Date,
  endDate: Date
) {
  return transactions.reduce(
    (
      total,
      transaction
    ) => {
      const type =
        (
          transaction.type ||
          ""
        )
          .toUpperCase();

      if (
        !type.includes(
          "DIVIDEND"
        ) &&
        !type.includes(
          "DISTRIBUTION"
        ) &&
        !type.includes(
          "INCOME"
        )
      ) {
        return total;
      }

      if (
        !isDateWithin(
          transaction.date,
          startDate,
          endDate
        )
      ) {
        return total;
      }

      const amount =
        Number(
          transaction.amount ||
          0
        );

      return Number.isFinite(
        amount
      )
        ? total +
          amount
        : total;
    },
    0
  );
}

export function createDividendPortfolioSummary(
  events: DividendEvent[],
  eligibility:
    DividendEligibility[],
  holdings: DividendHolding[],
  transactions:
    DividendTransaction[],
  baseCurrency = "AUD"
): DividendPortfolioSummary {
  const now =
    new Date();

  const trailingStart =
    new Date(now);

  trailingStart.setUTCFullYear(
    trailingStart.getUTCFullYear() -
      1
  );

  const forwardEnd =
    new Date(now);

  forwardEnd.setUTCFullYear(
    forwardEnd.getUTCFullYear() +
      1
  );

  const forwardEligibility =
    eligibility.filter(
      (entry) =>
        isDateWithin(
          entry.paymentDate ||
          entry.exDate,
          now,
          forwardEnd
        )
    );

  const trailingEligibility =
    eligibility.filter(
      (entry) =>
        isDateWithin(
          entry.paymentDate ||
          entry.exDate,
          trailingStart,
          now
        )
    );

  const monthlyMap =
    new Map<
      string,
      MonthlyDividendForecast
    >();

  for (
    let offset = 0;
    offset < 12;
    offset += 1
  ) {
    const date =
      new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth() +
            offset,
          1
        )
      );

    const key =
      monthKey(
        date.toISOString()
      ) as string;

    monthlyMap.set(
      key,
      {
        month:
          key,
        label:
          date.toLocaleDateString(
            "en-AU",
            {
              month:
                "short",
              year:
                "numeric",
              timeZone:
                "UTC",
            }
          ),
        announcedIncome:
          0,
        forecastIncome:
          0,
        receivedIncome:
          0,
        totalIncome:
          0,
        frankingCredits:
          0,
        eventCount:
          0,
      }
    );
  }

  for (
    const entry of
    forwardEligibility
  ) {
    const date =
      entry.paymentDate ||
      entry.exDate;

    if (!date) {
      continue;
    }

    const key =
      monthKey(date);

    const month =
      key
        ? monthlyMap.get(
            key
          )
        : null;

    if (!month) {
      continue;
    }

    const cash =
      entry.expectedCash ||
      0;

    if (
      entry.status ===
      "ANNOUNCED"
    ) {
      month.announcedIncome +=
        cash;
    }

    if (
      entry.status ===
      "FORECAST"
    ) {
      month.forecastIncome +=
        cash;
    }

    if (
      entry.status ===
      "RECEIVED"
    ) {
      month.receivedIncome +=
        cash;
    }

    month.frankingCredits +=
      entry.frankingCredit ||
      0;

    month.totalIncome +=
      cash;

    month.eventCount +=
      1;
  }

  const holdingSummaries:
    DividendHoldingSummary[] =
      holdings.map(
        (holding) => {
          const relatedEvents =
            events.filter(
              (event) =>
                symbolMatch(
                  event.symbol,
                  holding.symbol
                )
            );

          const relatedEligibility =
            eligibility.filter(
              (entry) =>
                symbolMatch(
                  entry.symbol,
                  holding.symbol
                )
            );

          const forward =
            relatedEligibility.filter(
              (entry) =>
                isDateWithin(
                  entry.paymentDate ||
                  entry.exDate,
                  now,
                  forwardEnd
                )
            );

          const trailing =
            relatedEligibility.filter(
              (entry) =>
                isDateWithin(
                  entry.paymentDate ||
                  entry.exDate,
                  trailingStart,
                  now
                )
            );

          const forwardIncome =
            forward.reduce(
              (
                total,
                entry
              ) =>
                total +
                (
                  entry.expectedCash ||
                  0
                ),
              0
            );

          const annualisedDps =
            forward.reduce(
              (
                total,
                entry
              ) =>
                total +
                (
                  entry.dividendPerShare ||
                  0
                ),
              0
            );

          const marketValue =
            Number(
              holding.currentPrice ||
              0
            ) *
            Number(
              holding.quantity ||
              0
            );

          const costBase =
            Number(
              holding.averageCost ||
              0
            ) *
            Number(
              holding.quantity ||
              0
            );

          const futureSorted =
            relatedEvents
              .filter(
                (event) =>
                  isDateWithin(
                    event.exDate ||
                    event.paymentDate,
                    now,
                    forwardEnd
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

          return {
            symbol:
              holding.symbol,
            displaySymbol:
              holding.symbol
                .replace(
                  /\.AX$/i,
                  ""
                ),
            currency:
              (
                holding.currency ||
                baseCurrency
              ).toUpperCase(),

            quantity:
              Number(
                holding.quantity ||
                0
              ),

            trailingTwelveMonthIncome:
              trailing.reduce(
                (
                  total,
                  entry
                ) =>
                  total +
                  (
                    entry.expectedCash ||
                    0
                  ),
                0
              ),
            forwardTwelveMonthIncome:
              forwardIncome,

            announcedIncome:
              forward
                .filter(
                  (entry) =>
                    entry.status ===
                    "ANNOUNCED"
                )
                .reduce(
                  (
                    total,
                    entry
                  ) =>
                    total +
                    (
                      entry.expectedCash ||
                      0
                    ),
                  0
                ),
            forecastIncome:
              forward
                .filter(
                  (entry) =>
                    entry.status ===
                    "FORECAST"
                )
                .reduce(
                  (
                    total,
                    entry
                  ) =>
                    total +
                    (
                      entry.expectedCash ||
                      0
                    ),
                  0
                ),
            receivedIncome:
              trailing
                .filter(
                  (entry) =>
                    entry.status ===
                    "RECEIVED"
                )
                .reduce(
                  (
                    total,
                    entry
                  ) =>
                    total +
                    (
                      entry.expectedCash ||
                      0
                    ),
                  0
                ),

            annualisedDividendPerShare:
              annualisedDps,
            forwardYield:
              marketValue > 0
                ? (
                    forwardIncome /
                    marketValue
                  ) *
                  100
                : null,
            yieldOnCost:
              costBase > 0
                ? (
                    forwardIncome /
                    costBase
                  ) *
                  100
                : null,

            nextExDate:
              futureSorted[0]
                ?.exDate ||
              null,
            nextPaymentDate:
              futureSorted[0]
                ?.paymentDate ||
              null,

            frankingCredits:
              forward.reduce(
                (
                  total,
                  entry
                ) =>
                  total +
                  (
                    entry.frankingCredit ||
                    0
                  ),
                0
              ),

            eventCount:
              relatedEvents.length,
          };
        }
      );

  const portfolioMarketValue =
    holdings.reduce(
      (
        total,
        holding
      ) =>
        total +
        Number(
          holding.currentPrice ||
          0
        ) *
        Number(
          holding.quantity ||
          0
        ),
      0
    );

  const portfolioCostBase =
    holdings.reduce(
      (
        total,
        holding
      ) =>
        total +
        Number(
          holding.averageCost ||
          0
        ) *
        Number(
          holding.quantity ||
          0
        ),
      0
    );

  const forwardIncome =
    forwardEligibility.reduce(
      (
        total,
        entry
      ) =>
        total +
        (
          entry.expectedCash ||
          0
        ),
      0
    );

  const nextEvent =
    [...forwardEligibility]
      .filter(
        (entry) =>
          Boolean(
            entry.paymentDate ||
            entry.exDate
          )
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            left.paymentDate ||
            left.exDate ||
            ""
          ).getTime() -
          new Date(
            right.paymentDate ||
            right.exDate ||
            ""
          ).getTime()
      )[0] ||
    null;

  return {
    currency:
      baseCurrency.toUpperCase(),

    trailingTwelveMonthIncome:
      trailingEligibility.reduce(
        (
          total,
          entry
        ) =>
          total +
          (
            entry.expectedCash ||
            0
          ),
        0
      ),
    forwardTwelveMonthIncome:
      forwardIncome,

    announcedForwardIncome:
      forwardEligibility
        .filter(
          (entry) =>
            entry.status ===
            "ANNOUNCED"
        )
        .reduce(
          (
            total,
            entry
          ) =>
            total +
            (
              entry.expectedCash ||
              0
            ),
          0
        ),
    forecastForwardIncome:
      forwardEligibility
        .filter(
          (entry) =>
            entry.status ===
            "FORECAST"
        )
        .reduce(
          (
            total,
            entry
          ) =>
            total +
            (
              entry.expectedCash ||
              0
            ),
          0
        ),

    receivedCurrentFinancialYear:
      receivedLedgerAmount(
        transactions,
        financialYearStart(now),
        now
      ),

    projectedFrankingCredits:
      forwardEligibility.reduce(
        (
          total,
          entry
        ) =>
          total +
          (
            entry.frankingCredit ||
            0
          ),
        0
      ),

    portfolioDividendYield:
      portfolioMarketValue > 0
        ? (
            forwardIncome /
            portfolioMarketValue
          ) *
          100
        : null,
    portfolioYieldOnCost:
      portfolioCostBase > 0
        ? (
            forwardIncome /
            portfolioCostBase
          ) *
          100
        : null,

    nextEvent,

    monthlyForecast:
      Array.from(
        monthlyMap.values()
      ),
    holdingSummaries,

    eventCount:
      events.length,
    announcedEventCount:
      events.filter(
        (event) =>
          event.status ===
          "ANNOUNCED"
      ).length,
    forecastEventCount:
      events.filter(
        (event) =>
          event.status ===
          "FORECAST"
      ).length,
    receivedEventCount:
      events.filter(
        (event) =>
          event.status ===
          "RECEIVED"
      ).length,

    generatedAt:
      new Date().toISOString(),
  };
}
