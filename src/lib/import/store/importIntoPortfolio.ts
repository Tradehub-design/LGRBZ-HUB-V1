import { usePortfolioStore } from "@/store/portfolioStore";
import { importMasterWorkbook } from "@/lib/import/services/importMasterWorkbook";

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
