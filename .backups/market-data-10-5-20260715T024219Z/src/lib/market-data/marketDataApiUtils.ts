import {
  NextResponse,
} from "next/server";
import type {
  MarketDataExchange,
  MarketDataProviderId,
} from "./marketDataTypes";

export type MarketDataApiErrorBody = {
  ok: false;

  error: {
    code: string;
    message: string;
    details?: unknown;
  };

  generatedAt: string;
};

export function marketDataApiError(
  code: string,
  message: string,
  status:
    number,
  details?: unknown
) {
  const body:
    MarketDataApiErrorBody = {
    ok:
      false,

    error: {
      code,
      message,

      ...(details ===
      undefined
        ? {}
        : {
            details,
          }),
    },

    generatedAt:
      new Date()
        .toISOString(),
  };

  return NextResponse.json(
    body,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}

export function marketDataApiSuccess<T>(
  data: T,
  options: {
    status?: number;
    cacheControl?: string;
  } = {}
) {
  return NextResponse.json(
    {
      ok:
        true,

      data,

      generatedAt:
        new Date()
          .toISOString(),
    },
    {
      status:
        options.status ||
        200,

      headers: {
        "Cache-Control":
          options.cacheControl ||
          "no-store",
      },
    }
  );
}

export function parseBoolean(
  value:
    string |
    null,
  fallback =
    false
): boolean {
  if (
    value ===
    null
  ) {
    return fallback;
  }

  return [
    "1",
    "true",
    "yes",
    "on",
  ].includes(
    value
      .trim()
      .toLowerCase()
  );
}

export function parseNumber(
  value:
    string |
    null,
  fallback:
    number,
  minimum:
    number,
  maximum:
    number
): number {
  const parsed =
    Number(
      value
    );

  if (
    !Number.isFinite(
      parsed
    )
  ) {
    return fallback;
  }

  return Math.max(
    minimum,
    Math.min(
      maximum,
      parsed
    )
  );
}

export function parseSymbols(
  value:
    string |
    string[] |
    null |
    undefined
): string[] {
  const values =
    Array.isArray(
      value
    )
      ? value
      : String(
          value ||
          ""
        ).split(
          ","
        );

  return Array.from(
    new Set(
      values
        .map(
          (
            symbol
          ) =>
            symbol
              .trim()
              .toUpperCase()
        )
        .filter(
          Boolean
        )
    )
  );
}

export function parseProviderList(
  value:
    string |
    string[] |
    null |
    undefined
): MarketDataProviderId[] {
  return parseSymbols(
    value
  ) as
    MarketDataProviderId[];
}

export function parseExchange(
  value:
    string |
    null |
    undefined
): MarketDataExchange {
  const exchange =
    String(
      value ||
      "UNKNOWN"
    )
      .trim()
      .toUpperCase();

  const allowed:
    MarketDataExchange[] = [
    "ASX",
    "NASDAQ",
    "NYSE",
    "NYSE_ARCA",
    "AMEX",
    "TSX",
    "LSE",
    "NZX",
    "HKEX",
    "TSE",
    "CRYPTO",
    "FOREX",
    "OTC",
    "UNKNOWN",
  ];

  return allowed.includes(
    exchange as
      MarketDataExchange
  )
    ? exchange as
        MarketDataExchange
    : "UNKNOWN";
}

export async function safeJsonBody(
  request:
    Request
): Promise<
  Record<string, unknown>
> {
  try {
    const body =
      await request.json();

    if (
      !body ||
      typeof body !==
      "object" ||
      Array.isArray(
        body
      )
    ) {
      return {};
    }

    return body as
      Record<
        string,
        unknown
      >;
  } catch {
    return {};
  }
}
