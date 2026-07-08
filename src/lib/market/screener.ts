import { DEFAULT_MARKET_WATCHLIST } from "./watchlist";

export type ScreenerRow = {
  symbol: string;
  name: string;
  market: string;
  category: string;
  score: number;
  signal: "Buy Watch" | "Hold Watch" | "Avoid Watch";
};

export function buildDemoScreener(): ScreenerRow[] {
  return DEFAULT_MARKET_WATCHLIST.map((asset, index) => {
    const score = 95 - index * 6;

    return {
      symbol: asset.symbol,
      name: asset.name,
      market: asset.market,
      category: asset.category,
      score,
      signal: score >= 80 ? "Buy Watch" : score >= 60 ? "Hold Watch" : "Avoid Watch",
    };
  });
}
