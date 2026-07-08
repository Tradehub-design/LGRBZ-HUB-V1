export type WatchlistAsset = {
  symbol: string;
  name: string;
  market: "ASX" | "NASDAQ" | "NYSE" | "CRYPTO" | "FX";
  category: string;
};

export const DEFAULT_MARKET_WATCHLIST: WatchlistAsset[] = [
  { symbol: "VAS", name: "Vanguard Australian Shares ETF", market: "ASX", category: "ETF" },
  { symbol: "VGS", name: "Vanguard International Shares ETF", market: "ASX", category: "ETF" },
  { symbol: "IVV", name: "iShares S&P 500 ETF", market: "ASX", category: "ETF" },
  { symbol: "NDQ", name: "BetaShares Nasdaq 100 ETF", market: "ASX", category: "ETF" },
  { symbol: "BHP", name: "BHP Group", market: "ASX", category: "Resources" },
  { symbol: "NAB", name: "National Australia Bank", market: "ASX", category: "Bank" },
  { symbol: "AAPL", name: "Apple", market: "NASDAQ", category: "Technology" },
  { symbol: "MSFT", name: "Microsoft", market: "NASDAQ", category: "Technology" },
  { symbol: "BTC", name: "Bitcoin", market: "CRYPTO", category: "Crypto" },
  { symbol: "ETH", name: "Ethereum", market: "CRYPTO", category: "Crypto" }
];
