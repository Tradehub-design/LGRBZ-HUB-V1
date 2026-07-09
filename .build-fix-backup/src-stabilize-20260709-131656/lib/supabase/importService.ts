import { buildPortfolio } from "@/lib/portfolio-engine/buildPortfolio";
import { mapLedgerRowToDb } from "./csvToDb";
import { insertPortfolioTransactions } from "./transactionRepository";

export async function importLedgerCsvToDatabase(csv: string, portfolioId: string) {
  const result = buildPortfolio(csv);
  const rows = result.transactions.map((row) => mapLedgerRowToDb(row, portfolioId));

  const inserted = await insertPortfolioTransactions(rows);

  return {
    parsedRows: result.transactions.length,
    insertedRows: inserted.length,
    issues: result.invalidRows,
  };
}
