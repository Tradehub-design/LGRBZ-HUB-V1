import type {
  CostBasisMethod,
  PortfolioTransaction,
  PositionLot,
  RealisedDisposal,
} from "./contracts";

import {
  addMoney,
  clampNearZero,
  divideMoney,
  multiplyMoney,
  roundMoney,
  roundQuantity,
  subtractMoney,
  toAud,
} from "./money";

export type LotDisposalResult = {
  lots: PositionLot[];
  costBaseRemovedAud: number;
  matchedLots: RealisedDisposal["matchedLots"];
  quantityMatched: number;
};

export function createAcquisitionLot(
  transaction: PortfolioTransaction,
  quantity: number,
  totalCostAud: number,
): PositionLot {
  if (!transaction.security) {
    throw new Error(
      `Cannot create acquisition lot for transaction ${transaction.id} without a security.`,
    );
  }

  const safeQuantity =
    roundQuantity(Math.max(0, quantity));

  const safeCostAud =
    roundMoney(Math.max(0, totalCostAud));

  return {
    lotId: `LOT-${transaction.id}`,

    securityId:
      transaction.security.securityId,

    accountId:
      transaction.account.accountId,

    openedByTransactionId:
      transaction.id,

    openedAt:
      transaction.tradeDate,

    originalQuantity:
      safeQuantity,

    remainingQuantity:
      safeQuantity,

    originalCostAud:
      safeCostAud,

    remainingCostAud:
      safeCostAud,

    unitCostAud:
      divideMoney(
        safeCostAud,
        safeQuantity,
        0,
      ),
  };
}

function disposeFromSingleLot(
  lot: PositionLot,
  requestedQuantity: number,
): {
  updatedLot: PositionLot;
  quantityRemoved: number;
  costBaseRemovedAud: number;
} {
  const quantityRemoved =
    roundQuantity(
      Math.min(
        lot.remainingQuantity,
        requestedQuantity,
      ),
    );

  if (quantityRemoved <= 0) {
    return {
      updatedLot: lot,
      quantityRemoved: 0,
      costBaseRemovedAud: 0,
    };
  }

  const fullLotDisposal =
    quantityRemoved >= lot.remainingQuantity;

  const costBaseRemovedAud =
    fullLotDisposal
      ? lot.remainingCostAud
      : multiplyMoney(
          quantityRemoved,
          lot.unitCostAud,
        );

  const remainingQuantity =
    roundQuantity(
      clampNearZero(
        lot.remainingQuantity -
          quantityRemoved,
      ),
    );

  const remainingCostAud =
    roundMoney(
      clampNearZero(
        lot.remainingCostAud -
          costBaseRemovedAud,
      ),
    );

  return {
    updatedLot: {
      ...lot,

      remainingQuantity,

      remainingCostAud,

      unitCostAud:
        remainingQuantity > 0
          ? divideMoney(
              remainingCostAud,
              remainingQuantity,
              0,
            )
          : lot.unitCostAud,
    },

    quantityRemoved,

    costBaseRemovedAud,
  };
}

export function disposeLotsFifo(
  currentLots: readonly PositionLot[],
  requestedQuantity: number,
  quantityTolerance = 1e-9,
): LotDisposalResult {
  let quantityRemaining =
    roundQuantity(requestedQuantity);

  let costBaseRemovedAud = 0;
  let quantityMatched = 0;

  const updatedLots: PositionLot[] = [];
  const matchedLots:
    RealisedDisposal["matchedLots"] = [];

  for (const lot of currentLots) {
    if (quantityRemaining <= quantityTolerance) {
      updatedLots.push(lot);
      continue;
    }

    const disposal =
      disposeFromSingleLot(
        lot,
        quantityRemaining,
      );

    updatedLots.push(disposal.updatedLot);

    if (disposal.quantityRemoved > 0) {
      quantityRemaining =
        roundQuantity(
          quantityRemaining -
            disposal.quantityRemoved,
        );

      quantityMatched =
        roundQuantity(
          quantityMatched +
            disposal.quantityRemoved,
        );

      costBaseRemovedAud =
        addMoney(
          costBaseRemovedAud,
          disposal.costBaseRemovedAud,
        );

      matchedLots.push({
        lotId: lot.lotId,

        quantity:
          disposal.quantityRemoved,

        costBaseAud:
          disposal.costBaseRemovedAud,
      });
    }
  }

  return {
    lots: updatedLots,
    costBaseRemovedAud,
    matchedLots,
    quantityMatched,
  };
}

