import type {
  MarketDataAssetType,
  MarketDataCapability,
  MarketDataExchange,
  MarketDataProviderDefinition,
  MarketDataProviderId,
  MarketDataRegion,
} from "./marketDataTypes";

const ALL_EQUITY_REGIONS: MarketDataRegion[] = [
  "AU",
  "US",
  "CA",
  "GB",
  "NZ",
  "EU",
  "HK",
  "JP",
  "GLOBAL",
];

const COMMON_ASSET_TYPES: MarketDataAssetType[] = [
  "EQUITY",
  "ETF",
  "FUND",
  "INDEX",
];

const COMMON_EXCHANGES: MarketDataExchange[] = [
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
  "OTC",
  "UNKNOWN",
];

export const DEFAULT_MARKET_DATA_PROVIDERS:
  MarketDataProviderDefinition[] = [
    {
      id: "YAHOO_FINANCE",
      name: "Yahoo Finance",
      enabled: true,
      priority: 10,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "DELAYED",
        },
        {
          capability: "QUOTE_BATCH",
          supported: true,
          latencyClass: "DELAYED",
        },
        {
          capability: "HISTORICAL_PRICE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
        {
          capability: "INTRADAY_PRICE",
          supported: true,
          latencyClass: "DELAYED",
        },
        {
          capability: "DIVIDENDS",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
        {
          capability: "COMPANY_PROFILE",
          supported: true,
          latencyClass: "UNKNOWN",
        },
      ],

      assetTypes: [
        ...COMMON_ASSET_TYPES,
        "FOREX",
        "CRYPTO",
        "COMMODITY",
      ],

      regions: ALL_EQUITY_REGIONS,

      exchanges: [
        ...COMMON_EXCHANGES,
        "FOREX",
        "CRYPTO",
      ],

      supportsBatch: true,
      maxBatchSize: 100,

      requiresApiKey: false,
      environmentKey: null,

      defaultTimeoutMs: 8_000,
      maxRetries: 2,

      rateLimitPerMinute: null,
      rateLimitPerDay: null,

      staleAfterSeconds: 900,
      expireAfterSeconds: 7_200,

      website: "https://finance.yahoo.com",
      notes:
        "Broad global coverage. Treat quote latency conservatively unless the response explicitly indicates real-time data.",
    },

    {
      id: "FINNHUB",
      name: "Finnhub",
      enabled: true,
      priority: 20,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "HISTORICAL_PRICE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
        {
          capability: "COMPANY_PROFILE",
          supported: true,
          latencyClass: "UNKNOWN",
        },
        {
          capability: "EXCHANGE_STATUS",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "FOREX_RATE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "CRYPTO_QUOTE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
      ],

      assetTypes: [
        ...COMMON_ASSET_TYPES,
        "FOREX",
        "CRYPTO",
      ],

      regions: [
        "US",
        "GLOBAL",
        "UNKNOWN",
      ],

      exchanges: [
        "NASDAQ",
        "NYSE",
        "NYSE_ARCA",
        "AMEX",
        "FOREX",
        "CRYPTO",
        "UNKNOWN",
      ],

      supportsBatch: false,
      maxBatchSize: 1,

      requiresApiKey: true,
      environmentKey: "FINNHUB_API_KEY",

      defaultTimeoutMs: 6_000,
      maxRetries: 2,

      rateLimitPerMinute: 60,
      rateLimitPerDay: null,

      staleAfterSeconds: 180,
      expireAfterSeconds: 1_800,

      website: "https://finnhub.io",
    },

    {
      id: "TWELVE_DATA",
      name: "Twelve Data",
      enabled: true,
      priority: 30,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "QUOTE_BATCH",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "HISTORICAL_PRICE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
        {
          capability: "INTRADAY_PRICE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "FOREX_RATE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "CRYPTO_QUOTE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
      ],

      assetTypes: [
        ...COMMON_ASSET_TYPES,
        "FOREX",
        "CRYPTO",
      ],

      regions: ALL_EQUITY_REGIONS,

      exchanges: [
        ...COMMON_EXCHANGES,
        "FOREX",
        "CRYPTO",
      ],

      supportsBatch: true,
      maxBatchSize: 120,

      requiresApiKey: true,
      environmentKey: "TWELVE_DATA_API_KEY",

      defaultTimeoutMs: 7_000,
      maxRetries: 2,

      rateLimitPerMinute: 8,
      rateLimitPerDay: 800,

      staleAfterSeconds: 180,
      expireAfterSeconds: 1_800,

      website: "https://twelvedata.com",
    },

    {
      id: "ALPHA_VANTAGE",
      name: "Alpha Vantage",
      enabled: true,
      priority: 40,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "DELAYED",
        },
        {
          capability: "HISTORICAL_PRICE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
        {
          capability: "INTRADAY_PRICE",
          supported: true,
          latencyClass: "DELAYED",
        },
        {
          capability: "FOREX_RATE",
          supported: true,
          latencyClass: "DELAYED",
        },
        {
          capability: "CRYPTO_QUOTE",
          supported: true,
          latencyClass: "DELAYED",
        },
      ],

      assetTypes: [
        ...COMMON_ASSET_TYPES,
        "FOREX",
        "CRYPTO",
      ],

      regions: [
        "US",
        "GLOBAL",
        "UNKNOWN",
      ],

      exchanges: [
        "NASDAQ",
        "NYSE",
        "NYSE_ARCA",
        "AMEX",
        "FOREX",
        "CRYPTO",
        "UNKNOWN",
      ],

      supportsBatch: false,
      maxBatchSize: 1,

      requiresApiKey: true,
      environmentKey: "ALPHA_VANTAGE_API_KEY",

      defaultTimeoutMs: 10_000,
      maxRetries: 1,

      rateLimitPerMinute: 5,
      rateLimitPerDay: 500,

      staleAfterSeconds: 900,
      expireAfterSeconds: 7_200,

      website: "https://www.alphavantage.co",
    },

    {
      id: "POLYGON",
      name: "Polygon",
      enabled: true,
      priority: 50,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "QUOTE_BATCH",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "HISTORICAL_PRICE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
        {
          capability: "INTRADAY_PRICE",
          supported: true,
          latencyClass: "REAL_TIME",
        },
        {
          capability: "EXCHANGE_STATUS",
          supported: true,
          latencyClass: "REAL_TIME",
        },
      ],

      assetTypes: [
        "EQUITY",
        "ETF",
        "INDEX",
        "FOREX",
        "CRYPTO",
      ],

      regions: [
        "US",
        "GLOBAL",
        "UNKNOWN",
      ],

      exchanges: [
        "NASDAQ",
        "NYSE",
        "NYSE_ARCA",
        "AMEX",
        "FOREX",
        "CRYPTO",
        "UNKNOWN",
      ],

      supportsBatch: true,
      maxBatchSize: 250,

      requiresApiKey: true,
      environmentKey: "POLYGON_API_KEY",

      defaultTimeoutMs: 6_000,
      maxRetries: 2,

      rateLimitPerMinute: 5,
      rateLimitPerDay: null,

      staleAfterSeconds: 120,
      expireAfterSeconds: 1_200,

      website: "https://polygon.io",
    },

    {
      id: "MARKETSTACK",
      name: "Marketstack",
      enabled: true,
      priority: 60,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "DELAYED",
        },
        {
          capability: "QUOTE_BATCH",
          supported: true,
          latencyClass: "DELAYED",
        },
        {
          capability: "HISTORICAL_PRICE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
        {
          capability: "INTRADAY_PRICE",
          supported: true,
          latencyClass: "DELAYED",
        },
      ],

      assetTypes: COMMON_ASSET_TYPES,
      regions: ALL_EQUITY_REGIONS,
      exchanges: COMMON_EXCHANGES,

      supportsBatch: true,
      maxBatchSize: 100,

      requiresApiKey: true,
      environmentKey: "MARKETSTACK_API_KEY",

      defaultTimeoutMs: 8_000,
      maxRetries: 2,

      rateLimitPerMinute: null,
      rateLimitPerDay: null,

      staleAfterSeconds: 900,
      expireAfterSeconds: 7_200,

      website: "https://marketstack.com",
    },

    {
      id: "STOOQ",
      name: "Stooq",
      enabled: true,
      priority: 70,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
        {
          capability: "HISTORICAL_PRICE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
      ],

      assetTypes: COMMON_ASSET_TYPES,

      regions: [
        "US",
        "EU",
        "GLOBAL",
        "UNKNOWN",
      ],

      exchanges: [
        "NASDAQ",
        "NYSE",
        "NYSE_ARCA",
        "AMEX",
        "LSE",
        "UNKNOWN",
      ],

      supportsBatch: false,
      maxBatchSize: 1,

      requiresApiKey: false,
      environmentKey: null,

      defaultTimeoutMs: 8_000,
      maxRetries: 1,

      rateLimitPerMinute: null,
      rateLimitPerDay: null,

      staleAfterSeconds: 86_400,
      expireAfterSeconds: 259_200,

      website: "https://stooq.com",
    },

    {
      id: "COINGECKO",
      name: "CoinGecko",
      enabled: true,
      priority: 25,

      capabilities: [
        {
          capability: "CRYPTO_QUOTE",
          supported: true,
          latencyClass: "INDICATIVE",
        },
        {
          capability: "QUOTE_BATCH",
          supported: true,
          latencyClass: "INDICATIVE",
        },
        {
          capability: "HISTORICAL_PRICE",
          supported: true,
          latencyClass: "END_OF_DAY",
        },
      ],

      assetTypes: [
        "CRYPTO",
      ],

      regions: [
        "GLOBAL",
        "UNKNOWN",
      ],

      exchanges: [
        "CRYPTO",
      ],

      supportsBatch: true,
      maxBatchSize: 250,

      requiresApiKey: false,
      environmentKey: "COINGECKO_API_KEY",

      defaultTimeoutMs: 8_000,
      maxRetries: 2,

      rateLimitPerMinute: 30,
      rateLimitPerDay: null,

      staleAfterSeconds: 300,
      expireAfterSeconds: 1_800,

      website: "https://www.coingecko.com",
    },

    {
      id: "MANUAL",
      name: "Manual Price",
      enabled: true,
      priority: 900,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "INDICATIVE",
          notes:
            "User-supplied price used only when external providers are unavailable.",
        },
      ],

      assetTypes: [
        "EQUITY",
        "ETF",
        "FUND",
        "INDEX",
        "FOREX",
        "CRYPTO",
        "COMMODITY",
        "UNKNOWN",
      ],

      regions: [
        "AU",
        "US",
        "CA",
        "GB",
        "NZ",
        "EU",
        "HK",
        "JP",
        "GLOBAL",
        "UNKNOWN",
      ],

      exchanges: [
        ...COMMON_EXCHANGES,
        "FOREX",
        "CRYPTO",
      ],

      supportsBatch: true,
      maxBatchSize: null,

      requiresApiKey: false,
      environmentKey: null,

      defaultTimeoutMs: 1_000,
      maxRetries: 0,

      rateLimitPerMinute: null,
      rateLimitPerDay: null,

      staleAfterSeconds: 86_400,
      expireAfterSeconds: 604_800,

      notes:
        "Last-resort fallback. Manual prices must always display an indicative or stale status.",
    },

    {
      id: "CACHE",
      name: "Market Data Cache",
      enabled: true,
      priority: 950,

      capabilities: [
        {
          capability: "QUOTE",
          supported: true,
          latencyClass: "UNKNOWN",
        },
        {
          capability: "QUOTE_BATCH",
          supported: true,
          latencyClass: "UNKNOWN",
        },
        {
          capability: "DIVIDENDS",
          supported: true,
          latencyClass: "UNKNOWN",
        },
      ],

      assetTypes: [
        "EQUITY",
        "ETF",
        "FUND",
        "INDEX",
        "FOREX",
        "CRYPTO",
        "COMMODITY",
        "UNKNOWN",
      ],

      regions: [
        "AU",
        "US",
        "CA",
        "GB",
        "NZ",
        "EU",
        "HK",
        "JP",
        "GLOBAL",
        "UNKNOWN",
      ],

      exchanges: [
        ...COMMON_EXCHANGES,
        "FOREX",
        "CRYPTO",
      ],

      supportsBatch: true,
      maxBatchSize: null,

      requiresApiKey: false,
      environmentKey: null,

      defaultTimeoutMs: 1_000,
      maxRetries: 0,

      rateLimitPerMinute: null,
      rateLimitPerDay: null,

      staleAfterSeconds: 900,
      expireAfterSeconds: 7_200,

      notes:
        "Cache is selected only after primary provider attempts or when explicitly requested.",
    },
  ];

