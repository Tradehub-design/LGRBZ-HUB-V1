import {
  NextRequest,
  NextResponse,
} from "next/server";
import type {
  QuoteApiRequest,
  QuoteApiResponse,
  QuoteRequestSecurity,
} from "@/lib/market-data";
import {
  getMarketQuotes,
  getProviderHealth,
} from "@/lib/market-data";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

const MAX_SYMBOLS =
  120;

function isRecord(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    Boolean(value) &&
    typeof value ===
      "object" &&
    !Array.isArray(value)
  );
}

function normaliseRequestSecurity(
  value: unknown
): QuoteRequestSecurity | null {
  if (
    typeof value ===
    "string"
  ) {
    const symbol =
      value.trim();

    return symbol
      ? {
          symbol,
        }
      : null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const symbol =
    typeof value.symbol ===
      "string"
      ? value.symbol.trim()
      : "";

  if (!symbol) {
    return null;
  }

  return {
    symbol,
    exchange:
      typeof value.exchange ===
        "string"
        ? value.exchange
        : null,
    currency:
      typeof value.currency ===
        "string"
        ? value.currency
        : null,
    providerSymbol:
      typeof value.providerSymbol ===
        "string"
        ? value.providerSymbol
        : null,
  };
}

function createErrorResponse(
  message: string,
  status: number
) {
  return NextResponse.json(
    {
      ok: false,
      message,
      batch: {
        quotes: [],
        requestedSymbols: [],
        resolvedSymbols: [],
        unresolvedSymbols: [],
        provider:
          "unavailable",
        providersUsed: [],
        requestedAt:
          new Date().toISOString(),
        completedAt:
          new Date().toISOString(),
        durationMs: 0,
        cacheHits: 0,
        providerRequests: 0,
        successCount: 0,
        failureCount: 0,
      },
      providerHealth:
        getProviderHealth(),
    } satisfies QuoteApiResponse,
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
        Partial<
          QuoteApiRequest
        > & {
          symbols?: unknown[];
        };

    const source =
      Array.isArray(
        body.securities
      )
        ? body.securities
        : Array.isArray(
              body.symbols
            )
          ? body.symbols
          : [];

    const securities =
      source
        .map(
          normaliseRequestSecurity
        )
        .filter(
          (
            security
          ): security is QuoteRequestSecurity =>
            Boolean(
              security
            )
        );

    if (
      securities.length ===
      0
    ) {
      return createErrorResponse(
        "At least one valid symbol is required.",
        400
      );
    }

    if (
      securities.length >
      MAX_SYMBOLS
    ) {
      return createErrorResponse(
        `A maximum of ${MAX_SYMBOLS} symbols may be requested at once.`,
        400
      );
    }

    const batch =
      await getMarketQuotes(
        securities,
        {
          forceRefresh:
            Boolean(
              body.forceRefresh
            ),
        }
      );

    return NextResponse.json(
      {
        ok: true,
        batch,
        providerHealth:
          getProviderHealth(),
      } satisfies QuoteApiResponse,
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "The market quote request failed.",
      500
    );
  }
}

export async function GET(
  request: NextRequest
) {
  const symbols =
    request.nextUrl.searchParams
      .get("symbols")
      ?.split(",")
      .map(
        (symbol) =>
          symbol.trim()
      )
      .filter(Boolean) ??
    [];

  if (
    symbols.length ===
    0
  ) {
    return createErrorResponse(
      "Provide comma-separated symbols using ?symbols=AAPL,BHP.AX.",
      400
    );
  }

  if (
    symbols.length >
    MAX_SYMBOLS
  ) {
    return createErrorResponse(
      `A maximum of ${MAX_SYMBOLS} symbols may be requested at once.`,
      400
    );
  }

  const forceRefresh =
    request.nextUrl.searchParams.get(
      "refresh"
    ) === "1";

  const batch =
    await getMarketQuotes(
      symbols.map(
        (symbol) => ({
          symbol,
        })
      ),
      {
        forceRefresh,
      }
    );

  return NextResponse.json(
    {
      ok: true,
      batch,
      providerHealth:
        getProviderHealth(),
    } satisfies QuoteApiResponse,
    {
      headers: {
        "Cache-Control":
          "no-store, max-age=0",
      },
    }
  );
}
