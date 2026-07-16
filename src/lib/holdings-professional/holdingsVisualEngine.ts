import type {
  HoldingsVisualPosition,
  HoldingsVisualSector,
  HoldingsVisualSnapshot,
} from "./holdingsVisualModels";

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
        raw === undefined ||
        raw === null ||
        raw === ""
      ) {
        continue;
      }

      const parsed =
        Number(raw);

      if (
        Number.isFinite(parsed)
      ) {
        return parsed;
      }
    }
  }

  return null;
}

function nonNegative(
  value: number | null,
  fallback = 0,
): number {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return Math.max(
    0,
    value,
  );
}

function safePercent(
  numerator: number,
  denominator: number,
): number | null {
  if (
    denominator === 0 ||
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator)
  ) {
    return null;
  }

  return (
    numerator /
    denominator
  ) * 100;
}

function quoteQualityScore(
  quoteSource: string,
  suppliedQuality: number | null,
): number | null {
  if (
    suppliedQuality !== null &&
    Number.isFinite(suppliedQuality)
  ) {
    return suppliedQuality;
  }

  switch (
    quoteSource.toUpperCase()
  ) {
    case "LIVE":
      return 100;

    case "CACHE":
      return 80;

    case "PREVIOUS_CLOSE":
      return 70;

    case "TRANSACTION_FALLBACK":
      return 40;

    case "UNAVAILABLE":
      return 0;

    default:
      return null;
  }
}

function quoteStatusLabel(
  source: UnknownRecord,
  valuation: UnknownRecord,
): string {
  const explicitStatus =
    text(
      [
        source,
        valuation,
      ],
      [
        "quoteStatus",
        "priceStatus",
        "freshness",
      ],
    );

  if (explicitStatus) {
    return explicitStatus
      .trim()
      .toUpperCase();
  }

  const quoteSource =
    text(
      [
        source,
        valuation,
      ],
      [
        "quoteSource",
        "source",
      ],
    )
      .trim()
      .toUpperCase();

  switch (quoteSource) {
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
      return quoteSource || "UNAVAILABLE";
  }
}

