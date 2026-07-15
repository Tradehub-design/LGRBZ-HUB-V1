import {
  type NextRequest,
} from "next/server";
import {
  createMarketDataCacheDiagnostics,
  getSharedMarketDataCache,
  marketDataApiError,
  marketDataApiSuccess,
} from "@/lib/market-data";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export async function GET() {
  try {
    const cache =
      getSharedMarketDataCache();

    return marketDataApiSuccess(
      createMarketDataCacheDiagnostics(
        cache
      )
    );
  } catch (
    error
  ) {
    return marketDataApiError(
      error
    );
  }
}

export async function DELETE(
  request:
    NextRequest
) {
  try {
    const cache =
      getSharedMarketDataCache();

    const symbol =
      request.nextUrl
        .searchParams
        .get(
          "symbol"
        )
        ?.trim()
        .toUpperCase();

    const provider =
      request.nextUrl
        .searchParams
        .get(
          "provider"
        )
        ?.trim()
        .toUpperCase();

    let removed =
      0;

    if (
      symbol
    ) {
      removed +=
        cache.deleteBySymbol(
          symbol
        );
    }

    if (
      provider
    ) {
      removed +=
        cache.deleteByProvider(
          provider
        );
    }

    if (
      !symbol &&
      !provider
    ) {
      const previousSize =
        cache.size();

      cache.clear();

      removed =
        previousSize;
    }

    return marketDataApiSuccess({
      removed,
      symbol:
        symbol ||
        null,
      provider:
        provider ||
        null,
    });
  } catch (
    error
  ) {
    return marketDataApiError(
      error,
      400
    );
  }
}
