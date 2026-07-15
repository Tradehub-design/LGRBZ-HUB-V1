import type {
  MarketDataExchange,
  MarketDataProviderId,
  NormalisedMarketQuote,
  QuoteFreshness,
} from "../marketDataTypes";

export type PortfolioLiveSourcePosition = {
  symbol: string;

  name: string;

  quantity: number;

  costBasis: number | null;
  existingMarketValue: number | null;

  sector: string;
  industry: string;
  currency: string;
  exchange: MarketDataExchange;

  account: string;
  broker: string;

  original: unknown;
};

export type PortfolioLiveValuation = {
  symbol: string;
  name: string;

  quantity: number;

  costBasis: number | null;

  livePrice: number | null;
  previousClose: number | null;

  liveMarketValue: number | null;
  existingMarketValue: number | null;

  unrealisedGainLoss: number | null;
  unrealisedGainLossPercent: number | null;

  dailyChange: number | null;
  dailyChangePercent: number | null;
  dailyValueChange: number | null;

  portfolioWeight: number;

  sector: string;
  industry: string;
  currency: string;
  exchange: MarketDataExchange;

  account: string;
  broker: string;

  provider: MarketDataProviderId | null;
  freshness: QuoteFreshness | null;

  qualityScore: number | null;
  confidenceScore: number | null;

  marketState: string | null;

  delayed: boolean;
  stale: boolean;
  expired: boolean;
  indicative: boolean;
  usable: boolean;

  quoteTimestamp: string | null;

  quote: NormalisedMarketQuote | null;

  original: unknown;
};

export type PortfolioLiveAllocationBucket = {
  key: string;
  label: string;

  liveMarketValue: number;
  costBasis: number;

  positionCount: number;
  pricedPositionCount: number;

  weight: number;

  unrealisedGainLoss: number;
  unrealisedGainLossPercent: number | null;
};

export type PortfolioLiveProviderBucket = {
  provider: string;
  positionCount: number;
  marketValue: number;
  weight: number;
};

export type PortfolioLiveFreshnessBucket = {
  freshness: string;
  positionCount: number;
  marketValue: number;
  weight: number;
};

export type PortfolioLiveRecalculation = {
  generatedAt: string;

  positions: PortfolioLiveValuation[];

  totals: {
    positionCount: number;
    pricedPositionCount: number;
    unpricedPositionCount: number;

    pricingCoveragePercent: number;
    marketValueCoveragePercent: number;

    liveMarketValue: number;
    existingMarketValue: number;
    costBasis: number;

    unrealisedGainLoss: number;
    unrealisedGainLossPercent: number | null;

    dailyValueChange: number;
    dailyChangePercent: number | null;

    averageQualityScore: number;
    averageConfidenceScore: number;

    delayedPositionCount: number;
    stalePositionCount: number;
    expiredPositionCount: number;
    indicativePositionCount: number;
    unusablePositionCount: number;

    topHoldingWeight: number;
    topFiveWeight: number;
  };

  bestDailyMover: PortfolioLiveValuation | null;
  worstDailyMover: PortfolioLiveValuation | null;

  sectorAllocation: PortfolioLiveAllocationBucket[];
  industryAllocation: PortfolioLiveAllocationBucket[];
  currencyAllocation: PortfolioLiveAllocationBucket[];
  exchangeAllocation: PortfolioLiveAllocationBucket[];
  accountAllocation: PortfolioLiveAllocationBucket[];
  brokerAllocation: PortfolioLiveAllocationBucket[];

  providerDistribution: PortfolioLiveProviderBucket[];
  freshnessDistribution: PortfolioLiveFreshnessBucket[];

  warnings: string[];
};

type UnknownRecord = Record<string, unknown>;

function record(
  value: unknown
): UnknownRecord {
  return (
    value &&
    typeof value === "object"
      ? value
      : {}
  ) as UnknownRecord;
}

