"use client";

import { toast } from "sonner";
import { readTextFile } from "./readFile";
import { buildPortfolio } from "@/lib/portfolio-engine";
import { usePortfolioStore } from "@/store/portfolioStore";

export function useImportLedger() {
  const setEngine = usePortfolioStore(
    (state) => state.setEngine,
  );

  async function importLedger(file: File) {
    try {
      const text = await readTextFile(file);

      const engine =
        buildPortfolio(text);

      setEngine(engine);

      toast.success(
        `${engine.transactions.length} transactions imported.`,
      );
    } catch (e) {
      toast.error(
        "Unable to import ledger.",
      );

      console.error(e);
    }
  }

  return {
    importLedger,
  };
}
