#!/usr/bin/env bash
set -e

echo "🔧 Transaction Ledger Fix Bash 3/4: import applies to transaction ledger..."

cat > src/lib/import/store/importIntoPortfolio.ts <<'TS'
import { importMasterWorkbook } from "@/lib/import/services/importMasterWorkbook";
import { applyLedger } from "@/lib/transactions/applyLedger";

export async function importIntoPortfolio(file: File, options?: { apply?: boolean }) {
  const result = await importMasterWorkbook(file);

  if (!(options?.apply ?? true)) {
    return {
      ...result,
      applied: false,
      applyMethod: "preview-only",
    };
  }

  const engine = applyLedger(result.transactions, "excel-seed-import");

  return {
    ...result,
    applied: true,
    applyMethod: "transaction-ledger",
    engineStatus: {
      transactions: engine.transactions.length,
      holdings: engine.holdings.length,
      openHoldings: engine.openHoldings.length,
      dividends: engine.dividends.length,
    },
  };
}
TS

npm run build
