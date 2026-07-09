import type { FifoDisposal } from "./fifo";

export type DiscountSummary = {
  eligibleGainAud: number;
  nonEligibleGainAud: number;
  discountAud: number;
  taxableGainAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateDiscountSummary(disposals: FifoDisposal[]): DiscountSummary {
  const gains = disposals.filter((row) => row.realisedGainAud > 0);
  const totalGain = gains.reduce((sum, row) => sum + row.realisedGainAud, 0);

  return {
    eligibleGainAud: round(0),
    nonEligibleGainAud: round(totalGain),
    discountAud: round(0),
    taxableGainAud: round(totalGain),
  };
}
