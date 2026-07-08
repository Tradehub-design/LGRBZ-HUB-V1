export type IntelligenceInsight = {
  id: string;
  title: string;
  detail: string;
  category: "Risk" | "Income" | "Growth" | "Diversification" | "Tax" | "Opportunity";
  priority: "Low" | "Medium" | "High";
};

export function buildIntelligenceInsights(params: {
  riskScore: number;
  healthScore: number;
  incomeYieldPercent: number;
  largestHoldingPercent: number;
  largestSectorPercent: number;
  totalReturnPercent: number;
  cashPercent: number;
}): IntelligenceInsight[] {
  const insights: IntelligenceInsight[] = [];

  if (params.largestHoldingPercent > 25) {
    insights.push({
      id: "concentration-largest-holding",
      title: "Single holding concentration is elevated",
      detail: "Your largest holding carries more than 25% of the portfolio. Consider whether this matches your risk plan.",
      category: "Diversification",
      priority: "High",
    });
  }

  if (params.largestSectorPercent > 40) {
    insights.push({
      id: "sector-concentration",
      title: "Sector concentration is high",
      detail: "One sector dominates your exposure. This can increase volatility if that sector weakens.",
      category: "Risk",
      priority: "Medium",
    });
  }

  if (params.incomeYieldPercent < 2) {
    insights.push({
      id: "income-yield-low",
      title: "Income yield is low",
      detail: "Dividend income is currently modest relative to invested capital.",
      category: "Income",
      priority: "Low",
    });
  }

  if (params.cashPercent < 2) {
    insights.push({
      id: "cash-low",
      title: "Cash reserve is thin",
      detail: "Low cash can reduce flexibility for opportunities or portfolio protection.",
      category: "Opportunity",
      priority: "Medium",
    });
  }

  if (params.healthScore >= 80) {
    insights.push({
      id: "health-strong",
      title: "Portfolio health is strong",
      detail: "Current diversification and risk controls appear healthy based on your transaction data.",
      category: "Growth",
      priority: "Low",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "balanced",
      title: "Portfolio looks balanced",
      detail: "No major intelligence warnings detected from current rules.",
      category: "Growth",
      priority: "Low",
    });
  }

  return insights;
}
