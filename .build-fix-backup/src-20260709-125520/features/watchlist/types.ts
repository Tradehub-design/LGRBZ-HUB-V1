export type WatchlistItem = {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  targetPrice: number;
  changePercent: number;
  marketCap: string;
  sector: string;
  status: "Watch" | "Buy Zone" | "Overvalued" | "Owned";
};
