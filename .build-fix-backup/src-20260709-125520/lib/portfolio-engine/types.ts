import type { AssetClass, CurrencyCode, RiskLevel, TransactionAction } from "@/types/portfolio";

export type LedgerRow = {
  raw: Record<string, string>;
  rowNumber: number;
  id: string;
  date: string;
  action: TransactionAction;
  assetTicker: string;
  cryptoUrlName?: string;
  quantity: number;
  price: number;
  fiatFees: number;
  currency: CurrencyCode;
  platform: string;
  assetClass: AssetClass;
  sector: string;
  country: string;
  strategy: RiskLevel | string;
  notes: string;
  total: number;
  totalFeesIncluded: number;
  totalAud: number;
  totalFeesIncludedAud: number;
};

export type HoldingLot = {
  id: string;
  ticker: string;
  platform: string;
  date: string;
  quantity: number;
  remainingQuantity: number;
  costAud: number;
  feesAud: number;
};

export type CalculatedHolding = {
  id: string;
  ticker: string;
  platform: string;
  assetClass: AssetClass;
  sector: string;
  country: string;
  risk: RiskLevel;
  currency: CurrencyCode;
  quantity: number;
  totalCostAud: number;
  averageCostAud: number;
  realisedPlAud: number;
  dividendsAud: number;
  status: "Open" | "Closed";
  lots: HoldingLot[];
};

export type CashAccount = {
  id: string;
  platform: string;
  currency: CurrencyCode;
  balance: number;
  balanceAud: number;
  depositsAud: number;
  withdrawalsAud: number;
  dividendsAud: number;
  interestAud: number;
  feesAud: number;
};

export type DividendRecord = {
  id: string;
  date: string;
  ticker: string;
  platform: string;
  amountAud: number;
  currency: CurrencyCode;
  sector: string;
  country: string;
  notes: string;
};

export type MemberContribution = {
  name: string;
  depositsAud: number;
  withdrawalsAud: number;
  netAud: number;
};

export type AllocationSlice = {
  label: string;
  value: number;
  percent: number;
};

export type PortfolioEngineResult = {
  generatedAt: string;
  sourceRows: number;
  validRows: number;
  invalidRows: LedgerIssue[];
  transactions: LedgerRow[];
  holdings: CalculatedHolding[];
  cashAccounts: CashAccount[];
  dividends: DividendRecord[];
  memberContributions: MemberContribution[];
  allocation: {
    assetClass: AllocationSlice[];
    sector: AllocationSlice[];
    country: AllocationSlice[];
    risk: AllocationSlice[];
    currency: AllocationSlice[];
    platform: AllocationSlice[];
  };
  summary: {
    totalCostAud: number;
    totalCashAud: number;
    totalDividendsAud: number;
    realisedPlAud: number;
    depositsAud: number;
    withdrawalsAud: number;
    feesAud: number;
    openHoldingsCount: number;
    closedHoldingsCount: number;
    transactionCount: number;
  };
};

export type LedgerIssue = {
  rowNumber: number;
  severity: "warning" | "error";
  field: string;
  message: string;
  value?: string;
};
