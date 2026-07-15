import type {
  MarketDataExchange,
  NormalisedMarketSymbol,
  QuoteRequestSecurity,
} from "./marketDataTypes";

const EXCHANGE_ALIASES: Record<
  string,
  MarketDataExchange
> = {
  ASX: "ASX",
  XASX: "ASX",
  AU: "ASX",
  AUSTRALIA: "ASX",

  NASDAQ: "NASDAQ",
  XNAS: "NASDAQ",
  NAS: "NASDAQ",

  NYSE: "NYSE",
  XNYS: "NYSE",

  NYSEARCA: "NYSE_ARCA",
  ARCA: "NYSE_ARCA",

  LSE: "LSE",
  XLON: "LSE",
  LONDON: "LSE",

  TSX: "TSX",
  XTSE: "TSX",
  TORONTO: "TSX",

  HKEX: "HKEX",
  XHKG: "HKEX",
  HONGKONG: "HKEX",
};

const EXCHANGE_SUFFIXES: Array<{
  suffix: string;
  exchange: MarketDataExchange;
  currency: string;
}> = [
  {
    suffix: ".AX",
    exchange: "ASX",
    currency: "AUD",
  },
  {
    suffix: ".L",
    exchange: "LSE",
    currency: "GBP",
  },
  {
    suffix: ".TO",
    exchange: "TSX",
    currency: "CAD",
  },
  {
    suffix: ".HK",
    exchange: "HKEX",
    currency: "HKD",
  },
];

const US_EXCHANGES =
  new Set<MarketDataExchange>([
    "NASDAQ",
    "NYSE",
    "NYSE_ARCA",
  ]);

function cleanSymbol(
  value: string
) {
  return value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^\$/, "");
}

function normaliseExchange(
  value?: string | null
): MarketDataExchange {
  if (!value) {
    return "UNKNOWN";
  }

  const cleaned =
    value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, "");

  return (
    EXCHANGE_ALIASES[
      cleaned
    ] ?? "UNKNOWN"
  );
}

function inferFromSuffix(
  symbol: string
) {
  return EXCHANGE_SUFFIXES.find(
    (entry) =>
      symbol.endsWith(
        entry.suffix
      )
  );
}

function defaultCurrency(
  exchange: MarketDataExchange
) {
  if (exchange === "ASX") {
    return "AUD";
  }

  if (
    US_EXCHANGES.has(
      exchange
    )
  ) {
    return "USD";
  }

  if (exchange === "LSE") {
    return "GBP";
  }

  if (exchange === "TSX") {
    return "CAD";
  }

  if (exchange === "HKEX") {
    return "HKD";
  }

  return "AUD";
}

function addProviderSuffix(
  symbol: string,
  exchange: MarketDataExchange
) {
  if (
    inferFromSuffix(
      symbol
    )
  ) {
    return symbol;
  }

  if (exchange === "ASX") {
    return `${symbol}.AX`;
  }

  if (exchange === "LSE") {
    return `${symbol}.L`;
  }

  if (exchange === "TSX") {
    return `${symbol}.TO`;
  }

  if (exchange === "HKEX") {
    return `${symbol}.HK`;
  }

  return symbol;
}

function removeKnownSuffix(
  symbol: string
) {
  const suffix =
    inferFromSuffix(
      symbol
    );

  if (!suffix) {
    return symbol;
  }

  return symbol.slice(
    0,
    -suffix.suffix.length
  );
}

export function normaliseMarketSymbol(
  security: QuoteRequestSecurity
): NormalisedMarketSymbol {
  const originalSymbol =
    security.symbol;

  const cleaned =
    cleanSymbol(
      security.providerSymbol ||
      security.symbol
    );

  const suffix =
    inferFromSuffix(
      cleaned
    );

  const requestedExchange =
    normaliseExchange(
      security.exchange
    );

  const exchange =
    suffix?.exchange ??
    requestedExchange;

  const resolvedExchange =
    exchange === "UNKNOWN" &&
    cleaned.endsWith(".AX")
      ? "ASX"
      : exchange;

  const currency =
    (
      security.currency ||
      suffix?.currency ||
      defaultCurrency(
        resolvedExchange
      )
    )
      .trim()
      .toUpperCase();

  const providerSymbol =
    addProviderSuffix(
      cleaned,
      resolvedExchange
    );

  return {
    originalSymbol,
    canonicalSymbol:
      providerSymbol,
    providerSymbol,
    displaySymbol:
      removeKnownSuffix(
        providerSymbol
      ),
    exchange:
      resolvedExchange,
    currency,
  };
}

export function normaliseMarketSymbols(
  securities: QuoteRequestSecurity[]
) {
  const deduplicated =
    new Map<
      string,
      NormalisedMarketSymbol
    >();

  for (
    const security of
    securities
  ) {
    if (
      !security.symbol?.trim()
    ) {
      continue;
    }

    const normalised =
      normaliseMarketSymbol(
        security
      );

    deduplicated.set(
      normalised.canonicalSymbol,
      normalised
    );
  }

  return Array.from(
    deduplicated.values()
  );
}

export function createMarketSymbolKey(
  symbol: string
) {
  return cleanSymbol(
    symbol
  );
}
