import {
  isSupportedCurrency,
  isTransactionAction,
  type PortfolioTransaction,
  type ValidationIssue,
} from "./contracts";

import {
  actionRequiresQuantity,
  actionRequiresSecurity,
  actionRequiresUnitPrice,
} from "./actions";

import {
  approximatelyEqual,
  calculateGrossAmount,
  finiteNumber,
} from "./money";

export type TransactionValidationOptions = {
  allowPending?: boolean;
  allowCancelled?: boolean;
  amountTolerance?: number;
};

export type TransactionValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

function createIssue(
  transaction: PortfolioTransaction,
  issue: Omit<ValidationIssue, "transactionId">,
): ValidationIssue {
  return {
    ...issue,
    transactionId: transaction.id,
  };
}

export function validatePortfolioTransaction(
  transaction: PortfolioTransaction,
  options: TransactionValidationOptions = {},
): TransactionValidationResult {
  const issues: ValidationIssue[] = [];

  const amountTolerance =
    options.amountTolerance ?? 0.02;

  if (!transaction.id.trim()) {
    issues.push(
      createIssue(transaction, {
        code: "MISSING_ID",
        severity: "error",
        message: "Transaction ID is empty.",
        field: "id",
      }),
    );
  }

  if (
    !Number.isFinite(
      Date.parse(transaction.tradeDate),
    )
  ) {
    issues.push(
      createIssue(transaction, {
        code: "INVALID_DATE",
        severity: "error",
        message: "Transaction trade date is invalid.",
        field: "tradeDate",
        suppliedValue: transaction.tradeDate,
      }),
    );
  }

  if (!isTransactionAction(transaction.action)) {
    issues.push(
      createIssue(transaction, {
        code: "INVALID_ACTION",
        severity: "error",
        message: "Transaction action is invalid.",
        field: "action",
        suppliedValue: transaction.action,
      }),
    );
  }

  if (
    actionRequiresSecurity(transaction.action) &&
    !transaction.security
  ) {
    issues.push(
      createIssue(transaction, {
        code: "MISSING_TICKER",
        severity: "error",
        message:
          `${transaction.action} requires a security.`,
        field: "security",
      }),
    );
  }

  if (
    transaction.security &&
    !transaction.security.ticker.trim()
  ) {
    issues.push(
      createIssue(transaction, {
        code: "MISSING_TICKER",
        severity: "error",
        message: "Security ticker is empty.",
        field: "security.ticker",
      }),
    );
  }

  if (
    actionRequiresQuantity(transaction.action) &&
    transaction.amounts.quantity <= 0
  ) {
    issues.push(
      createIssue(transaction, {
        code: "INVALID_QUANTITY",
        severity: "error",
        message:
          `${transaction.action} quantity must be greater than zero.`,
        field: "amounts.quantity",
        suppliedValue: transaction.amounts.quantity,
      }),
    );
  }

  if (
    actionRequiresUnitPrice(transaction.action) &&
    transaction.amounts.unitPrice <= 0
  ) {
    issues.push(
      createIssue(transaction, {
        code: "INVALID_PRICE",
        severity: "error",
        message:
          `${transaction.action} unit price must be greater than zero.`,
        field: "amounts.unitPrice",
        suppliedValue: transaction.amounts.unitPrice,
      }),
    );
  }

  const financialFields: Array<{
    field: string;
    value: number;
  }> = [
    {
      field: "amounts.quantity",
      value: transaction.amounts.quantity,
    },
    {
      field: "amounts.unitPrice",
      value: transaction.amounts.unitPrice,
    },
    {
      field: "amounts.fees",
      value: transaction.amounts.fees,
    },
    {
      field: "amounts.grossAmount",
      value: transaction.amounts.grossAmount,
    },
    {
      field: "amounts.netAmount",
      value: transaction.amounts.netAmount,
    },
    {
      field: "amounts.fxRateToAud",
      value: transaction.amounts.fxRateToAud,
    },
  ];

  for (const financialField of financialFields) {
    if (!Number.isFinite(financialField.value)) {
      issues.push(
        createIssue(transaction, {
          code: "INVALID_NET_AMOUNT",
          severity: "error",
          message:
            `${financialField.field} must be a finite number.`,
          field: financialField.field,
          suppliedValue: financialField.value,
        }),
      );
    }

    if (finiteNumber(financialField.value) < 0) {
      issues.push(
        createIssue(transaction, {
          code: "INVALID_NET_AMOUNT",
          severity: "error",
          message:
            `${financialField.field} cannot be negative. Direction is derived from action.`,
          field: financialField.field,
          suppliedValue: financialField.value,
        }),
      );
    }
  }

  if (!isSupportedCurrency(transaction.currency)) {
    issues.push(
      createIssue(transaction, {
        code: "UNSUPPORTED_CURRENCY",
        severity: "error",
        message:
          `Unsupported transaction currency: ${transaction.currency}`,
        field: "currency",
        suppliedValue: transaction.currency,
      }),
    );
  }

  if (
    transaction.currency !== "AUD" &&
    transaction.amounts.fxRateToAud <= 0
  ) {
    issues.push(
      createIssue(transaction, {
        code: "MISSING_FX_RATE",
        severity: "error",
        message:
          `${transaction.currency} transaction requires an FX rate to AUD.`,
        field: "amounts.fxRateToAud",
        suppliedValue:
          transaction.amounts.fxRateToAud,
      }),
    );
  }

  if (
    transaction.currency === "AUD" &&
    !approximatelyEqual(
      transaction.amounts.fxRateToAud,
      1,
      0.000001,
    )
  ) {
    issues.push(
      createIssue(transaction, {
        code: "MISSING_FX_RATE",
        severity: "warning",
        message:
          "AUD transaction FX rate should equal 1.",
        field: "amounts.fxRateToAud",
        suppliedValue:
          transaction.amounts.fxRateToAud,
      }),
    );
  }

  if (
    transaction.action === "BUY" ||
    transaction.action === "SELL" ||
    transaction.action === "DIVIDEND_REINVESTMENT"
  ) {
    const expectedGross = calculateGrossAmount(
      transaction.amounts.quantity,
      transaction.amounts.unitPrice,
    );

    if (
      expectedGross > 0 &&
      !approximatelyEqual(
        expectedGross,
        transaction.amounts.grossAmount,
        amountTolerance,
      )
    ) {
      issues.push(
        createIssue(transaction, {
          code: "INCONSISTENT_AMOUNT",
          severity: "warning",
          message:
            "Gross amount does not equal quantity multiplied by unit price.",
          field: "amounts.grossAmount",
          suppliedValue:
            transaction.amounts.grossAmount,
        }),
      );
    }
  }

  if (
    (
      transaction.action === "SPLIT" ||
      transaction.action === "CONSOLIDATION"
    ) &&
    (
      !transaction.corporateAction.ratioNumerator ||
      !transaction.corporateAction.ratioDenominator ||
      transaction.corporateAction.ratioNumerator <= 0 ||
      transaction.corporateAction.ratioDenominator <= 0
    )
  ) {
    issues.push(
      createIssue(transaction, {
        code: "INVALID_CORPORATE_ACTION",
        severity: "error",
        message:
          `${transaction.action} requires a valid positive ratio.`,
        field: "corporateAction",
        suppliedValue:
          transaction.corporateAction,
      }),
    );
  }

  if (
    transaction.status === "pending" &&
    options.allowPending !== true
  ) {
    issues.push(
      createIssue(transaction, {
        code: "UNCLASSIFIED_TRANSACTION",
        severity: "information",
        message:
          "Pending transaction is retained but will not be replayed into posted holdings.",
        field: "status",
        suppliedValue: transaction.status,
      }),
    );
  }

  if (
    transaction.status === "cancelled" &&
    options.allowCancelled !== true
  ) {
    issues.push(
      createIssue(transaction, {
        code: "UNCLASSIFIED_TRANSACTION",
        severity: "information",
        message:
          "Cancelled transaction is retained for audit but will not affect holdings.",
        field: "status",
        suppliedValue: transaction.status,
      }),
    );
  }

  return {
    valid: !issues.some(
      (issue) => issue.severity === "error",
    ),
    issues,
  };
}

export function validatePortfolioTransactions(
  transactions: readonly PortfolioTransaction[],
  options: TransactionValidationOptions = {},
): {
  validTransactions: PortfolioTransaction[];
  invalidTransactions: PortfolioTransaction[];
  issues: ValidationIssue[];
} {
  const validTransactions: PortfolioTransaction[] = [];
  const invalidTransactions: PortfolioTransaction[] = [];
  const issues: ValidationIssue[] = [];

  for (const transaction of transactions) {
    const result = validatePortfolioTransaction(
      transaction,
      options,
    );

    issues.push(...result.issues);

    if (result.valid) {
      validTransactions.push(transaction);
    } else {
      invalidTransactions.push(transaction);
    }
  }

  return {
    validTransactions,
    invalidTransactions,
    issues,
  };
}
