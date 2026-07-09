export type AnalyticsRange =
  | "7D"
  | "30D"
  | "90D"
  | "YTD"
  | "1Y"
  | "ALL";

export type AnalyticsPoint = {
  date: string;
  value: number;
  pnl: number;
  returnPercent: number;
};

export type AnalyticsBreakdownRow = {
  label: string;
  value: number;
  pnl: number;
  returnPercent: number;
  weight: number;
};
