import type { PortfolioTransaction } from "@/core/portfolio/types";
import type { RepositoryRecord } from "./types";
import {
  saveLocal,
  getAllLocal,
  getLocal
} from "./localRepository";

const COLLECTION = "transactions";

export function saveTransactionLocal(
  transaction: PortfolioTransaction
) {
  const existing =
    getLocal<PortfolioTransaction>(
      COLLECTION,
      transaction.id
    );

  const now = new Date().toISOString();

  const record: RepositoryRecord<PortfolioTransaction> = {
    id: transaction.id,
    data: transaction,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    deletedAt: null,
    version: (existing?.version ?? 0) + 1,
    source: "local"
  };

  saveLocal(COLLECTION, record);

  return record;
}

export function getTransactionsLocal() {
  return getAllLocal<PortfolioTransaction>(
    COLLECTION
  )
    .filter(r => !r.deletedAt)
    .map(r => r.data);
}

export function softDeleteTransactionLocal(
  id: string
) {
  const existing =
    getLocal<PortfolioTransaction>(
      COLLECTION,
      id
    );

  if (!existing) return null;

  const record = {
    ...existing,
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: existing.version + 1
  };

  saveLocal(COLLECTION, record);

  return record;
}
