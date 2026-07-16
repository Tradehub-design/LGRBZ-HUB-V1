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

  largestHolding:
    ProfessionalOverviewHolding | null;

  bestPerformer:
    ProfessionalOverviewHolding | null;

  worstPerformer:
    ProfessionalOverviewHolding | null;
};

type UnknownRecord =
  Record<string, unknown>;

function record(
  value: unknown,
): UnknownRecord {
  return (
    value &&
    typeof value === "object"
      ? value
      : {}
  ) as UnknownRecord;
}

function nestedRecord(
  source: UnknownRecord,
  key: string,
): UnknownRecord {
  return record(
    source[key],
  );
}

function text(
  sources: readonly UnknownRecord[],
  keys: readonly string[],
): string {
  for (const source of sources) {
    for (const key of keys) {
      const value =
        source[key];

      if (
        typeof value === "string" &&
        value.trim()
      ) {
        return value.trim();
      }
    }
  }

  return "";
}

function numeric(
  sources: readonly UnknownRecord[],
  keys: readonly string[],
): number | null {
  for (const source of sources) {
    for (const key of keys) {
      const raw =
        source[key];

      if (
        raw === null ||
        raw === undefined ||
        raw === ""
      ) {
        continue;
      }

      const value =
        Number(raw);

      if (
        Number.isFinite(value)
      ) {
        return value;
      }
    }
  }

  return null;
}

function safePercent(
  numerator: number,
  denominator: number,
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
  values: readonly number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (
        total,
        value,
      ) =>
        total +
        value,
      0,
    ) /
    values.length
  );
}

function quoteStatusLabel(
  sources: readonly UnknownRecord[],
): string {
  const explicitStatus =
    text(
      sources,
      [
        "quoteStatus",
        "priceStatus",
        "freshness",
      ],
    );

  if (explicitStatus) {
    return explicitStatus
      .toUpperCase();
  }

  const source =
    text(
      sources,
      [
        "quoteSource",
        "source",
      ],
    )
      .toUpperCase();

  switch (source) {
    case "LIVE":
      return "LIVE";

    case "CACHE":
      return "DELAYED CACHE";

    case "PREVIOUS_CLOSE":
      return "PREVIOUS CLOSE";

    case "TRANSACTION_FALLBACK":
      return "ESTIMATED TRANSACTION";

    case "UNAVAILABLE":
      return "UNAVAILABLE";

    default:
      return source || "UNAVAILABLE";
  }
}

function quoteQualityScore(
  quoteStatus: string,
  suppliedQuality: number | null,
): number | null {
  if (
    suppliedQuality !== null &&
    Number.isFinite(
      suppliedQuality,
    )
  ) {
    return suppliedQuality;
  }

  const status =
    quoteStatus.toUpperCase();

  if (status.includes("LIVE")) {
    return 100;
  }

  if (
    status.includes("CACHE") ||
    status.includes("DELAYED")
  ) {
    return 80;
  }

  if (
    status.includes("PREVIOUS")
  ) {
    return 70;
  }

  if (
    status.includes("TRANSACTION") ||
    status.includes("ESTIMATED")
  ) {
    return 40;
  }

  if (
    status.includes("UNAVAILABLE")
  ) {
    return 0;
  }

  return null;
}

function normaliseHolding(
  value: unknown,
): Omit<
  ProfessionalOverviewHolding,
  "portfolioWeight"