export function providerById(
  id: MarketDataProviderId,
  providers:
    MarketDataProviderDefinition[] =
      DEFAULT_MARKET_DATA_PROVIDERS
): MarketDataProviderDefinition | null {
  return (
    providers.find(
      (
        provider
      ) =>
        provider.id === id
    ) ||
    null
  );
}

export function providerSupportsCapability(
  provider: MarketDataProviderDefinition,
  capability: MarketDataCapability
): boolean {
  return provider.capabilities.some(
    (
      item
    ) =>
      item.capability === capability &&
      item.supported
  );
}

export function providerSupportsAssetType(
  provider: MarketDataProviderDefinition,
  assetType: MarketDataAssetType
): boolean {
  return (
    provider.assetTypes.includes(
      assetType
    ) ||
    provider.assetTypes.includes(
      "UNKNOWN"
    )
  );
}

export function providerSupportsRegion(
  provider: MarketDataProviderDefinition,
  region: MarketDataRegion
): boolean {
  return (
    provider.regions.includes(
      region
    ) ||
    provider.regions.includes(
      "GLOBAL"
    ) ||
    provider.regions.includes(
      "UNKNOWN"
    )
  );
}

export function providerSupportsExchange(
  provider: MarketDataProviderDefinition,
  exchange: MarketDataExchange
): boolean {
  return (
    provider.exchanges.includes(
      exchange
    ) ||
    provider.exchanges.includes(
      "UNKNOWN"
    )
  );
}

