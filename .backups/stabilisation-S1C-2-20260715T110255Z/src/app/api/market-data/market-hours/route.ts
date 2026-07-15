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




const callMarketDataApiError =
  marketDataApiError as unknown as (
    ...args: unknown[]
  ) => unknown;
const runMarketHoursDiagnosticSummary =
  createMarketHoursDiagnosticSummary as (
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
        getMarketClock(
          exchange
        )
      );
    }

    return marketDataApiSuccess(
      runMarketHoursDiagnosticSummary()
    );
  } catch (
    error
  ) {
    return callMarketDataApiError(
      error,
      400
    );
  }
}
    return marketDataApiError(
      error,
      400
    );
  }
}