> & {
  suppliedPortfolioWeight:
    number | null;
} | null {
  const source =
    record(value);

  const metrics =
    nestedRecord(
      source,
      "metrics",
    );

  const valuation =
    nestedRecord(
      source,
      "valuation",
    );

  const security =
    nestedRecord(
      source,
      "security",
    );

  const classification =
    nestedRecord(
      source,
      "classification",
    );

  const sources = [
    source,
    metrics,
    valuation,
    security,
    classification,
  ];

  const symbol =
    text(
      sources,
      [
        "symbol",
        "ticker",
        "assetTicker",
        "code",
        "asset",
        "instrument",
      ],
    )
      .trim()
      .toUpperCase();

  if (!symbol) {
    return null;
  }

  const quantity =
    Math.max(
      0,
      numeric(
        sources,
        [
          "quantity",
          "units",
          "shares",
          "openQuantity",
          "remainingQuantity",
        ],
      ) ?? 0,
    );

  const averageCost =
    numeric(
      sources,
      [
        "averageCostAud",
        "averagePriceAud",
        "averageCost",
        "averagePrice",
        "averageBuyPrice",
        "avgCost",
        "unitCost",
      ],
    );

  const costBasis =
    Math.max(
      0,
      numeric(
        sources,
        [
          "costBaseAud",
          "totalCostAud",
          "costBasis",
          "costBasisAud",
          "totalCost",
          "investedAmount",
          "bookValue",
        ],
      ) ??
      (
        averageCost !== null
          ? averageCost *
            quantity
          : 0
      ),
    );

  const currentPrice =
    numeric(
      sources,
      [
        "marketPriceAud",
        "priceAud",
        "marketPrice",
        "livePrice",
        "currentPrice",
        "price",
        "lastPrice",
        "close",
      ],
    );

  const explicitMarketValue =
    numeric(
      sources,
      [
        "marketValueAud",
        "valueAud",
        "marketValue",
        "currentValue",
        "positionValue",
        "liveMarketValue",
      ],
    );

  /**
   * Missing prices remain unavailable.
   * Cost base is never substituted as current market value.
   */
  const marketValue =
    Math.max(
      0,
      explicitMarketValue ??
      (
        currentPrice !== null &&
        currentPrice > 0
          ? currentPrice *
            quantity
          : 0
      ),
    );

  const gainLoss =
    numeric(
      sources,
      [
        "unrealisedPlAud",
        "unrealisedGainAud",
        "unrealizedGainAud",
        "gainLoss",
        "unrealisedGainLoss",
        "unrealizedGainLoss",
        "profitLoss",
        "pnl",
        "unrealisedProfit",
      ],
    ) ??
    (
      marketValue > 0
        ? marketValue -
          costBasis
        : 0
    );

  const gainLossPercent =
    numeric(
      sources,
      [
        "unrealisedPlPercent",
        "unrealisedGainPercent",
        "unrealizedGainPercent",
        "gainLossPercent",
        "returnPercent",
        "unrealisedGainLossPercent",
        "unrealizedGainLossPercent",
        "pnlPercent",
        "unrealisedPercent",
      ],
    ) ??
    (
      marketValue > 0
        ? safePercent(
            gainLoss,
            costBasis,
          )
        : null
    );

  /**
   * Only explicit future/annual forecast fields are annualised.
   * dividendsAud is historical received income and is intentionally excluded.
   */
  const annualDividendIncome =
    Math.max(
      0,
      numeric(
        sources,
        [
          "forecastAnnualIncomeAud",
          "projectedAnnualIncomeAud",
          "forwardAnnualIncomeAud",
          "annualDividendIncomeAud",
          "annualDividendIncome",
          "projectedAnnualIncome",
          "forwardAnnualIncome",
          "annualIncome",
        ],
      ) ??
      (
        (
          numeric(
            sources,
            [
              "annualDividendPerShareAud",
              "annualDividendPerShare",
              "forwardAnnualDividend",
              "dividendRate",
            ],
          ) ?? 0
        ) *
        quantity
      ),
    );

  const dividendYield =
    numeric(
      sources,
      [
        "forecastDividendYield",
        "dividendYield",
        "forwardYield",
        "currentYield",
      ],
    ) ??
    (
      marketValue > 0 &&
      annualDividendIncome > 0
        ? safePercent(
            annualDividendIncome,
            marketValue,
          )
        : null
    );

  const quoteStatus =
    quoteStatusLabel(
      sources,
    );

  const suppliedPortfolioWeight =
    numeric(
      sources,
      [
        "portfolioWeightPercent",
        "weightPercent",
        "portfolioWeight",
        "allocationPercent",
      ],
    );

  return {
    symbol,

    name:
      text(
        sources,
        [
          "name",
          "company",
          "companyName",
          "securityName",
          "description",
        ],
      ) ||
      symbol,

    quantity,

    averageCost,

    costBasis,

    currentPrice:
      currentPrice !== null &&
      currentPrice > 0
        ? currentPrice
        : null,

    marketValue,

    gainLoss,

    gainLossPercent,

    annualDividendIncome,

    dividendYield,

    sector:
      text(
        sources,
        [
          "sector",
          "gicsSector",
          "assetClass",
        ],
      ) ||
      "Unclassified",

    industry:
      text(
        sources,
        [
          "industry",
          "gicsIndustry",
          "subIndustry",
        ],
      ) ||
      "Unclassified",

    country:
      text(
        sources,
        [
          "country",
          "domicile",
          "region",
        ],
      ) ||
      "Unknown",

    currency:
      text(
        sources,
        [
          "currency",
          "tradingCurrency",
          "localCurrency",
        ],
      )
        .toUpperCase() ||
      "AUD",

    quoteQuality:
      quoteQualityScore(
        quoteStatus,
        numeric(
          sources,
          [
            "quoteQuality",
            "qualityScore",
            "priceQuality",
          ],
        ),
      ),

    quoteStatus,

    suppliedPortfolioWeight,

    original:
      value,
  };
}

