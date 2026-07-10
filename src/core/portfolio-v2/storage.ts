import type { MasterTransaction } from "./types";

export const PORTFOLIO_V2_STORAGE_KEY = "lgrbz.portfolio.v2.transactions";

export function loadStoredTransactions(): MasterTransaction[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PORTFOLIO_V2_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(PORTFOLIO_V2_STORAGE_KEY);
    return [];
  }
}

export function saveStoredTransactions(transactions: MasterTransaction[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PORTFOLIO_V2_STORAGE_KEY, JSON.stringify(transactions));
}

export function clearStoredTransactions() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PORTFOLIO_V2_STORAGE_KEY);
}
