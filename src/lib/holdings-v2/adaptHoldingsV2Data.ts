import {
  HoldingsV2AdaptedResult,
  HoldingsV2PositionStatus,
  HoldingsV2PriceStatus,
  HoldingsV2Record,
  HoldingsV2RiskLevel,
  HoldingsV2SourceBundle,
  HoldingsV2Summary,
} from "./holdingsV2Types";
import {
  holdingsV2Array,
  holdingsV2CreateId,
  holdingsV2Currency,
  holdingsV2Date,
  holdingsV2FirstDefined,
  holdingsV2Number,
  holdingsV2String,
  holdingsV2StringArray,
  isHoldingsV2Record,
} from "./holdingsV2DataAccess";

function resolveRiskLevel(
  value: unknown
): HoldingsV2RiskLevel {
  const text =
    holdingsV2String(
      value
    ).toUpperCase();

  if (
    text.includes(
      "LOW"
    )
  ) {
    return "LOW";
  }

  if (
    text.includes(
      "MED"
    )
  ) {
    return "MEDIUM";
  }

  if (
    text.includes(
      "HIGH"
    )
  ) {
    return "HIGH";
  }

  return "UNKNOWN";
}

function resolvePositionStatus(
  value: unknown,
  quantity: number
): HoldingsV2PositionStatus {
  const text =
    holdingsV2String(
      value
    ).toUpperCase();

  if (
    text.includes(
      "CLOSED"
    ) ||
    quantity === 0
  ) {
    return "CLOSED";
  }

  if (
    text.includes(
      "PART"
    )
  ) {
    return "PARTIAL";
  }

  if (
    text.includes(
      "OPEN"
    ) ||
    quantity > 0
  ) {
    return "OPEN";
  }

  return "UNKNOWN";
}

function resolvePriceStatus(
  value: unknown,
  currentPrice: number | null,
  priceUpdatedAt: string | null
): HoldingsV2PriceStatus {
  if (
    currentPrice === null
  ) {
    return "MISSING";
  }

  const text =
    holdingsV2String(
      value
    ).toUpperCase();

  if (
    text.includes(
      "LIVE"
    )
  ) {
    return "LIVE";
  }

  if (
    text.includes(
      "DELAY"
    )
  ) {
    return "DELAYED";
  }

  if (
    text.includes(
      "MANUAL"
    )
  ) {
    return "MANUAL";
  }

  if (
    text.includes(
      "STALE"
    )
  ) {
    return "STALE";
  }

  if (
    priceUpdatedAt
  ) {
    const timestamp =
      new Date(
        priceUpdatedAt
      );

    if (
      !Number.isNaN(
        timestamp.getTime()
      ) &&
      Date.now() -
        timestamp.getTime() >
        24 *
          60 *
          60 *
          1000
    ) {
      return "STALE";
    }
  }

  return "UNKNOWN";
}

