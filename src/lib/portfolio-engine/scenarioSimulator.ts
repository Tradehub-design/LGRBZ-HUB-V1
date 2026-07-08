export type ScenarioResult = {
  name: string;
  startingValueAud: number;
  monthlyContributionAud: number;
  annualReturnPercent: number;
  years: number;
  projectedValueAud: number;
  projectedGainAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateScenario(params: {
  name: string;
  startingValueAud: number;
  monthlyContributionAud: number;
  annualReturnPercent: number;
  years: number;
}): ScenarioResult {
  const monthlyRate = params.annualReturnPercent / 100 / 12;
  const months = params.years * 12;

  let value = params.startingValueAud;

  for (let i = 0; i < months; i += 1) {
    value = value * (1 + monthlyRate) + params.monthlyContributionAud;
  }

  return {
    ...params,
    projectedValueAud: round(value),
    projectedGainAud: round(value - params.startingValueAud - params.monthlyContributionAud * months),
  };
}

export function buildDefaultScenarios(currentValueAud: number): ScenarioResult[] {
  return [
    calculateScenario({
      name: "Conservative",
      startingValueAud: currentValueAud,
      monthlyContributionAud: 500,
      annualReturnPercent: 5,
      years: 10,
    }),
    calculateScenario({
      name: "Balanced",
      startingValueAud: currentValueAud,
      monthlyContributionAud: 1000,
      annualReturnPercent: 7,
      years: 10,
    }),
    calculateScenario({
      name: "Growth",
      startingValueAud: currentValueAud,
      monthlyContributionAud: 1500,
      annualReturnPercent: 9,
      years: 10,
    }),
  ];
}
