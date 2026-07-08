import type { MarketQuote } from "./provider";

export type QuoteMap = Record<string, MarketQuote>;

export function cleanQuoteSymbol(symbol: string) {
  return symbol.replace("ASX:", "").replace(".AX", "").toUpperCase();
}

export function buildQuoteMap(quotes: MarketQuote[]): QuoteMap {
  return quotes.reduce<QuoteMap>((map, quote) => {
    map[cleanQuoteSymbol(quote.symbol)] = quote;
    return map;
  }, {});
}
