export type PriceStatus = "Live" | "Delayed" | "Closed" | "Error";

export type LivePriceRow = {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
  status: PriceStatus;
};
