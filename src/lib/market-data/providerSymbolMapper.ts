import type {
  MarketDataAssetType,
  MarketDataExchange,
  MarketDataProviderId,
  MarketDataRegion,
  MarketDataSymbol,
} from "./marketDataTypes";

const EXCHANGE_SUFFIX:
  Partial<
    Record<
      MarketDataExchange,
      string
    >
  > = {
    ASX:
      ".AX",

    LSE:
      ".L",

    TSX:
      ".TO",

    NZX:
      ".NZ",

    HKEX:
      ".HK",
  };

function cleanSymbol(
  value: string
): string {
  return value
    .trim()
    .toUpperCase()
    .replace(
      /\s+/g,
      ""
    );
}

export function inferExchangeFromSymbol(
  symbol: string
): MarketDataExchange {
  const normalised =
    cleanSymbol(
      symbol
    );

  if (
    normalised.endsWith(
      ".AX"
    )
  ) {
    return "ASX";
  }

  if (
    normalised.endsWith(
      ".L"
    )
  ) {
    return "LSE";
  }

  if (
    normalised.endsWith(
      ".TO"
    )
  ) {
    return "TSX";
  }

  if (
    normalised.endsWith(
      ".NZ"
    )
  ) {
    return "NZX";
  }

  if (
    normalised.endsWith(
      ".HK"
    )
  ) {
    return "HKEX";
  }

  if (
    normalised.includes(
      "/"
    ) ||
    normalised.includes(
      "=X"
    )
  ) {
    return "FOREX";
  }

  if (
    normalised.includes(
      "-"
    ) &&
    (
      normalised.endsWith(
        "-USD"
      ) ||
      normalised.endsWith(
        "-AUD"
      )
    )
  ) {
    return "CRYPTO";
  }

  return "UNKNOWN";
}

export function inferRegionFromExchange(
  exchange: MarketDataExchange
): MarketDataRegion {
  const map:
    Partial<
      Record<
        MarketDataExchange,
        MarketDataRegion
      >
    > = {
    ASX:
      "AU",

    NASDAQ:
      "US",

    NYSE:
      "US",

    NYSE_ARCA:
      "US",

    AMEX:
      "US",

    TSX:
      "CA",

    LSE:
      "GB",

    NZX:
      "NZ",

    HKEX:
      "HK",

    TSE:
      "JP",

    FOREX:
      "GLOBAL",

    CRYPTO:
      "GLOBAL",
  };

  return map[
    exchange
  ] ||
    "UNKNOWN";
}

export function inferAssetTypeFromSymbol(
  symbol: string,
  exchange: MarketDataExchange
): MarketDataAssetType {
  const normalised =
    cleanSymbol(
      symbol
    );

  if (
    exchange ===
    "FOREX" ||
    normalised.endsWith(
      "=X"
    )
  ) {
    return "FOREX";
  }

  if (
    exchange ===
    "CRYPTO"
  ) {
    return "CRYPTO";
  }

  return "EQUITY";
}

export function createMarketDataSymbol(
  rawSymbol: string,
  options: {
    exchange?: MarketDataExchange;
    region?: MarketDataRegion;
    assetType?: MarketDataAssetType;
    currency?: string | null;
    provider?: MarketDataProviderId;
  } = {}
): MarketDataSymbol {
  const raw =
    cleanSymbol(
      rawSymbol
    );

  const exchange =
    options.exchange &&
    options.exchange !==
      "UNKNOWN"
      ? options.exchange
      : inferExchangeFromSymbol(
          raw
        );

  const region =
    options.region &&
    options.region !==
      "UNKNOWN"
      ? options.region
      : inferRegionFromExchange(
          exchange
        );

  const assetType =
    options.assetType &&
    options.assetType !==
      "UNKNOWN"
      ? options.assetType
      : inferAssetTypeFromSymbol(
          raw,
          exchange
        );

  const canonical =
    addExchangeSuffix(
      removeKnownExchangeSuffix(
        raw
      ),
      exchange
    );

  return {
    raw,
    canonical,
    display:
      removeKnownExchangeSuffix(
        canonical
      ),

    providerSymbol:
      options.provider
        ? mapSymbolForProvider(
            canonical,
            options.provider,
            exchange
          )
        : canonical,

    assetType,
    region,
    exchange,
    currency:
      options.currency ||
      null,
  };
}

export function removeKnownExchangeSuffix(
  symbol: string
): string {
  return cleanSymbol(
    symbol
  ).replace(
    /\.(AX|L|TO|NZ|HK)$/i,
    ""
  );
}

export function addExchangeSuffix(
  symbol: string,
  exchange: MarketDataExchange
): string {
  const clean =
    removeKnownExchangeSuffix(
      symbol
    );

  const suffix =
    EXCHANGE_SUFFIX[
      exchange
    ];

  if (
    !suffix
  ) {
    return clean;
  }

  return `${clean}${suffix}`;
}

export function mapSymbolForProvider(
  symbol: string,
  provider: MarketDataProviderId,
  exchange: MarketDataExchange
): string {
  const canonical =
    addExchangeSuffix(
      symbol,
      exchange
    );

  const clean =
    removeKnownExchangeSuffix(
      canonical
    );

  if (
    provider ===
    "YAHOO_FINANCE"
  ) {
    return canonical;
  }

  if (
    provider ===
    "FINNHUB"
  ) {
    if (
      exchange ===
      "ASX"
    ) {
      return `${clean}.AX`;
    }

    return clean;
  }

  if (
    provider ===
    "TWELVE_DATA"
  ) {
    if (
      exchange ===
      "ASX"
    ) {
      return `${clean}:ASX`;
    }

    if (
      exchange ===
      "LSE"
    ) {
      return `${clean}:LSE`;
    }

    if (
      exchange ===
      "TSX"
    ) {
      return `${clean}:TSX`;
    }

    return clean;
  }

  if (
    provider ===
    "ALPHA_VANTAGE"
  ) {
    if (
      exchange ===
      "ASX"
    ) {
      return `${clean}.AX`;
    }

    return clean;
  }

  return canonical;
}

export function symbolForProvider(
  symbol: MarketDataSymbol,
  provider: MarketDataProviderId
): MarketDataSymbol {
  return {
    ...symbol,

    providerSymbol:
      mapSymbolForProvider(
        symbol.canonical,
        provider,
        symbol.exchange
      ),
  };
}
