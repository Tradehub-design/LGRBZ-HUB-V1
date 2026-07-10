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