export function disposeLotsAverageCost(
  currentLots: readonly PositionLot[],
  requestedQuantity: number,
  totalQuantity: number,
  totalCostBaseAud: number,
  quantityTolerance = 1e-9,
): LotDisposalResult {
  const safeRequested =
    roundQuantity(requestedQuantity);

  const safeTotalQuantity =
    roundQuantity(totalQuantity);

  if (
    safeRequested <= quantityTolerance ||
    safeTotalQuantity <= quantityTolerance
  ) {
    return {
      lots: [...currentLots],
      costBaseRemovedAud: 0,
      matchedLots: [],
      quantityMatched: 0,
    };
  }

  const quantityMatched =
    roundQuantity(
      Math.min(
        safeRequested,
        safeTotalQuantity,
      ),
    );

  const averageUnitCost =
    divideMoney(
      totalCostBaseAud,
      safeTotalQuantity,
      0,
    );

  const completePositionDisposal =
    quantityMatched >=
    safeTotalQuantity - quantityTolerance;

  const costBaseRemovedAud =
    completePositionDisposal
      ? roundMoney(totalCostBaseAud)
      : multiplyMoney(
          quantityMatched,
          averageUnitCost,
        );

  /**
   * Average-cost mode still maintains proportional lot records for audit
   * tracing. Tax matching uses the position-level average cost.
   */
  let quantityToRemove = quantityMatched;
  let remainingCostToRemove =
    costBaseRemovedAud;

  const updatedLots: PositionLot[] = [];
  const matchedLots:
    RealisedDisposal["matchedLots"] = [];

  const openLots = currentLots.filter(
    (lot) =>
      lot.remainingQuantity >
      quantityTolerance,
  );

  const openQuantity = openLots.reduce(
    (sum, lot) =>
      sum + lot.remainingQuantity,
    0,
  );

  for (
    let index = 0;
    index < currentLots.length;
    index += 1
  ) {
    const lot = currentLots[index];

    if (
      lot.remainingQuantity <= quantityTolerance ||
      quantityToRemove <= quantityTolerance
    ) {
      updatedLots.push(lot);
      continue;
    }

    const isLastOpenLot =
      openLots.at(-1)?.lotId === lot.lotId;

    const proportionalQuantity =
      isLastOpenLot
        ? quantityToRemove
        : roundQuantity(
            quantityMatched *
              (
                lot.remainingQuantity /
                openQuantity
              ),
          );

    const quantityRemoved =
      Math.min(
        lot.remainingQuantity,
        proportionalQuantity,
        quantityToRemove,
      );

    const proportionalCost =
      isLastOpenLot
        ? remainingCostToRemove
        : multiplyMoney(
            costBaseRemovedAud,
            quantityRemoved /
              quantityMatched,
          );

    const costRemoved =
      Math.min(
        lot.remainingCostAud,
        proportionalCost,
        remainingCostToRemove,
      );

    const remainingQuantity =
      roundQuantity(
        clampNearZero(
          lot.remainingQuantity -
            quantityRemoved,
        ),
      );

    const remainingCostAud =
      roundMoney(
        clampNearZero(
          lot.remainingCostAud -
            costRemoved,
        ),
      );

    updatedLots.push({
      ...lot,

      remainingQuantity,

      remainingCostAud,

      unitCostAud:
        remainingQuantity > quantityTolerance
          ? divideMoney(
              remainingCostAud,
              remainingQuantity,
              lot.unitCostAud,
            )
          : lot.unitCostAud,
    });

    matchedLots.push({
      lotId: lot.lotId,
      quantity:
        roundQuantity(quantityRemoved),
      costBaseAud:
        roundMoney(costRemoved),
    });

    quantityToRemove =
      roundQuantity(
        quantityToRemove -
          quantityRemoved,
      );

    remainingCostToRemove =
      subtractMoney(
        remainingCostToRemove,
        costRemoved,
      );
  }

  return {
    lots: updatedLots,
    costBaseRemovedAud,
    matchedLots,
    quantityMatched,
  };
}

