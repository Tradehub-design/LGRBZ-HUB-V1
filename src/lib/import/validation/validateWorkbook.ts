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
