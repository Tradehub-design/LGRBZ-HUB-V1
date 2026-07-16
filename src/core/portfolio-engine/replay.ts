import type {
  PortfolioTransaction,
  RealisedDisposal,
  ValidationIssue,
} from "./contracts";

import {
  createHoldingId,
  sortTransactionsDeterministically,
} from "./identity";

import {
  addMoney,
  clampNearZero,
  divideMoney,
  roundMoney,
  roundQuantity,
  subtractMoney,
  toAud,
} from "./money";

import {
  applyCashTransaction,
  createEmptyCashSummary,
} from "./cash";

import {
  createAcquisitionLot,
  disposePositionLots,
  reduceLotsForReturnOfCapital,
  scaleLotsForCorporateAction,
  transactionAcquisitionCostAud,
  transactionFeesAud,
  transactionSaleProceedsAud,
} from "./lots";

import type {
  MutablePositionState,
  PortfolioReplayResult,
  ReplayOptions,
  ReplayPositionResult,
  ReplayState,
  SecurityIncomeState,
} from "./replay-contracts";

const DEFAULT_QUANTITY_TOLERANCE = 1e-8;

function createIssue(
  transaction: PortfolioTransaction,
  issue: Omit<ValidationIssue, "transactionId">,
): ValidationIssue {
  return {
    ...issue,
    transactionId: transaction.id,
  };
}

function positionKey(
  transaction: PortfolioTransaction,
): string | null {
  if (!transaction.security) {
    return null;
  }

  return createHoldingId(
    transaction.security.securityId,
    transaction.account.accountId,
  );
}

function incomeKey(
  transaction: PortfolioTransaction,
): string | null {
  if (!transaction.security) {
    return null;
  }

  return [
    transaction.account.accountId,
    transaction.security.securityId,
  ].join("::");
}

function createPosition(
  transaction: PortfolioTransaction,
): MutablePositionState {
  if (!transaction.security) {
    throw new Error(
      `Cannot create position for transaction ${transaction.id} without a security.`,
    );
  }

  const holdingId = createHoldingId(
    transaction.security.securityId,
    transaction.account.accountId,
  );

  return {
    holdingId,

    security:
      transaction.security,

    account:
      transaction.account,

    classification:
      transaction.classification,

    currency:
      transaction.currency,

    quantity: 0,
    costBaseAud: 0,
    averageCostAud: 0,

    realisedGainAud: 0,
    realisedProceedsAud: 0,
    disposedCostBaseAud: 0,

    totalIncomeAud: 0,
    dividendsReceivedAud: 0,
    interestReceivedAud: 0,
    returnOfCapitalAud: 0,

    firstTransactionAt:
      transaction.tradeDate,

    lastTransactionAt:
      transaction.tradeDate,

    lots: [],
  };
}

function getOrCreatePosition(
  state: ReplayState,
  transaction: PortfolioTransaction,
): MutablePositionState | null {
  const key = positionKey(transaction);

  if (!key || !transaction.security) {
    return null;
  }

  const existing =
    state.positions.get(key);

  if (existing) {
    existing.lastTransactionAt =
      transaction.tradeDate;

    /**
     * Newer classification metadata is allowed to fill previously
     * unclassified values, but never overwrites meaningful historical data
     * with another empty placeholder.
     */
    if (
      existing.classification.sector ===
        "Unclassified" &&
      transaction.classification.sector !==
        "Unclassified"
    ) {
      existing.classification.sector =
        transaction.classification.sector;
    }

    if (
      existing.classification.industry ===
        "Unclassified" &&
      transaction.classification.industry !==
        "Unclassified"
    ) {
      existing.classification.industry =
        transaction.classification.industry;
    }

    if (
      existing.classification.strategy ===
        "Unclassified" &&
      transaction.classification.strategy !==
        "Unclassified"
    ) {
      existing.classification.strategy =
        transaction.classification.strategy;
    }

    if (
      existing.security.name ===
        existing.security.ticker &&
      transaction.security.name !==
        transaction.security.ticker
    ) {
      existing.security.name =
        transaction.security.name;
    }

    return existing;
  }

  const created =
    createPosition(transaction);

  state.positions.set(
    key,
    created,
  );

  return created;
}

