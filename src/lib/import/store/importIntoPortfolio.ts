import { usePortfolioStore } from "@/store/portfolioStore";
import { importMasterWorkbook } from "@/lib/import/services/importMasterWorkbook";
import { buildEngineFromTransactions } from "@/lib/portfolio/buildEngineFromTransactions";

export async function importIntoPortfolio(file: File, options?: { apply?: boolean }) {
  const result = await importMasterWorkbook(file);
  const shouldApply = options?.apply ?? true;

  if (!shouldApply) {
    return {
      ...result,
      applied: false,
      applyMethod: "preview-only",
    };
  }

  const engine = buildEngineFromTransactions(result.transactions as any);
  const store = usePortfolioStore.getState();

  store.setEngine(engine, "master-workbook-import");

  if (typeof window !== "undefined") {
    window.localStorage.setItem("lgrbz.masterTransactions.v1", JSON.stringify(result.transactions));
  }

  return {
    ...result,
    applied: true,
    applyMethod: "setEngine",
  };
}