function normaliseHolding(
  value: unknown,
  index: number,
  baseCurrency: string
): HoldingsV2Record | null {
  if (
    !isHoldingsV2Record(
      value
    )
  ) {
    return null;
  }

  const symbol =
    holdingsV2String(
      holdingsV2FirstDefined(
        value,
        [
          "symbol",
          "ticker",
          "code",
          "security.symbol",
          "instrument.symbol",
        ]
      ).value
    ).toUpperCase();

  if (!symbol) {
    return null;
  }

  const quantity =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "quantity",
          "units",
          "shares",
          "holdingQuantity",
          "position.quantity",
        ]
      ).value
    ) ?? 0;

  const averageCost =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "averageCost",
          "avgCost",
          "averagePrice",
          "costPerShare",
          "unitCost",
          "position.averageCost",
        ]
      ).value
    ) ?? 0;

  const currentPrice =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "currentPrice",
          "marketPrice",
          "price",
          "lastPrice",
          "quote.price",
          "position.currentPrice",
        ]
      ).value
    );

  const previousClose =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "previousClose",
          "priorClose",
          "quote.previousClose",
        ]
      ).value
    );

  const costBase =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "costBase",
          "costBasis",
          "totalCost",
          "investedCapital",
          "position.costBase",
        ]
      ).value
    ) ??
    quantity *
      averageCost;

  const marketValue =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "marketValue",
          "currentValue",
          "positionValue",
          "value",
          "position.marketValue",
        ]
      ).value
    ) ??
    (
      currentPrice ===
      null
        ? null
        : quantity *
          currentPrice
    );

  const unrealisedGainLoss =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "unrealisedGainLoss",
          "unrealizedGainLoss",
          "unrealisedPnl",
          "unrealizedPnl",
          "gainLoss",
          "position.unrealisedGainLoss",
        ]
      ).value
    ) ??
    (
      marketValue ===
        null
        ? null
        : marketValue -
          costBase
    );

  const unrealisedGainLossPercent =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "unrealisedGainLossPercent",
          "unrealizedGainLossPercent",
          "unrealisedReturnPercent",
          "returnPercent",
          "gainLossPercent",
        ]
      ).value
    ) ??
    (
      unrealisedGainLoss ===
        null ||
      costBase === 0
        ? null
        : (
            unrealisedGainLoss /
            costBase
          ) *
          100
    );

  const dailyGainLoss =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "dailyGainLoss",
          "dayGainLoss",
          "dailyPnl",
          "dayPnl",
          "todayGainLoss",
        ]
      ).value
    ) ??
    (
      currentPrice ===
        null ||
      previousClose ===
        null
        ? null
        : (
            currentPrice -
            previousClose
          ) *
          quantity
    );

  const dailyGainLossPercent =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "dailyGainLossPercent",
          "dayGainLossPercent",
          "dailyReturnPercent",
          "changePercent",
          "dayChangePercent",
        ]
      ).value
    ) ??
    (
      currentPrice ===
        null ||
      previousClose ===
        null ||
      previousClose === 0
        ? null
        : (
            (
              currentPrice -
              previousClose
            ) /
            previousClose
          ) *
          100
    );

  const portfolioWeight =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "portfolioWeight",
          "weight",
          "allocationPercent",
          "portfolioPercent",
        ]
      ).value
    );

  const priceUpdatedAt =
    holdingsV2Date(
      holdingsV2FirstDefined(
        value,
        [
          "priceUpdatedAt",
          "quote.updatedAt",
          "quotedAt",
          "lastPriceUpdate",
        ]
      ).value
    );

  const riskLevel =
    resolveRiskLevel(
      holdingsV2FirstDefined(
        value,
        [
          "riskLevel",
          "risk",
          "classification.risk",
        ]
      ).value
    );

  const positionStatus =
    resolvePositionStatus(
      holdingsV2FirstDefined(
        value,
        [
          "status",
          "positionStatus",
          "position.status",
        ]
      ).value,
      quantity
    );

  const priceStatus =
    resolvePriceStatus(
      holdingsV2FirstDefined(
        value,
        [
          "priceStatus",
          "quote.status",
          "pricingSource",
        ]
      ).value,
      currentPrice,
      priceUpdatedAt
    );

  const currency =
    holdingsV2Currency(
      holdingsV2FirstDefined(
        value,
        [
          "currency",
          "baseCurrency",
          "security.currency",
          "position.currency",
        ]
      ).value,
      baseCurrency
    );

  const targetPrice =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "targetPrice",
          "priceTarget",
          "fairValue",
          "research.targetPrice",
        ]
      ).value
    );

  const targetUpsidePercent =
    holdingsV2Number(
      holdingsV2FirstDefined(
        value,
        [
          "targetUpsidePercent",
          "upsidePercent",
          "targetReturnPercent",
        ]
      ).value
    ) ??
    (
      currentPrice ===
        null ||
      currentPrice <= 0 ||
      targetPrice ===
        null
        ? null
        : (
            (
              targetPrice -
              currentPrice
            ) /
            currentPrice
          ) *
          100
    );

  return {
    id:
      holdingsV2CreateId(
        "holding",
        index,
        holdingsV2FirstDefined(
          value,
          [
            "id",
            "holdingId",
            "positionId",
            "uuid",
          ]
        ).value
      ),

    symbol,
    name:
      holdingsV2String(
        holdingsV2FirstDefined(
          value,
          [
            "name",
            "companyName",
            "securityName",
            "instrument.name",
          ]
        ).value,
        symbol
      ),

    exchange:
      holdingsV2String(
        holdingsV2FirstDefined(
          value,
          [
            "exchange",
            "market",
            "security.exchange",
          ]
        ).value
      ).toUpperCase(),

    currency,

    sector:
      holdingsV2String(
        holdingsV2FirstDefined(
          value,
          [
            "sector",
            "classification.sector",
            "security.sector",
          ]
        ).value,
        "Unclassified"
      ),

    industry:
      holdingsV2String(
        holdingsV2FirstDefined(
          value,
          [
            "industry",
            "classification.industry",
            "security.industry",
          ]
        ).value,
        "Unclassified"
      ),

    quantity,
    averageCost,
    currentPrice,
    previousClose,
    costBase,
    marketValue,
    unrealisedGainLoss,
    unrealisedGainLossPercent,

    realisedGainLoss:
      holdingsV2Number(
        holdingsV2FirstDefined(
          value,
          [
            "realisedGainLoss",
            "realizedGainLoss",
            "realisedPnl",
            "realizedPnl",
          ]
        ).value
      ),

    dailyGainLoss,
    dailyGainLossPercent,
    portfolioWeight,

    dividendsReceived:
      holdingsV2Number(
        holdingsV2FirstDefined(
          value,
          [
            "dividendsReceived",
            "dividendIncome",
            "income.dividends",
          ]
        ).value
      ),

    annualDividendIncome:
      holdingsV2Number(
        holdingsV2FirstDefined(
          value,
          [
            "annualDividendIncome",
            "forecastDividendIncome",
            "income.annualDividend",
          ]
        ).value
      ),

    dividendYield:
      holdingsV2Number(
        holdingsV2FirstDefined(
          value,
          [
            "dividendYield",
            "yield",
            "income.dividendYield",
          ]
        ).value
      ),

    targetPrice,
    targetUpsidePercent,

    riskLevel,
    status:
      positionStatus,
    priceStatus,

    strategy:
      holdingsV2String(
        holdingsV2FirstDefined(
          value,
          [
            "strategy",
            "investmentStrategy",
            "classification.strategy",
          ]
        ).value
      ),

    tags:
      holdingsV2StringArray(
        holdingsV2FirstDefined(
          value,
          [
            "tags",
            "labels",
          ]
        ).value
      ),

    account:
      holdingsV2String(
        holdingsV2FirstDefined(
          value,
          [
            "account",
            "accountName",
            "portfolioAccount",
          ]
        ).value
      ),

    broker:
      holdingsV2String(
        holdingsV2FirstDefined(
          value,
          [
            "broker",
            "brokerName",
            "platform",
          ]
        ).value
      ),

    openedAt:
      holdingsV2Date(
        holdingsV2FirstDefined(
          value,
          [
            "openedAt",
            "openDate",
            "firstBuyDate",
          ]
        ).value
      ),

    lastTransactionAt:
      holdingsV2Date(
        holdingsV2FirstDefined(
          value,
          [
            "lastTransactionAt",
            "lastTradeDate",
            "lastActivityAt",
          ]
        ).value
      ),

    priceUpdatedAt,

    lastUpdated:
      holdingsV2Date(
        holdingsV2FirstDefined(
          value,
          [
            "updatedAt",
            "lastUpdated",
            "modifiedAt",
            "priceUpdatedAt",
          ]
        ).value
      ),

    notes:
      holdingsV2String(
        holdingsV2FirstDefined(
          value,
          [
            "notes",
            "note",
            "comment",
          ]
        ).value
      ),

    raw:
      value,
  };
}

