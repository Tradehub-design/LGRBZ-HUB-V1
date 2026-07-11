import { NormalisedTransaction } from "@/lib/transactions/professionalTransactions";
import { validateTransaction } from "@/lib/transactions/transactionValidation";

export type TransactionQualityIssueType =
  | "INVALID"
  | "DUPLICATE"
  | "MISSING_BROKER"
  | "ZERO_VALUE"
  | "FUTURE_DATE"
  | "STALE_DATE";

export type TransactionQualityIssue = {
  id: string;
  transactionId: string;
  symbol: string;
  date: string;
  type: TransactionQualityIssueType;
  severity: "error" | "warning" | "info";
  title: string;
  message: string;
};

export type TransactionQualitySummary = {
  totalTransactions: number;
  validTransactions: number;
  invalidTransactions: number;
  duplicateTransactions: number;
  missingBrokerTransactions: number;
  zeroValueTransactions: number;
  futureTransactions: number;
  staleTransactions: number;
  score: number;
  issues: TransactionQualityIssue[];
};

function createIssueId(
  transactionId: string,
  type: TransactionQualityIssueType,
  index = 0
) {
  return `${transactionId}-${type.toLowerCase()}-${index}`;
}

function normaliseDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function duplicateKey(
  transaction: NormalisedTransaction
) {
  return [
    transaction.date,
    transaction.symbol.trim().toUpperCase(),
    transaction.type,
    Number(transaction.quantity || 0).toFixed(6),
    Number(transaction.price || 0).toFixed(6),
    Number(transaction.fees || 0).toFixed(2),
    Number(transaction.total || 0).toFixed(2),
    String(transaction.currency || "AUD")
      .trim()
      .toUpperCase(),
  ].join("|");
}

export function analyseTransactionQuality(
  transactions: NormalisedTransaction[]
): TransactionQualitySummary {
  const issues: TransactionQualityIssue[] = [];
  const duplicateGroups = new Map<
    string,
    NormalisedTransaction[]
  >();

  const now = new Date();
  const staleThreshold = new Date();

  staleThreshold.setFullYear(
    staleThreshold.getFullYear() - 15
  );

  let validTransactions = 0;
  let invalidTransactions = 0;
  let missingBrokerTransactions = 0;
  let zeroValueTransactions = 0;
  let futureTransactions = 0;
  let staleTransactions = 0;

  transactions.forEach((transaction) => {
    const validation =
      validateTransaction(transaction);

    if (validation.valid) {
      validTransactions += 1;
    } else {
      invalidTransactions += 1;

      issues.push({
        id: createIssueId(
          transaction.id,
          "INVALID"
        ),
        transactionId: transaction.id,
        symbol: transaction.symbol,
        date: transaction.date,
        type: "INVALID",
        severity: "error",
        title: "Invalid transaction",
        message:
          Object.values(validation.errors)
            .filter(Boolean)
            .join(" ") ||
          "This transaction contains invalid data.",
      });
    }

    if (!transaction.broker?.trim()) {
      missingBrokerTransactions += 1;

      issues.push({
        id: createIssueId(
          transaction.id,
          "MISSING_BROKER"
        ),
        transactionId: transaction.id,
        symbol: transaction.symbol,
        date: transaction.date,
        type: "MISSING_BROKER",
        severity: "info",
        title: "Broker missing",
        message:
          "No broker or platform has been recorded for this transaction.",
      });
    }

    if (
      Number(transaction.total || 0) === 0 &&
      Number(transaction.quantity || 0) === 0 &&
      Number(transaction.fees || 0) === 0
    ) {
      zeroValueTransactions += 1;

      issues.push({
        id: createIssueId(
          transaction.id,
          "ZERO_VALUE"
        ),
        transactionId: transaction.id,
        symbol: transaction.symbol,
        date: transaction.date,
        type: "ZERO_VALUE",
        severity: "warning",
        title: "Zero-value transaction",
        message:
          "Quantity, total and fees are all zero.",
      });
    }

    const transactionDate =
      normaliseDate(transaction.date);

    if (
      transactionDate &&
      transactionDate.getTime() >
        now.getTime() + 86400000
    ) {
      futureTransactions += 1;

      issues.push({
        id: createIssueId(
          transaction.id,
          "FUTURE_DATE"
        ),
        transactionId: transaction.id,
        symbol: transaction.symbol,
        date: transaction.date,
        type: "FUTURE_DATE",
        severity: "warning",
        title: "Future transaction date",
        message:
          "The recorded transaction date is in the future.",
      });
    }

    if (
      transactionDate &&
      transactionDate.getTime() <
        staleThreshold.getTime()
    ) {
      staleTransactions += 1;

      issues.push({
        id: createIssueId(
          transaction.id,
          "STALE_DATE"
        ),
        transactionId: transaction.id,
        symbol: transaction.symbol,
        date: transaction.date,
        type: "STALE_DATE",
        severity: "info",
        title: "Historic transaction",
        message:
          "This transaction is more than 15 years old. Confirm the date is correct.",
      });
    }

    const key = duplicateKey(transaction);
    const existing =
      duplicateGroups.get(key) ?? [];

    existing.push(transaction);
    duplicateGroups.set(key, existing);
  });

  let duplicateTransactions = 0;

  duplicateGroups.forEach((group) => {
    if (group.length <= 1) return;

    duplicateTransactions += group.length;

    group.forEach((transaction, index) => {
      issues.push({
        id: createIssueId(
          transaction.id,
          "DUPLICATE",
          index
        ),
        transactionId: transaction.id,
        symbol: transaction.symbol,
        date: transaction.date,
        type: "DUPLICATE",
        severity: "warning",
        title: "Possible duplicate",
        message: `${group.length} transactions share the same date, symbol, type, quantity, price, fees and total.`,
      });
    });
  });

  const totalTransactions =
    transactions.length;

  const weightedPenalty =
    invalidTransactions * 8 +
    duplicateTransactions * 4 +
    zeroValueTransactions * 3 +
    futureTransactions * 3 +
    missingBrokerTransactions * 0.5;

  const maximumPenalty =
    Math.max(1, totalTransactions * 8);

  const score =
    totalTransactions === 0
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              100 -
                (weightedPenalty /
                  maximumPenalty) *
                  100
            )
          )
        );

  const severityRank = {
    error: 0,
    warning: 1,
    info: 2,
  };

  issues.sort((a, b) => {
    const severityDifference =
      severityRank[a.severity] -
      severityRank[b.severity];

    if (severityDifference !== 0) {
      return severityDifference;
    }

    return (
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
    );
  });

  return {
    totalTransactions,
    validTransactions,
    invalidTransactions,
    duplicateTransactions,
    missingBrokerTransactions,
    zeroValueTransactions,
    futureTransactions,
    staleTransactions,
    score,
    issues,
  };
}
