export type AttributionRow = {
  id: string;
  source: string;
  category: string;
  value: number;
  contribution: number;
  contributionPercent: number;
  weight: number;
};

export type AttributionPeriod = "MTD" | "QTD" | "YTD" | "1Y" | "ALL";