function resolveBaseCurrency(
  bundle: HoldingsV2SourceBundle
) {
  const candidates = [
    bundle.snapshot,
    bundle.portfolio,
    bundle.dashboard,
    bundle.metadata,
  ];

  for (
    const source of candidates
  ) {
    const resolved =
      holdingsV2FirstDefined(
        source,
        [
          "currency",
          "baseCurrency",
          "portfolio.currency",
          "metadata.currency",
        ]
      );

    if (
      resolved.value
    ) {
      return holdingsV2Currency(
        resolved.value,
        "AUD"
      );
    }
  }

  return "AUD";
}

function resolveRawHoldings(
  bundle: HoldingsV2SourceBundle
) {
  if (
    Array.isArray(
      bundle.holdings
    )
  ) {
    return bundle.holdings;
  }

  if (
    Array.isArray(
      bundle.positions
    )
  ) {
    return bundle.positions;
  }

  const candidates = [
    bundle.portfolio,
    bundle.snapshot,
    bundle.dashboard,
  ];

  for (
    const source of candidates
  ) {
    const resolved =
      holdingsV2FirstDefined(
        source,
        [
          "holdings",
          "positions",
          "portfolio.holdings",
          "portfolio.positions",
          "data.holdings",
        ]
      );

    if (
      Array.isArray(
        resolved.value
      )
    ) {
      return resolved.value;
    }
  }

  return [];
}

