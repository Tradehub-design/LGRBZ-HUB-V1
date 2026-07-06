export type DividendRecord = {
  id: string;
  date: string;
  symbol: string;
  company: string;
  shares: number;
  dividendPerShare: number;
  grossAmount: number;
  taxWithheld: number;
  netAmount: number;
  currency: string;
  account: string;
};
