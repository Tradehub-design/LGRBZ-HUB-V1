import {
  DEFAULT_MARKET_DATA_PROVIDERS,
} from "@/lib/market-data/providerRegistry";
import {
  createMarketDataDiagnosticSummary,
} from "@/lib/market-data/marketDataDiagnostics";
import {
  createMarketHoursDiagnosticSummary,
} from "@/lib/market-data/marketHoursDiagnostics";
import {
  getSharedMultiProviderQuoteResolver,
} from "@/lib/market-data/multiProviderQuoteResolver";
import {
  getSharedMarketDataRefreshCoordinator,
} from "@/lib/market-data/marketDataRefreshCoordinator";
import {
  marketDataApiSuccess,
} from "@/lib/market-data/marketDataApiUtils";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export async function GET() {
  const resolver =
    getSharedMultiProviderQuoteResolver();

  const coordinator =
    getSharedMarketDataRefreshCoordinator();

  const providers =
    createMarketDataDiagnosticSummary(
      DEFAULT_MARKET_DATA_PROVIDERS,
      resolver.getHealthStore()
    );

  const markets =
    createMarketHoursDiagnosticSummary();

  const refresh =
    coordinator.snapshot();

  return marketDataApiSuccess({
    status:
      providers.unhealthyProviderCount >
      0
        ? "DEGRADED"
        : "HEALTHY",

    providers,
    markets,
    refresh,
  });
}
