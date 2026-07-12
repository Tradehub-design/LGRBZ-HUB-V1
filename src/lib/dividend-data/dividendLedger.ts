import type {
  DividendEvent,
  DividendTransaction,
} from "./dividendTypes";
import {
  createDividendId,
  dividendCurrency,
  dividendDate,
} from "./dividendUtils";

function isDividendType(
  value: string | null
) {
  const type =
    (
      value ||
      ""
    )
      .trim()
      .toUpperCase();

  return (
    type.includes(
      "DIVIDEND"
    ) ||
    type.includes(
      "DISTRIBUTION"
    ) ||
    type.includes(
      "INCOME"
    )
  );
}

export function createReceivedDividendEvents(
  transactions:
    DividendTransaction[]
): DividendEvent[] {
  return transactions
    .filter(
      (transaction) =>
        isDividendType(
          transaction.type
        )
    )
    .map(
      (
        transaction,
        index
      ) => {
        const date =
          dividendDate(
            transaction.date
          );

        const amount =
          transaction.dividendPerShare ??
          null;

        return {
          id:
            transaction.id ||
            createDividendId(
              "ledger",
              transaction.symbol,
              date,
              amount,
              index
            ),

          symbol:
            transaction.symbol
              .trim()
              .toUpperCase(),
          providerSymbol:
            transaction.symbol
              .trim()
              .toUpperCase(),
          displaySymbol:
            transaction.symbol
              .trim()
              .toUpperCase()
              .replace(
                /\.AX$/,
                ""
              ),
          exchange:
            transaction.symbol
              .toUpperCase()
              .endsWith(
                ".AX"
              )
              ? "ASX"
              : "UNKNOWN",
          currency:
            dividendCurrency(
              transaction.currency,
              "AUD"
            ),

          exDate:
            null,
          declarationDate:
            null,
          recordDate:
            null,
          paymentDate:
            date,

          dividendPerShare:
            amount,
          adjustedDividendPerShare:
            amount,

          status:
            "RECEIVED",
          confidence:
            "CONFIRMED",
          provider:
            "ledger",

          frequency:
            "UNKNOWN",
          isSpecial:
            false,

          frankingPercentage:
            null,
          taxRate:
            null,

          sourceUpdatedAt:
            date,
          receivedAt:
            new Date().toISOString(),

          note:
            transaction.note ||
            (
              transaction.amount !==
              null &&
              transaction.amount !==
              undefined
                ? `Received cash amount: ${transaction.amount}`
                : "Matched from transaction ledger."
            ),
        } satisfies DividendEvent;
      }
    );
}
