import type { EnhancedHolding } from "./valuation";

export type PortfolioMover = {
  ticker: string;
  name: string;
  valueAud: number;
  changeAud: number;
  changePercent: number;
  direction: "up" | "down" | "flat";
};

export function calculateTopMovers(holdings: EnhancedHolding[]): PortfolioMover[] {
  return [...holdings]
    .map((holding) => ({
      ticker: holding.ticker,
      name: holding.sector,
      valueAud: holding.marketValueAud,
      changeAud: holding.unrealisedPlAud,
      changePercent: holding.unrealisedPlPercent,
      direction:
        holding.unrealisedPlAud > 0 ? "up" : holding.unrealisedPlAud < 0 ? "down" : "flat",
    }))
    .sort((a, b) => Math.abs(b.changeAud) - Math.abs(a.changeAud));
}
