import type { LedgerRow } from "@/store/portfolioStore";

export const TX_LEDGER_STORAGE_KEY = "lgrbz.tx.ledger.v1";

export function loadTxLedger(): LedgerRow[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(TX_LEDGER_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(TX_LEDGER_STORAGE_KEY);
    return [];
  }
}

export function saveTxLedger(rows: LedgerRow[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TX_LEDGER_STORAGE_KEY, JSON.stringify(rows));
}

export function clearTxLedger() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TX_LEDGER_STORAGE_KEY);
  window.localStorage.removeItem("lgrbz.masterTransactions.v1");
  window.localStorage.removeItem("lgrbz.portfolio.v2.transactions");
}
