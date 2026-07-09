export type FireProjection = {
  annualExpenseAud: number;
  fireNumberAud: number;
  currentPortfolioAud: number;
  progressPercent: number;
  gapAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateFireProjection(params: {
  currentPortfolioAud: number;
  annualExpenseAud?: number;
  withdrawalRatePercent?: number;
}): FireProjection {
  const annualExpenseAud = params.annualExpenseAud ?? 72000;
  const withdrawalRatePercent = params.withdrawalRatePercent ?? 4;
  const fireNumberAud = annualExpenseAud / (withdrawalRatePercent / 100);

  return {
    annualExpenseAud: round(annualExpenseAud),
    fireNumberAud: round(fireNumberAud),
    currentPortfolioAud: round(params.currentPortfolioAud),
    progressPercent: round((params.currentPortfolioAud / fireNumberAud) * 100),
    gapAud: round(Math.max(fireNumberAud - params.currentPortfolioAud, 0)),
  };
}
