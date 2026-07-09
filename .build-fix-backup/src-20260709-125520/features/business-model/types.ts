export interface RiskProfile {
  account: string;
  startingBalance: number;
  currentBalance: number;
  dailyRiskPercent: number;
  weeklyRiskPercent: number;
  monthlyRiskPercent: number;
  maxOpenTrades: number;
  riskPerTrade: number;
  averageRR: number;
}