function getOrCreateIncomeState(
  state: ReplayState,
  transaction: PortfolioTransaction,
): SecurityIncomeState | null {
  const key = incomeKey(transaction);

  if (
    !key ||
    !transaction.security
  ) {
    return null;
  }

  const existing =
    state.securityIncome.get(key);

  if (existing) {
    return existing;
  }

  const created: SecurityIncomeState = {
    securityId:
      transaction.security.securityId,

    accountId:
      transaction.account.accountId,

    dividendsReceivedAud: 0,
    interestReceivedAud: 0,
    frankingCreditsAud: 0,
    withholdingTaxAud: 0,
    returnOfCapitalAud: 0,
    totalIncomeAud: 0,
  };

  state.securityIncome.set(
    key,
    created,
  );

  return created;
}

function refreshAverageCost(
  position: MutablePositionState,
  quantityTolerance: number,
): void {
  position.quantity =
    roundQuantity(
      clampNearZero(
        position.quantity,
        quantityTolerance,
      ),
    );

  position.costBaseAud =
    roundMoney(
      clampNearZero(
        position.costBaseAud,
      ),
    );

  if (
    position.quantity <=
    quantityTolerance
  ) {
    position.quantity = 0;
    position.costBaseAud = 0;
    position.averageCostAud = 0;

    position.lots = position.lots.map(
      (lot) => ({
        ...lot,
        remainingQuantity:
          roundQuantity(
            clampNearZero(
              lot.remainingQuantity,
              quantityTolerance,
            ),
          ),
        remainingCostAud:
          roundMoney(
            clampNearZero(
              lot.remainingCostAud,
            ),
          ),
      }),
    );

    return;
  }

  position.averageCostAud =
    divideMoney(
      position.costBaseAud,
      position.quantity,
      0,
    );
}

function applyAcquisition(
  state: ReplayState,
  transaction: PortfolioTransaction,
  quantityTolerance: number,
  allowUnknownTransferCost: boolean,
): boolean {
  const position =
    getOrCreatePosition(
      state,
      transaction,
    );

  if (!position) {
    state.issues.push(
      createIssue(transaction, {
        code: "MISSING_TICKER",
        severity: "error",
        message:
          `${transaction.action} cannot update a position without a security.`,
        field: "security",
      }),
    );

    return false;
  }

  const quantity =
    transaction.amounts.quantity;

  if (quantity <= quantityTolerance) {
    state.issues.push(
      createIssue(transaction, {
        code: "INVALID_QUANTITY",
        severity: "error",
        message:
          `${transaction.action} quantity must be greater than zero.`,
        field: "amounts.quantity",
        suppliedValue: quantity,
      }),
    );

    return false;
  }

  let acquisitionCostAud =
    transactionAcquisitionCostAud(
      transaction,
    );

  if (
    transaction.action ===
      "TRANSFER_IN" &&
    acquisitionCostAud <= 0
  ) {
    if (!allowUnknownTransferCost) {
      state.issues.push(
        createIssue(transaction, {
          code: "INVALID_GROSS_AMOUNT",
          severity: "error",
          message:
            "Transfer-in requires the transferred cost base so holdings and tax reporting remain accurate.",
          field: "amounts.netAmount",
          suppliedValue:
            transaction.amounts.netAmount,
        }),
      );

      return false;
    }

    acquisitionCostAud = 0;

    state.issues.push(
      createIssue(transaction, {
        code: "INVALID_GROSS_AMOUNT",
        severity: "warning",
        message:
          "Transfer-in was accepted with a zero cost base. Tax results will remain incomplete until the original cost base is supplied.",
        field: "amounts.netAmount",
        suppliedValue:
          transaction.amounts.netAmount,
      }),
    );
  }

  const lot =
    createAcquisitionLot(
      transaction,
      quantity,
      acquisitionCostAud,
    );

  position.quantity =
    roundQuantity(
      position.quantity +
        quantity,
    );

  position.costBaseAud =
    addMoney(
      position.costBaseAud,
      acquisitionCostAud,
    );

  position.lots.push(lot);

  refreshAverageCost(
    position,
    quantityTolerance,
  );

  return true;
}

