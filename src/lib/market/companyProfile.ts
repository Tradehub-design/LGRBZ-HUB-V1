export type CompanyProfile = {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  description: string;
};

export const DEMO_COMPANY_PROFILES: Record<string, CompanyProfile> = {
  VAS: {
    symbol: "VAS",
    name: "Vanguard Australian Shares ETF",
    exchange: "ASX",
    sector: "ETF",
    industry: "Broad Market",
    description: "Australian broad market ETF tracking large and mid-cap Australian companies.",
  },
  NDQ: {
    symbol: "NDQ",
    name: "BetaShares Nasdaq 100 ETF",
    exchange: "ASX",
    sector: "ETF",
    industry: "Technology Growth",
    description: "ETF providing exposure to the Nasdaq 100 index.",
  },
  BHP: {
    symbol: "BHP",
    name: "BHP Group",
    exchange: "ASX",
    sector: "Materials",
    industry: "Mining",
    description: "Global resources company with exposure to iron ore, copper and energy transition materials.",
  },
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    exchange: "Crypto",
    sector: "Digital Asset",
    industry: "Crypto",
    description: "Decentralised digital asset used as a store-of-value and settlement network.",
  },
};

export function getCompanyProfile(symbol = "VAS"): CompanyProfile {
  return DEMO_COMPANY_PROFILES[symbol.toUpperCase()] ?? DEMO_COMPANY_PROFILES.VAS;
}
