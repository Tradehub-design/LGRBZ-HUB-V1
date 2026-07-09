export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR" | "CAD" | "NZD" | "JPY" | "CNY";

export type AssetClass =
  | "Stock"
  | "ETF"
  | "Crypto"
  | "Cash"
  | "Bond"
  | "Fund"
  | "Other";

export type RiskLevel = "Low Risk" | "Medium Risk" | "High Risk" | "Dividend" | "Unrated";

export type TransactionAction =
  | "Buy"
  | "Sell"
  | "Cash Deposit"
  | "Cash Withdrawal"
  | "Transfer Send"
  | "Transfer Deposit"
  | "Cash Dividend"
  | "Cash Interest"
  | "Fee"
  | "FX"
  | "Adjustment"
  | "Other";

export type Transaction = {
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
  sector?: string;
  country?: string;
  strategy?: string;
  notes?: string;
  total?: number;
  totalFeesIncluded?: number;
  totalAud?: number;
  totalFeesIncludedAud?: number;
};

export type HoldingStatus = "Open" | "Closed" | "Sold" | "Watchlist";

export type Holding = {
  id: string;
  ticker: string;
  name?: string;
  platform: string;
  assetClass: AssetClass;
  sector?: string;
  country?: string;
  risk: RiskLevel;
  currency: CurrencyCode;
  quantity: number;
  averageCost: number;
  averageCostAud: number;
  marketPrice?: number;
  marketValue?: number;
  marketValueAud?: number;
  totalCostAud: number;
  unrealisedPlAud: number;
  realisedPlAud: number;
  dividendsAud: number;
  totalReturnAud: number;
  totalReturnPercent: number;
  status: HoldingStatus;
};

export type Account = {
  id: string;
  name: string;
  platform: string;
  currency: CurrencyCode;
  type: "Broker" | "Bank" | "Crypto" | "Cash" | "Other";
  balance: number;
  balanceAud: number;
};

export type PortfolioSummary = {
  totalValueAud: number;
  totalCostAud: number;
  totalCashAud: number;
  totalDividendsAud: number;
  realisedPlAud: number;
  unrealisedPlAud: number;
  totalReturnAud: number;
  totalReturnPercent: number;
  depositsAud: number;
  withdrawalsAud: number;
  feesAud: number;
  holdingsCount: number;
  openHoldingsCount: number;
  closedHoldingsCount: number;
};