function createDisposal(
  transaction: PortfolioTransaction,
  quantity: number,
  proceedsAud: number,
  feesAud: number,
  costBaseRemovedAud: number,
  matchedLots: RealisedDisposal["matchedLots"],
): RealisedDisposal {
  const realisedGainAud =
    subtractMoney(
      proceedsAud,
      costBaseRemovedAud,
    );

  return {
    disposalId:
      `DISPOSAL-${transaction.id}`,

    transactionId:
      transaction.id,

    securityId:
      transaction.security?.securityId ??
      "UNKNOWN",

    accountId:
      transaction.account.accountId,

    disposedAt:
      transaction.tradeDate,

    quantity,

    proceedsAud,

    feesAud,

    costBaseRemovedAud,

    realisedGainAud,

    matchedLots,
  };
}

function applyDisposal(
  state: ReplayState,
  transaction: PortfolioTransaction,
  quantityTolerance: number,
): boolean {
  const key = positionKey(transaction);

  const position =
    key
      ? state.positions.get(key)
      : undefined;

  if (!position) {
    state.issues.push(
      createIssue(transaction, {
        code: "SELL_EXCEEDS_POSITION",
        severity: "error",
        message:
          `${transaction.action} cannot be processed because no matching position exists.`,
        field: "amounts.quantity",
        suppliedValue:
          transaction.amounts.quantity,
      }),
    );

    return false;
  }

  const requestedQuantity =
    transaction.amounts.quantity;

  if (
    requestedQuantity >
    position.quantity +
      quantityTolerance
  ) {
    state.issues.push(
      createIssue(transaction, {
        code: "SELL_EXCEEDS_POSITION",
        severity: "error",
        message:
          `${transaction.action} quantity ${requestedQuantity} exceeds available quantity ${position.quantity}.`,
        field: "amounts.quantity",
        suppliedValue:
          requestedQuantity,
      }),
    );

    return false;
  }

  const lotDisposal =
    disposePositionLots({
      method:
        state.costBasisMethod,

      lots:
        position.lots,

      requestedQuantity,

      totalQuantity:
        position.quantity,

      totalCostBaseAud:
        position.costBaseAud,

      quantityTolerance,
    });

  if (
    lotDisposal.quantityMatched <
    requestedQuantity -
      quantityTolerance
  ) {
    state.issues.push(
      createIssue(transaction, {
        code: "SELL_EXCEEDS_POSITION",
        severity: "error",
        message:
          "Position lots could not satisfy the disposal quantity.",
        field: "lots",
        suppliedValue:
          requestedQuantity,
      }),
    );

    return false;
  }

  const proceedsAud =
    transaction.action ===
      "TRANSFER_OUT"
      ? transaction.amounts.netAmount > 0
        ? toAud(
            transaction.amounts.netAmount,
            transaction.amounts.fxRateToAud,
          )
        : lotDisposal.costBaseRemovedAud
      : transactionSaleProceedsAud(
          transaction,
        );

  const feesAud =
    transactionFeesAud(transaction);

  const disposal =
    createDisposal(
      transaction,
      requestedQuantity,
      proceedsAud,
      feesAud,
      lotDisposal.costBaseRemovedAud,
      lotDisposal.matchedLots,
    );

  position.quantity =
    roundQuantity(
      position.quantity -
        requestedQuantity,
    );

  position.costBaseAud =
    subtractMoney(
      position.costBaseAud,
      lotDisposal.costBaseRemovedAud,
    );

  position.realisedGainAud =
    addMoney(
      position.realisedGainAud,
      disposal.realisedGainAud,
    );

  position.realisedProceedsAud =
    addMoney(
      position.realisedProceedsAud,
      disposal.proceedsAud,
    );

  position.disposedCostBaseAud =
    addMoney(
      position.disposedCostBaseAud,
      disposal.costBaseRemovedAud,
    );

  position.lots =
    lotDisposal.lots;

  state.disposals.push(
    disposal,
  );

  refreshAverageCost(
    position,
    quantityTolerance,
  );

  return true;
}

