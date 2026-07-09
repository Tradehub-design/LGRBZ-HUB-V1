export function detectOpportunities(holdings: any[] = []) {
  return holdings.map((holding) => ({
    ticker: holding.ticker ?? holding.assetTicker ?? "UNKNOWN",
    score: Number(holding?.metrics?.unrealisedPercent ?? holding.unrealisedPlPercent ?? 0),
  }));
}

export function findOpportunities(holdings: any[] = []) {
  return detectOpportunities(holdings);
}

export default detectOpportunities;
