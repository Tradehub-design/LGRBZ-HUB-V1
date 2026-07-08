import type { CalculatedHolding } from "./types";

export type MarketPriceMap = Record<string, number>;

export type EnhancedHolding = CalculatedHolding & {
  marketPriceAud: number;
  marketValueAud: number;
  unrealisedPlAud: number;
  unrealisedPlPercent: number;
  portfolioWeightPercent: number;
};

export type PortfolioValuation = {
  investedCostAud: number;
  marketValueAud: number;
  cashAud: number;
  totalValueAud: number;
  unrealisedPlAud: number;
  unrealisedPlPercent: number;
};

export const DEFAULT_MARKET_PRICES: MarketPriceMap = {
  VAS: 101.25,
  VGS: 142.8,
  IVV: 61.4,
  NDQ: 52.3,
  BHP: 43.1,
  NAB: 38.25,
  CBA: 129.4,
  COH: 329.5,
  AAPL: 320,
  MSFT: 680,
  BTC: 99000,
  ETH: 5300,
};

function cleanTicker(ticker: string) {
  return ticker.replace("ASX:", "").replace(".AX", "").toUpperCase();
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value || 0) * factor) / factor;
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return round((value / total) * 100, 2);
}

export function calculateEnhancedHoldings(
  holdings: CalculatedHolding[],
  marketPrices: MarketPriceMap = DEFAULT_MARKET_PRICES,
): EnhancedHolding[] {
  const openHoldings = holdings.filter((holding) => holding.status === "Open");

  const baseRows = openHoldings.map((holding) => {
    const ticker = cleanTicker(holding.ticker);
    const marketPriceAud = marketPrices[ticker] ?? holding.averageCostAud;
    const marketValueAud = round(holding.quantity * marketPriceAud);
    const unrealisedPlAud = round(marketValueAud - holding.totalCostAud);
    const unrealisedPlPercent = percent(unrealisedPlAud, holding.totalCostAud);

    return {
      ...holding,
      marketPriceAud,
      marketValueAud,
      unrealisedPlAud,
      unrealisedPlPercent,
      portfolioWeightPercent: 0,
    };
  });

  const totalMarketValue = baseRows.reduce((sum, holding) => sum + holding.marketValueAud, 0);

  return baseRows.map((holding) => ({
    ...holding,
    portfolioWeightPercent: percent(holding.marketValueAud, totalMarketValue),
  }));
}

export function calculatePortfolioValuation(params: {
  enhancedHoldings: EnhancedHolding[];
  cashAud: number;
}): PortfolioValuation {
  const investedCostAud = round(
    params.enhancedHoldings.reduce((sum, holding) => sum + holding.totalCostAud, 0),
  );

  const marketValueAud = round(
    params.enhancedHoldings.reduce((sum, holding) => sum + holding.marketValueAud, 0),
  );

  const unrealisedPlAud = round(marketValueAud - investedCostAud);
  const unrealisedPlPercent = percent(unrealisedPlAud, investedCostAud);

  return {
    investedCostAud,
    marketValueAud,
    cashAud: round(params.cashAud),
    totalValueAud: round(marketValueAud + params.cashAud),
    unrealisedPlAud,
    unrealisedPlPercent,
  };
}
