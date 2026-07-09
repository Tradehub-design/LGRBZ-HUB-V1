export type DashboardRange = "7D" | "30D" | "90D" | "YTD" | "1Y" | "ALL";

export type MoneyPoint = {
  date: string;
  value: number;
};

export type PortfolioHolding = {
  id: string;
  symbol: string;
  name: string;
  exchange?: string | null;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currency: string;
};

export type DashboardSummary = {
  portfolioValue: number;
  investedValue: number;
  cashBalance: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;
  currency: string;
};

export type AllocationSlice = {
  label: string;
  value: number;
  percentage: number;
};

export type DashboardState = {
  range: DashboardRange;
  setRange: (range: DashboardRange) => void;
};