export function disposePositionLots(input: {
  method: CostBasisMethod;
  lots: readonly PositionLot[];
  requestedQuantity: number;
  totalQuantity: number;
  totalCostBaseAud: number;
  quantityTolerance?: number;
}): LotDisposalResult {
  if (input.method === "FIFO") {
    return disposeLotsFifo(
      input.lots,
      input.requestedQuantity,
      input.quantityTolerance,
    );
  }

  return disposeLotsAverageCost(
    input.lots,
    input.requestedQuantity,
    input.totalQuantity,
    input.totalCostBaseAud,
    input.quantityTolerance,
  );
}

export function scaleLotsForCorporateAction(
  lots: readonly PositionLot[],
  ratioNumerator: number,
  ratioDenominator: number,
): PositionLot[] {
  const multiplier =
    ratioNumerator / ratioDenominator;

  return lots.map((lot) => {
    const originalQuantity =
      roundQuantity(
        lot.originalQuantity *
          multiplier,
      );

    const remainingQuantity =
      roundQuantity(
        lot.remainingQuantity *
          multiplier,
      );

    return {
      ...lot,

      originalQuantity,

      remainingQuantity,

      unitCostAud:
        remainingQuantity > 0
          ? divideMoney(
              lot.remainingCostAud,
              remainingQuantity,
              0,
            )
          : lot.unitCostAud,
    };
  });
}

export function reduceLotsForReturnOfCapital(
  lots: readonly PositionLot[],
  reductionAud: number,
  totalCostBaseAud: number,
): PositionLot[] {
  if (
    reductionAud <= 0 ||
    totalCostBaseAud <= 0
  ) {
    return [...lots];
  }

  const cappedReduction =
    Math.min(
      reductionAud,
      totalCostBaseAud,
    );

  let remainingReduction =
    cappedReduction;

  const openLots = lots.filter(
    (lot) =>
      lot.remainingCostAud > 0 &&
      lot.remainingQuantity > 0,
  );

  const lastOpenLotId =
    openLots.at(-1)?.lotId;

  return lots.map((lot) => {
    if (
      lot.remainingCostAud <= 0 ||
      remainingReduction <= 0
    ) {
      return lot;
    }

    const proportionalReduction =
      lot.lotId === lastOpenLotId
        ? remainingReduction
        : multiplyMoney(
            cappedReduction,
            lot.remainingCostAud /
              totalCostBaseAud,
          );

    const lotReduction =
      Math.min(
        lot.remainingCostAud,
        proportionalReduction,
        remainingReduction,
      );

    remainingReduction =
      subtractMoney(
        remainingReduction,
        lotReduction,
      );

    const remainingCostAud =
      subtractMoney(
        lot.remainingCostAud,
        lotReduction,
      );

    return {
      ...lot,

      remainingCostAud,

      unitCostAud:
        lot.remainingQuantity > 0
          ? divideMoney(
              remainingCostAud,
              lot.remainingQuantity,
              0,
            )
          : lot.unitCostAud,
    };
  });
}

export function transactionAcquisitionCostAud(
  transaction: PortfolioTransaction,
): number {
  const localCost =
    transaction.amounts.netAmount ||
    transaction.amounts.grossAmount +
      transaction.amounts.fees;

  return toAud(
    localCost,
    transaction.amounts.fxRateToAud,
  );
}

export function transactionSaleProceedsAud(
  transaction: PortfolioTransaction,
): number {
  const localProceeds =
    transaction.amounts.netAmount ||
    Math.max(
      0,
      transaction.amounts.grossAmount -
        transaction.amounts.fees,
    );

  return toAud(
    localProceeds,
    transaction.amounts.fxRateToAud,
  );
}

export function transactionFeesAud(
  transaction: PortfolioTransaction,
): number {
  return toAud(
    transaction.amounts.fees,
    transaction.amounts.fxRateToAud,
  );
}
