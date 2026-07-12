import type {
  DividendEligibility,
  DividendEvent,
  DividendHolding,
  DividendTransaction,
} from "./dividendTypes";

function normaliseType(
  value: string | null
) {
  return (
    value ||
    ""
  )
    .trim()
    .toUpperCase();
}

function sameSymbol(
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

function transactionQuantityBeforeDate(
  transactions:
    DividendTransaction[],
  symbol: string,
  date: string
) {
  const cutoff =
    new Date(date).getTime();

  if (
    Number.isNaN(cutoff)
  ) {
    return null;
  }

  let quantity =
    0;

  let recognised =
    false;

  for (
    const transaction of transactions
  ) {
    if (
      !sameSymbol(
        transaction.symbol,
        symbol
      )
    ) {
      continue;
    }

    const transactionDate =
      new Date(
        transaction.date
      ).getTime();

    if (
      Number.isNaN(
        transactionDate
      ) ||
      transactionDate >=
        cutoff
    ) {
      continue;
    }

    const amount =
      Number(
        transaction.quantity ||
        0
      );

    if (
      !Number.isFinite(amount)
    ) {
      continue;
    }

    const type =
      normaliseType(
        transaction.type
      );

    if (
      type.includes("BUY") ||
      type.includes("TRANSFER IN")
    ) {
      quantity +=
        Math.abs(amount);

      recognised =
        true;
    }

    if (
      type.includes("SELL") ||
      type.includes("TRANSFER OUT")
    ) {
      quantity -=
        Math.abs(amount);

      recognised =
        true;
    }
  }

  return recognised
    ? Math.max(
        0,
        quantity
      )
    : null;
}

function calculateFrankingCredit(
  expectedCash: number | null,
  frankingPercentage:
    | number
    | null,
  taxRate:
    | number
    | null
) {
  if (
    expectedCash === null ||
    frankingPercentage ===
      null ||
    frankingPercentage <=
      0
  ) {
    return 0;
  }

  const companyTaxRate =
    taxRate &&
    taxRate > 0 &&
    taxRate < 1
      ? taxRate
      : 0.30;

  const frankedCash =
    expectedCash *
    Math.min(
      1,
      Math.max(
        0,
        frankingPercentage /
          100
      )
    );

  return (
    frankedCash *
    companyTaxRate
  ) /
    (
      1 -
      companyTaxRate
    );
}

export function calculateDividendEligibility(
  events: DividendEvent[],
  holdings: DividendHolding[],
  transactions:
    DividendTransaction[] = []
): DividendEligibility[] {
  const results:
    DividendEligibility[] = [];

  for (
    const event of events
  ) {
    const relatedHoldings =
      holdings.filter(
        (holding) =>
          sameSymbol(
            holding.symbol,
            event.symbol
          )
      );

    for (
      const holding of
      relatedHoldings
    ) {
      const ledgerQuantity =
        event.exDate
          ? transactionQuantityBeforeDate(
              transactions,
              event.symbol,
              event.exDate
            )
          : null;

      const eligibleQuantity =
        ledgerQuantity ??
        Math.max(
          0,
          Number(
            holding.quantity ||
            0
          )
        );

      const expectedCash =
        event.dividendPerShare !==
          null
          ? eligibleQuantity *
            event.dividendPerShare
          : null;

      const frankingCredit =
        calculateFrankingCredit(
          expectedCash,
          event.frankingPercentage,
          event.taxRate
        );

      results.push({
        holdingId:
          holding.id ||
          null,
        symbol:
          event.symbol,

        eligibleQuantity,

        exDate:
          event.exDate,
        paymentDate:
          event.paymentDate,

        dividendPerShare:
          event.dividendPerShare,

        expectedCash,
        frankingCredit,
        grossedUpIncome:
          expectedCash ===
          null
            ? null
            : expectedCash +
              frankingCredit,

        currency:
          event.currency,

        status:
          event.status,
        confidence:
          event.confidence,
      });
    }
  }

  return results;
}
