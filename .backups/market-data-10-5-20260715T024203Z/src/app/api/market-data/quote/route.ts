import {
  type NextRequest,
} from "next/server";
import {
  marketDataApiError,
  marketDataApiSuccess,
  parseQuoteRequest,
  resolveMarketQuote,
} from "@/lib/market-data";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export async function GET(
  request:
    NextRequest
) {
  try {
    const input =
      parseQuoteRequest(
        request.nextUrl
      );

    const result =
      await resolveMarketQuote({
        symbol:
          input.symbol,

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
      });

    return marketDataApiSuccess(
      result,
      {
        status:
          result.successful
            ? 200
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
