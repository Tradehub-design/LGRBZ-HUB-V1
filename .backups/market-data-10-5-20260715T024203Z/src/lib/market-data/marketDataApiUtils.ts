import {
  NextResponse,
} from "next/server";
import type {
  MarketDataAssetType,
  MarketDataExchange,
  MarketDataProviderId,
  MarketDataRegion,
} from "./marketDataTypes";

export type QuoteApiRequest = {
  symbol: string;

  assetType?: MarketDataAssetType;
  region?: MarketDataRegion;
  exchange?: MarketDataExchange;
  currency?: string | null;

  providers?: MarketDataProviderId[];

  forceRefresh?: boolean;
  compareProviders?: boolean;

  allowDelayed?: boolean;
  allowIndicative?: boolean;
  allowStale?: boolean;
  allowExpiredFallback?: boolean;

  minimumQualityScore?: number;
  maximumProviderAttempts?: number;
};

export type BatchQuoteApiRequest = {
  symbols: string[];

  assetType?: MarketDataAssetType;
  region?: MarketDataRegion;
  exchange?: MarketDataExchange;
  currency?: string | null;

  providers?: MarketDataProviderId[];

  forceRefresh?: boolean;
  compareProviders?: boolean;

  allowDelayed?: boolean;
  allowIndicative?: boolean;
  allowStale?: boolean;
  allowExpiredFallback?: boolean;

  minimumQualityScore?: number;
  maximumProviderAttempts?: number;

  concurrency?: number;
};

export type RefreshApiRequest = {
  symbols: string[];

  exchange?: MarketDataExchange;
  currency?: string | null;

  providers?: MarketDataProviderId[];

  priority?:
    | "CRITICAL"
    | "HIGH"
    | "NORMAL"
    | "LOW"
    | "BACKGROUND";

  compareProviders?: boolean;
  forceRefresh?: boolean;

  maximumRetries?: number;
};

const PROVIDERS:
  MarketDataProviderId[] = [
    "YAHOO_FINANCE",
    "ALPHA_VANTAGE",
    "FINNHUB",
    "TWELVE_DATA",
    "POLYGON",
    "MARKETSTACK",
    "STOOQ",
    "COINGECKO",
    "MANUAL",
    "CACHE",
    "UNKNOWN",
  ];

function booleanParam(
  value:
    string |
    null,
  fallback:
    boolean
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
    value.toLowerCase()
  );
}

function numberParam(
  value:
    string |
    null,
  fallback:
    number
): number {
  const parsed =
    Number(
      value
    );

  return Number.isFinite(
    parsed
  )
    ? parsed
    : fallback;
}

export function parseProviders(
  value:
    string |
    null
):
  MarketDataProviderId[] |
  undefined {
  if (
    !value
  ) {
    return undefined;
  }

  const providers =
    value
      .split(
        ","
      )
      .map(
        (
          provider
        ) =>
          provider
            .trim()
            .toUpperCase()
      )
      .filter(
        (
          provider
        ): provider is MarketDataProviderId =>
          PROVIDERS.includes(
            provider as
              MarketDataProviderId
          )
      );

  return providers.length >
    0
    ? providers
    : undefined;
}

