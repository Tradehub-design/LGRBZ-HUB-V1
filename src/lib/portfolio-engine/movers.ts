export type PortfolioMover = {
  ticker: string;
  name: string;
  valueAud: number;
  changeAud: number;
  changePercent: number;
  direction: "up" | "down" | "flat";
};

export function calculateTopMovers(): PortfolioMover[] {
  return [];
}

export function calculatePortfolioMovers(): PortfolioMover[] {
  return calculateTopMovers();
}

export default calculateTopMovers;
