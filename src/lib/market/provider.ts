import { marketProviderConfig, marketProviderIsLive } from "./providerConfig";

export type MarketQuote = {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  updatedAt: string;
  mode: "demo" | "live";
};

export interface MarketProvider {
  getQuote(symbol: string): Promise<MarketQuote>;
  getQuotes(symbols: string[]): Promise<MarketQuote[]>;
}

const SEEDED_QUOTES: Record<string, number> = {
  VAS: 101.25,
  VGS: 142.8,
  IVV: 61.4,
  NDQ: 52.3,
  BHP: 43.1,
  NAB: 38.25,
  CBA: 129.4,
  COH: 329.5,
  AAPL: 320,
  MSFT: 680,
  BTC: 99000,
  ETH: 5300,
};

export class DemoMarketProvider implements MarketProvider {
  async getQuote(symbol: string): Promise<MarketQuote> {
    const cleaned = symbol.replace(".AX", "").replace("ASX:", "").toUpperCase();
    const price = SEEDED_QUOTES[cleaned] ?? 100;
    const previousClose = price * 0.9925;
    const change = price - previousClose;

    return {
      symbol: cleaned,
      price,
      previousClose,
      change,
      changePercent: previousClose ? (change / previousClose) * 100 : 0,
      currency: "AUD",
      updatedAt: new Date().toISOString(),
      mode: marketProviderIsLive ? "live" : "demo",
    };
  }

  async getQuotes(symbols: string[]) {
    return Promise.all(symbols.map((symbol) => this.getQuote(symbol)));
  }
}

export const marketProvider = new DemoMarketProvider();

export function getMarketProviderStatus() {
  return {
    mode: marketProviderConfig.mode,
    provider: marketProviderConfig.provider,
    live: marketProviderIsLive,
    warning: marketProviderIsLive ? null : marketProviderConfig.demoWarning,
  };
}
