export type HoldingAccount = {
  id: string;
  name: string;
  broker: string;
};

export type HoldingRow = {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  exchange: string;
  assetClass: string;
  sector: string;
  currency: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  costBase: number;
  unrealisedPnl: number;
  unrealisedPnlPercent: number;
  portfolioWeight: number;
};
