import {
  createMarketDataCacheDiagnostics,
} from "@/lib/market-data/marketDataCacheDiagnostics";
import {
  getSharedMarketDataCache,
} from "@/lib/market-data/memoryMarketDataCache";
import {
  marketDataApiError,
  marketDataApiSuccess,
  safeJsonBody,
} from "@/lib/market-data/marketDataApiUtils";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export async function GET() {
  const cache =
    getSharedMarketDataCache();

  return marketDataApiSuccess(
    createMarketDataCacheDiagnostics(
      cache
    )
  );
}

export async function DELETE(
  request:
    Request
) {
  const cache =
    getSharedMarketDataCache();

  const body =
    await safeJsonBody(
      request
    );

  const symbol =
    typeof body.symbol ===
    "string"
      ? body.symbol
          .trim()
          .toUpperCase()
      : null;

  const provider =
    typeof body.provider ===
    "string"
      ? body.provider
          .trim()
          .toUpperCase()
      : null;

  const clearAll =
    Boolean(
      body.clearAll
    );

  if (
    clearAll
  ) {
    const removed =
      cache.size();

    cache.clear();

    return marketDataApiSuccess({
      action:
        "CLEAR_ALL",

      removed,
    });
  }

  if (
    symbol
  ) {
    const removed =
      cache.deleteBySymbol(
        symbol
      );

    return marketDataApiSuccess({
      action:
        "DELETE_SYMBOL",

      symbol,
      removed,
    });
  }

  if (
    provider
  ) {
    const removed =
      cache.deleteByProvider(
        provider
      );

    return marketDataApiSuccess({
      action:
        "DELETE_PROVIDER",

      provider,
      removed,
    });
  }

  return marketDataApiError(
    "INVALID_CACHE_DELETE",
    "Provide symbol, provider or clearAll.",
    400
  );
}
