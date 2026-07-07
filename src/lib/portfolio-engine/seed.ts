import { buildPortfolio } from "./buildPortfolio";

export function buildSeedPortfolioFromCsv(csv: string) {
  if (!csv.trim()) return null;
  return buildPortfolio(csv);
}
