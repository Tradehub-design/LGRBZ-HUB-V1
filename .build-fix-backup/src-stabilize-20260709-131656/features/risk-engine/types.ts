export interface TradingAccount {
  id: string;
  name: string;
  broker: string;
  currency: string;

  startingBalance: number;
  currentBalance: number;

  dailyLossLimitPercent: number;
  overallLossLimitPercent: number;

  riskPerTradePercent: number;

  maxOpenTrades: number;

  averageRR: number;

  averageWinRate: number;
}