function calculateSummary(
  holdings: HoldingsV2Record[],
  baseCurrency: string
): HoldingsV2Summary {
  const openHoldings =
    holdings.filter(
      (holding) =>
        holding.status !==
        "CLOSED"
    );

  const totalCostBase =
    openHoldings.reduce(
      (
        sum,
        holding
      ) =>
        sum +
        holding.costBase,
      0
    );

  const valued =
    openHoldings.filter(
      (holding) =>
        holding.marketValue !==
        null
    );

  const totalMarketValue =
    valued.length ===
    openHoldings.length
      ? valued.reduce(
          (
            sum,
            holding
          ) =>
            sum +
            (
              holding.marketValue ??
              0
            ),
          0
        )
      : null;

  const unrealisedValues =
    openHoldings.filter(
      (holding) =>
        holding.unrealisedGainLoss !==
        null
    );

  const totalUnrealisedGainLoss =
    unrealisedValues.length ===
    openHoldings.length
      ? unrealisedValues.reduce(
          (
            sum,
            holding
          ) =>
            sum +
            (
              holding.unrealisedGainLoss ??
              0
            ),
          0
        )
      : null;

  const totalUnrealisedGainLossPercent =
    totalUnrealisedGainLoss ===
      null ||
    totalCostBase === 0
      ? null
      : (
          totalUnrealisedGainLoss /
          totalCostBase
        ) *
        100;

  const dailyValues =
    openHoldings.filter(
      (holding) =>
        holding.dailyGainLoss !==
        null
    );

  const totalDailyGainLoss =
    dailyValues.length ===
    openHoldings.length
      ? dailyValues.reduce(
          (
            sum,
            holding
          ) =>
            sum +
            (
              holding.dailyGainLoss ??
              0
            ),
          0
        )
      : null;

  const previousValue =
    totalMarketValue !==
      null &&
    totalDailyGainLoss !==
      null
      ? totalMarketValue -
        totalDailyGainLoss
      : null;

  const totalDailyGainLossPercent =
    totalDailyGainLoss ===
      null ||
    previousValue ===
      null ||
    previousValue === 0
      ? null
      : (
          totalDailyGainLoss /
          previousValue
        ) *
        100;

  const realisedValues =
    holdings.filter(
      (holding) =>
        holding.realisedGainLoss !==
        null
    );

  const dividendValues =
    holdings.filter(
      (holding) =>
        holding.dividendsReceived !==
        null
    );

  const annualIncomeValues =
    holdings.filter(
      (holding) =>
        holding.annualDividendIncome !==
        null
    );

  const largestPosition =
    [...openHoldings]
      .filter(
        (holding) =>
          holding.marketValue !==
          null
      )
      .sort(
        (
          left,
          right
        ) =>
          (
            right.marketValue ??
            0
          ) -
          (
            left.marketValue ??
            0
          )
      )[0] ??
    null;

  const largestWinner =
    [...openHoldings]
      .filter(
        (holding) =>
          holding.unrealisedGainLoss !==
          null
      )
      .sort(
        (
          left,
          right
        ) =>
          (
            right.unrealisedGainLoss ??
            0
          ) -
          (
            left.unrealisedGainLoss ??
            0
          )
      )[0] ??
    null;

  const largestLoser =
    [...openHoldings]
      .filter(
        (holding) =>
          holding.unrealisedGainLoss !==
          null
      )
      .sort(
        (
          left,
          right
        ) =>
          (
            left.unrealisedGainLoss ??
            0
          ) -
          (
            right.unrealisedGainLoss ??
            0
          )
      )[0] ??
    null;

  const asOf =
    holdings
      .map(
        (holding) =>
          holding.lastUpdated ??
          holding.priceUpdatedAt
      )
      .filter(
        (
          value
        ): value is string =>
          Boolean(value)
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            right
          ).getTime() -
          new Date(
            left
          ).getTime()
      )[0] ??
    null;

  return {
    totalHoldings:
      holdings.length,

    openHoldings:
      openHoldings.length,

    totalQuantity:
      openHoldings.reduce(
        (
          sum,
          holding
        ) =>
          sum +
          holding.quantity,
        0
      ),

    totalCostBase,
    totalMarketValue,

    totalUnrealisedGainLoss,
    totalUnrealisedGainLossPercent,

    totalRealisedGainLoss:
      realisedValues.length ===
      0
        ? null
        : realisedValues.reduce(
            (
              sum,
              holding
            ) =>
              sum +
              (
                holding.realisedGainLoss ??
                0
              ),
            0
          ),

    totalDailyGainLoss,
    totalDailyGainLossPercent,

    totalDividendsReceived:
      dividendValues.length ===
      0
        ? null
        : dividendValues.reduce(
            (
              sum,
              holding
            ) =>
              sum +
              (
                holding.dividendsReceived ??
                0
              ),
            0
          ),

    annualDividendIncome:
      annualIncomeValues.length ===
      0
        ? null
        : annualIncomeValues.reduce(
            (
              sum,
              holding
            ) =>
              sum +
              (
                holding.annualDividendIncome ??
                0
              ),
            0
          ),

    profitableHoldings:
      openHoldings.filter(
        (holding) =>
          (
            holding.unrealisedGainLoss ??
            0
          ) > 0
      ).length,

    losingHoldings:
      openHoldings.filter(
        (holding) =>
          (
            holding.unrealisedGainLoss ??
            0
          ) < 0
      ).length,

    missingPriceCount:
      openHoldings.filter(
        (holding) =>
          holding.currentPrice ===
          null
      ).length,

    stalePriceCount:
      openHoldings.filter(
        (holding) =>
          holding.priceStatus ===
          "STALE"
      ).length,

    largestPosition,
    largestWinner:
      (
        largestWinner?.unrealisedGainLoss ??
        0
      ) > 0
        ? largestWinner
        : null,

    largestLoser:
      (
        largestLoser?.unrealisedGainLoss ??
        0
      ) < 0
        ? largestLoser
        : null,

    baseCurrency,
    asOf,
  };
}

export function adaptHoldingsV2Data(
  bundle: HoldingsV2SourceBundle
): HoldingsV2AdaptedResult {
  const baseCurrency =
    resolveBaseCurrency(
      bundle
    );

  const rawHoldings =
    resolveRawHoldings(
      bundle
    );

  const holdings =
    holdingsV2Array(
      rawHoldings
    )
      .map(
        (
          value,
          index
        ) =>
          normaliseHolding(
            value,
            index,
            baseCurrency
          )
      )
      .filter(
        (
          holding
        ): holding is HoldingsV2Record =>
          Boolean(holding)
      );

  const warnings:
    string[] = [];

  if (
    holdings.length ===
    0
  ) {
    warnings.push(
      "No holdings were supplied to Holdings 2.0."
    );
  }

  const missingPrices =
    holdings.filter(
      (holding) =>
        holding.currentPrice ===
        null
    ).length;

  if (
    missingPrices >
    0
  ) {
    warnings.push(
      `${missingPrices} holding${
        missingPrices ===
        1
          ? ""
          : "s"
      } have no current price.`
    );
  }

  return {
    holdings,
    summary:
      calculateSummary(
        holdings,
        baseCurrency
      ),
    warnings,
  };
}
