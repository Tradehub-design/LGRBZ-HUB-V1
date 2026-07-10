#!/usr/bin/env bash
set -e

echo "🔧 Portfolio Engine V2 Bash 1/5: transaction database foundation..."

mkdir -p src/core/portfolio-v2

cat > src/core/portfolio-v2/types.ts <<'TS'
export type TransactionAction =
  | "Buy"
  | "Sell"
  | "Dividend"
  | "Deposit"
  | "Withdrawal"
  | "Fee"
  | "Interest"
  | "Other";

export type CurrencyCode =
  | "AUD"
  | "USD"
  | "GBP"
  | "EUR"
  | "NZD"
  | "CAD"
  | "JPY"
  | "HKD"
  | "SGD"
  | "CHF"
  | "CNY";

export type MasterTransaction = {
  id: string;
  source: "excel-seed" | "manual";
  sourceRow: number;
  date: string;
  action: TransactionAction | string;
  ticker: string;
  assetTicker: string;
  quantity: number;
  price: number;
  fees: number;
  total: number;
  currency: CurrencyCode;
  platform: string;
  assetClass: string;
  sector: string;
  country: string;
  strategy: string;
  notes: string;
  raw?: Record<string, unknown>;
};

export type MasterHolding = {
  id: string;
  ticker: string;
  assetTicker: string;
  name: string;
  platform: string;
  assetClass: string;
  sector: string;
  country: string;
  currency: CurrencyCode;
  status: "Open" | "Closed";
  quantity: number;
  averageCostAud: number;
  marketPriceAud: number;
  marketValueAud: number;
  costBaseAud: number;
  realisedPlAud: number;
  unrealisedPlAud: number;
  unrealisedPlPercent: number;
  portfolioWeightPercent: number;
};

export type MasterCash = {
  balanceAud: number;
  depositsAud: number;
  withdrawalsAud: number;
  dividendsAud: number;
  feesAud: number;
  interestAud: number;
};

export type AllocationSlice = {
  label: string;
  value: number;
  percent: number;
};

export type PortfolioEngineV2 = {
  generatedAt: string;
  transactions: MasterTransaction[];
  holdings: MasterHolding[];
  openHoldings: MasterHolding[];
  closedHoldings: MasterHolding[];
  cash: MasterCash;
  dividends: MasterTransaction[];
  allocation: {
    assetClass: AllocationSlice[];
    sector: AllocationSlice[];
    country: AllocationSlice[];
    currency: AllocationSlice[];
    platform: AllocationSlice[];
  };
  totals: {
    portfolioValueAud: number;
    investedCostAud: number;
    cashAud: number;
    dividendsAud: number;
    feesAud: number;
    realisedPlAud: number;
    unrealisedPlAud: number;
    totalReturnAud: number;
    totalReturnPercent: number;
  };
};
TS

cat > src/core/portfolio-v2/storage.ts <<'TS'
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
TS

cat > src/core/portfolio-v2/normalise.ts <<'TS'
import type { CurrencyCode, MasterTransaction } from "./types";

function n(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function s(value: unknown, fallback = ""): string {
  const text = String(value ?? "").trim();
  return text || fallback;
}

export function normaliseTransaction(input: any, index = 0): MasterTransaction {
  const ticker = s(input.ticker ?? input.assetTicker ?? input["Asset Ticker"], "CASH").toUpperCase();

  const quantity = n(input.quantity ?? input.Quantity);
  const price = n(input.price ?? input.priceAud ?? input.Price);
  const fees = n(input.fees ?? input.fiatFees ?? input["Fiat Fees"]);
  const total = n(input.total ?? input.totalAud ?? input.amountAud ?? input.Total ?? quantity * price + fees);

  return {
    id: s(input.id, `tx-${index + 1}-${ticker}-${s(input.date ?? input.Date, "unknown")}`),
    source: input.source === "manual" ? "manual" : "excel-seed",
    sourceRow: n(input.sourceRow ?? input.rowNumber ?? index + 2),
    date: s(input.date ?? input.Date),
    action: s(input.action ?? input.Action, "Other"),
    ticker,
    assetTicker: ticker,
    quantity,
    price,
    fees,
    total,
    currency: s(input.currency ?? input.Currency, "AUD") as CurrencyCode,
    platform: s(input.platform ?? input.Platform, "Manual"),
    assetClass: s(input.assetClass ?? input["Asset Class"], "Stock"),
    sector: s(input.sector ?? input.Sector, "Unknown"),
    country: s(input.country ?? input.Country, "Australia"),
    strategy: s(input.strategy ?? input.Strategy, "Manual"),
    notes: s(input.notes ?? input.Notes),
    raw: input.raw ?? input,
  };
}

export function normaliseTransactions(rows: any[]): MasterTransaction[] {
  return rows
    .map((row, index) => normaliseTransaction(row, index))
    .filter((tx) => tx.date && tx.action && tx.ticker);
}
TS

npm run build