function applyCorporateAction(
  state: ReplayState,
  transaction: PortfolioTransaction,
  quantityTolerance: number,
): boolean {
  const key = positionKey(transaction);

  const position =
    key
      ? state.positions.get(key)
      : undefined;

  if (!position) {
    state.issues.push(
      createIssue(transaction, {
        code: "INVALID_CORPORATE_ACTION",
        severity: "error",
        message:
          `${transaction.action} cannot be processed because no matching position exists.`,
        field: "security",
      }),
    );

    return false;
  }

  const numerator =
    transaction.corporateAction.ratioNumerator;

  const denominator =
    transaction.corporateAction.ratioDenominator;

  if (
    !numerator ||
    !denominator ||
    numerator <= 0 ||
    denominator <= 0
  ) {
    state.issues.push(
      createIssue(transaction, {
        code: "INVALID_CORPORATE_ACTION",
        severity: "error",
        message:
          `${transaction.action} requires a positive corporate-action ratio.`,
        field: "corporateAction",
        suppliedValue:
          transaction.corporateAction,
      }),
    );

    return false;
  }

  const multiplier =
    numerator / denominator;

  position.quantity =
    roundQuantity(
      position.quantity *
        multiplier,
    );

  position.lots =
    scaleLotsForCorporateAction(
      position.lots,
      numerator,
      denominator,
    );

  refreshAverageCost(
    position,
    quantityTolerance,
  );

  return true;
}

function applyDividendIncome(
  state: ReplayState,
  transaction: PortfolioTransaction,
): boolean {
  const amountAud =
    toAud(
      transaction.amounts.netAmount ||
        transaction.amounts.grossAmount,
      transaction.amounts.fxRateToAud,
    );

  const income =
    getOrCreateIncomeState(
      state,
      transaction,
    );

  if (income) {
    income.dividendsReceivedAud =
      addMoney(
        income.dividendsReceivedAud,
        amountAud,
      );

    income.frankingCreditsAud =
      addMoney(
        income.frankingCreditsAud,
        transaction.tax.frankingCreditAud ??
          0,
      );

    income.withholdingTaxAud =
      addMoney(
        income.withholdingTaxAud,
        transaction.tax.withholdingTaxAud ??
          0,
      );

    income.totalIncomeAud =
      addMoney(
        income.totalIncomeAud,
        amountAud,
      );
  }

  const key = positionKey(transaction);

  if (key) {
    const position =
      state.positions.get(key);

    if (position) {
      position.dividendsReceivedAud =
        addMoney(
          position.dividendsReceivedAud,
          amountAud,
        );

      position.totalIncomeAud =
        addMoney(
          position.totalIncomeAud,
          amountAud,
        );

      position.lastTransactionAt =
        transaction.tradeDate;
    }
  }

  return true;
}

function applyInterestIncome(
  state: ReplayState,
  transaction: PortfolioTransaction,
): boolean {
  const amountAud =
    toAud(
      transaction.amounts.netAmount ||
        transaction.amounts.grossAmount,
      transaction.amounts.fxRateToAud,
    );

  const income =
    getOrCreateIncomeState(
      state,
      transaction,
    );

  if (income) {
    income.interestReceivedAud =
      addMoney(
        income.interestReceivedAud,
        amountAud,
      );

    income.totalIncomeAud =
      addMoney(
        income.totalIncomeAud,
        amountAud,
      );
  }

  const key = positionKey(transaction);

  if (key) {
    const position =
      state.positions.get(key);

    if (position) {
      position.interestReceivedAud =
        addMoney(
          position.interestReceivedAud,
          amountAud,
        );

      position.totalIncomeAud =
        addMoney(
          position.totalIncomeAud,
          amountAud,
        );

      position.lastTransactionAt =
        transaction.tradeDate;
    }
  }

  return true;
}

