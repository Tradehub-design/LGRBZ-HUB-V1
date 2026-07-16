import type {
  CashBalance,
  CurrencyCode,
  PortfolioCashSummary,
  PortfolioTransaction,
} from "./contracts";

import {
  actionCashDirection,
} from "./actions";

import {
  addMoney,
  finiteNumber,
  roundMoney,
  toAud,
} from "./money";

export function createEmptyCashSummary(): PortfolioCashSummary {
  return {
    balances: [],

    cashAud: 0,
    depositsAud: 0,
    withdrawalsAud: 0,
    transfersInAud: 0,
    transfersOutAud: 0,
    dividendsReceivedAud: 0,
    interestReceivedAud: 0,
    feesPaidAud: 0,
    taxPaidAud: 0,
    returnOfCapitalAud: 0,
  };
}

function balanceIndex(
  balances: readonly CashBalance[],
  currency: CurrencyCode,
): number {
  return balances.findIndex(
    (balance) => balance.currency === currency,
  );
}

function updateCurrencyBalance(
  summary: PortfolioCashSummary,
  transaction: PortfolioTransaction,
  signedLocalAmount: number,
): void {
  const currency = transaction.currency;
  const fxRateToAud =
    transaction.amounts.fxRateToAud;

  const index = balanceIndex(
    summary.balances,
    currency,
  );

  if (index < 0) {
    const localBalance = roundMoney(
      signedLocalAmount,
    );

    summary.balances.push({
      currency,
      localBalance,
      fxRateToAud,
      balanceAud: toAud(
        localBalance,
        fxRateToAud,
      ),
    });

    return;
  }

  const current = summary.balances[index];

  const localBalance = addMoney(
    current.localBalance,
    signedLocalAmount,
  );

  summary.balances[index] = {
    currency,
    localBalance,
    fxRateToAud,
    balanceAud: toAud(
      localBalance,
      fxRateToAud,
    ),
  };
}

function transactionCashAmountLocal(
  transaction: PortfolioTransaction,
): number {
  switch (transaction.action) {
    case "BUY":
    case "DIVIDEND_REINVESTMENT":
      return transaction.amounts.netAmount;

    case "SELL":
      return transaction.amounts.netAmount;

    case "DIVIDEND":
    case "INTEREST":
    case "DEPOSIT":
    case "WITHDRAWAL":
    case "FEE":
    case "TAX":
    case "TRANSFER_IN":
    case "TRANSFER_OUT":
    case "RETURN_OF_CAPITAL":
    case "ADJUSTMENT":
      return (
        transaction.amounts.netAmount ||
        transaction.amounts.grossAmount
      );

    case "SPLIT":
    case "CONSOLIDATION":
      return 0;
  }
}

export function applyCashTransaction(
  summary: PortfolioCashSummary,
  transaction: PortfolioTransaction,
): void {
  const unsignedAmountLocal =
    Math.abs(
      finiteNumber(
        transactionCashAmountLocal(transaction),
      ),
    );

  const direction =
    actionCashDirection(transaction.action);

  /**
   * ADJUSTMENT may represent a signed cash correction in raw source data.
   *
   * The canonical contract stores absolute values, so a neutral adjustment
   * does not modify cash until a future explicit adjustment-direction field
   * is introduced.
   */
  const signedLocalAmount =
    direction === 0
      ? 0
      : unsignedAmountLocal * direction;

  if (signedLocalAmount !== 0) {
    updateCurrencyBalance(
      summary,
      transaction,
      signedLocalAmount,
    );
  }

  const amountAud = toAud(
    unsignedAmountLocal,
    transaction.amounts.fxRateToAud,
  );

  switch (transaction.action) {
    case "DEPOSIT":
      summary.depositsAud = addMoney(
        summary.depositsAud,
        amountAud,
      );
      break;

    case "WITHDRAWAL":
      summary.withdrawalsAud = addMoney(
        summary.withdrawalsAud,
        amountAud,
      );
      break;

    case "TRANSFER_IN":
      summary.transfersInAud = addMoney(
        summary.transfersInAud,
        amountAud,
      );
      break;

    case "TRANSFER_OUT":
      summary.transfersOutAud = addMoney(
        summary.transfersOutAud,
        amountAud,
      );
      break;

    case "DIVIDEND":
      summary.dividendsReceivedAud = addMoney(
        summary.dividendsReceivedAud,
        amountAud,
      );
      break;

    case "INTEREST":
      summary.interestReceivedAud = addMoney(
        summary.interestReceivedAud,
        amountAud,
      );
      break;

    case "FEE":
      summary.feesPaidAud = addMoney(
        summary.feesPaidAud,
        amountAud,
      );
      break;

    case "TAX":
      summary.taxPaidAud = addMoney(
        summary.taxPaidAud,
        amountAud,
      );
      break;

    case "RETURN_OF_CAPITAL":
      summary.returnOfCapitalAud = addMoney(
        summary.returnOfCapitalAud,
        amountAud,
      );
      break;

    case "BUY":
    case "SELL":
    case "DIVIDEND_REINVESTMENT":
    case "SPLIT":
    case "CONSOLIDATION":
    case "ADJUSTMENT":
      break;
  }

  summary.cashAud = roundMoney(
    summary.balances.reduce(
      (sum, balance) =>
        sum + finiteNumber(balance.balanceAud),
      0,
    ),
  );

  summary.balances.sort(
    (left, right) =>
      left.currency.localeCompare(right.currency),
  );
}
