import type { MarketQuote } from "./provider";

export type MarketMover = MarketQuote & {
  direction: "up" | "down" | "flat";
};

export function buildMarketMovers(quotes: MarketQuote[]): MarketMover[] {
  return [...quotes]
    .map((quote) => ({
      ...quote,
      direction: quote.change > 0 ? "up" : quote.change < 0 ? "down" : "flat",
    }))
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
}