function applyReturnOfCapital(
  state: ReplayState,
  transaction: PortfolioTransaction,
  quantityTolerance: number,
): boolean {
  const key = positionKey(transaction);

  const position =
    key
      ? state.positions.get(key)
      : undefined;

  if (!position) {
    state.issues.push(
      createIssue(transaction, {
        code: "INVALID_CORPORATE_ACTION",
        severity: "error",
        message:
          "Return of capital cannot be processed because no matching position exists.",
        field: "security",
      }),
    );

    return false;
  }

  const amountAud =
    toAud(
      transaction.amounts.netAmount ||
        transaction.amounts.grossAmount,
      transaction.amounts.fxRateToAud,
    );

  if (amountAud <= 0) {
    state.issues.push(
      createIssue(transaction, {
        code: "INVALID_NET_AMOUNT",
        severity: "error",
        message:
          "Return of capital requires an amount greater than zero.",
        field: "amounts.netAmount",
        suppliedValue:
          transaction.amounts.netAmount,
      }),
    );

    return false;
  }

  const reductionAud =
    Math.min(
      amountAud,
      position.costBaseAud,
    );

  const excessAud =
    Math.max(
      0,
      amountAud -
        position.costBaseAud,
    );

  position.lots =
    reduceLotsForReturnOfCapital(
      position.lots,
      reductionAud,
      position.costBaseAud,
    );

  position.costBaseAud =
    subtractMoney(
      position.costBaseAud,
      reductionAud,
    );

  position.returnOfCapitalAud =
    addMoney(
      position.returnOfCapitalAud,
      amountAud,
    );

  /**
   * Any amount exceeding remaining cost base is treated as a realised gain.
   * This keeps the engine conservative and prevents negative cost bases.
   */
  if (excessAud > 0) {
    position.realisedGainAud =
      addMoney(
        position.realisedGainAud,
        excessAud,
      );

    position.realisedProceedsAud =
      addMoney(
        position.realisedProceedsAud,
        excessAud,
      );
  }

  const income =
    getOrCreateIncomeState(
      state,
      transaction,
    );

  if (income) {
    income.returnOfCapitalAud =
      addMoney(
        income.returnOfCapitalAud,
        amountAud,
      );
  }

  refreshAverageCost(
    position,
    quantityTolerance,
  );

  return true;
}

function replayTransaction(
  state: ReplayState,
  transaction: PortfolioTransaction,
  options: Required<ReplayOptions>,
): boolean {
  if (transaction.status !== "posted") {
    state.issues.push(
      createIssue(transaction, {
        code: "UNCLASSIFIED_TRANSACTION",
        severity: "information",
        message:
          `Transaction with status ${transaction.status} was excluded from replay.`,
        field: "status",
        suppliedValue:
          transaction.status,
      }),
    );

    return false;
  }

  let applied = false;

  switch (transaction.action) {
    case "BUY":
    case "DIVIDEND_REINVESTMENT":
    case "TRANSFER_IN":
      applied = applyAcquisition(
        state,
        transaction,
        options.quantityTolerance,
        options.allowUnknownTransferCost,
      );
      break;

    case "SELL":
    case "TRANSFER_OUT":
      applied = applyDisposal(
        state,
        transaction,
        options.quantityTolerance,
      );
      break;

    case "SPLIT":
    case "CONSOLIDATION":
      applied = applyCorporateAction(
        state,
        transaction,
        options.quantityTolerance,
      );
      break;

    case "DIVIDEND":
      applied = applyDividendIncome(
        state,
        transaction,
      );
      break;

    case "INTEREST":
      applied = applyInterestIncome(
        state,
        transaction,
      );
      break;

    case "RETURN_OF_CAPITAL":
      applied = applyReturnOfCapital(
        state,
        transaction,
        options.quantityTolerance,
      );
      break;

    case "DEPOSIT":
    case "WITHDRAWAL":
    case "FEE":
    case "TAX":
    case "ADJUSTMENT":
      applied = true;
      break;
  }

  if (applied) {
    applyCashTransaction(
      state.cash,
      transaction,
    );
  }

  return applied;
}

