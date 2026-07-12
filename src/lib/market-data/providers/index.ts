import type {
  MarketDataProvider,
} from "../marketDataTypes";
import {
  alphaVantageProvider,
} from "./alphaVantageProvider";
import {
  finnhubProvider,
} from "./finnhubProvider";
import {
  twelveDataProvider,
} from "./twelveDataProvider";

export const marketDataProviders:
  MarketDataProvider[] = [
    twelveDataProvider,
    finnhubProvider,
    alphaVantageProvider,
  ];

export function configuredMarketDataProviders() {
  return marketDataProviders.filter(
    (provider) =>
      provider.isConfigured()
  );
}

export {
  alphaVantageProvider,
  finnhubProvider,
  twelveDataProvider,
};
