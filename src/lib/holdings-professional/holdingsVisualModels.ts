export type HoldingsVisualPosition = {
  symbol: string;
  name: string;

  quantity: number;

  marketValue: number;
  costBasis: number;

  gainLoss: number;
  gainLossPercent: number | null;

  dailyChange: number;
  dailyChangePercent: number | null;

  annualIncome: number;
  dividendYield: number | null;

  portfolioWeight: number;

  sector: string;
  industry: string;
  country: string;
  currency: string;

  quoteStatus: string;
  quoteQuality: number | null;

  original: unknown;
};

export type HoldingsVisualSector = {
  sector: string;

  holdingCount: number;

  marketValue: number;
  costBasis: number;

  gainLoss: number;
  gainLossPercent: number | null;

  annualIncome: number;

  weight: number;
};

export type HoldingsVisualSnapshot = {
  positions: HoldingsVisualPosition[];
  sectors: HoldingsVisualSector[];

  totals: {
    holdingCount: number;

    marketValue: number;
    costBasis: number;

    gainLoss: number;
    gainLossPercent: number | null;

    dailyChange: number;
    dailyChangePercent: number | null;

    annualIncome: number;
    monthlyIncome: number;
    dividendYield: number | null;

    largestPositionWeight: number;
    topFiveWeight: number;

    profitableCount: number;
    losingCount: number;
    flatCount: number;

    pricedCount: number;
    pricingCoverage: number;

    averageQuoteQuality: number;

    sectorCount: number;
    countryCount: number;
  };

  largestPosition: HoldingsVisualPosition | null;
  bestPerformer: HoldingsVisualPosition | null;
  worstPerformer: HoldingsVisualPosition | null;
};
