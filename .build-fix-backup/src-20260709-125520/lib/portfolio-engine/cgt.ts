import type { FifoDisposal } from "./fifo";

export type CgtSummary = {
  totalProceedsAud: number;
  totalCostBaseAud: number;
  capitalGainsAud: number;
  capitalLossesAud: number;
  netCapitalGainAud: number;
  disposalCount: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateCgtSummary(disposals: FifoDisposal[]): CgtSummary {
  const totalProceedsAud = disposals.reduce((sum, row) => sum + row.proceedsAud, 0);
  const totalCostBaseAud = disposals.reduce((sum, row) => sum + row.costBaseAud, 0);

  const capitalGainsAud = disposals
    .filter((row) => row.realisedGainAud > 0)
    .reduce((sum, row) => sum + row.realisedGainAud, 0);

  const capitalLossesAud = disposals
    .filter((row) => row.realisedGainAud < 0)
    .reduce((sum, row) => sum + Math.abs(row.realisedGainAud), 0);

  return {
    totalProceedsAud: round(totalProceedsAud),
    totalCostBaseAud: round(totalCostBaseAud),
    capitalGainsAud: round(capitalGainsAud),
    capitalLossesAud: round(capitalLossesAud),
    netCapitalGainAud: round(capitalGainsAud - capitalLossesAud),
    disposalCount: disposals.length,
  };
}
