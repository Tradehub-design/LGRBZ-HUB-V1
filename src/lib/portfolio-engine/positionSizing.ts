export type PositionSizeModel = {
  portfolioValueAud: number;
  riskPercent: number;
  maxPositionAud: number;
  suggestedStarterAud: number;
  maxHighRiskAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculatePositionSizing(params: {
  portfolioValueAud: number;
  riskPercent?: number;
}): PositionSizeModel {
  const riskPercent = params.riskPercent ?? 5;

  return {
    portfolioValueAud: round(params.portfolioValueAud),
    riskPercent,
    maxPositionAud: round(params.portfolioValueAud * (riskPercent / 100)),
    suggestedStarterAud: round(params.portfolioValueAud * 0.02),
    maxHighRiskAud: round(params.portfolioValueAud * 0.03),
  };
}
