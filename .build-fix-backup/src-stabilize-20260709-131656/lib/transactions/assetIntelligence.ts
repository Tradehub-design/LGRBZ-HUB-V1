export type AssetSuggestion = {
  ticker: string;
  name: string;
  assetClass: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  riskLevel: "Low" | "Medium" | "High";
  dividendProfile: "Dividend" | "Growth" | "Mixed" | "None";
  strategy: string;
  confidence: number;
};

const ASSET_REGISTRY: Record<string, AssetSuggestion> = {
  "ASX:VAS": {
    ticker: "ASX:VAS",
    name: "Vanguard Australian Shares ETF",
    assetClass: "ETF",
    sector: "Broad Market",
    industry: "Australian Equities",
    country: "Australia",
    currency: "AUD",
    riskLevel: "Medium",
    dividendProfile: "Dividend",
    strategy: "Core ETF / Dividend",
    confidence: 0.95,
  },
  "ASX:NDQ": {
    ticker: "ASX:NDQ",
    name: "BetaShares Nasdaq 100 ETF",
    assetClass: "ETF",
    sector: "Technology",
    industry: "US Growth Equities",
    country: "United States",
    currency: "AUD",
    riskLevel: "Medium",
    dividendProfile: "Growth",
    strategy: "Growth ETF",
    confidence: 0.95,
  },
  "ASX:GMG": {
    ticker: "ASX:GMG",
    name: "Goodman Group",
    assetClass: "Stock",
    sector: "Real Estate",
    industry: "Industrial REIT",
    country: "Australia",
    currency: "AUD",
    riskLevel: "Medium",
    dividendProfile: "Dividend",
    strategy: "Dividend / Property",
    confidence: 0.9,
  },
  "ASX:IEL": {
    ticker: "ASX:IEL",
    name: "IDP Education",
    assetClass: "Stock",
    sector: "Consumer Discretionary",
    industry: "Education Services",
    country: "Australia",
    currency: "AUD",
    riskLevel: "High",
    dividendProfile: "Growth",
    strategy: "High Risk",
    confidence: 0.85,
  },
  "NYSE:ALB": {
    ticker: "NYSE:ALB",
    name: "Albemarle",
    assetClass: "Stock",
    sector: "Materials",
    industry: "Lithium / Chemicals",
    country: "United States",
    currency: "USD",
    riskLevel: "High",
    dividendProfile: "Mixed",
    strategy: "High Risk",
    confidence: 0.9,
  },
  "BTC-AUD": {
    ticker: "BTC-AUD",
    name: "Bitcoin",
    assetClass: "Crypto",
    sector: "Crypto",
    industry: "Digital Asset",
    country: "Crypto World",
    currency: "AUD",
    riskLevel: "High",
    dividendProfile: "None",
    strategy: "High Risk",
    confidence: 0.95,
  },
  "ETH-AUD": {
    ticker: "ETH-AUD",
    name: "Ethereum",
    assetClass: "Crypto",
    sector: "Crypto",
    industry: "Smart Contract Platform",
    country: "Crypto World",
    currency: "AUD",
    riskLevel: "High",
    dividendProfile: "None",
    strategy: "High Risk",
    confidence: 0.95,
  },
  "SOL-AUD": {
    ticker: "SOL-AUD",
    name: "Solana",
    assetClass: "Crypto",
    sector: "Crypto",
    industry: "Smart Contract Platform",
    country: "Crypto World",
    currency: "AUD",
    riskLevel: "High",
    dividendProfile: "None",
    strategy: "High Risk",
    confidence: 0.9,
  },
  "BNB-AUD": {
    ticker: "BNB-AUD",
    name: "BNB",
    assetClass: "Crypto",
    sector: "Crypto",
    industry: "Exchange Token",
    country: "Crypto World",
    currency: "AUD",
    riskLevel: "High",
    dividendProfile: "None",
    strategy: "High Risk",
    confidence: 0.85,
  },
};

export function normaliseTicker(input: string) {
  return input.trim().toUpperCase();
}

export function suggestAssetFields(tickerInput: string): AssetSuggestion {
  const ticker = normaliseTicker(tickerInput);

  if (ASSET_REGISTRY[ticker]) return ASSET_REGISTRY[ticker];

  if (ticker.endsWith("-AUD")) {
    return {
      ticker,
      name: ticker.replace("-AUD", ""),
      assetClass: "Crypto",
      sector: "Crypto",
      industry: "Digital Asset",
      country: "Crypto World",
      currency: "AUD",
      riskLevel: "High",
      dividendProfile: "None",
      strategy: "High Risk",
      confidence: 0.7,
    };
  }

  if (ticker.startsWith("ASX:")) {
    return {
      ticker,
      name: ticker.replace("ASX:", ""),
      assetClass: "Stock",
      sector: "Unknown",
      industry: "Unknown",
      country: "Australia",
      currency: "AUD",
      riskLevel: "Medium",
      dividendProfile: "Mixed",
      strategy: "Medium Risk",
      confidence: 0.45,
    };
  }

  if (ticker.startsWith("NYSE:") || ticker.startsWith("NASDAQ:")) {
    return {
      ticker,
      name: ticker.split(":")[1] ?? ticker,
      assetClass: "Stock",
      sector: "Unknown",
      industry: "Unknown",
      country: "United States",
      currency: "USD",
      riskLevel: "Medium",
      dividendProfile: "Mixed",
      strategy: "Medium Risk",
      confidence: 0.45,
    };
  }

  return {
    ticker,
    name: ticker,
    assetClass: "Stock",
    sector: "Unknown",
    industry: "Unknown",
    country: "Australia",
    currency: "AUD",
    riskLevel: "Medium",
    dividendProfile: "Mixed",
    strategy: "Medium Risk",
    confidence: 0.35,
  };
}
