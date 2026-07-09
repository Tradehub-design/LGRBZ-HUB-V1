import type { LedgerRow } from "./types";

export type FifoLot = {
  id: string;
  ticker: string;
  platform: string;
  buyDate: string;
  quantity: number;
  remainingQuantity: number;
  unitCostAud: number;
  totalCostAud: number;
};

export type FifoDisposal = {
  id: string;
  ticker: string;
  sellDate: string;
  quantitySold: number;
  proceedsAud: number;
  costBaseAud: number;
  realisedGainAud: number;
};

export type FifoResult = {
  openLots: FifoLot[];
  disposals: FifoDisposal[];
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateFifoLots(transactions: LedgerRow[]): FifoResult {
  const openLots: FifoLot[] = [];
  const disposals: FifoDisposal[] = [];

  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((tx) => {
    if (tx.action === "Buy" && tx.quantity > 0) {
      const totalCostAud = Math.abs(tx.totalFeesIncludedAud || tx.totalAud || tx.quantity * tx.price);

      openLots.push({
        id: `lot-${tx.id}`,
        ticker: tx.assetTicker,
        platform: tx.platform,
        buyDate: tx.date,
        quantity: tx.quantity,
        remainingQuantity: tx.quantity,
        unitCostAud: round(totalCostAud / tx.quantity),
        totalCostAud: round(totalCostAud),
      });
    }

    if (tx.action === "Sell" && tx.quantity > 0) {
      let quantityToSell = tx.quantity;
      let costBaseAud = 0;

      const matchingLots = openLots.filter(
        (lot) => lot.ticker === tx.assetTicker && lot.remainingQuantity > 0,
      );

      matchingLots.forEach((lot) => {
        if (quantityToSell <= 0) return;

        const quantityUsed = Math.min(quantityToSell, lot.remainingQuantity);

        costBaseAud += quantityUsed * lot.unitCostAud;
        lot.remainingQuantity = round(lot.remainingQuantity - quantityUsed);
        quantityToSell = round(quantityToSell - quantityUsed);
      });

      const proceedsAud = Math.abs(tx.totalFeesIncludedAud || tx.totalAud);

      disposals.push({
        id: `disposal-${tx.id}`,
        ticker: tx.assetTicker,
        sellDate: tx.date,
        quantitySold: tx.quantity,
        proceedsAud: round(proceedsAud),
        costBaseAud: round(costBaseAud),
        realisedGainAud: round(proceedsAud - costBaseAud),
      });
    }
  });

  return {
    openLots: openLots.filter((lot) => lot.remainingQuantity > 0),
    disposals,
  };
}
