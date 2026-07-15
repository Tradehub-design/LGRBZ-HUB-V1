import {
  type NextRequest,
} from "next/server";
import {
  marketDataApiError,
  marketDataApiSuccess,
  resolveMarketQuotes,
  validateBatchQuoteRequest,
} from "@/lib/market-data";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export async function POST(
  request:
    NextRequest
) {
  try {
    const body =
      await request.json();

    const input =
      validateBatchQuoteRequest(
        body
      );

    const result =
      await resolveMarketQuotes({
        symbols:
          input.symbols,

        assetType:
          input.assetType,

        region:
          input.region,

        exchange:
          input.exchange,

        currency:
          input.currency,

        providerPreference:
          input.providers,

        forceRefresh:
          input.forceRefresh,

        compareProviders:
          input.compareProviders,

        allowDelayed:
          input.allowDelayed,

        allowIndicative:
          input.allowIndicative,

        allowStale:
          input.allowStale,

        allowExpiredFallback:
          input.allowExpiredFallback,

        minimumQualityScore:
          input.minimumQualityScore,

        maximumProviderAttempts:
          input.maximumProviderAttempts,

        concurrency:
          input.concurrency,
      });

    return marketDataApiSuccess(
      result,
      {
        status:
          result.failedCount ===
          0
            ? 200
            : result.successfulCount >
              0
              ? 207
              : 404,
      }
    );
  } catch (
    error
  ) {
    return marketDataApiError(
      error,
      400
    );
  }
}
