import type { EnhancedHolding } from "./valuation";

export type PortfolioAlert = {
  id: string;
  title: string;
  message: string;
  severity: "info" | "success" | "warning" | "danger";
};

export function calculatePortfolioAlerts(params: {
  enhancedHoldings: EnhancedHolding[];
  riskScore: number;
  healthScore: number;
  cashPercent: number;
  largestHoldingPercent: number;
  highRiskPercent: number;
}): PortfolioAlert[] {
  const alerts: PortfolioAlert[] = [];

  if (params.healthScore >= 80) {
    alerts.push({
      id: "health-good",
      title: "Strong portfolio health",
      message: "Your portfolio health score is currently in a strong range.",
      severity: "success",
    });
  }

  if (params.riskScore >= 60) {
    alerts.push({
      id: "risk-high",
      title: "High risk score",
      message: "Your current risk score is elevated. Review concentration and high-risk exposure.",
      severity: "danger",
    });
  } else if (params.riskScore >= 35) {
    alerts.push({
      id: "risk-moderate",
      title: "Moderate risk score",
      message: "Your portfolio has some concentration or exposure risks worth reviewing.",
      severity: "warning",
    });
  }

  if (params.cashPercent < 2) {
    alerts.push({
      id: "cash-low",
      title: "Low cash reserve",
      message: "Cash reserve is low compared with total portfolio value.",
      severity: "warning",
    });
  }

  if (params.largestHoldingPercent > 25) {
    alerts.push({
      id: "holding-concentration",
      title: "Holding concentration",
      message: "Your largest position is carrying a large share of portfolio risk.",
      severity: "warning",
    });
  }

  if (params.highRiskPercent > 35) {
    alerts.push({
      id: "high-risk-exposure",
      title: "High-risk exposure elevated",
      message: "High-risk assets represent a significant part of the portfolio.",
      severity: "danger",
    });
  }

  const topWinner = [...params.enhancedHoldings].sort((a, b) => b.unrealisedPlAud - a.unrealisedPlAud)[0];

  if (topWinner && topWinner.unrealisedPlAud > 0) {
    alerts.push({
      id: "top-winner",
      title: `${topWinner.ticker} leading gains`,
      message: `${topWinner.ticker} is currently your strongest unrealised contributor.`,
      severity: "info",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "no-alerts",
      title: "No major alerts",
      message: "No major portfolio alerts were detected from current transaction data.",
      severity: "success",
    });
  }

  return alerts;
}
