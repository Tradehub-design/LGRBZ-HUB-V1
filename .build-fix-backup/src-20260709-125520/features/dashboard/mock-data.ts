import type {
  AllocationSlice,
  DashboardSummary,
  MoneyPoint,
  PortfolioHolding,
} from "./types";

export const dashboardSummary: DashboardSummary = {
  portfolioValue: 128420.72,
  investedValue: 109840.12,
  cashBalance: 8450.22,
  dailyPnL: 842.18,
  dailyPnLPercent: 0.66,
  totalPnL: 18580.6,
  totalPnLPercent: 16.91,
  currency: "AUD",
};

export const equityCurve: MoneyPoint[] = [
  { date: "2026-01-01", value: 100000 },
  { date: "2026-02-01", value: 104250 },
  { date: "2026-03-01", value: 101900 },
  { date: "2026-04-01", value: 112430 },
  { date: "2026-05-01", value: 119280 },
  { date: "2026-06-01", value: 123760 },
  { date: "2026-07-01", value: 128420.72 },
];

export const holdings: PortfolioHolding[] = [
  {
    id: "1",
    symbol: "VAS",
    name: "Vanguard Australian Shares ETF",
    exchange: "ASX",
    quantity: 280,
    averagePrice: 89.12,
    currentPrice: 97.44,
    currency: "AUD",
  },
  {
    id: "2",
    symbol: "NDQ",
    name: "BetaShares Nasdaq 100 ETF",
    exchange: "ASX",
    quantity: 420,
    averagePrice: 39.2,
    currentPrice: 47.88,
    currency: "AUD",
  },
  {
    id: "3",
    symbol: "NAB",
    name: "National Australia Bank",
    exchange: "ASX",
    quantity: 510,
    averagePrice: 31.8,
    currentPrice: 37.26,
    currency: "AUD",
  },
  {
    id: "4",
    symbol: "COH",
    name: "Cochlear Limited",
    exchange: "ASX",
    quantity: 34,
    averagePrice: 286.4,
    currentPrice: 314.12,
    currency: "AUD",
  },
];

export const allocations: AllocationSlice[] = [
  { label: "Australian ETFs", value: 45220, percentage: 35.21 },
  { label: "US Growth ETFs", value: 34180, percentage: 26.61 },
  { label: "Banks", value: 27840, percentage: 21.68 },
  { label: "Healthcare", value: 12630, percentage: 9.83 },
  { label: "Cash", value: 8550.72, percentage: 6.67 },
];
