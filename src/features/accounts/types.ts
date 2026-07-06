export type AccountType = "Brokerage" | "ETF Builder" | "Long Term" | "Cash";

export type InvestmentAccount = {
  id: string;
  name: string;
  broker: string;
  type: AccountType;
  currency: string;
  openingBalance: number;
  currentValue: number;
  investedAmount: number;
  cashBalance: number;
  unrealisedPnl: number;
  realisedPnl: number;
  totalReturnPercent: number;
};
