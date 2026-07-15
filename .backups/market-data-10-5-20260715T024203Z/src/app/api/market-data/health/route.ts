import {
  createMarketDataDiagnosticSummary,
  DEFAULT_MARKET_DATA_PROVIDERS,
  getSharedMultiProviderQuoteResolver,
  marketDataApiError,
  marketDataApiSuccess,
} from "@/lib/market-data";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export async function GET() {
  try {
    const resolver =
      getSharedMultiProviderQuoteResolver();

    const diagnostics =
      createMarketDataDiagnosticSummary(
        DEFAULT_MARKET_DATA_PROVIDERS,
        resolver.getHealthStore()
      );

    return marketDataApiSuccess(
      diagnostics
    );
  } catch (
    error
  ) {
    return marketDataApiError(
      error
    );
  }
}
