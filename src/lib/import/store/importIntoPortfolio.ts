import { usePortfolioStore } from "@/store/portfolioStore";

export async function importIntoPortfolio(file: File) {
  const { importMasterWorkbook } = await import(
    "@/lib/import/services/importMasterWorkbook"
  );

  const result = await importMasterWorkbook(file);

  const store = usePortfolioStore.getState();

  if ("replaceTransactions" in store && typeof store.replaceTransactions === "function") {
    store.replaceTransactions(result.transactions);
  } else if ("setTransactions" in store && typeof store.setTransactions === "function") {
    store.setTransactions(result.transactions);
  } else {
    console.warn(
      "No transaction setter found in portfolioStore."
    );
  }

  return result;
}
