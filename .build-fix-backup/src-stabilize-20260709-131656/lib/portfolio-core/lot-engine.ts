export type CostBasisMethod = "FIFO" | "LIFO" | "AVERAGE_COST";

export type CoreTransaction = {
  id: string;
  date: string;
  action: string;
  assetTicker: string;
  quantity: number;
  price: number;
  fiatFees: number;
  currency: string;
  platform: string;
};

export type HoldingLot = {
  id: string;
  sourceTransactionId: string;
  ticker: string;
  platform: string;
  acquiredDate: string;
  originalQuantity: number;
  remainingQuantity: number;
  unitCost: number;
  totalCost: number;
  fees: number;
  currency: string;
};

export type RealisedDisposal = {
  sellTransactionId: string;
  buyTransactionId: string;
  ticker: string;
  platform: string;
  acquiredDate: string;
  disposalDate: string;
  quantity: number;
  proceeds: number;
  costBase: number;
  realisedPl: number;
  currency: string;
};

function isBuy(action: string) {
  return action.toLowerCase() === "buy";
}

function isSell(action: string) {
  return action.toLowerCase() === "sell";
}

function round(value: number) {
  return Math.round((value || 0) * 1000000) / 1000000;
}

export function buildLotsAndDisposals(
  transactions: CoreTransaction[],
  method: CostBasisMethod = "FIFO",
) {
  const lots: HoldingLot[] = [];
  const disposals: RealisedDisposal[] = [];
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  for (const tx of sorted) {
    if (!tx.assetTicker || tx.assetTicker.toLowerCase() === "cash") continue;

    const ticker = tx.assetTicker.toUpperCase();
    const platform = tx.platform || "Unknown";

    if (isBuy(tx.action)) {
      const totalCost = tx.quantity * tx.price + (tx.fiatFees || 0);

      lots.push({
        id: `lot-${tx.id}`,
        sourceTransactionId: tx.id,
        ticker,
        platform,
        acquiredDate: tx.date,
        originalQuantity: round(tx.quantity),
        remainingQuantity: round(tx.quantity),
        unitCost: tx.quantity ? round(totalCost / tx.quantity) : 0,
        totalCost: round(totalCost),
        fees: round(tx.fiatFees || 0),
        currency: tx.currency || "AUD",
      });
    }

    if (isSell(tx.action)) {
      let remainingToSell = round(tx.quantity);
      const proceedsTotal = tx.quantity * tx.price - (tx.fiatFees || 0);

      const candidateLots = lots
        .filter((lot) => lot.ticker === ticker && lot.remainingQuantity > 0)
        .sort((a, b) =>
          method === "LIFO"
            ? b.acquiredDate.localeCompare(a.acquiredDate)
            : a.acquiredDate.localeCompare(b.acquiredDate),
        );

      for (const lot of candidateLots) {
        if (remainingToSell <= 0) break;

        const usedQty = Math.min(lot.remainingQuantity, remainingToSell);
        const sellRatio = tx.quantity ? usedQty / tx.quantity : 0;
        const proceeds = proceedsTotal * sellRatio;
        const costBase = lot.unitCost * usedQty;

        lot.remainingQuantity = round(lot.remainingQuantity - usedQty);
        remainingToSell = round(remainingToSell - usedQty);

        disposals.push({
          sellTransactionId: tx.id,
          buyTransactionId: lot.sourceTransactionId,
          ticker,
          platform,
          acquiredDate: lot.acquiredDate,
          disposalDate: tx.date,
          quantity: round(usedQty),
          proceeds: round(proceeds),
          costBase: round(costBase),
          realisedPl: round(proceeds - costBase),
          currency: tx.currency || lot.currency || "AUD",
        });
      }

      if (remainingToSell > 0.000001) {
        console.warn(`Oversold ${ticker}: ${remainingToSell} units could not be matched to lots.`);
      }
    }
  }

  return {
    openLots: lots.filter((lot) => lot.remainingQuantity > 0),
    allLots: lots,
    disposals,
  };
}