function positionToResult(
  position: MutablePositionState,
): ReplayPositionResult {
  return {
    holdingId:
      position.holdingId,

    security: {
      ...position.security,
    },

    account: {
      ...position.account,
    },

    classification: {
      ...position.classification,
    },

    currency:
      position.currency,

    quantity:
      position.quantity,

    costBaseAud:
      position.costBaseAud,

    averageCostAud:
      position.averageCostAud,

    realisedGainAud:
      position.realisedGainAud,

    realisedProceedsAud:
      position.realisedProceedsAud,

    disposedCostBaseAud:
      position.disposedCostBaseAud,

    totalIncomeAud:
      position.totalIncomeAud,

    dividendsReceivedAud:
      position.dividendsReceivedAud,

    interestReceivedAud:
      position.interestReceivedAud,

    returnOfCapitalAud:
      position.returnOfCapitalAud,

    firstTransactionAt:
      position.firstTransactionAt,

    lastTransactionAt:
      position.lastTransactionAt,

    lots: position.lots.map(
      (lot) => ({ ...lot }),
    ),
  };
}

export function replayPortfolioTransactions(
  transactions: readonly PortfolioTransaction[],
  replayOptions: ReplayOptions = {},
): PortfolioReplayResult {
  const options: Required<ReplayOptions> = {
    costBasisMethod:
      replayOptions.costBasisMethod ??
      "AVERAGE",

    allowUnknownTransferCost:
      replayOptions.allowUnknownTransferCost ??
      false,

    quantityTolerance:
      replayOptions.quantityTolerance ??
      DEFAULT_QUANTITY_TOLERANCE,
  };

  const state: ReplayState = {
    costBasisMethod:
      options.costBasisMethod,

    positions: new Map(),

    disposals: [],

    securityIncome: new Map(),

    cash:
      createEmptyCashSummary(),

    issues: [],

    processedTransactions: [],

    rejectedTransactions: [],
  };

  const orderedTransactions =
    sortTransactionsDeterministically(
      transactions,
    );

  for (const transaction of orderedTransactions) {
    const applied =
      replayTransaction(
        state,
        transaction,
        options,
      );

    if (applied) {
      state.processedTransactions.push(
        transaction,
      );
    } else {
      state.rejectedTransactions.push(
        transaction,
      );
    }
  }

  const positions = Array.from(
    state.positions.values(),
  )
    .map(positionToResult)
    .sort((left, right) => {
      const accountDifference =
        left.account.accountId.localeCompare(
          right.account.accountId,
        );

      if (accountDifference !== 0) {
        return accountDifference;
      }

      return left.security.securityId.localeCompare(
        right.security.securityId,
      );
    });

  const openPositions =
    positions.filter(
      (position) =>
        position.quantity >
        options.quantityTolerance,
    );

  const closedPositions =
    positions.filter(
      (position) =>
        position.quantity <=
        options.quantityTolerance,
    );

  return {
    costBasisMethod:
      options.costBasisMethod,

    positions,

    openPositions,

    closedPositions,

    disposals:
      state.disposals.map(
        (disposal) => ({
          ...disposal,
          matchedLots:
            disposal.matchedLots.map(
              (matchedLot) => ({
                ...matchedLot,
              }),
            ),
        }),
      ),

    cash: {
      ...state.cash,

      balances:
        state.cash.balances.map(
          (balance) => ({
            ...balance,
          }),
        ),
    },

    securityIncome:
      Array.from(
        state.securityIncome.values(),
      )
        .map(
          (income) => ({
            ...income,
          }),
        )
        .sort((left, right) => {
          const accountDifference =
            left.accountId.localeCompare(
              right.accountId,
            );

          if (accountDifference !== 0) {
            return accountDifference;
          }

          return left.securityId.localeCompare(
            right.securityId,
          );
        }),

    processedTransactions: [
      ...state.processedTransactions,
    ],

    rejectedTransactions: [
      ...state.rejectedTransactions,
    ],

    issues: [
      ...state.issues,
    ],

    processedCount:
      state.processedTransactions.length,

    rejectedCount:
      state.rejectedTransactions.length,
  };
}
