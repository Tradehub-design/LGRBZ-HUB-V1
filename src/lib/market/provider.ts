export type MarketQuote = {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  updatedAt: string;
};

export interface MarketProvider {
  getQuote(symbol: string): Promise<MarketQuote>;
  getQuotes(symbols: string[]): Promise<MarketQuote[]>;
}

export class DemoMarketProvider implements MarketProvider {

  async getQuote(symbol: string): Promise<MarketQuote> {

    const price = Number((Math.random() * 300 + 20).toFixed(2));

    return {
      symbol,
      price,
      previousClose: Number((price * 0.99).toFixed(2)),
      change: Number((price * 0.01).toFixed(2)),
      changePercent: 1,
      currency: "AUD",
      updatedAt: new Date().toISOString(),
    };

  }

  async getQuotes(symbols: string[]) {
    return Promise.all(symbols.map(s => this.getQuote(s)));
  }

}

export const marketProvider = new DemoMarketProvider();
