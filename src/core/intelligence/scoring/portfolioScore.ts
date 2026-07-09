export function calculatePortfolioScore(portfolio: any) {
  return Math.max(0, Math.min(100, Number(portfolio?.performance?.winRate ?? 75)));
}

export default calculatePortfolioScore;
