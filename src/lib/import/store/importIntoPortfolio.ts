import { importMasterWorkbook } from "@/lib/import/services/importMasterWorkbook";
import { normaliseLedgerRows } from "@/lib/transactions/normaliseLedgerRow";
import { saveTxLedger } from "@/lib/transactions/ledgerStorage";

export async function importIntoPortfolio(file: File, options?: { apply?: boolean }) {
  const result = await importMasterWorkbook(file);

  if (!(options?.apply ?? true)) {
    return {
      ...result,
      applied: false,
      applyMethod: "preview-only",
    };
  }

  const transactions = normaliseLedgerRows(result.transactions);

  saveTxLedger(transactions);

  return {
    ...result,
    applied: true,
    applyMethod: "safe-ledger-storage-only",
    engineStatus: {
      transactions: transactions.length,
      holdings: 0,
      openHoldings: 0,
      dividends: 0,
    },
  };
}
