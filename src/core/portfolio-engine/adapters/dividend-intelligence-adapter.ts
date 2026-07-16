import type {
  DividendHolding,
  DividendTransaction,
} from "@/lib/dividend-data";

import type {
  PortfolioTransaction,
  PortfolioSnapshot,
} from "../contracts";

import type {
  PortfolioDividendApiPayload,
} from "../dividends/contracts";

import {
  roundMoney,
} from "../money";

function isoDate(
  value: string,
): string {
  const timestamp =
    Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return value;
  }

  return new Date(
    timestamp,
  ).toISOString();
}

function startDateForDividendHistory(
  portfolio: PortfolioSnapshot,
): string {
  const earliestTransaction =
    [...portfolio.transactions]
      .map(
        (transaction) =>
          Date.parse(
            transaction.tradeDate,
          ),
      )
      .filter(Number.isFinite)
      .sort(
        (left, right) =>
          left - right,
      )[0];

  const defaultStart =
    new Date();

  defaultStart.setUTCFullYear(
    defaultStart.getUTCFullYear() -
      5,
  );

  if (
    earliestTransaction === undefined
  ) {
    return defaultStart.toISOString();
  }

  const earliest =
    new Date(
      earliestTransaction,
    );

  /**
   * Include one year before the earliest transaction. Provider history before
   * ownership helps determine frequency and forecast cadence, while
   * eligibility still prevents pre-ownership income being counted.
   */
  earliest.setUTCFullYear(
    earliest.getUTCFullYear() -
      1,
  );

  return earliest.toISOString();
}

function endDateForDividendForecast():
  string {
  const end =
    new Date();

  end.setUTCFullYear(
    end.getUTCFullYear() +
      1,
  );

  return end.toISOString();
}

export function portfolioSnapshotToDividendHoldings(
  portfolio: PortfolioSnapshot,
): DividendHolding[] {
  return portfolio.openHoldings.map(
    (holding): DividendHolding => ({
      id:
        holding.holdingId,

      symbol:
        holding.security.quoteTicker ||
        holding.security.ticker,

      exchange:
        holding.security.market,

      currency:
        holding.currency,

      quantity:
        holding.quantity,

      averageCost:
        holding.averageCostAud,

      currentPrice:
        holding.valuation.marketPriceAud > 0
          ? holding.valuation.marketPriceAud
          : null,

      openedAt:
        isoDate(
          holding.firstTransactionAt,
        ),

      closedAt:
        null,

      account:
        holding.account.accountName,

      broker:
        holding.account.platform,
    }),
  );
}

function transactionAmountForDividendLedger(
  transaction:
    PortfolioTransaction,
): number | null {
  const amount =
    transaction.amounts.netAmount ||
    transaction.amounts.grossAmount;

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return null;
  }

  return roundMoney(amount);
}

function transactionDividendPerShare(
  transaction:
    PortfolioTransaction,
): number | null {
  if (
    transaction.action !==
    "DIVIDEND"
  ) {
    return null;
  }

  const quantity =
    transaction.amounts.quantity;

  const amount =
    transactionAmountForDividendLedger(
      transaction,
    );

  if (
    amount === null ||
    quantity <= 0
  ) {
    return null;
  }

  return roundMoney(
    amount /
    quantity,
  );
}

export function portfolioSnapshotToDividendTransactions(
  portfolio: PortfolioSnapshot,
): DividendTransaction[] {
  return portfolio.transactions
    .filter(
      (transaction) =>
        Boolean(
          transaction.security,
        ),
    )
    .map(
      (
        transaction,
      ): DividendTransaction => ({
        id:
          transaction.id,

        symbol:
          transaction.security
            ?.quoteTicker ||
          transaction.security
            ?.ticker ||
          "",

        type:
          transaction.action,

        date:
          isoDate(
            transaction.tradeDate,
          ),

        quantity:
          transaction.amounts.quantity > 0
            ? transaction.amounts.quantity
            : null,

        amount:
          transactionAmountForDividendLedger(
            transaction,
          ),

        dividendPerShare:
          transactionDividendPerShare(
            transaction,
          ),

        currency:
          transaction.currency,

        note:
          transaction.notes ||
          null,
      }),
    )
    .filter(
      (transaction) =>
        Boolean(
          transaction.symbol,
        ),
    );
}

export function createPortfolioDividendApiPayload(
  portfolio: PortfolioSnapshot,
  forceRefresh = false,
): PortfolioDividendApiPayload {
  const holdings =
    portfolioSnapshotToDividendHoldings(
      portfolio,
    );

  return {
    securities:
      holdings.map(
        (holding) => ({
          symbol:
            holding.symbol,

          exchange:
            holding.exchange,

          currency:
            holding.currency,
        }),
      ),

    holdings,

    transactions:
      portfolioSnapshotToDividendTransactions(
        portfolio,
      ),

    startDate:
      startDateForDividendHistory(
        portfolio,
      ),

    endDate:
      endDateForDividendForecast(),

    baseCurrency:
      portfolio.baseCurrency,

    forceRefresh,
  };
}

export function dividendPayloadIdentity(
  payload:
    PortfolioDividendApiPayload,
): string {
  return JSON.stringify({
    holdings:
      payload.holdings
        .map(
          (holding) => ({
            id:
              holding.id,

            symbol:
              holding.symbol,

            quantity:
              holding.quantity,

            averageCost:
              holding.averageCost,

            currentPrice:
              holding.currentPrice,

            currency:
              holding.currency,
          }),
        )
        .sort(
          (left, right) =>
            String(
              left.id ??
              left.symbol,
            ).localeCompare(
              String(
                right.id ??
                right.symbol,
              ),
            ),
        ),

    transactions:
      payload.transactions
        .map(
          (transaction) => ({
            id:
              transaction.id,

            symbol:
              transaction.symbol,

            type:
              transaction.type,

            date:
              transaction.date,

            quantity:
              transaction.quantity,

            amount:
              transaction.amount,

            currency:
              transaction.currency,
          }),
        )
        .sort(
          (left, right) =>
            String(
              left.id ??
              "",
            ).localeCompare(
              String(
                right.id ??
                "",
              ),
            ),
        ),

    startDate:
      payload.startDate,

    endDate:
      payload.endDate,

    baseCurrency:
      payload.baseCurrency,
  });
}
