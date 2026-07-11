import { NormalisedTransaction } from "@/lib/transactions/professionalTransactions";

export type TransactionHistoryAction =
  | "EDIT"
  | "DELETE"
  | "BULK_DELETE";

export type TransactionHistoryEntry = {
  id: string;
  action: TransactionHistoryAction;
  createdAt: string;
  label: string;
  before: NormalisedTransaction[];
  after: NormalisedTransaction[];
};

const MAX_HISTORY_ENTRIES = 20;

function createHistoryId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `history-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createTransactionHistoryEntry({
  action,
  label,
  before,
  after,
}: Omit<TransactionHistoryEntry, "id" | "createdAt">) {
  return {
    id: createHistoryId(),
    action,
    createdAt: new Date().toISOString(),
    label,
    before,
    after,
  };
}

export function appendTransactionHistory(
  current: TransactionHistoryEntry[],
  entry: TransactionHistoryEntry
) {
  return [entry, ...current].slice(
    0,
    MAX_HISTORY_ENTRIES
  );
}

export function removeTransactionHistoryEntry(
  current: TransactionHistoryEntry[],
  id: string
) {
  return current.filter(
    (entry) => entry.id !== id
  );
}