export function calculateProfessionalPortfolioOverview(
  values: readonly unknown[],
): ProfessionalPortfolioOverview {
  const preliminary =
    values
      .map(
        normaliseHolding,
      )
      .filter(
        (
          holding,
        ): holding is NonNullable<
          ReturnType<
            typeof normaliseHolding
          >
        > =>
          Boolean(holding),
      );

  const totalMarketValue =
    preliminary.reduce(
      (
        total,
        holding,
      ) =>
        total +
        holding.marketValue,
      0,
    );

  const hasCompleteSuppliedWeights =
    preliminary.length > 0 &&
    preliminary.every(
      (holding) =>
        holding.suppliedPortfolioWeight !== null &&
        Number.isFinite(
          holding.suppliedPortfolioWeight,
        ),
    );

  const holdings:
    ProfessionalOverviewHolding[] =
      preliminary.map(
        ({
          suppliedPortfolioWeight,
          ...holding
        }) => ({
          ...holding,

          portfolioWeight:
            hasCompleteSuppliedWeights
              ? suppliedPortfolioWeight ?? 0
              : (
                  totalMarketValue > 0
                    ? (
                        holding.marketValue /
                        totalMarketValue
                      ) *
                      100
                    : 0
                ),
        }),
      );

  const totalCostBasis =
    holdings.reduce(
      (
        total,
        holding,
      ) =>
        total +
        holding.costBasis,
      0,
    );

  const totalGainLoss =
    holdings.reduce(
      (
        total,
        holding,
      ) =>
        total +
        holding.gainLoss,
      0,
    );

  const annualDividendIncome =
    holdings.reduce(
      (
        total,
        holding,
      ) =>
        total +
        holding.annualDividendIncome,
      0,
    );

  const sectorsByName =
    new Map<
      string,
      ProfessionalOverviewSector
    >();

  for (const holding of holdings) {
    const existing =
      sectorsByName.get(
        holding.sector,
      );

    if (existing) {
      existing.holdingCount += 1;
      existing.marketValue +=
        holding.marketValue;
      existing.costBasis +=
        holding.costBasis;
      existing.gainLoss +=
        holding.gainLoss;
      existing.weight +=
        holding.portfolioWeight;
      existing.annualDividendIncome +=
        holding.annualDividendIncome;

      continue;
    }

    sectorsByName.set(
      holding.sector,
      {
        sector:
          holding.sector,

        holdingCount: 1,

        marketValue:
          holding.marketValue,

        costBasis:
          holding.costBasis,

        gainLoss:
          holding.gainLoss,

        weight:
          holding.portfolioWeight,

        annualDividendIncome:
          holding.annualDividendIncome,
      },
    );
  }

  const sectors =
    Array.from(
      sectorsByName.values(),
    ).sort(
      (
        left,
        right,
      ) =>
        right.marketValue -
        left.marketValue,
    );

  const sortedByMarketValue =
    [...holdings].sort(
      (
        left,
        right,
      ) =>
        right.marketValue -
        left.marketValue,
    );

  const returnEligibleHoldings =
    holdings.filter(
      (holding) =>
        holding.gainLossPercent !== null,
    );

  const bestPerformer =
    [...returnEligibleHoldings]
      .sort(
        (
          left,
          right,
        ) =>
          (
            right.gainLossPercent ??
            0
          ) -
          (
            left.gainLossPercent ??
            0
          ),
      )[0] ??
    null;

  const worstPerformer =
    [...returnEligibleHoldings]
      .sort(
        (
          left,
          right,
        ) =>
          (
            left.gainLossPercent ??
            0
          ) -
          (
            right.gainLossPercent ??
            0
          ),
      )[0] ??
    null;

  const pricedHoldings =
    holdings.filter(
      (holding) =>
        holding.marketValue > 0 &&
        !holding.quoteStatus.includes(
          "UNAVAILABLE",
        ),
    );

  const quoteQualities =
    holdings
      .map(
        (holding) =>
          holding.quoteQuality,
      )
      .filter(
        (
          quality,
        ): quality is number =>
          quality !== null &&
          Number.isFinite(
            quality,
          ),
      );

  return {
    holdings,

    sectors,

    totals: {
      holdingCount:
        holdings.length,

      marketValue:
        totalMarketValue,

      costBasis:
        totalCostBasis,

      gainLoss:
        totalGainLoss,

      gainLossPercent:
        safePercent(
          totalGainLoss,
          totalCostBasis,
        ),

      annualDividendIncome,

      monthlyDividendIncome:
        annualDividendIncome /
        12,

      dividendYield:
        totalMarketValue > 0 &&
        annualDividendIncome > 0
          ? safePercent(
              annualDividendIncome,
              totalMarketValue,
            )
          : null,

      topHoldingWeight:
        sortedByMarketValue[0]
          ?.portfolioWeight ??
        0,

      topFiveWeight:
        sortedByMarketValue
          .slice(
            0,
            5,
          )
          .reduce(
            (
              total,
              holding,
            ) =>
              total +
              holding.portfolioWeight,
            0,
          ),

      profitableHoldingCount:
        holdings.filter(
          (holding) =>
            holding.gainLoss > 0,
        ).length,

      losingHoldingCount:
        holdings.filter(
          (holding) =>
            holding.gainLoss < 0,
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
          : 0,

      averageQuoteQuality:
        average(
          quoteQualities,
        ),

      sectorCount:
        new Set(
          holdings.map(
            (holding) =>
              holding.sector,
          ),
        ).size,

      countryCount:
        new Set(
          holdings.map(
            (holding) =>
              holding.country,
          ),
        ).size,
    },

    largestHolding:
      sortedByMarketValue[0] ??
      null,

    bestPerformer,

    worstPerformer,
  };
}
