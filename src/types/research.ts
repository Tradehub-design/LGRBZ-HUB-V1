import type { CurrencyCode, RiskLevel } from "./portfolio";

export type AnalystRating = "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell" | "Not Rated";

export type WatchlistItem = {
  id: string;
  ticker: string;
  name: string;
  exchange?: string;
  currency: CurrencyCode;
  sector?: string;
  country?: string;
  targetPrice?: number;
  alertPrice?: number;
  rating?: AnalystRating;
  risk?: RiskLevel;
  notes?: string;
  createdAt: string;
};

export type CompanyMetric = {
  ticker: string;
  name: string;
  marketCap?: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  eps?: number;
  roe?: number;
  beta?: number;
  revenueGrowth?: number;
  debtToEquity?: number;
  grossMargin?: number;
  netMargin?: number;
  updatedAt?: string;
};
