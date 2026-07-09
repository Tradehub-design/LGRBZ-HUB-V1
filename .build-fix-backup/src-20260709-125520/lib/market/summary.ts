import type { MarketQuote } from "./provider";

export type MarketSummary = {
  quoteCount: number;
  gainers: number;
  losers: number;
  averageChangePercent: number;
  strongestSymbol: string;
  weakestSymbol: string;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function buildMarketSummary(quotes: MarketQuote[]): MarketSummary {
  const gainers = quotes.filter((quote) => quote.change > 0);
  const losers = quotes.filter((quote) => quote.change < 0);
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const averageChangePercent = quotes.length
    ? quotes.reduce((sum, quote) => sum + quote.changePercent, 0) / quotes.length
    : 0;

  return {
    quoteCount: quotes.length,
    gainers: gainers.length,
    losers: losers.length,
    averageChangePercent: round(averageChangePercent),
    strongestSymbol: sorted[0]?.symbol ?? "N/A",
    weakestSymbol: sorted[sorted.length - 1]?.symbol ?? "N/A",
  };
}
