import { importMasterWorkbook } from "@/lib/import/services/importMasterWorkbook";
import { applyPortfolioTransactions } from "@/core/portfolio-v2/apply";

export async function importIntoPortfolio(file: File, options?: { apply?: boolean }) {
  const result = await importMasterWorkbook(file);

  if (!(options?.apply ?? true)) {
    return {
      ...result,
      applied: false,
      applyMethod: "preview-only",
    };
  }

  applyPortfolioTransactions(result.transactions, "excel-seed");

  return {
    ...result,
    applied: true,
    applyMethod: "portfolio-engine-v2",
  };
}
