import type {
  PortfolioSnapshot,
  PortfolioTransaction,
} from "../contracts";

import {
  roundQuantity,
} from "../money";

export type DividendOwnershipPoint = {
  securityId: string;
  holdingId: string | null;
  symbol: string;

  exDate: string;

  eligibleQuantity: number;
  transactionCount: number;

  lastTransactionDate:
    string | null;
};

function canonicalSymbol(
  value: string,
): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\.AX$/, "");
}

function effectiveDate(
  transaction:
    PortfolioTransaction,
): number {
  const value =
    transaction.settlementDate ||
    transaction.tradeDate;

  const timestamp =
    Date.parse(value);

  return Number.isFinite(timestamp)
    ? timestamp
    : Number.MAX_SAFE_INTEGER;
}

function actionQuantityDirection(
  transaction:
    PortfolioTransaction,
): number {
  switch (transaction.action) {
    case "BUY":
    case "DIVIDEND_REINVESTMENT":
    case "TRANSFER_IN":
      return 1;

    case "SELL":
    case "TRANSFER_OUT":
      return -1;

    case "SPLIT":
    case "CONSOLIDATION":
    case "DIVIDEND":
    case "INTEREST":
    case "DEPOSIT":
    case "WITHDRAWAL":
    case "FEE":
    case "TAX":
    case "RETURN_OF_CAPITAL":
    case "ADJUSTMENT":
      return 0;
  }
}

function applyCorporateAction(
  quantity: number,
  transaction:
    PortfolioTransaction,
): number {
  if (
    transaction.action !== "SPLIT" &&
    transaction.action !== "CONSOLIDATION"
  ) {
    return quantity;
  }

  const numerator =
    transaction.corporateAction
      .ratioNumerator;

  const denominator =
    transaction.corporateAction
      .ratioDenominator;

  if (
    !numerator ||
    !denominator ||
    numerator <= 0 ||
    denominator <= 0
  ) {
    return quantity;
  }

  return roundQuantity(
    quantity *
    (
      numerator /
      denominator
    ),
  );
}

function matchesSecurity(
  transaction:
    PortfolioTransaction,
  securityId:
    string,
  symbol:
    string,
): boolean {
  if (!transaction.security) {
    return false;
  }

  if (
    transaction.security
      .securityId ===
    securityId
  ) {
    return true;
  }

  const canonical =
    canonicalSymbol(symbol);

  return (
    canonicalSymbol(
      transaction.security.ticker,
    ) === canonical ||
    canonicalSymbol(
      transaction.security.quoteTicker,
    ) === canonical
  );
}

/**
 * Dividend eligibility uses quantity held immediately before the ex-date.
 *
 * Trades effective on the ex-date are excluded from eligibility. This avoids
 * counting purchases made after entitlement has already detached.
 */
export function quantityOwnedBeforeExDate(input: {
  portfolio:
    PortfolioSnapshot;

  securityId:
    string;

  symbol:
    string;

  exDate:
    string;
}): DividendOwnershipPoint {
  const exTimestamp =
    Date.parse(input.exDate);

  if (!Number.isFinite(exTimestamp)) {
    return {
      securityId:
        input.securityId,

      holdingId:
        null,

      symbol:
        input.symbol,

      exDate:
        input.exDate,

      eligibleQuantity:
        0,

      transactionCount:
        0,

      lastTransactionDate:
        null,
    };
  }

  const relevantTransactions =
    input.portfolio.transactions
      .filter(
        (transaction) =>
          transaction.status === "posted" &&
          matchesSecurity(
            transaction,
            input.securityId,
            input.symbol,
          ) &&
          effectiveDate(transaction) <
            exTimestamp,
      )
      .sort(
        (left, right) => {
          const dateDifference =
            effectiveDate(left) -
            effectiveDate(right);

          if (dateDifference !== 0) {
            return dateDifference;
          }

          return left.id.localeCompare(
            right.id,
          );
        },
      );

  let quantity =
    0;

  let lastTransactionDate:
    string | null = null;

  for (
    const transaction of
    relevantTransactions
  ) {
    quantity =
      applyCorporateAction(
        quantity,
        transaction,
      );

    const direction =
      actionQuantityDirection(
        transaction,
      );

    if (direction !== 0) {
      quantity =
        roundQuantity(
          quantity +
          (
            transaction.amounts
              .quantity *
            direction
          ),
        );
    }

    quantity =
      Math.max(
        0,
        roundQuantity(quantity),
      );

    lastTransactionDate =
      transaction.tradeDate;
  }

  const holding =
    input.portfolio.holdings.find(
      (candidate) =>
        candidate.security.securityId ===
        input.securityId,
    );

  return {
    securityId:
      input.securityId,

    holdingId:
      holding?.holdingId ??
      null,

    symbol:
      input.symbol,

    exDate:
      input.exDate,

    eligibleQuantity:
      quantity,

    transactionCount:
      relevantTransactions.length,

    lastTransactionDate,
  };
}
