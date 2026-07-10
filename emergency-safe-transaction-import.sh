#!/usr/bin/env bash
set -e

echo "🔧 Emergency safe import: save transactions only, no portfolio engine apply..."

cat > src/lib/import/store/importIntoPortfolio.ts <<'TS'
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
TS

cat > src/providers/PortfolioPersistenceProvider.tsx <<'TSX'
"use client";

export default function PortfolioPersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
TSX

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/transactions/page.tsx")
text = p.read_text()

# Add localStorage load support if not already present
text = text.replace(
'import { useMemo, useState } from "react";',
'import { useEffect, useMemo, useState } from "react";'
)

text = text.replace(
'import { applyLedger } from "@/lib/transactions/applyLedger";',
'import { applyLedger } from "@/lib/transactions/applyLedger";\nimport { loadTxLedger } from "@/lib/transactions/ledgerStorage";'
)

text = text.replace(
'  const transactions = usePortfolioStore((state) => state.transactions);',
'''  const storeTransactions = usePortfolioStore((state) => state.transactions);
  const [localTransactions, setLocalTransactions] = useState<any[]>([]);

  useEffect(() => {
    const saved = loadTxLedger();
    setLocalTransactions(saved);
  }, []);

  const transactions = storeTransactions.length ? storeTransactions : localTransactions;'''
)

p.write_text(text)
PY

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/import-centre/page.tsx")
text = p.read_text()

text = text.replace(
'''      const imported = await importIntoPortfolio(selectedFile, { apply: true });
      setResult(imported as ImportResult);''',
'''      const imported = await importIntoPortfolio(selectedFile, { apply: true });
      setResult(imported as ImportResult);
      window.location.href = "/transactions";'''
)

p.write_text(text)
PY

npm run build
