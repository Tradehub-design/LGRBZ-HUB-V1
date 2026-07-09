export function revaluePortfolio(holdings: any[] = [], prices: Record<string, any> = {}) {
  return holdings.map((holding) => {
    const ticker = holding.ticker ?? holding.assetTicker;
    const quote = prices[ticker] ?? {};
    const price = Number(quote.price ?? holding.priceAud ?? 0);
    const quantity = Number(holding.quantity ?? 0);
    return {
      ...holding,
      priceAud: price,
      valueAud: price * quantity,
    };
  });
}

export function applyLiveValuation(holdings: any[] = [], prices: Record<string, any> = {}) {
  return revaluePortfolio(holdings, prices);
}

export default revaluePortfolio;
