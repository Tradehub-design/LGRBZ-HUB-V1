export type RetirementProjection = {
  targetIncomeAud: number;
  withdrawalRatePercent: number;
  requiredPortfolioAud: number;
  currentPortfolioAud: number;
  progressPercent: number;
  gapAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateRetirementProjection(params: {
  currentPortfolioAud: number;
  targetIncomeAud?: number;
  withdrawalRatePercent?: number;
}): RetirementProjection {
  const targetIncomeAud = params.targetIncomeAud ?? 60000;
  const withdrawalRatePercent = params.withdrawalRatePercent ?? 4;
  const requiredPortfolioAud = targetIncomeAud / (withdrawalRatePercent / 100);
  const progressPercent = requiredPortfolioAud ? (params.currentPortfolioAud / requiredPortfolioAud) * 100 : 0;

  return {
    targetIncomeAud,
    withdrawalRatePercent,
    requiredPortfolioAud: round(requiredPortfolioAud),
    currentPortfolioAud: round(params.currentPortfolioAud),
    progressPercent: round(progressPercent),
    gapAud: round(Math.max(requiredPortfolioAud - params.currentPortfolioAud, 0)),
  };
}
