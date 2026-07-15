import type {
  HoldingsVisualPosition,
} from "./holdingsVisualModels";
import type {
  PositionActivityEvent,
  PositionActivitySnapshot,
  PositionActivityType,
  PositionFifoLot,
  PositionLotStatus,
} from "./positionActivityModels";

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

function arrayValue(
  source: UnknownRecord,
  keys: string[]
): unknown[] {
  for (const key of keys) {
    const value =
      source[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function dateValue(
  source: UnknownRecord,
  keys: string[]
): string | null {
  for (const key of keys) {
    const raw =
      source[key];

    if (
      typeof raw !== "string" &&
      typeof raw !== "number"
    ) {
      continue;
    }

    const date =
      new Date(raw);

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date.toISOString();
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

function holdingDays(
  date: string | null
): number | null {
  if (!date) {
    return null;
  }

  const timestamp =
    new Date(date).getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.floor(
      (
        Date.now() -
        timestamp
      ) /
      86_400_000
    )
  );
}

function lotStatus(
  originalQuantity: number,
  remainingQuantity: number
): PositionLotStatus {
  if (
    remainingQuantity <= 0
  ) {
    return "CLOSED";
  }

  if (
    remainingQuantity <
    originalQuantity
  ) {
    return "PARTIALLY_REALISED";
  }

  return "OPEN";
}

function inferActivityType(
  value: string
): PositionActivityType {
  const type =
    value.toUpperCase();

  if (
    type.includes("DRP") ||
    type.includes("REINVEST")
  ) {
    return "DRP";
  }

  if (
    type.includes("DIVIDEND") ||
    type.includes("DISTRIBUTION")
  ) {
    return "DIVIDEND";
  }

  if (
    type.includes("BUY") ||
    type.includes("PURCHASE")
  ) {
    return "BUY";
  }

  if (
    type.includes("SELL") ||
    type.includes("SALE")
  ) {
    return "SELL";
  }

  if (
    type.includes("SPLIT") ||
    type.includes("CONSOLIDATION")
  ) {
    return "SPLIT";
  }

  if (
    type.includes("TRANSFER")
  ) {
    return "TRANSFER";
  }

  if (
    type.includes("FEE") ||
    type.includes("BROKERAGE")
  ) {
    return "FEE";
  }

  if (
    type.includes("CORPORATE") ||
    type.includes("MERGER") ||
    type.includes("SPIN")
  ) {
    return "CORPORATE_ACTION";
  }

  return "OTHER";
}

function activityTitle(
  type: PositionActivityType,
  symbol: string
): string {
  if (type === "BUY") {
    return `Bought ${symbol}`;
  }

  if (type === "SELL") {
    return `Sold ${symbol}`;
  }

  if (type === "DIVIDEND") {
    return `${symbol} dividend received`;
  }

  if (type === "DRP") {
    return `${symbol} dividend reinvested`;
  }

  if (type === "SPLIT") {
    return `${symbol} stock split`;
  }

  if (type === "TRANSFER") {
    return `${symbol} transferred`;
  }

  if (type === "FEE") {
    return `${symbol} fee recorded`;
  }

  if (type === "CORPORATE_ACTION") {
    return `${symbol} corporate action`;
  }

  return `${symbol} portfolio activity`;
}

function normaliseLot({
  value,
  position,
  index,
}: {
  value: unknown;
  position: HoldingsVisualPosition;
  index: number;
}): PositionFifoLot | null {
  const source =
    record(value);

  const originalQuantity =
    numeric(
      source,
      [
        "originalQuantity",
        "quantity",
        "units",
        "shares",
        "purchasedQuantity",
      ]
    ) || 0;

  const remainingQuantity =
    numeric(
      source,
      [
        "remainingQuantity",
        "openQuantity",
        "quantityRemaining",
        "remainingUnits",
      ]
    ) ??
    originalQuantity;

  const purchasePrice =
    numeric(
      source,
      [
        "purchasePrice",
        "price",
        "unitPrice",
        "costPerShare",
        "averagePrice",
      ]
    ) ??
    (
      originalQuantity > 0
        ? (
            numeric(
              source,
              [
                "originalCost",
                "costBasis",
                "totalCost",
              ]
            ) || 0
          ) /
          originalQuantity
        : 0
    );

  const originalCost =
    numeric(
      source,
      [
        "originalCost",
        "costBasis",
        "totalCost",
        "grossCost",
      ]
    ) ??
    (
      originalQuantity *
      purchasePrice
    );

  const remainingCost =
    numeric(
      source,
      [
        "remainingCost",
        "openCost",
        "remainingCostBasis",
      ]
    ) ??
    (
      remainingQuantity *
      purchasePrice
    );

  if (
    originalQuantity <= 0 &&
    originalCost <= 0
  ) {
    return null;
  }

  const currentPrice =
    numeric(
      record(
        position.original
      ),
      [
        "livePrice",
        "currentPrice",
        "marketPrice",
        "price",
        "lastPrice",
      ]
    ) ??
    (
      position.quantity > 0
        ? position.marketValue /
          position.quantity
        : null
    );

  const currentValue =
    currentPrice === null
      ? remainingCost
      : remainingQuantity *
        currentPrice;

  const unrealisedGainLoss =
    currentValue -
    remainingCost;

  const purchaseDate =
    dateValue(
      source,
      [
        "purchaseDate",
        "tradeDate",
        "date",
        "transactionDate",
        "acquiredAt",
      ]
    );

  return {
    id:
      text(
        source,
        [
          "id",
          "lotId",
          "transactionId",
        ]
      ) ||
      `${position.symbol}-LOT-${index + 1}`,

    symbol:
      position.symbol,

    purchaseDate,

    originalQuantity,
    remainingQuantity,

    realisedQuantity:
      Math.max(
        0,
        originalQuantity -
        remainingQuantity
      ),

    purchasePrice,
    currentPrice,

    originalCost,
    remainingCost,
    currentValue,

    unrealisedGainLoss,

    unrealisedGainLossPercent:
      safePercent(
        unrealisedGainLoss,
        remainingCost
      ),

    holdingDays:
      holdingDays(
        purchaseDate
      ),

    broker:
      text(
        source,
        [
          "broker",
          "brokerName",
        ]
      ) ||
      "Unknown",

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

    currency:
      text(
        source,
        [
          "currency",
        ]
      ).toUpperCase() ||
      position.currency,

    status:
      lotStatus(
        originalQuantity,
        remainingQuantity
      ),
  };
}

function createSyntheticLot(
  position: HoldingsVisualPosition
): PositionFifoLot | null {
  if (
    position.quantity <= 0
  ) {
    return null;
  }

  const source =
    record(
      position.original
    );

  const purchaseDate =
    dateValue(
      source,
      [
        "firstPurchaseDate",
        "purchaseDate",
        "openedAt",
      ]
    );

  const purchasePrice =
    position.quantity > 0
      ? position.costBasis /
        position.quantity
      : 0;

  const currentPrice =
    position.quantity > 0
      ? position.marketValue /
        position.quantity
      : null;

  return {
    id:
      `${position.symbol}-SYNTHETIC-LOT`,

    symbol:
      position.symbol,

    purchaseDate,

    originalQuantity:
      position.quantity,

    remainingQuantity:
      position.quantity,

    realisedQuantity:
      0,

    purchasePrice,
    currentPrice,

    originalCost:
      position.costBasis,

    remainingCost:
      position.costBasis,

    currentValue:
      position.marketValue,

    unrealisedGainLoss:
      position.gainLoss,

    unrealisedGainLossPercent:
      position.gainLossPercent,

    holdingDays:
      holdingDays(
        purchaseDate
      ),

    broker:
      text(
        source,
        [
          "broker",
          "brokerName",
        ]
      ) ||
      "Unknown",

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

    currency:
      position.currency,

    status:
      "OPEN",
  };
}

function normaliseEvent({
  value,
  symbol,
  index,
  fallbackCurrency,
}: {
  value: unknown;
  symbol: string;
  index: number;
  fallbackCurrency: string;
}): PositionActivityEvent | null {
  const source =
    record(value);

  const eventSymbol =
    text(
      source,
      [
        "symbol",
        "ticker",
        "code",
      ]
    ).toUpperCase() ||
    symbol;

  if (
    eventSymbol !== symbol
  ) {
    return null;
  }

  const rawType =
    text(
      source,
      [
        "type",
        "transactionType",
        "action",
        "eventType",
      ]
    );

  const type =
    inferActivityType(
      rawType
    );

  const quantity =
    numeric(
      source,
      [
        "quantity",
        "units",
        "shares",
      ]
    );

  const price =
    numeric(
      source,
      [
        "price",
        "unitPrice",
        "tradePrice",
      ]
    );

  const grossAmount =
    numeric(
      source,
      [
        "grossAmount",
        "gross",
        "total",
        "amount",
        "value",
      ]
    ) ??
    (
      quantity !== null &&
      price !== null
        ? quantity * price
        : null
    );

  const fees =
    numeric(
      source,
      [
        "fees",
        "fee",
        "brokerage",
        "commission",
      ]
    ) || 0;

  const netAmount =
    numeric(
      source,
      [
        "netAmount",
        "net",
      ]
    ) ??
    (
      grossAmount === null
        ? null
        : type === "BUY"
          ? grossAmount +
            fees
          : grossAmount -
            fees
    );

  if (
    !rawType &&
    !grossAmount &&
    !quantity
  ) {
    return null;
  }

  return {
    id:
      text(
        source,
        [
          "id",
          "transactionId",
          "eventId",
        ]
      ) ||
      `${symbol}-EVENT-${index + 1}`,

    symbol,

    type,

    date:
      dateValue(
        source,
        [
          "date",
          "tradeDate",
          "transactionDate",
          "paymentDate",
          "createdAt",
        ]
      ),

    title:
      activityTitle(
        type,
        symbol
      ),

    description:
      text(
        source,
        [
          "description",
          "note",
          "memo",
          "reference",
        ]
      ) ||
      (
        quantity !== null
          ? `${quantity.toLocaleString(
              "en-AU",
              {
                maximumFractionDigits:
                  4,
              }
            )} units`
          : "Portfolio activity"
      ),

    quantity,
    price,

    grossAmount,
    fees,
    netAmount,

    broker:
      text(
        source,
        [
          "broker",
          "brokerName",
        ]
      ) ||
      "Unknown",

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

    currency:
      text(
        source,
        [
          "currency",
        ]
      ).toUpperCase() ||
      fallbackCurrency,

    source:
      value,
  };
}

export function createPositionActivitySnapshot(
  position: HoldingsVisualPosition
): PositionActivitySnapshot {
  const source =
    record(
      position.original
    );

  const rawLots =
    arrayValue(
      source,
      [
        "fifoLots",
        "lots",
        "costLots",
        "purchaseLots",
        "openLots",
      ]
    );

  let lots =
    rawLots
      .map(
        (
          value,
          index
        ) =>
          normaliseLot({
            value,
            position,
            index,
          })
      )
      .filter(
        (
          lot
        ): lot is PositionFifoLot =>
          Boolean(lot)
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            left.purchaseDate ||
            "9999-12-31"
          ).getTime() -
          new Date(
            right.purchaseDate ||
            "9999-12-31"
          ).getTime()
      );

  if (
    lots.length === 0
  ) {
    const syntheticLot =
      createSyntheticLot(
        position
      );

    if (syntheticLot) {
      lots = [
        syntheticLot,
      ];
    }
  }

  const rawEvents = [
    ...arrayValue(
      source,
      [
        "transactions",
        "transactionHistory",
        "activity",
        "events",
      ]
    ),

    ...arrayValue(
      source,
      [
        "dividends",
        "dividendHistory",
      ]
    ),

    ...arrayValue(
      source,
      [
        "corporateActions",
      ]
    ),
  ];

  const events =
    rawEvents
      .map(
        (
          value,
          index
        ) =>
          normaliseEvent({
            value,
            symbol:
              position.symbol,
            index,
            fallbackCurrency:
              position.currency,
          })
      )
      .filter(
        (
          event
        ): event is PositionActivityEvent =>
          Boolean(event)
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            right.date ||
            0
          ).getTime() -
          new Date(
            left.date ||
            0
          ).getTime()
      );

  const originalQuantity =
    lots.reduce(
      (
        total,
        lot
      ) =>
        total +
        lot.originalQuantity,
      0
    );

  const remainingQuantity =
    lots.reduce(
      (
        total,
        lot
      ) =>
        total +
        lot.remainingQuantity,
      0
    );

  const realisedQuantity =
    lots.reduce(
      (
        total,
        lot
      ) =>
        total +
        lot.realisedQuantity,
      0
    );

  const remainingCost =
    lots.reduce(
      (
        total,
        lot
      ) =>
        total +
        lot.remainingCost,
      0
    );

  const currentValue =
    lots.reduce(
      (
        total,
        lot
      ) =>
        total +
        lot.currentValue,
      0
    );

  const unrealisedGainLoss =
    currentValue -
    remainingCost;

  const holdingDayValues =
    lots
      .map(
        lot =>
          lot.holdingDays
      )
      .filter(
        (
          value
        ): value is number =>
          value !== null
      );

  return {
    lots,
    events,

    totals: {
      lotCount:
        lots.length,

      openLotCount:
        lots.filter(
          lot =>
            lot.status ===
            "OPEN"
        ).length,

      partialLotCount:
        lots.filter(
          lot =>
            lot.status ===
            "PARTIALLY_REALISED"
        ).length,

      closedLotCount:
        lots.filter(
          lot =>
            lot.status ===
            "CLOSED"
        ).length,

      originalQuantity,
      remainingQuantity,
      realisedQuantity,

      remainingCost,
      currentValue,

      unrealisedGainLoss,

      unrealisedGainLossPercent:
        safePercent(
          unrealisedGainLoss,
          remainingCost
        ),

      oldestHoldingDays:
        holdingDayValues.length >
        0
          ? Math.max(
              ...holdingDayValues
            )
          : null,

      averageHoldingDays:
        holdingDayValues.length >
        0
          ? holdingDayValues.reduce(
              (
                total,
                value
              ) =>
                total +
                value,
              0
            ) /
            holdingDayValues.length
          : null,

      eventCount:
        events.length,

      buyCount:
        events.filter(
          event =>
            event.type ===
            "BUY"
        ).length,

      sellCount:
        events.filter(
          event =>
            event.type ===
            "SELL"
        ).length,

      dividendCount:
        events.filter(
          event =>
            event.type ===
              "DIVIDEND" ||
            event.type ===
              "DRP"
        ).length,

      corporateActionCount:
        events.filter(
          event =>
            event.type ===
              "CORPORATE_ACTION" ||
            event.type ===
              "SPLIT"
        ).length,
    },
  };
}
