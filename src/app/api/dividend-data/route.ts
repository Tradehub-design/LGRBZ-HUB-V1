import {
  NextRequest,
  NextResponse,
} from "next/server";
import {
  getDividendIntelligence,
} from "@/lib/dividend-data";
import type {
  DividendIntelligenceRequest,
  DividendIntelligenceResponse,
} from "@/lib/dividend-data";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

const MAX_HOLDINGS =
  250;

function errorResponse(
  message: string,
  status: number
) {
  return NextResponse.json(
    {
      ok: false,
      events: [],
      eligibility: [],
      summary: {
        currency:
          "AUD",
        trailingTwelveMonthIncome:
          0,
        forwardTwelveMonthIncome:
          0,
        announcedForwardIncome:
          0,
        forecastForwardIncome:
          0,
        receivedCurrentFinancialYear:
          0,
        projectedFrankingCredits:
          0,
        portfolioDividendYield:
          null,
        portfolioYieldOnCost:
          null,
        nextEvent:
          null,
        monthlyForecast: [],
        holdingSummaries: [],
        eventCount:
          0,
        announcedEventCount:
          0,
        forecastEventCount:
          0,
        receivedEventCount:
          0,
        generatedAt:
          new Date().toISOString(),
      },
      providersUsed: [],
      unresolvedSymbols: [],
      message,
    } satisfies DividendIntelligenceResponse,
    {
      status,
      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json() as
        DividendIntelligenceRequest;

    const holdingCount =
      body.holdings?.length ||
      body.securities?.length ||
      0;

    if (
      holdingCount === 0
    ) {
      return errorResponse(
        "At least one holding or security is required.",
        400
      );
    }

    if (
      holdingCount >
      MAX_HOLDINGS
    ) {
      return errorResponse(
        `A maximum of ${MAX_HOLDINGS} holdings may be requested.`,
        400
      );
    }

    const result =
      await getDividendIntelligence(
        body
      );

    return NextResponse.json(
      result,
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Dividend intelligence request failed.",
      500
    );
  }
}
