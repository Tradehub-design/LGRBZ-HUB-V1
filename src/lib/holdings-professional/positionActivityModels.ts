export type PositionLotStatus =
  | "OPEN"
  | "PARTIALLY_REALISED"
  | "CLOSED";

export type PositionFifoLot = {
  id: string;

  symbol: string;

  purchaseDate: string | null;

  originalQuantity: number;
  remainingQuantity: number;
  realisedQuantity: number;

  purchasePrice: number;
  currentPrice: number | null;

  originalCost: number;
  remainingCost: number;
  currentValue: number;

  unrealisedGainLoss: number;
  unrealisedGainLossPercent: number | null;

  holdingDays: number | null;

  broker: string;
  account: string;
  currency: string;

  status: PositionLotStatus;
};

export type PositionActivityType =
  | "BUY"
  | "SELL"
  | "DIVIDEND"
  | "DRP"
  | "SPLIT"
  | "TRANSFER"
  | "FEE"
  | "CORPORATE_ACTION"
  | "OTHER";

export type PositionActivityEvent = {
  id: string;

  symbol: string;

  type: PositionActivityType;

  date: string | null;

  title: string;
  description: string;

  quantity: number | null;
  price: number | null;

  grossAmount: number | null;
  fees: number;
  netAmount: number | null;

  broker: string;
  account: string;
  currency: string;

  source: unknown;
};

export type PositionActivityFilter =
  | "ALL"
  | PositionActivityType;

export type PositionActivitySnapshot = {
  lots: PositionFifoLot[];

  events: PositionActivityEvent[];

  totals: {
    lotCount: number;

    openLotCount: number;
    partialLotCount: number;
    closedLotCount: number;

    originalQuantity: number;
    remainingQuantity: number;
    realisedQuantity: number;

    remainingCost: number;
    currentValue: number;

    unrealisedGainLoss: number;
    unrealisedGainLossPercent: number | null;

    oldestHoldingDays: number | null;
    averageHoldingDays: number | null;

    eventCount: number;

    buyCount: number;
    sellCount: number;
    dividendCount: number;
    corporateActionCount: number;
  };
};
