import type {
  HoldingsVisualPosition,
  HoldingsVisualSector,
  HoldingsVisualSnapshot,
} from "./holdingsVisualModels";

type UnknownRecord =
  Record<string, unknown>;

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
    const value =
      source[key];

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

  return null;
}

function safePercent(
  numerator: number,
  denominator: number
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

function normalisePosition(
  value: unknown
): Omit<
  HoldingsVisualPosition,
  "portfolioWeight"
> | null {
  const source =
    record(value);

  const symbol =
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
      .toUpperCase()
      .trim();

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

  const costBasis =
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
    ) ??
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

  const marketValue =
    numeric(
      source,
      [
        "marketValueAud",
        "marketValue",
        "currentValue",
        "positionValue",
        "liveMarketValue",
      ]
    ) ??
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

  const dailyChange =
    numeric(
      source,
      [
        "dailyChange",
        "dayChange",
        "dailyChangeValue",
        "dayChangeValue",
        "dailyGainLoss",
      ]
    ) || 0;

  const dailyChangePercent =
    numeric(
      source,
      [
        "dailyChangePercent",
        "dayChangePercent",
        "dailyReturnPercent",
      ]
    ) ??
    safePercent(
      dailyChange,
      marketValue -
      dailyChange
    );

  const annualIncome =
    numeric(
      source,
      [
        "annualDividendIncome",
        "annualIncome",
        "projectedAnnualIncome",
        "forwardAnnualIncome",
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
        ) || 0
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
      annualIncome,
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

    marketValue,
    costBasis,

    gainLoss,
    gainLossPercent,

    dailyChange,
    dailyChangePercent,

    annualIncome,
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

    quoteQuality:
      numeric(
        source,
        [
          "quoteQuality",
          "qualityScore",
          "priceQuality",
        ]
      ),

    original:
      value,
  };
}

export function createHoldingsVisualSnapshot(
  values: readonly unknown[]
): HoldingsVisualSnapshot {
  const preliminary =
    values
      .map(
        normalisePosition
      )
      .filter(
        (
          position
        ): position is NonNullable<
          ReturnType<
            typeof normalisePosition
          >
        > =>
          Boolean(position)
      );

  const marketValue =
    preliminary.reduce(
      (
        total,
        position
      ) =>
        total +
        position.marketValue,
      0
    );

  const positions:
    HoldingsVisualPosition[] =
      preliminary
        .map(
          (
            position
          ) => ({
            ...position,

            portfolioWeight:
              marketValue > 0
                ? (
                    position.marketValue /
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

  const costBasis =
    positions.reduce(
      (
        total,
        position
      ) =>
        total +
        position.costBasis,
      0
    );

  const gainLoss =
    marketValue -
    costBasis;

  const dailyChange =
    positions.reduce(
      (
        total,
        position
      ) =>
        total +
        position.dailyChange,
      0
    );

  const annualIncome =
    positions.reduce(
      (
        total,
        position
      ) =>
        total +
        position.annualIncome,
      0
    );

  const sectorMap =
    new Map<
      string,
      HoldingsVisualSector
    >();

  for (const position of positions) {
    const existing =
      sectorMap.get(
        position.sector
      ) || {
        sector:
          position.sector,

        holdingCount: 0,

        marketValue: 0,
        costBasis: 0,

        gainLoss: 0,
        gainLossPercent: null,

        annualIncome: 0,

        weight: 0,
      };

    existing.holdingCount +=
      1;

    existing.marketValue +=
      position.marketValue;

    existing.costBasis +=
      position.costBasis;

    existing.gainLoss +=
      position.gainLoss;

    existing.annualIncome +=
      position.annualIncome;

    sectorMap.set(
      position.sector,
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

          gainLossPercent:
            safePercent(
              sector.gainLoss,
              sector.costBasis
            ),

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

  const performancePositions =
    positions
      .filter(
        (
          position
        ) =>
          position.gainLossPercent !==
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

  const priced =
    positions.filter(
      (
        position
      ) =>
        position.quoteStatus !==
        "ESTIMATED"
    );

  const qualityValues =
    positions
      .map(
        (
          position
        ) =>
          position.quoteQuality
      )
      .filter(
        (
          value
        ): value is number =>
          value !== null
      );

  const averageQuoteQuality =
    qualityValues.length > 0
      ? qualityValues.reduce(
          (
            total,
            value
          ) =>
            total +
            value,
          0
        ) /
        qualityValues.length
      : 0;

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
          costBasis
        ),

      dailyChange,

      dailyChangePercent:
        safePercent(
          dailyChange,
          marketValue -
          dailyChange
        ),

      annualIncome,

      monthlyIncome:
        annualIncome /
        12,

      dividendYield:
        safePercent(
          annualIncome,
          marketValue
        ),

      largestPositionWeight:
        positions[0]
          ?.portfolioWeight ||
        0,

      topFiveWeight:
        positions
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
          ),

      profitableCount:
        positions.filter(
          (
            position
          ) =>
            position.gainLoss >
            0
        ).length,

      losingCount:
        positions.filter(
          (
            position
          ) =>
            position.gainLoss <
            0
        ).length,

      flatCount:
        positions.filter(
          (
            position
          ) =>
            position.gainLoss ===
            0
        ).length,

      pricedCount:
        priced.length,

      pricingCoverage:
        positions.length > 0
          ? (
              priced.length /
              positions.length
            ) *
            100
          : 100,

      averageQuoteQuality,

      sectorCount:
        sectors.length,

      countryCount:
        new Set(
          positions.map(
            (
              position
            ) =>
              position.country
          )
        ).size,
    },

    largestPosition:
      positions[0] ||
      null,

    bestPerformer:
      performancePositions[0] ||
      null,

    worstPerformer:
      performancePositions[
        performancePositions.length -
        1
      ] ||
      null,
  };
}
