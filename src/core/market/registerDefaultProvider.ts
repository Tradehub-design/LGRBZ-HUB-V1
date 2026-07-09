import { MARKET_CONFIG } from "@/config/market";
import { registerProvider } from "./providerManager";
import { fmpProvider } from "./providers/fmp/fmpProvider";

export function registerDefaultMarketProvider() {
  switch (MARKET_CONFIG.provider) {
    case "fmp":
    default:
      registerProvider(fmpProvider);
      break;
  }
}
