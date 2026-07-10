#!/usr/bin/env bash
set -e

echo "🔧 Import Centre V2 Bash 2/4: import result + store apply status..."

cat > src/lib/import/store/importIntoPortfolio.ts <<'TS'
import { usePortfolioStore } from "@/store/portfolioStore";
import { importMasterWorkbook } from "@/lib/import/services/importMasterWorkbook";

export async function importIntoPortfolio(file: File) {
  const result = await importMasterWorkbook(file);

  const store = usePortfolioStore.getState();

  let applied = false;
  let applyMethod = "none";

  if ("replaceTransactions" in store && typeof store.replaceTransactions === "function") {
    store.replaceTransactions(result.transactions);
    applied = true;
    applyMethod = "replaceTransactions";
  } else if ("setTransactions" in store && typeof store.setTransactions === "function") {
    store.setTransactions(result.transactions);
    applied = true;
    applyMethod = "setTransactions";
  } else if ("loadTransactions" in store && typeof store.loadTransactions === "function") {
    store.loadTransactions(result.transactions as any);
    applied = true;
    applyMethod = "loadTransactions";
  }

  return {
    ...result,
    applied,
    applyMethod,
  };
}
TS

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/import-centre/page.tsx")
text = p.read_text()

text = text.replace(
'''type ImportResult = {
  workbookSheets?: string[];
  detectedHeaders?: Record<string, string>;
  validation?: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  summary?: {
    sheetCount: number;
    transactionCount: number;
  };
};''',
'''type ImportResult = {
  workbookSheets?: string[];
  detectedHeaders?: Record<string, string>;
  applied?: boolean;
  applyMethod?: string;
  validation?: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  summary?: {
    sheetCount: number;
    transactionCount: number;
  };
};'''
)

text = text.replace(
'''            <Stat label="Detected Columns" value={String(Object.keys(result.detectedHeaders ?? {}).length)} />''',
'''            <Stat label="Detected Columns" value={String(Object.keys(result.detectedHeaders ?? {}).length)} />
            <Stat label="Applied To Store" value={result.applied ? "Yes" : "No"} />
            <Stat label="Apply Method" value={result.applyMethod ?? "none"} />'''
)

p.write_text(text)
PY

npm run build
