export type PortfolioGoal = {
  id: string;
  title: string;
  targetAud: number;
  currentAud: number;
  progressPercent: number;
  gapAud: number;
  category: "Portfolio" | "Income" | "Cash" | "Retirement";
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

function progress(current: number, target: number) {
  if (!target) return 0;
  return round((current / target) * 100);
}

export function buildPortfolioGoals(params: {
  totalValueAud: number;
  annualIncomeAud: number;
  cashAud: number;
  retirementTargetAud: number;
}): PortfolioGoal[] {
  const goals = [
    {
      id: "portfolio-250k",
      title: "Portfolio Value",
      targetAud: 250000,
      currentAud: params.totalValueAud,
      category: "Portfolio" as const,
    },
    {
      id: "income-12k",
      title: "Annual Dividend Income",
      targetAud: 12000,
      currentAud: params.annualIncomeAud,
      category: "Income" as const,
    },
    {
      id: "cash-10k",
      title: "Cash Reserve",
      targetAud: 10000,
      currentAud: params.cashAud,
      category: "Cash" as const,
    },
    {
      id: "retirement",
      title: "Retirement Portfolio",
      targetAud: params.retirementTargetAud,
      currentAud: params.totalValueAud,
      category: "Retirement" as const,
    },
  ];

  return goals.map((goal) => ({
    ...goal,
    currentAud: round(goal.currentAud),
    targetAud: round(goal.targetAud),
    progressPercent: progress(goal.currentAud, goal.targetAud),
    gapAud: round(Math.max(goal.targetAud - goal.currentAud, 0)),
  }));
}
