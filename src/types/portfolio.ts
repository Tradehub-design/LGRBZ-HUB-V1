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


export type RiskLevel = string;
export type TransactionAction = string;
