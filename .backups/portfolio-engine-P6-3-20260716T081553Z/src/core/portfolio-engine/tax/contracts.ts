import type {
  PortfolioDashboardSnapshot,
} from "../dashboard/contracts";

export type TaxFinancialYear = {
  startDate: string;
  endDate: string;
  label: string;
};

export type TaxTransactionRow = {
  transactionId: string;

  date: string;
  action: string;

  ticker: string | null;
  description: string;

  grossAmountAud: number;
  feesAud: number;
  taxAud: number;

  realisedGainAud: number;
  dividendIncomeAud: number;
  interestIncomeAud: number;

  frankingCreditAud: number;
  withholdingTaxAud: number;
};

export type PortfolioTaxSnapshot = {
  generatedAt: string;

  portfolioSnapshotId: string;
  dividendSnapshotId: string;

  financialYear:
    TaxFinancialYear;

  rows:
    TaxTransactionRow[];

  totals: {
    realisedCapitalGainAud: number;
    realisedCapitalLossAud: number;
    netRealisedCapitalGainAud: number;

    dividendIncomeAud: number;
    interestIncomeAud: number;

    frankingCreditsAud: number;
    withholdingTaxAud: number;

    transactionFeesAud: number;
    recordedTaxAud: number;

    grossTaxableIncomeAud: number;
  };

  dashboard:
    PortfolioDashboardSnapshot;
};

export type PortfolioTaxBuildInput = {
  dashboard:
    PortfolioDashboardSnapshot;

  now?: string;
};
