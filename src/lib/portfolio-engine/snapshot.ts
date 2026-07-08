export type PortfolioSnapshot = {
  generatedAt: string;
  headline: string;
  strengths: string[];
  watchItems: string[];
};

export function buildPortfolioSnapshot(params: {
  totalValueAud: number;
  totalReturnPercent: number;
  healthScore: number;
  riskScore: number;
  incomeYieldPercent: number;
  positionCount: number;
}): PortfolioSnapshot {
  const strengths: string[] = [];
  const watchItems: string[] = [];

  if (params.healthScore >= 75) strengths.push("Portfolio health is in a strong range.");
  else watchItems.push("Portfolio health needs review.");

  if (params.riskScore <= 35) strengths.push("Risk score is controlled.");
  else watchItems.push("Risk score is elevated.");

  if (params.positionCount >= 8) strengths.push("Position diversification is improving.");
  else watchItems.push("Portfolio may need more diversification.");

  if (params.incomeYieldPercent >= 3) strengths.push("Income yield is developing well.");
  else watchItems.push("Dividend yield remains low.");

  return {
    generatedAt: new Date().toISOString(),
    headline: `Portfolio value is ${Math.round(params.totalValueAud).toLocaleString("en-AU")} AUD with ${params.totalReturnPercent.toFixed(2)}% total return.`,
    strengths,
    watchItems,
  };
}
