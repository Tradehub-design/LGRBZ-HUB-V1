import type {
  DividendDataProvider,
} from "../dividendTypes";
import {
  alphaVantageDividendProvider,
} from "./alphaVantageDividendProvider";
import {
  twelveDataDividendProvider,
} from "./twelveDataDividendProvider";

export const dividendProviders:
  DividendDataProvider[] = [
    twelveDataDividendProvider,
    alphaVantageDividendProvider,
  ];

export function configuredDividendProviders() {
  return dividendProviders.filter(
    (provider) =>
      provider.isConfigured()
  );
}

export {
  alphaVantageDividendProvider,
  twelveDataDividendProvider,
};