function text(
  source: UnknownRecord,
  keys: string[]
): string {
  for (const key of keys) {
    const value = source[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function numeric(
  source: UnknownRecord,
  keys: string[]
): number | null {
  for (const key of keys) {
    const raw = source[key];

    if (
      raw === null ||
      raw === undefined ||
      raw === ""
    ) {
      continue;
    }

    const value = Number(raw);

    if (Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function normaliseSymbol(
  value: string
): string {
  return value
    .trim()
    .toUpperCase();
}

function inferExchange(
  symbol: string,
  source: UnknownRecord
): MarketDataExchange {
  const explicit = text(
    source,
    [
      "exchange",
      "market",
      "listingExchange",
    ]
  ).toUpperCase();

  const supported: MarketDataExchange[] = [
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

  if (
    supported.includes(
      explicit as MarketDataExchange
    )
  ) {
    return explicit as MarketDataExchange;
  }

  if (symbol.endsWith(".AX")) {
    return "ASX";
  }

  if (symbol.endsWith(".L")) {
    return "LSE";
  }

  if (symbol.endsWith(".TO")) {
    return "TSX";
  }

  if (symbol.endsWith(".NZ")) {
    return "NZX";
  }

  if (symbol.endsWith(".HK")) {
    return "HKEX";
  }

  if (
    symbol.endsWith("=X") ||
    symbol.includes("/")
  ) {
    return "FOREX";
  }

  if (
    symbol.endsWith("-USD") ||
    [
      "BTC",
      "ETH",
      "SOL",
      "XRP",
    ].includes(symbol)
  ) {
    return "CRYPTO";
  }

  return "UNKNOWN";
}

function inferredCurrency(
  symbol: string,
  source: UnknownRecord,
  exchange: MarketDataExchange
): string {
  const explicit = text(
    source,
    [
      "currency",
      "tradingCurrency",
      "localCurrency",
    ]
  ).toUpperCase();

  if (explicit) {
    return explicit;
  }

  const exchangeCurrency: Partial<
    Record<MarketDataExchange, string>
  > = {
    ASX: "AUD",
    NASDAQ: "USD",
    NYSE: "USD",
    NYSE_ARCA: "USD",
    AMEX: "USD",
    TSX: "CAD",
    LSE: "GBP",
    NZX: "NZD",
    HKEX: "HKD",
    TSE: "JPY",
    OTC: "USD",
  };

  if (
    symbol.endsWith("-USD")
  ) {
    return "USD";
  }

  return (
    exchangeCurrency[exchange] ||
    "AUD"
  );
}

function safePercent(
  numerator: number,
  denominator: number
): number | null {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0
  ) {
    return null;
  }

  return (
    numerator /
    denominator
  ) * 100;
}

function average(
  values: number[]
): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (
        total,
        value
      ) =>
        total +
        value,
      0
    ) /
    values.length
  );
}

function round(
  value: number,
  digits = 4
): number {
  const multiplier =
    10 ** digits;

  return (
    Math.round(
      value *
      multiplier
    ) /
    multiplier
  );
}

export function normalisePortfolioLivePosition(
  value: unknown
): PortfolioLiveSourcePosition | null {
  const source = record(value);

  const symbol = normaliseSymbol(
    text(
      source,
      [
        "symbol",
        "ticker",
        "code",
        "asset",
        "instrument",
      ]
    )
  );

  if (!symbol) {
    return null;
  }

  const exchange = inferExchange(
    symbol,
    source
  );

  const quantity =
    numeric(
      source,
      [
        "quantity",
        "units",
        "shares",
        "openQuantity",
        "remainingQuantity",
      ]
    ) ||
    0;

  const costBasis = numeric(
    source,
    [
      "costBaseAud",
      "costBasis",
      "costBasisAud",
      "totalCost",
      "investedAmount",
      "bookValue",
    ]
  );

  const existingMarketValue = numeric(
    source,
    [
      "marketValueAud",
      "marketValue",
      "currentValue",
      "positionValue",
    ]
  );

  return {
    symbol,

    name:
      text(
        source,
        [
          "name",
          "companyName",
          "securityName",
          "description",
        ]
      ) ||
      symbol,

    quantity,

    costBasis,
    existingMarketValue,

    sector:
      text(
        source,
        [
          "sector",
          "gicsSector",
          "assetClass",
        ]
      ) ||
      "Unclassified",

    industry:
      text(
        source,
        [
          "industry",
          "gicsIndustry",
          "subIndustry",
        ]
      ) ||
      "Unclassified",

    currency:
      inferredCurrency(
        symbol,
        source,
        exchange
      ),

    exchange,

    account:
      text(
        source,
        [
          "account",
          "accountName",
          "portfolio",
        ]
      ) ||
      "Default",

    broker:
      text(
        source,
        [
          "broker",
          "brokerName",
          "platform",
        ]
      ) ||
      "Unspecified",

    original:
      value,
  };
}

function allocationBuckets(
  positions: PortfolioLiveValuation[],
  selector: (
    position: PortfolioLiveValuation
  ) => string,
  totalMarketValue: number
): PortfolioLiveAllocationBucket[] {
  const buckets = new Map<
    string,
    PortfolioLiveAllocationBucket
  >();

  for (const position of positions) {
    const label =
      selector(position) ||
      "Unclassified";

    const current =
      buckets.get(label) || {
        key:
          label
            .trim()
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            ),

        label,

        liveMarketValue: 0,
        costBasis: 0,

        positionCount: 0,
        pricedPositionCount: 0,

        weight: 0,

        unrealisedGainLoss: 0,
        unrealisedGainLossPercent: null,
      };

    current.positionCount += 1;

    if (
      position.liveMarketValue !==
      null
    ) {
      current.pricedPositionCount += 1;
      current.liveMarketValue +=
        position.liveMarketValue;
    }

    current.costBasis +=
      position.costBasis || 0;

    current.unrealisedGainLoss =
      current.liveMarketValue -
      current.costBasis;

    current.unrealisedGainLossPercent =
      safePercent(
        current.unrealisedGainLoss,
        current.costBasis
      );

    buckets.set(
      label,
      current
    );
  }

  return Array.from(
    buckets.values()
  )
    .map(
      (
        bucket
      ) => ({
        ...bucket,

        weight:
          totalMarketValue > 0
            ? (
                bucket.liveMarketValue /
                totalMarketValue
              ) *
              100
            : 0,
      })
    )
    .sort(
      (
        left,
        right
      ) =>
        right.liveMarketValue -
        left.liveMarketValue
    );
}

function providerBuckets(
  positions: PortfolioLiveValuation[],
  totalMarketValue: number
): PortfolioLiveProviderBucket[] {
  const rows = new Map<
    string,
    PortfolioLiveProviderBucket
  >();

  for (const position of positions) {
    const provider =
      position.provider ||
      "UNPRICED";

    const current =
      rows.get(provider) || {
        provider,
        positionCount: 0,
        marketValue: 0,
        weight: 0,
      };

    current.positionCount += 1;
    current.marketValue +=
      position.liveMarketValue || 0;

    rows.set(
      provider,
      current
    );
  }

  return Array.from(
    rows.values()
  )
    .map(
      (
        row
      ) => ({
        ...row,

        weight:
          totalMarketValue > 0
            ? (
                row.marketValue /
                totalMarketValue
              ) *
              100
            : 0,
      })
    )
    .sort(
      (
        left,
        right
      ) =>
        right.marketValue -
        left.marketValue
    );
}

function freshnessBuckets(
  positions: PortfolioLiveValuation[],
  totalMarketValue: number
): PortfolioLiveFreshnessBucket[] {
  const rows = new Map<
    string,
    PortfolioLiveFreshnessBucket
  >();

  for (const position of positions) {
    const freshness =
      position.freshness ||
      "UNPRICED";

    const current =
      rows.get(freshness) || {
        freshness,
        positionCount: 0,
        marketValue: 0,
        weight: 0,
      };

    current.positionCount += 1;
    current.marketValue +=
      position.liveMarketValue || 0;

    rows.set(
      freshness,
      current
    );
  }

  return Array.from(
    rows.values()
  )
    .map(
      (
        row
      ) => ({
        ...row,

        weight:
          totalMarketValue > 0
            ? (
                row.marketValue /
                totalMarketValue
              ) *
              100
            : 0,
      })
    )
    .sort(
      (
        left,
        right
      ) =>
        right.marketValue -
        left.marketValue
    );
}

export function calculatePortfolioLiveRecalculation({
  positions,
  quoteBySymbol,
}: {
  positions: PortfolioLiveSourcePosition[];

  quoteBySymbol: Record<
    string,
    NormalisedMarketQuote | null
  >;
}): PortfolioLiveRecalculation {
  const initialPositions =
    positions.map(
      (
        position
      ): PortfolioLiveValuation => {
        const quote =
          quoteBySymbol[
            position.symbol
          ] ||
          null;

        const livePrice =
          quote?.price ??
          null;

        const liveMarketValue =
          livePrice !== null
            ? position.quantity *
              livePrice
            : null;

        const unrealisedGainLoss =
          liveMarketValue !== null &&
          position.costBasis !== null
            ? liveMarketValue -
              position.costBasis
            : null;

        const unrealisedGainLossPercent =
          unrealisedGainLoss !== null &&
          position.costBasis !== null
            ? safePercent(
                unrealisedGainLoss,
                position.costBasis
              )
            : null;

        const dailyValueChange =
          quote?.change !== null &&
          quote?.change !== undefined
            ? quote.change *
              position.quantity
            : null;

        return {
          ...position,

          livePrice,

          previousClose:
            quote?.previousClose ??
            null,

          liveMarketValue,

          unrealisedGainLoss,
          unrealisedGainLossPercent,

          dailyChange:
            quote?.change ??
            null,

          dailyChangePercent:
            quote?.changePercent ??
            null,

          dailyValueChange,

          portfolioWeight: 0,

          provider:
            quote?.provider ||
            null,

          freshness:
            quote?.freshness ||
            null,

          qualityScore:
            quote?.qualityScore ??
            null,

          confidenceScore:
            quote?.confidenceScore ??
            null,

          marketState:
            quote?.marketState ||
            null,

          delayed:
            quote?.isDelayed ||
            false,

          stale:
            quote?.isStale ||
            false,

          expired:
            quote?.isExpired ||
            false,

          indicative:
            quote?.isIndicative ||
            false,

          usable:
            quote?.isUsable ||
            false,

          quoteTimestamp:
            quote?.quoteTimestamp ||
            null,

          quote,
        };
      }
    );

  const liveMarketValue =
    initialPositions.reduce(
      (
        total,
        position
      ) =>
        total +
        (
          position.liveMarketValue ||
          0
        ),
      0
    );

  const valuedPositions =
    initialPositions.map(
      (
        position
      ) => ({
        ...position,

        portfolioWeight:
          liveMarketValue > 0 &&
          position.liveMarketValue !==
            null
            ? (
                position.liveMarketValue /
                liveMarketValue
              ) *
              100
            : 0,
      })
    );

  const pricedPositions =
    valuedPositions.filter(
      (
        position
      ) =>
        position.liveMarketValue !==
        null
    );

  const costBasis =
    valuedPositions.reduce(
      (
        total,
        position
      ) =>
        total +
        (
          position.costBasis ||
          0
        ),
      0
    );

  const existingMarketValue =
    valuedPositions.reduce(
      (
        total,
        position
      ) =>
        total +
        (
          position.existingMarketValue ||
          0
        ),
      0
    );

  const unrealisedGainLoss =
    liveMarketValue -
    costBasis;

  const dailyValueChange =
    valuedPositions.reduce(
      (
        total,
        position
      ) =>
        total +
        (
          position.dailyValueChange ||
          0
        ),
      0
    );

  const previousPortfolioValue =
    liveMarketValue -
    dailyValueChange;

  const sortedMovers =
    pricedPositions
      .filter(
        (
          position
        ) =>
          position.dailyChangePercent !==
          null
      )
      .sort(
        (
          left,
          right
        ) =>
          (
            right.dailyChangePercent ||
            0
          ) -
          (
            left.dailyChangePercent ||
            0
          )
      );

  const sortedWeights =
    [...valuedPositions].sort(
      (
        left,
        right
      ) =>
        right.portfolioWeight -
        left.portfolioWeight
    );

  const topFiveWeight =
    sortedWeights
      .slice(
        0,
        5
      )
      .reduce(
        (
          total,
          position
        ) =>
          total +
          position.portfolioWeight,
        0
      );

  const warnings: string[] = [];

  const unpricedCount =
    valuedPositions.length -
    pricedPositions.length;

  const delayedCount =
    valuedPositions.filter(
      (
        position
      ) =>
        position.delayed
    ).length;

  const staleCount =
    valuedPositions.filter(
      (
        position
      ) =>
        position.stale
    ).length;

  const expiredCount =
    valuedPositions.filter(
      (
        position
      ) =>
        position.expired
    ).length;

  if (unpricedCount > 0) {
    warnings.push(
      `${unpricedCount} position${
        unpricedCount === 1
          ? ""
          : "s"
      } could not be live-priced.`
    );
  }

  if (delayedCount > 0) {
    warnings.push(
      `${delayedCount} position${
        delayedCount === 1
          ? ""
          : "s"
      } use delayed provider data.`
    );
  }

  if (staleCount > 0) {
    warnings.push(
      `${staleCount} position${
        staleCount === 1
          ? ""
          : "s"
      } use stale provider data.`
    );
  }

  if (expiredCount > 0) {
    warnings.push(
      `${expiredCount} position${
        expiredCount === 1
          ? ""
          : "s"
      } have expired quotes.`
    );
  }

  if (
    sortedWeights[0] &&
    sortedWeights[0].portfolioWeight >
      25
  ) {
    warnings.push(
      `${sortedWeights[0].symbol} represents ${sortedWeights[0].portfolioWeight.toFixed(
        1
      )}% of the live-priced portfolio.`
    );
  }

  if (topFiveWeight > 75) {
    warnings.push(
      `The five largest positions represent ${topFiveWeight.toFixed(
        1
      )}% of the live-priced portfolio.`
    );
  }

  return {
    generatedAt:
      new Date()
        .toISOString(),

    positions:
      valuedPositions,

    totals: {
      positionCount:
        valuedPositions.length,

      pricedPositionCount:
        pricedPositions.length,

      unpricedPositionCount:
        unpricedCount,

      pricingCoveragePercent:
        valuedPositions.length > 0
          ? (
              pricedPositions.length /
              valuedPositions.length
            ) *
            100
          : 100,

      marketValueCoveragePercent:
        existingMarketValue > 0
          ? (
              liveMarketValue /
              existingMarketValue
            ) *
            100
          : valuedPositions.length > 0
            ? (
                pricedPositions.length /
                valuedPositions.length
              ) *
              100
            : 100,

      liveMarketValue,
      existingMarketValue,
      costBasis,

      unrealisedGainLoss,

      unrealisedGainLossPercent:
        safePercent(
          unrealisedGainLoss,
          costBasis
        ),

      dailyValueChange,

      dailyChangePercent:
        safePercent(
          dailyValueChange,
          previousPortfolioValue
        ),

      averageQualityScore:
        round(
          average(
            pricedPositions
              .map(
                (
                  position
                ) =>
                  position.qualityScore
              )
              .filter(
                (
                  value
                ): value is number =>
                  value !== null
              )
          ),
          2
        ),

      averageConfidenceScore:
        round(
          average(
            pricedPositions
              .map(
                (
                  position
                ) =>
                  position.confidenceScore
              )
              .filter(
                (
                  value
                ): value is number =>
                  value !== null
              )
          ),
          2
        ),

      delayedPositionCount:
        delayedCount,

      stalePositionCount:
        staleCount,

      expiredPositionCount:
        expiredCount,

      indicativePositionCount:
        valuedPositions.filter(
          (
            position
          ) =>
            position.indicative
        ).length,

      unusablePositionCount:
        valuedPositions.filter(
          (
            position
          ) =>
            !position.usable
        ).length,

      topHoldingWeight:
        sortedWeights[0]
          ?.portfolioWeight ||
        0,

      topFiveWeight,
    },

    bestDailyMover:
      sortedMovers[0] ||
      null,

    worstDailyMover:
      sortedMovers[
        sortedMovers.length -
        1
      ] ||
      null,

    sectorAllocation:
      allocationBuckets(
        valuedPositions,
        (
          position
        ) =>
          position.sector,
        liveMarketValue
      ),

    industryAllocation:
      allocationBuckets(
        valuedPositions,
        (
          position
        ) =>
          position.industry,
        liveMarketValue
      ),

    currencyAllocation:
      allocationBuckets(
        valuedPositions,
        (
          position
        ) =>
          position.currency,
        liveMarketValue
      ),

    exchangeAllocation:
      allocationBuckets(
        valuedPositions,
        (
          position
        ) =>
          position.exchange,
        liveMarketValue
      ),

    accountAllocation:
      allocationBuckets(
        valuedPositions,
        (
          position
        ) =>
          position.account,
        liveMarketValue
      ),

    brokerAllocation:
      allocationBuckets(
        valuedPositions,
        (
          position
        ) =>
          position.broker,
        liveMarketValue
      ),

    providerDistribution:
      providerBuckets(
        valuedPositions,
        liveMarketValue
      ),

    freshnessDistribution:
      freshnessBuckets(
        valuedPositions,
        liveMarketValue
      ),

    warnings:
      Array.from(
        new Set(
          warnings
        )
      ),
  };
}
