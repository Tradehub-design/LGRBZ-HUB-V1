import type { LedgerRow } from "@/store/portfolioStore";
import { usePortfolioStore } from "@/store/portfolioStore";
import { buildEngineFromTransactions } from "@/lib/portfolio/buildEngineFromTransactions";
import { normaliseLedgerRows } from "./normaliseLedgerRow";
import { saveTxLedger } from "./ledgerStorage";

export function applyLedger(rows: any[], source = "transaction-ledger") {
  const transactions: LedgerRow[] = normaliseLedgerRows(rows);
  const engine = buildEngineFromTransactions(transactions);

  usePortfolioStore.setState({
    loaded: true,
    rawLedgerCsv: source,
    engine,
    portfolio: engine.portfolio,
    transactions: engine.transactions,
    holdings: engine.holdings,
    openHoldings: engine.openHoldings,
    closedHoldings: engine.closedHoldings,
    dividends: engine.dividends,
    cashAccounts: engine.cashAccounts,
  });

  saveTxLedger(engine.transactions);

  return engine;
}
