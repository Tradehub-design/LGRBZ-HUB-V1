import { buildPortfolio } from "./buildPortfolio";
import { DEFAULT_TRANSACTION_LEDGER } from "@/data/seed-transactions";

export function buildSeedPortfolio() {
  if (!DEFAULT_TRANSACTION_LEDGER || DEFAULT_TRANSACTION_LEDGER === "PASTE_TRANSACTION_LEDGER_HERE") {
    return null;
  }

  return buildPortfolio(DEFAULT_TRANSACTION_LEDGER);
}
