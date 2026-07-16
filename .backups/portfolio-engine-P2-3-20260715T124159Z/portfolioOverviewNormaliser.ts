export type ProfessionalOverviewHolding = {
  symbol: string;
  name: string;

  quantity: number;

  averageCost: number | null;
  costBasis: number;
  currentPrice: number | null;
  marketValue: number;

  gainLoss: number;
  gainLossPercent: number | null;

  portfolioWeight: number;

  annualDividendIncome: number;
  dividendYield: number | null;

  sector: string;
  industry: string;
  country: string;
  currency: string;

  quoteQuality: number | null;
  quoteStatus: string;

  original: unknown;
};

export type ProfessionalOverviewSector = {
  sector: string;

  holdingCount: number;

  marketValue: number;
  costBasis: number;
  gainLoss: number;

  weight: number;

  annualDividendIncome: number;
};

export type ProfessionalPortfolioOverview = {
  holdings: ProfessionalOverviewHolding[];

  sectors: ProfessionalOverviewSector[];

  totals: {
    holdingCount: number;

    marketValue: number;
    costBasis: number;

    gainLoss: number;
    gainLossPercent: number | null;

    annualDividendIncome: number;
    monthlyDividendIncome: number;

    dividendYield: number | null;

    topHoldingWeight: number;
    topFiveWeight: number;

    profitableHoldingCount: number;
    losingHoldingCount: number;

    pricedHoldingCount: number;
    pricingCoverage: number;

    averageQuoteQuality: number;

    sectorCount: number;
    countryCount: number;
  };

  largestHolding: ProfessionalOverviewHolding | null;
  bestPerformer: ProfessionalOverviewHolding | null;
  worstPerformer: ProfessionalOverviewHolding | null;
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

function normaliseHolding(
  value: unknown
): Omit<
  ProfessionalOverviewHolding,
  "portfolioWeight"
> | null {
  const source = record(value);

  const symbol = text(
    source,
    [
      "symbol",
      "ticker",
      "code",
      "asset",
      "instrument",
    ]
  )
    .trim()
    .toUpperCase();

  if (!symbol) {
    return null;
  }

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
    ) || 0;

  const averageCost =
    numeric(
      source,
      [
        "averageCost",
        "averagePrice",
        "averageBuyPrice",
        "avgCost",
        "unitCost",
      ]
    );

  const explicitCostBasis =
    numeric(
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

  const costBasis =
    explicitCostBasis ??
    (
      averageCost !== null
        ? averageCost *
          quantity
        : 0
    );

  const currentPrice =
    numeric(
      source,
      [
        "livePrice",
        "currentPrice",
        "marketPrice",
        "price",
        "lastPrice",
        "close",
      ]
    );

  const explicitMarketValue =
    numeric(
      source,
      [
        "marketValueAud",
        "marketValue",
        "currentValue",
        "positionValue",
        "liveMarketValue",
      ]
    );

  const marketValue =
    explicitMarketValue ??
    (
      currentPrice !== null
        ? currentPrice *
          quantity
        : costBasis
    );

  const gainLoss =
    numeric(
      source,
      [
        "gainLoss",
        "unrealisedGainLoss",
        "unrealizedGainLoss",
        "profitLoss",
        "pnl",
      ]
    ) ??
    (
      marketValue -
      costBasis
    );

  const gainLossPercent =
    numeric(
      source,
      [
        "gainLossPercent",
        "returnPercent",
        "unrealisedGainLossPercent",
        "unrealizedGainLossPercent",
        "pnlPercent",
      ]
    ) ??
    safePercent(
      gainLoss,
      costBasis
    );

  const annualDividendIncome =
    numeric(
      source,
      [
        "annualDividendIncome",
        "projectedAnnualIncome",
        "forwardAnnualIncome",
        "annualIncome",
      ]
    ) ??
    (
      (
        numeric(
          source,
          [
            "annualDividendPerShare",
            "forwardAnnualDividend",
            "dividendRate",
          ]
        ) ||
        0
      ) *
      quantity
    );

  const dividendYield =
    numeric(
      source,
      [
        "dividendYield",
        "forwardYield",
        "currentYield",
      ]
    ) ??
    safePercent(
      annualDividendIncome,
      marketValue
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

    averageCost,
    costBasis,
    currentPrice,
    marketValue,

    gainLoss,
    gainLossPercent,

    annualDividendIncome,
    dividendYield,

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

    country:
      text(
        source,
        [
          "country",
          "domicile",
          "region",
        ]
      ) ||
      "Unknown",

    currency:
      text(
        source,
        [
          "currency",
          "tradingCurrency",
          "localCurrency",
        ]
      )
        .toUpperCase() ||
      "AUD",

    quoteQuality:
      numeric(
        source,
        [
          "quoteQuality",
          "qualityScore",
          "priceQuality",
        ]
      ),

    quoteStatus:
      text(
        source,
        [
          "quoteStatus",
          "priceStatus",
          "freshness",
        ]
      ) ||
      (
        currentPrice !== null
          ? "PRICED"
          : "ESTIMATED"
      ),

    original:
      value,
  };
}

export function calculateProfessionalPortfolioOverview(
  values: readonly unknown[]
): ProfessionalPortfolioOverview {
  const preliminary = values
    .map(
      normaliseHolding
    )
    .filter(
      (
        holding
      ): holding is NonNullable<
        ReturnType<
          typeof normaliseHolding
        >
      > =>
        Boolean(holding)
    );

  const marketValue =
    preliminary.reduce(
      (
        total,
        holding
      ) =>
        total +
        holding.marketValue,
      0
    );

  const holdings:
    ProfessionalOverviewHolding[] =
      preliminary.map(
        (
          holding
        ) => ({
          ...holding,

          portfolioWeight:
            marketValue > 0
              ? (
                  holding.marketValue /
                  marketValue
                ) *
                100
              : 0,
        })
      );

  const costBasis =
    holdings.reduce(
      (
        total,
        holding
      ) =>
        total +
        holding.costBasis,
      0
    );

  const gainLoss =
    marketValue -
    costBasis;

  const annualDividendIncome =
    holdings.reduce(
      (
        total,
        holding
      ) =>
        total +
        holding.annualDividendIncome,
      0
    );

  const sortedByWeight =
    [...holdings].sort(
      (
        left,
        right
      ) =>
        right.portfolioWeight -
        left.portfolioWeight
    );

  const sortedByPerformance =
    holdings
      .filter(
        (
          holding
        ) =>
          holding.gainLossPercent !==
          null
      )
      .sort(
        (
          left,
          right
        ) =>
          (
            right.gainLossPercent ||
            0
          ) -
          (
            left.gainLossPercent ||
            0
          )
      );

  const sectorMap = new Map<
    string,
    ProfessionalOverviewSector
  >();

  for (const holding of holdings) {
    const existing =
      sectorMap.get(
        holding.sector
      ) || {
        sector:
          holding.sector,

        holdingCount: 0,

        marketValue: 0,
        costBasis: 0,
        gainLoss: 0,

        weight: 0,

        annualDividendIncome: 0,
      };

    existing.holdingCount +=
      1;

    existing.marketValue +=
      holding.marketValue;

    existing.costBasis +=
      holding.costBasis;

    existing.gainLoss +=
      holding.gainLoss;

    existing.annualDividendIncome +=
      holding.annualDividendIncome;

    sectorMap.set(
      holding.sector,
      existing
    );
  }

  const sectors =
    Array.from(
      sectorMap.values()
    )
      .map(
        (
          sector
        ) => ({
          ...sector,

          weight:
            marketValue > 0
              ? (
                  sector.marketValue /
                  marketValue
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

  const pricedHoldings =
    holdings.filter(
      (
        holding
      ) =>
        holding.currentPrice !==
        null
    );

  const quoteQualityValues =
    holdings
      .map(
        (
          holding
        ) =>
          holding.quoteQuality
      )
      .filter(
        (
          value
        ): value is number =>
          value !== null
      );

  return {
    holdings,
    sectors,

    totals: {
      holdingCount:
        holdings.length,

      marketValue,
      costBasis,

      gainLoss,

      gainLossPercent:
        safePercent(
          gainLoss,
          costBasis
        ),

      annualDividendIncome,

      monthlyDividendIncome:
        annualDividendIncome /
        12,

      dividendYield:
        safePercent(
          annualDividendIncome,
          marketValue
        ),

      topHoldingWeight:
        sortedByWeight[0]
          ?.portfolioWeight ||
        0,

      topFiveWeight:
        sortedByWeight
          .slice(
            0,
            5
          )
          .reduce(
            (
              total,
              holding
            ) =>
              total +
              holding.portfolioWeight,
            0
          ),

      profitableHoldingCount:
        holdings.filter(
          (
            holding
          ) =>
            holding.gainLoss >
            0
        ).length,

      losingHoldingCount:
        holdings.filter(
          (
            holding
          ) =>
            holding.gainLoss <
            0
        ).length,

      pricedHoldingCount:
        pricedHoldings.length,

      pricingCoverage:
        holdings.length > 0
          ? (
              pricedHoldings.length /
              holdings.length
            ) *
            100
          : 100,

      averageQuoteQuality:
        average(
          quoteQualityValues
        ),

      sectorCount:
        new Set(
          holdings.map(
            (
              holding
            ) =>
              holding.sector
          )
        ).size,

      countryCount:
        new Set(
          holdings.map(
            (
              holding
            ) =>
              holding.country
          )
        ).size,
    },

    largestHolding:
      sortedByWeight[0] ||
      null,

    bestPerformer:
      sortedByPerformance[0] ||
      null,

    worstPerformer:
      sortedByPerformance[
        sortedByPerformance.length -
        1
      ] ||
      null,
  };
}
