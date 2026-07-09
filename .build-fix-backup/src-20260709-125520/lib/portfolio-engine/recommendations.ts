export type PortfolioRecommendation = {
  id: string;
  title: string;
  detail: string;
  priority: "Low" | "Medium" | "High";
  category: "Risk" | "Income" | "Diversification" | "Cash" | "Performance";
};

export function calculateRecommendations(params: {
  healthScore: number;
  riskScore: number;
  largestHoldingPercent: number;
  largestSectorPercent: number;
  cashPercent: number;
  highRiskPercent: number;
  incomeYieldPercent: number;
}): PortfolioRecommendation[] {
  const items: PortfolioRecommendation[] = [];

  if (params.riskScore > 60) {
    items.push({
      id: "risk-score",
      title: "Review overall risk exposure",
      detail: "Risk score is elevated. Review concentration, high-risk exposure and cash position.",
      priority: "High",
      category: "Risk",
    });
  }

  if (params.largestHoldingPercent > 25) {
    items.push({
      id: "largest-holding",
      title: "Reduce single holding concentration",
      detail: "Largest holding is above 25% of the portfolio.",
      priority: "High",
      category: "Diversification",
    });
  }

  if (params.largestSectorPercent > 40) {
    items.push({
      id: "sector-concentration",
      title: "Reduce sector concentration",
      detail: "One sector represents a large portion of the portfolio.",
      priority: "Medium",
      category: "Diversification",
    });
  }

  if (params.cashPercent < 2) {
    items.push({
      id: "low-cash",
      title: "Build cash reserve",
      detail: "Cash reserve is low compared with portfolio value.",
      priority: "Medium",
      category: "Cash",
    });
  }

  if (params.highRiskPercent > 35) {
    items.push({
      id: "high-risk",
      title: "High-risk allocation is elevated",
      detail: "Consider whether the portfolio risk matches the investment plan.",
      priority: "High",
      category: "Risk",
    });
  }

  if (params.incomeYieldPercent < 2) {
    items.push({
      id: "income-yield",
      title: "Income yield is low",
      detail: "Dividend income is low relative to invested capital.",
      priority: "Low",
      category: "Income",
    });
  }

  if (items.length === 0) {
    items.push({
      id: "healthy",
      title: "Portfolio structure looks balanced",
      detail: "No major risk or concentration issue detected from current data.",
      priority: "Low",
      category: "Performance",
    });
  }

  return items;
}