function normalisePosition(
  value: unknown,
): Omit<
  HoldingsVisualPosition,
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
      .toUpperCase()
      .trim();

  if (!symbol) {
    return null;
  }

  const quantity =
    nonNegative(
      numeric(
        sources,
        [
          "quantity",
          "units",
          "shares",
          "openQuantity",
          "remainingQuantity",
        ],
      ),
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
    nonNegative(
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
   * Never substitute cost base as market value.
   *
   * A missing market quote must remain visible as unavailable instead of
   * producing a false 0% return and a false portfolio value.
   */
  const marketValue =
    explicitMarketValue ??
    (
      currentPrice !== null &&
      currentPrice > 0
        ? currentPrice *
          quantity
        : 0
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

  const dailyChange =
    numeric(
      sources,
      [
        "dailyChangeAud",
        "dailyChange",
        "dayChange",
        "dailyChangeValue",
        "dayChangeValue",
        "dailyGainLoss",
      ],
    ) ?? 0;

  const dailyChangePercent =
    numeric(
      sources,
      [
        "dailyChangePercent",
        "dayChangePercent",
        "dailyReturnPercent",
      ],
    ) ??
    (
      marketValue > 0
        ? safePercent(
            dailyChange,
            marketValue -
              dailyChange,
          )
        : null
    );

  /**
   * Annual income is only taken from explicit forecast fields.
   *
   * Historical received dividends are not converted into an annual forecast
   * in this sprint.
   */
  const annualIncome =
    nonNegative(
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
      annualIncome > 0
        ? safePercent(
            annualIncome,
            marketValue,
          )
        : null
    );

  const quoteStatus =
    quoteStatusLabel(
      source,
      valuation,
    );

  const quoteSource =
    text(
      [
        source,
        valuation,
      ],
      [
        "quoteSource",
        "source",
      ],
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

    marketValue:
      nonNegative(
        marketValue,
      ),

    costBasis,

    gainLoss,

    gainLossPercent,

    dailyChange,

    dailyChangePercent,

    annualIncome,

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

    quoteStatus,

    quoteQuality:
      quoteQualityScore(
        quoteSource ||
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

    suppliedPortfolioWeight,

    original:
      value,
  };
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

export function createHoldingsVisualSnapshot(
  values: readonly unknown[],
): HoldingsVisualSnapshot {
  const preliminary =
    values
      .map(
        normalisePosition,
      )
      .filter(
        (
          position,
        ): position is NonNullable<
          ReturnType<
            typeof normalisePosition
          >
        > =>
          Boolean(position),
      );

  const marketValue =
    preliminary.reduce(
      (
        total,
        position,
      ) =>
        total +
        position.marketValue,
      0,
    );

  const hasCompleteSuppliedWeights =
    preliminary.length > 0 &&
    preliminary.every(
      (position) =>
        position.suppliedPortfolioWeight !== null &&
        Number.isFinite(
          position.suppliedPortfolioWeight,
        ),
    );

  const positions:
    HoldingsVisualPosition[] =
      preliminary.map(
        ({
          suppliedPortfolioWeight,
          ...position
        }) => ({
          ...position,

          portfolioWeight:
            hasCompleteSuppliedWeights
              ? suppliedPortfolioWeight ?? 0
              : (
                  marketValue > 0
                    ? (
                        position.marketValue /
                        marketValue
                      ) *
                      100
                    : 0
                ),
        }),
      );

  const costBasis =
    positions.reduce(
      (
        total,
        position,
      ) =>
        total +
        position.costBasis,
      0,
    );

  const gainLoss =
    positions.reduce(
      (
        total,
        position,
      ) =>
        total +
        position.gainLoss,
      0,
    );

  const dailyChange =
    positions.reduce(
      (
        total,
        position,
      ) =>
        total +
        position.dailyChange,
      0,
    );

  const annualIncome =
    positions.reduce(
      (
        total,
        position,
      ) =>
        total +
        position.annualIncome,
      0,
    );

  const sortedPositions =
    [...positions].sort(
      (
        left,
        right,
      ) =>
        right.marketValue -
        left.marketValue,
    );

  const topFiveWeight =
    sortedPositions
      .slice(
        0,
        5,
      )
      .reduce(
        (
          total,
          position,
        ) =>
          total +
          position.portfolioWeight,
        0,
      );

  const sectorMap =
    new Map<
      string,
      {
        positions:
          HoldingsVisualPosition[];
        marketValue: number;
        costBasis: number;
        gainLoss: number;
        annualIncome: number;
        weight: number;
      }
    >();

  for (const position of positions) {
    const existing =
      sectorMap.get(
        position.sector,
      );

    if (existing) {
      existing.positions.push(
        position,
      );

      existing.marketValue +=
        position.marketValue;

      existing.costBasis +=
        position.costBasis;

      existing.gainLoss +=
        position.gainLoss;

      existing.annualIncome +=
        position.annualIncome;

      existing.weight +=
        position.portfolioWeight;

      continue;
    }

    sectorMap.set(
      position.sector,
      {
        positions: [
          position,
        ],

        marketValue:
          position.marketValue,

        costBasis:
          position.costBasis,

        gainLoss:
          position.gainLoss,

        annualIncome:
          position.annualIncome,

        weight:
          position.portfolioWeight,
      },
    );
  }

  const sectors:
    HoldingsVisualSector[] =
      Array.from(
        sectorMap.entries(),
      )
        .map(
          ([
            sector,
            entry,
          ]) => ({
            sector,

            holdingCount:
              entry.positions.length,

            marketValue:
              entry.marketValue,

            costBasis:
              entry.costBasis,

            gainLoss:
              entry.gainLoss,

            gainLossPercent:
              safePercent(
                entry.gainLoss,
                entry.costBasis,
              ),

            annualIncome:
              entry.annualIncome,

            weight:
              entry.weight,
          }),
        )
        .sort(
          (
            left,
            right,
          ) =>
            right.marketValue -
            left.marketValue,
        );

  const pricedPositions =
    positions.filter(
      (position) =>
        position.marketValue > 0 &&
        !position.quoteStatus.includes(
          "UNAVAILABLE",
        ),
    );

  const quoteQualities =
    positions
      .map(
        (position) =>
          position.quoteQuality,
      )
      .filter(
        (
          value,
        ): value is number =>
          value !== null &&
          Number.isFinite(value),
      );

  const largestPosition =
    sortedPositions[0] ??
    null;

  const performancePositions =
    positions.filter(
      (position) =>
        position.gainLossPercent !== null,
    );

  const bestPerformer =
    [...performancePositions]
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
    [...performancePositions]
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

  return {
    positions,

    sectors,

    totals: {
      holdingCount:
        positions.length,

      marketValue,

      costBasis,

      gainLoss,

      gainLossPercent:
        safePercent(
          gainLoss,
          costBasis,
        ),

      dailyChange,

      dailyChangePercent:
        marketValue > 0
          ? safePercent(
              dailyChange,
              marketValue -
                dailyChange,
            )
          : null,

      annualIncome,

      monthlyIncome:
        annualIncome /
        12,

      dividendYield:
        marketValue > 0 &&
        annualIncome > 0
          ? safePercent(
              annualIncome,
              marketValue,
            )
          : null,

      largestPositionWeight:
        largestPosition
          ?.portfolioWeight ??
        0,

      topFiveWeight,

      profitableCount:
        positions.filter(
          (position) =>
            position.gainLoss > 0,
        ).length,

      losingCount:
        positions.filter(
          (position) =>
            position.gainLoss < 0,
        ).length,

      flatCount:
        positions.filter(
          (position) =>
            position.gainLoss === 0,
        ).length,

      pricedCount:
        pricedPositions.length,

      pricingCoverage:
        positions.length > 0
          ? (
              pricedPositions.length /
              positions.length
            ) *
            100
          : 0,

      averageQuoteQuality:
        average(
          quoteQualities,
        ),

      sectorCount:
        new Set(
          positions.map(
            (position) =>
              position.sector,
          ),
        ).size,

      countryCount:
        new Set(
          positions.map(
            (position) =>
              position.country,
          ),
        ).size,
    },

    largestPosition,

    bestPerformer,

    worstPerformer,
  };
}
