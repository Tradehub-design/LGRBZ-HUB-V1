import type { MasterTransaction } from "./types";
import { normaliseTransactions } from "./normalise";
import { buildPortfolioEngineV2 } from "./engine";
import { toLegacyPortfolioEngine } from "./toLegacyStore";
import { saveStoredTransactions } from "./storage";
import { usePortfolioStore } from "@/store/portfolioStore";

export function applyPortfolioTransactions(rows: any[], source = "portfolio-v2") {
  const transactions: MasterTransaction[] = normaliseTransactions(rows);
  const engineV2 = buildPortfolioEngineV2(transactions);
  const legacyEngine = toLegacyPortfolioEngine(engineV2);

  usePortfolioStore.getState().setEngine(legacyEngine, source);
  saveStoredTransactions(transactions);

  return {
    transactions,
    engineV2,
    legacyEngine,
  };
}
