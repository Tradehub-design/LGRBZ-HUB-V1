#!/usr/bin/env bash
set -e

echo "🔧 Sprint 2 - Bash 5/5: Final workbook importer..."

mkdir -p src/lib/import/services
mkdir -p src/lib/import/validation

#######################################################
# Workbook validator
#######################################################

cat > src/lib/import/validation/validateWorkbook.ts <<'TS'
import { MasterWorkbookImportResult } from "../excel/readMasterWorkbook";

export interface WorkbookValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateWorkbook(
  workbook: MasterWorkbookImportResult,
): WorkbookValidationResult {

  const errors: string[] = [];
  const warnings: string[] = [];

  if (workbook.transactions.length === 0) {
    errors.push("No transactions detected.");
  }

  if (!workbook.sheetNames.some(s => s.toLowerCase().includes("transaction"))) {
    errors.push("Transactions worksheet missing.");
  }

  const recommended = [
    "Budget",
    "Property",
    "Watchlist",
    "Goals",
    "Dividends",
    "Cash",
    "Super",
  ];

  recommended.forEach(sheet => {
    if (!workbook.sheetNames.some(s => s.toLowerCase() === sheet.toLowerCase())) {
      warnings.push(sheet);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
TS

#######################################################
# Import service
#######################################################

cat > src/lib/import/services/importMasterWorkbook.ts <<'TS'
import { readMasterWorkbook } from "../excel/readMasterWorkbook";
import { convertMasterTransactions } from "../transform/convertTransactions";
import { validateWorkbook } from "../validation/validateWorkbook";

export async function importMasterWorkbook(file: File) {

  const workbook = await readMasterWorkbook(file);

  const validation = validateWorkbook(workbook);

  if (!validation.valid) {
    throw new Error(validation.errors.join("\n"));
  }

  const transactions =
    convertMasterTransactions(workbook.transactions);

  return {

    workbookSheets: workbook.sheetNames,

    detectedHeaders: workbook.detectedHeaders,

    validation,

    transactions,

    summary: {

      sheetCount: workbook.sheetNames.length,

      transactionCount: transactions.length,

    },

  };

}
TS

#######################################################
# Build
#######################################################

npm run build

echo ""
echo "====================================="
echo "✅ SMART IMPORTER COMPLETE"
echo "====================================="
echo ""
echo "Next step:"
echo "Upload your Master Workbook."
echo ""
