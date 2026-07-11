import { NormalisedTransaction } from "@/lib/transactions/professionalTransactions";

export type OptimisticTransactionOperation =
  | {
      id: string;
      type: "EDIT";
      createdAt: string;
      before: NormalisedTransaction;
      after: NormalisedTransaction;
      label: string;
    }
  | {
      id: string;
      type: "DELETE";
      createdAt: string;
      removed: NormalisedTransaction[];
      label: string;
    };

function createOperationId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `transaction-operation-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createEditOperation(
  before: NormalisedTransaction,
  after: NormalisedTransaction
): OptimisticTransactionOperation {
  return {
    id: createOperationId(),
    type: "EDIT",
    createdAt: new Date().toISOString(),
    before,
    after,
    label: `Updated ${after.symbol} transaction`,
  };
}

export function createDeleteOperation(
  removed: NormalisedTransaction[]
): OptimisticTransactionOperation {
  const symbolLabel = Array.from(
    new Set(
      removed
        .map((transaction) => transaction.symbol)
        .filter(Boolean)
    )
  )
    .slice(0, 3)
    .join(", ");

  return {
    id: createOperationId(),
    type: "DELETE",
    createdAt: new Date().toISOString(),
    removed,
    label:
      removed.length === 1
        ? `Deleted ${removed[0]?.symbol || "transaction"}`
        : `Deleted ${removed.length} transactions${
            symbolLabel ? ` (${symbolLabel})` : ""
          }`,
  };
}

export function applyTransactionEdit(
  rows: NormalisedTransaction[],
  updated: NormalisedTransaction
) {
  return rows.map((row) =>
    row.id === updated.id
      ? {
          ...row,
          ...updated,
        }
      : row
  );
}

export function applyTransactionDelete(
  rows: NormalisedTransaction[],
  removedIds: Set<string>
) {
  return rows.filter(
    (row) => !removedIds.has(row.id)
  );
}

export function undoOptimisticOperation(
  rows: NormalisedTransaction[],
  operation: OptimisticTransactionOperation
) {
  if (operation.type === "EDIT") {
    return rows.map((row) =>
      row.id === operation.before.id
        ? operation.before
        : row
    );
  }

  const existingIds = new Set(
    rows.map((row) => row.id)
  );

  const restored = operation.removed.filter(
    (row) => !existingIds.has(row.id)
  );

  return [...rows, ...restored];
}
