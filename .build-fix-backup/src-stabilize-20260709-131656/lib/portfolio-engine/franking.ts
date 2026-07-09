import type { DividendRecord } from "./types";

export type FrankingSummary = {
  cashDividendAud: number;
  frankingCreditsAud: number;
  grossedUpIncomeAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateFranking(dividends: DividendRecord[]): FrankingSummary {
  const cashDividendAud = dividends.reduce((sum, dividend) => sum + dividend.amountAud, 0);

  return {
    cashDividendAud: round(cashDividendAud),
    frankingCreditsAud: 0,
    grossedUpIncomeAud: round(cashDividendAud),
  };
}
