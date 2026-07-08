export type MarketProviderMode = "demo" | "live";

export const marketProviderConfig = {
  mode: (process.env.NEXT_PUBLIC_MARKET_PROVIDER_MODE ?? "demo") as MarketProviderMode,
  provider: process.env.NEXT_PUBLIC_MARKET_PROVIDER ?? "demo",
  demoWarning:
    "Market prices are currently in demo mode. Add a live provider key to enable real market prices.",
};

export const marketProviderIsLive = marketProviderConfig.mode === "live";
