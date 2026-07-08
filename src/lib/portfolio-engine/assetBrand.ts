export type AssetBrand = {
  ticker: string;
  displayName: string;
  shortName: string;
  theme: "blue" | "green" | "orange" | "purple" | "rose" | "slate";
};

const registry: Record<string, AssetBrand> = {
  VAS: { ticker: "VAS", displayName: "Vanguard Australian Shares", shortName: "VAS", theme: "green" },
  VGS: { ticker: "VGS", displayName: "Vanguard International Shares", shortName: "VGS", theme: "blue" },
  IVV: { ticker: "IVV", displayName: "iShares S&P 500", shortName: "IVV", theme: "blue" },
  NDQ: { ticker: "NDQ", displayName: "BetaShares Nasdaq 100", shortName: "NDQ", theme: "purple" },
  BHP: { ticker: "BHP", displayName: "BHP Group", shortName: "BHP", theme: "orange" },
  NAB: { ticker: "NAB", displayName: "National Australia Bank", shortName: "NAB", theme: "blue" },
  CBA: { ticker: "CBA", displayName: "Commonwealth Bank", shortName: "CBA", theme: "orange" },
  COH: { ticker: "COH", displayName: "Cochlear", shortName: "COH", theme: "green" },
  BTC: { ticker: "BTC", displayName: "Bitcoin", shortName: "BTC", theme: "orange" },
  ETH: { ticker: "ETH", displayName: "Ethereum", shortName: "ETH", theme: "purple" },
};

export function cleanAssetTicker(ticker: string) {
  return ticker.replace("ASX:", "").replace(".AX", "").toUpperCase();
}

export function getAssetBrand(ticker: string): AssetBrand {
  const cleaned = cleanAssetTicker(ticker);

  return (
    registry[cleaned] ?? {
      ticker: cleaned,
      displayName: cleaned,
      shortName: cleaned.slice(0, 4),
      theme: "slate",
    }
  );
}
