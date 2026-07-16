import {
  PORTFOLIO_ENGINE_SCHEMA_VERSION,
  type PortfolioTransaction,
  type TransactionLedger,
  type ValidationIssue,
} from "./contracts";

import {
  sortTransactionsDeterministically,
} from "./identity";

import {
  normalisePortfolioTransactions,
  type TransactionNormalisationContext,
} from "./normalise";

import {
  validatePortfolioTransactions,
  type TransactionValidationOptions,
} from "./validate";

import type {
  RawPortfolioTransaction,
} from "./raw-transaction";

export type BuildTransactionLedgerOptions =
  TransactionNormalisationContext &
  TransactionValidationOptions & {
    includePending?: boolean;
    includeCancelled?: boolean;
  };

function duplicateKey(
  transaction: PortfolioTransaction,
): string {
  if (transaction.externalId) {
    return [
      "EXTERNAL",
      transaction.source,
      transaction.externalId,
    ].join("::");
  }

  return [
    "CONTENT",
    transaction.account.accountId,
    transaction.tradeDate,
    transaction.action,
    transaction.security?.securityId ?? "CASH",
    transaction.currency,
    transaction.amounts.quantity,
    transaction.amounts.unitPrice,
    transaction.amounts.fees,
    transaction.amounts.grossAmount,
    transaction.amounts.netAmount,
  ].join("::");
}

function removeDuplicateTransactions(
  transactions: readonly PortfolioTransaction[],
): {
  transactions: PortfolioTransaction[];
  issues: ValidationIssue[];
  rejectedCount: number;
} {
  const seenIds = new Map<string, PortfolioTransaction>();
  const seenContent = new Map<string, PortfolioTransaction>();

  const accepted: PortfolioTransaction[] = [];
  const issues: ValidationIssue[] = [];

  let rejectedCount = 0;

  for (const transaction of transactions) {
    const existingId = seenIds.get(transaction.id);

    if (existingId) {
      rejectedCount += 1;

      issues.push({
        code: "DUPLICATE_TRANSACTION",
        severity: "error",
        message:
          `Duplicate transaction ID ${transaction.id}. ` +
          `Original transaction date: ${existingId.tradeDate}.`,
        transactionId: transaction.id,
        field: "id",
        suppliedValue: transaction.id,
      });

      continue;
    }

    const contentKey = duplicateKey(transaction);
    const existingContent =
      seenContent.get(contentKey);

    if (existingContent) {
      rejectedCount += 1;

      issues.push({
        code: "DUPLICATE_TRANSACTION",
        severity: "error",
        message:
          `Transaction duplicates ${existingContent.id} based on its account, ` +
          "date, action, security, quantity, price and amount.",
        transactionId: transaction.id,
        field: "transaction",
        suppliedValue: contentKey,
      });

      continue;
    }

    seenIds.set(transaction.id, transaction);
    seenContent.set(contentKey, transaction);
    accepted.push(transaction);
  }

  return {
    transactions: accepted,
    issues,
    rejectedCount,
  };
}

function shouldIncludeTransaction(
  transaction: PortfolioTransaction,
  options: BuildTransactionLedgerOptions,
): boolean {
  if (transaction.status === "invalid") {
    return false;
  }

  if (
    transaction.status === "pending" &&
    options.includePending !== true
  ) {
    return false;
  }

  if (
    transaction.status === "cancelled" &&
    options.includeCancelled !== true
  ) {
    return false;
  }

  return true;
}

export function buildTransactionLedger(
  rawTransactions: readonly RawPortfolioTransaction[],
  options: BuildTransactionLedgerOptions = {},
): TransactionLedger {
  const generatedAt =
    options.generatedAt ??
    new Date().toISOString();

  const normalised =
    normalisePortfolioTransactions(
      rawTransactions,
      {
        ...options,
        generatedAt,
      },
    );

  const validation =
    validatePortfolioTransactions(
      normalised.transactions,
      {
        allowPending:
          options.includePending === true,
        allowCancelled:
          options.includeCancelled === true,
        amountTolerance:
          options.amountTolerance,
      },
    );

  const deduplicated =
    removeDuplicateTransactions(
      validation.validTransactions,
    );

  const replayableTransactions =
    deduplicated.transactions.filter(
      (transaction) =>
        shouldIncludeTransaction(
          transaction,
          options,
        ),
    );

  const sorted =
    sortTransactionsDeterministically(
      replayableTransactions,
    );

  const rejectedCount =
    normalised.rejectedCount +
    validation.invalidTransactions.length +
    deduplicated.rejectedCount;

  const issues = [
    ...normalised.issues,
    ...validation.issues,
    ...deduplicated.issues,
  ];

  return {
    schemaVersion:
      PORTFOLIO_ENGINE_SCHEMA_VERSION,

    generatedAt,

    transactions: sorted,

    issues,

    rejectedCount,

    acceptedCount: sorted.length,
  };
}

export function buildLedgerFromCanonicalTransactions(
  transactions: readonly PortfolioTransaction[],
  options: BuildTransactionLedgerOptions = {},
): TransactionLedger {
  const generatedAt =
    options.generatedAt ??
    new Date().toISOString();

  const validation =
    validatePortfolioTransactions(
      transactions,
      {
        allowPending:
          options.includePending === true,
        allowCancelled:
          options.includeCancelled === true,
        amountTolerance:
          options.amountTolerance,
      },
    );

  const deduplicated =
    removeDuplicateTransactions(
      validation.validTransactions,
    );

  const replayableTransactions =
    deduplicated.transactions.filter(
      (transaction) =>
        shouldIncludeTransaction(
          transaction,
          options,
        ),
    );

  const sorted =
    sortTransactionsDeterministically(
      replayableTransactions,
    );

  return {
    schemaVersion:
      PORTFOLIO_ENGINE_SCHEMA_VERSION,

    generatedAt,

    transactions: sorted,

    issues: [
      ...validation.issues,
      ...deduplicated.issues,
    ],

    rejectedCount:
      validation.invalidTransactions.length +
      deduplicated.rejectedCount,

    acceptedCount: sorted.length,
  };
}

export function ledgerHasErrors(
  ledger: TransactionLedger,
): boolean {
  return ledger.issues.some(
    (issue) => issue.severity === "error",
  );
}

export function ledgerErrorCount(
  ledger: TransactionLedger,
): number {
  return ledger.issues.filter(
    (issue) => issue.severity === "error",
  ).length;
}

export function ledgerWarningCount(
  ledger: TransactionLedger,
): number {
  return ledger.issues.filter(
    (issue) => issue.severity === "warning",
  ).length;
}
