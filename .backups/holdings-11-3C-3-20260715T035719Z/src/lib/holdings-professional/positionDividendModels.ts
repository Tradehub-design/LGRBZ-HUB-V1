export type PositionDividendStatus =
  | "ANNOUNCED"
  | "EXPECTED"
  | "FORECAST"
  | "PAID"
  | "CANCELLED";

export type PositionDividendEvent = {
  id: string;

  symbol: string;

  exDividendDate: string | null;
  recordDate: string | null;
  paymentDate: string | null;

  amountPerShare: number;
  quantity: number;

  grossAmount: number;
  withholdingTax: number;
  frankingCredit: number;
  netAmount: number;

  currency: string;

  status: PositionDividendStatus;
  confidence: number;

  source: unknown;
};

export type PositionDividendYear = {
  year: number;

  grossIncome: number;
  netIncome: number;
  frankingCredits: number;
  withholdingTax: number;

  paymentCount: number;

  growthPercent: number | null;
};

export type PositionDividendMonth = {
  month: number;
  monthLabel: string;

  grossIncome: number;
  netIncome: number;

  paymentCount: number;
};

export type PositionDividendSnapshot = {
  events: PositionDividendEvent[];

  historicalEvents: PositionDividendEvent[];
  upcomingEvents: PositionDividendEvent[];

  annualHistory: PositionDividendYear[];
  monthlyProfile: PositionDividendMonth[];

  nextPayment: PositionDividendEvent | null;

  totals: {
    historicalGrossIncome: number;
    historicalNetIncome: number;

    upcomingGrossIncome: number;
    upcomingNetIncome: number;

    forwardAnnualIncome: number;
    monthlyAverageIncome: number;

    currentYield: number | null;
    yieldOnCost: number | null;
    incomeContribution: number | null;

    latestAnnualGrowth: number | null;
    compoundAnnualGrowth: number | null;

    averageConfidence: number;

    historicalPaymentCount: number;
    upcomingPaymentCount: number;

    daysUntilNextPayment: number | null;
    daysUntilNextExDividend: number | null;
  };
};
