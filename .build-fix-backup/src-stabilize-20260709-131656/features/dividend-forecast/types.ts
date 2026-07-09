export type ForecastFrequency = "Monthly" | "Quarterly" | "Semi-Annual" | "Annual";

export type DividendForecastRow = {
  id: string;
  symbol: string;
  company: string;
  shares: number;
  dividendPerShare: number;
  annualIncome: number;
  yieldOnCost: number;
  paymentFrequency: ForecastFrequency;
  nextExDate: string;
  nextPaymentDate: string;
};
