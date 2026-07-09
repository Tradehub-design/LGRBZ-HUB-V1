export function buildPortfolioSnapshot(input: any = {}) {
  const holdings = Array.isArray(input.holdings) ? input.holdings : [];
  const transactions = Array.isArray(input.transactions) ? input.transactions : [];

  const marketValue = holdings.reduce((sum: number, h: any) => sum + Number(h.valueAud ?? h.marketValueAud ?? 0), 0);
  const costBasis = holdings.reduce((sum: number, h: any) => sum + Number(h.costBaseAud ?? h.totalCostAud ?? 0), 0);
  const unrealised = marketValue - costBasis;

  return {
    holdings,
    transactions,
    totals: {
      marketValue,
      costBasis,
      unrealised,
      totalValueAud: marketValue,
      totalCostAud: costBasis,
      unrealisedPlAud: unrealised,
      unrealisedPlPercent: costBasis ? (unrealised / costBasis) * 100 : 0,
    },
    performance: {
      realisedPnL: 0,
      realisedPlAud: 0,
      winRate: 0,
    },
  };
}

export default buildPortfolioSnapshot;