export function parseQuoteRequest(
  url:
    URL
):
  QuoteApiRequest {
  const symbol =
    url.searchParams
      .get(
        "symbol"
      )
      ?.trim()
      .toUpperCase() ||
    "";

  if (
    !symbol
  ) {
    throw new Error(
      "A symbol query parameter is required."
    );
  }

  return {
    symbol,

    assetType:
      (
        url.searchParams
          .get(
            "assetType"
          )
          ?.toUpperCase() ||
        undefined
      ) as
        MarketDataAssetType |
        undefined,

    region:
      (
        url.searchParams
          .get(
            "region"
          )
          ?.toUpperCase() ||
        undefined
      ) as
        MarketDataRegion |
        undefined,

    exchange:
      (
        url.searchParams
          .get(
            "exchange"
          )
          ?.toUpperCase() ||
        undefined
      ) as
        MarketDataExchange |
        undefined,

    currency:
      url.searchParams
        .get(
          "currency"
        )
        ?.toUpperCase() ||
      null,

    providers:
      parseProviders(
        url.searchParams
          .get(
            "providers"
          )
      ),

    forceRefresh:
      booleanParam(
        url.searchParams
          .get(
            "forceRefresh"
          ),
        false
      ),

    compareProviders:
      booleanParam(
        url.searchParams
          .get(
            "compareProviders"
          ),
        false
      ),

    allowDelayed:
      booleanParam(
        url.searchParams
          .get(
            "allowDelayed"
          ),
        true
      ),

    allowIndicative:
      booleanParam(
        url.searchParams
          .get(
            "allowIndicative"
          ),
        false
      ),

    allowStale:
      booleanParam(
        url.searchParams
          .get(
            "allowStale"
          ),
        true
      ),

    allowExpiredFallback:
      booleanParam(
        url.searchParams
          .get(
            "allowExpiredFallback"
          ),
        false
      ),

    minimumQualityScore:
      numberParam(
        url.searchParams
          .get(
            "minimumQualityScore"
          ),
        45
      ),

    maximumProviderAttempts:
      numberParam(
        url.searchParams
          .get(
            "maximumProviderAttempts"
          ),
        4
      ),
  };
}

export function validateBatchQuoteRequest(
  value:
    unknown
):
  BatchQuoteApiRequest {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    throw new Error(
      "A JSON request body is required."
    );
  }

  const candidate =
    value as
      Partial<
        BatchQuoteApiRequest
      >;

  if (
    !Array.isArray(
      candidate.symbols
    )
  ) {
    throw new Error(
      "symbols must be an array."
    );
  }

  const symbols =
    Array.from(
      new Set(
        candidate.symbols
          .map(
            (
              symbol
            ) =>
              String(
                symbol
              )
                .trim()
                .toUpperCase()
          )
          .filter(
            Boolean
          )
      )
    );

  if (
    symbols.length ===
    0
  ) {
    throw new Error(
      "At least one symbol is required."
    );
  }

  if (
    symbols.length >
    250
  ) {
    throw new Error(
      "A maximum of 250 symbols may be requested at once."
    );
  }

  return {
    ...candidate,
    symbols,

    concurrency:
      Math.max(
        1,
        Math.min(
          candidate.concurrency ||
          6,
          20
        )
      ),
  };
}

export function validateRefreshRequest(
  value:
    unknown
):
  RefreshApiRequest {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    throw new Error(
      "A JSON request body is required."
    );
  }

  const candidate =
    value as
      Partial<
        RefreshApiRequest
      >;

  if (
    !Array.isArray(
      candidate.symbols
    )
  ) {
    throw new Error(
      "symbols must be an array."
    );
  }

  const symbols =
    Array.from(
      new Set(
        candidate.symbols
          .map(
            (
              symbol
            ) =>
              String(
                symbol
              )
                .trim()
                .toUpperCase()
          )
          .filter(
            Boolean
          )
      )
    );

  if (
    symbols.length ===
    0
  ) {
    throw new Error(
      "At least one symbol is required."
    );
  }

  if (
    symbols.length >
    500
  ) {
    throw new Error(
      "A maximum of 500 refresh jobs may be submitted at once."
    );
  }

  return {
    ...candidate,
    symbols,
  };
}

export function marketDataApiSuccess(
  data:
    unknown,
  options: {
    status?: number;
    cacheControl?: string;
  } = {}
):
  NextResponse {
  return NextResponse.json(
    {
      ok:
        true,

      generatedAt:
        new Date()
          .toISOString(),

      data,
    },
    {
      status:
        options.status ||
        200,

      headers: {
        "Cache-Control":
          options.cacheControl ||
          "no-store",

        "X-LGRBZ-Market-Data":
          "v2",
      },
    }
  );
}

export function marketDataApiError(
  error:
    unknown,
  status =
    500
):
  NextResponse {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown market-data API error.";

  return NextResponse.json(
    {
      ok:
        false,

      generatedAt:
        new Date()
          .toISOString(),

      error: {
        code:
          status >=
          500
            ? "MARKET_DATA_API_ERROR"
            : "INVALID_REQUEST",

        message,
      },
    },
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",

        "X-LGRBZ-Market-Data":
          "v2",
      },
    }
  );
}
