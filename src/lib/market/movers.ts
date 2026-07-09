export type MarketMover = {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  updatedAt: string;
  mode: "demo" | "live";
  direction: "up" | "down" | "flat";
};

export function buildMarketMovers(_input?: unknown): MarketMover[] {
  return [];
}

export function getMarketMovers(_input?: unknown): MarketMover[] {
  return buildMarketMovers(_input);
}

export default buildMarketMovers;
