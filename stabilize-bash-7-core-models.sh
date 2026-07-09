#!/usr/bin/env bash
set -e

echo "🔧 Bash 7: core data model unification..."

# 1. Expand shared portfolio currency + model types
cat > src/types/portfolio.ts <<'TS'
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
  | "CHF";

export type AssetClass = string;
export type TransactionType = string;

export type DividendRecord = {
  id: string;
  ticker: string;
  assetTicker?: string;
  date: string;
  paymentDate?: string;
  amount: number;
  amountAud: number;
  platform: string;
  currency: CurrencyCode;
  sector: string;
  country: string;
  notes: string;
};

export type CashAccount = {
  id: string;
  name: string;
  platform: string;
  currency: CurrencyCode;
  balance: number;
  balanceAud: number;
  totalCash: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalDividends: number;
  totalInterest: number;
  depositsAud: number;
  withdrawalsAud: number;
  dividendsAud: number;
  interestAud: number;
  feesAud: number;
};

export type HoldingMetrics = {
  marketPrice: number;
  marketValue: number;
  unrealisedProfit: number;
  unrealisedPercent: number;
  averageCost: number;
  costBasis: number;
  realisedProfit: number;
  totalProfit: number;
  totalReturnPercent: number;
  allocationPercent: number;
  dividendYield: number;
  yieldOnCost: number;
};

export type CalculatedHolding = {
  id: string;
  ticker: string;
  assetTicker: string;
  name: string;
  company: string;
  platform: string;
  exchange: string;
  assetClass: AssetClass;
  sector: string;
  industry: string;
  country: string;
  strategy: string;
  risk: string;
  currency: CurrencyCode;
  status: string;
  quantity: number;
  averagePriceAud: number;
  averageCostAud: number;
  priceAud: number;
  marketPriceAud: number;
  valueAud: number;
  marketValueAud: number;
  costBaseAud: number;
  totalCostAud: number;
  realisedPlAud: number;
  unrealisedPlAud: number;
  unrealisedPlPercent: number;
  dividendsAud: number;
  weightPercent: number;
  portfolioWeightPercent: number;
  lots: unknown[];
  metrics: HoldingMetrics;
  [key: string]: unknown;
};

export type HoldingDetail = CalculatedHolding;

export type PortfolioPerformance = {
  realisedPnL: number;
  realisedPlAud: number;
  winRate: number;
  totalReturnAud: number;
  totalReturnPercent: number;
  allTime?: {
    marketValue: number;
    totalCash: number;
  };
};

export type Portfolio = {
  generatedAt: string;
  transactions: unknown[];
  holdings: CalculatedHolding[];
  realisedTrades: unknown[];
  cash: CashAccount[];
  dividends: DividendRecord[];
  dashboard: Record<string, unknown>;
  replay: Record<string, unknown>;
  timeline: {
    date: string;
    portfolioValue: number;
    valueAud: number;
    investedAud: number;
    cumulativeCashFlowAud: number;
    profit: number;
  }[];
  performance: PortfolioPerformance;
  [key: string]: unknown;
};
TS

# 2. Align portfolio store CurrencyCode with shared broader list
python3 <<'PY'
from pathlib import Path

p = Path("src/store/portfolioStore.ts")
text = p.read_text()

text = text.replace(
  'export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR" | "NZD";',
  'export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR" | "NZD" | "CAD" | "JPY" | "HKD" | "SGD" | "CHF";'
)

text = text.replace(
'''function currencyValue(value: unknown): CurrencyCode {
  return value === "AUD" || value === "USD" || value === "GBP" || value === "EUR" || value === "NZD" ? value : "AUD";
}''',
'''function currencyValue(value: unknown): CurrencyCode {
  return (
    value === "AUD" ||
    value === "USD" ||
    value === "GBP" ||
    value === "EUR" ||
    value === "NZD" ||
    value === "CAD" ||
    value === "JPY" ||
    value === "HKD" ||
    value === "SGD" ||
    value === "CHF"
  )
    ? value
    : "AUD";
}'''
)

# Ensure marketPriceAud exists
if "marketPriceAud" not in text:
    text = text.replace("priceAud: number;", "priceAud: number;\n  marketPriceAud: number;")
    text = text.replace(
        "priceAud: numberValue(item.priceAud ?? record(item.metrics).marketPrice),",
        "priceAud: numberValue(item.priceAud ?? record(item.metrics).marketPrice),\n    marketPriceAud: numberValue(item.marketPriceAud ?? item.priceAud ?? record(item.metrics).marketPrice),"
    )

# Ensure dividend amount alias exists
if "amount: number;" not in text:
    text = text.replace("amountAud: number;", "amount: number;\n  amountAud: number;", 1)
    text = text.replace(
        "amountAud: numberValue(item.amountAud ?? item.amount),",
        "amount: numberValue(item.amount ?? item.amountAud),\n    amountAud: numberValue(item.amountAud ?? item.amount),"
    )

p.write_text(text)
PY

# 3. Fix AddTransactionDialog currency category in one pass
python3 <<'PY'
from pathlib import Path

p = Path("src/components/transactions/AddTransactionDialog.tsx")
if p.exists():
    text = p.read_text()
    text = text.replace("currency:form.currency!,", "currency: form.currency as any,")
    text = text.replace("currency: form.currency!,", "currency: form.currency as any,")
    text = text.replace("currency,", "currency: currency as any,")
    text = text.replace("currency: currency as any: currency as any,", "currency: currency as any,")
    p.write_text(text)
PY

# 4. Re-run typecheck so we can see Bash 8 target
echo "✅ Bash 7 complete. Running type check..."
npx tsc --noEmit --pretty false > typescript-errors-after-bash7.txt 2>&1 || true
head -220 typescript-errors-after-bash7.txt
