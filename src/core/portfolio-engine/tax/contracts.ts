import type {
  PortfolioDashboardSnapshot,
} from "../dashboard/contracts";

import type {
  ValidationIssue,
} from "../contracts";

export type TaxFinancialYear = {
  startDate: string;
  endDate: string;
  label: string;
};

export type TaxTransactionCategory =
  | "CAPITAL_GAIN"
  | "CAPITAL_LOSS"
  | "DIVIDEND"
  | "INTEREST"
  | "FEE"
  | "TAX"
  | "OTHER";

export type TaxTransactionRow = {
  transactionId: string;

  date: string;
  action: string;
  category: TaxTransactionCategory;

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

  source:
    | "TRANSACTION"
    | "PORTFOLIO_REPLAY"
    | "DIVIDEND_ENGINE";
};

export type PortfolioTaxTotals = {
  realisedCapitalGainAud: number;
  realisedCapitalLossAud: number;
  netRealisedCapitalGainAud: number;

  dividendIncomeAud: number;
  interestIncomeAud: number;

  frankingCreditsAud: number;
  withholdingTaxAud: number;

  transactionFeesAud: number;
  recordedTaxAud: number;

  grossAssessableIncomeAud: number;
};

export type PortfolioTaxDataQuality = {
  valid: boolean;

  issues: ValidationIssue[];

  transactionCount: number;
  sellTransactionCount: number;
  dividendTransactionCount: number;
  interestTransactionCount: number;

  unresolvedRealisedGainCount: number;

  usedDividendEngineFrankingFallback: boolean;
  usedDividendEngineWithholdingFallback: boolean;
};

export type PortfolioTaxSnapshot = {
  generatedAt: string;

  portfolioSnapshotId: string;
  dividendSnapshotId: string;
  dashboardSnapshotId: string;

  financialYear:
    TaxFinancialYear;

  rows:
    TaxTransactionRow[];

  totals:
    PortfolioTaxTotals;

  dataQuality:
    PortfolioTaxDataQuality;

  dashboard:
    PortfolioDashboardSnapshot;
};

export type PortfolioTaxBuildInput = {
  dashboard:
    PortfolioDashboardSnapshot;

  now?: string;
};