export function providerApiKeyConfigured(
  provider: MarketDataProviderDefinition,
  environment:
    Record<string, string | undefined> =
      process.env
): boolean {
  if (
    !provider.requiresApiKey
  ) {
    return true;
  }

  if (
    !provider.environmentKey
  ) {
    return false;
  }

  const value =
    environment[
      provider.environmentKey
    ];

  return Boolean(
    value &&
    value.trim()
  );
}

export function enabledMarketDataProviders(
  providers:
    MarketDataProviderDefinition[] =
      DEFAULT_MARKET_DATA_PROVIDERS
): MarketDataProviderDefinition[] {
  return providers
    .filter(
      (
        provider
      ) =>
        provider.enabled
    )
    .sort(
      (
        left,
        right
      ) =>
        left.priority -
        right.priority
    );
}

export function providersForCapability(
  capability: MarketDataCapability,
  providers:
    MarketDataProviderDefinition[] =
      DEFAULT_MARKET_DATA_PROVIDERS
): MarketDataProviderDefinition[] {
  return enabledMarketDataProviders(
    providers
  ).filter(
    (
      provider
    ) =>
      providerSupportsCapability(
        provider,
        capability
      )
  );
}

export function updateProviderDefinition(
  id: MarketDataProviderId,
  patch:
    Partial<MarketDataProviderDefinition>,
  providers:
    MarketDataProviderDefinition[] =
      DEFAULT_MARKET_DATA_PROVIDERS
): MarketDataProviderDefinition[] {
  return providers.map(
    (
      provider
    ) =>
      provider.id === id
        ? {
            ...provider,
            ...patch,
            id:
              provider.id,
          }
        : provider
  );
}

export function disableProvider(
  id: MarketDataProviderId,
  providers:
    MarketDataProviderDefinition[] =
      DEFAULT_MARKET_DATA_PROVIDERS
): MarketDataProviderDefinition[] {
  return updateProviderDefinition(
    id,
    {
      enabled: false,
    },
    providers
  );
}

export function enableProvider(
  id: MarketDataProviderId,
  providers:
    MarketDataProviderDefinition[] =
      DEFAULT_MARKET_DATA_PROVIDERS
): MarketDataProviderDefinition[] {
  return updateProviderDefinition(
    id,
    {
      enabled: true,
    },
    providers
  );
}

export function setProviderPriority(
  id: MarketDataProviderId,
  priority: number,
  providers:
    MarketDataProviderDefinition[] =
      DEFAULT_MARKET_DATA_PROVIDERS
): MarketDataProviderDefinition[] {
  return updateProviderDefinition(
    id,
    {
      priority:
        Math.max(
          1,
          Math.round(
            priority
          )
        ),
    },
    providers
  );
}
