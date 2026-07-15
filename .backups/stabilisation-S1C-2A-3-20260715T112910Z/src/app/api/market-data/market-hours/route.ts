import {
  type NextRequest,
} from "next/server";
import {
  createMarketHoursDiagnosticSummary,
  getMarketClock,
  marketDataApiError,
  marketDataApiSuccess,
} from "@/lib/market-data";
import type {
  MarketDataExchange,
} from "@/lib/market-data";







const callMarketHoursDiagnosticSummary =
  createMarketHoursDiagnosticSummary as unknown as (
    ...args: unknown[]
  ) => unknown;

const callMarketSessionSnapshot =
  createMarketSessionSnapshot as unknown as (
    ...args: unknown[]
  ) => unknown;
export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export async function GET(
  request:
    NextRequest
) {
  try {
    const exchange =
      request.nextUrl
        .searchParams
        .get(
          "exchange"
        )
        ?.trim()
        .toUpperCase() as
          MarketDataExchange |
          undefined;

    if (
      exchange
    ) {
      return marketDataApiSuccess(
        getMarketClock(
          exchange
        )
      );
    }

    return marketDataApiSuccess(
      callMarketHoursDiagnosticSummary()
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
