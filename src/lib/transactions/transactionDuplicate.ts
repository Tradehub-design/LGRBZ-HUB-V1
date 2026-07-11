import {
  NormalisedTransaction,
} from "@/lib/transactions/professionalTransactions";

function createTransactionId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `transaction-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function duplicateTransactionDraft(
  source: NormalisedTransaction
): NormalisedTransaction {
  return {
    ...source,
    id: createTransactionId(),
    date: new Date()
      .toISOString()
      .slice(0, 10),
    notes: source.notes
      ? `${source.notes}\nDuplicated from transaction ${source.id}.`
      : `Duplicated from transaction ${source.id}.`,
  };
}
