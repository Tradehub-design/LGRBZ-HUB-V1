export type WatchlistIdea = {
  symbol: string;
  name: string;
  theme: string;
  reason: string;
  priority: "Low" | "Medium" | "High";
};

export function buildWatchlistIdeas(params: {
  highRiskPercent: number;
  largestSectorPercent: number;
  incomeYieldPercent: number;
  cashPercent: number;
}): WatchlistIdea[] {
  const ideas: WatchlistIdea[] = [];

  if (params.largestSectorPercent > 40) {
    ideas.push({
      symbol: "IVV.AX",
      name: "iShares S&P 500 ETF",
      theme: "Diversification",
      reason: "May improve broad-market exposure if sector concentration is high.",
      priority: "Medium",
    });
  }

  if (params.incomeYieldPercent < 2) {
    ideas.push({
      symbol: "VAS.AX",
      name: "Vanguard Australian Shares ETF",
      theme: "Income",
      reason: "Broad Australian exposure may support dividend income strategy.",
      priority: "Medium",
    });
  }

  if (params.highRiskPercent > 35) {
    ideas.push({
      symbol: "VGS.AX",
      name: "Vanguard International Shares ETF",
      theme: "Risk Balance",
      reason: "Global diversification may reduce single-theme exposure.",
      priority: "High",
    });
  }

  if (params.cashPercent > 5) {
    ideas.push({
      symbol: "NDQ.AX",
      name: "BetaShares Nasdaq 100 ETF",
      theme: "Growth",
      reason: "Cash reserve may allow staged deployment into growth exposure.",
      priority: "Low",
    });
  }

  return ideas.length
    ? ideas
    : [
        {
          symbol: "VAS.AX",
          name: "Vanguard Australian Shares ETF",
          theme: "Core",
          reason: "Default watchlist idea for broad Australian exposure.",
          priority: "Low",
        },
      ];
}
