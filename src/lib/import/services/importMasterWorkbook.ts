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
