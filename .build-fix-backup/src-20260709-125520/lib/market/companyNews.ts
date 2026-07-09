export type CompanyNewsItem = {
  id: string;
  symbol: string;
  title: string;
  source: string;
  publishedAt: string;
  sentiment: "positive" | "neutral" | "negative";
};

export function getDemoCompanyNews(symbol = "VAS"): CompanyNewsItem[] {
  return [
    {
      id: `${symbol}-1`,
      symbol,
      title: `${symbol} shows steady investor interest as market volatility settles`,
      source: "LGRBZ Market Desk",
      publishedAt: new Date().toISOString(),
      sentiment: "positive",
    },
    {
      id: `${symbol}-2`,
      symbol,
      title: `Analysts monitor valuation and sector exposure for ${symbol}`,
      source: "LGRBZ Research",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      sentiment: "neutral",
    },
    {
      id: `${symbol}-3`,
      symbol,
      title: `${symbol} remains sensitive to macro and rate expectations`,
      source: "LGRBZ Macro",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      sentiment: "neutral",
    },
  ];
}
