import {
  type NextRequest,
} from "next/server";
import {
  createMarketDataRefreshDiagnosticSummary,
  getSharedMarketDataRefreshCoordinator,
  marketDataApiError,
  marketDataApiSuccess,
  validateRefreshRequest,
} from "@/lib/market-data";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export async function GET() {
  try {
    return marketDataApiSuccess(
      createMarketDataRefreshDiagnosticSummary()
    );
  } catch (
    error
  ) {
    return marketDataApiError(
      error
    );
  }
}

export async function POST(
  request:
    NextRequest
) {
  try {
    const body =
      await request.json();

    const input =
      validateRefreshRequest(
        body
      );

    const coordinator =
      getSharedMarketDataRefreshCoordinator();

    const jobs =
      coordinator.submitMany(
        input.symbols.map(
          (
            symbol
          ) => ({
            symbol,

            exchange:
              input.exchange,

            currency:
              input.currency,

            providerPreference:
              input.providers,

            priority:
              input.priority ||
              "NORMAL",

            trigger:
              "API",

            compareProviders:
              input.compareProviders,

            forceRefresh:
              input.forceRefresh ??
              true,

            maximumRetries:
              input.maximumRetries,
          })
        )
      );

    return marketDataApiSuccess(
      {
        submitted:
          jobs.length,

        jobs,
      },
      {
        status:
          202,
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
