import type {
  AccountIdentity,
  Classification,
  CostBasisMethod,
  CurrencyCode,
  PortfolioCashSummary,
  PortfolioTransaction,
  PositionLot,
  RealisedDisposal,
  SecurityIdentity,
  ValidationIssue,
} from "./contracts";

export type MutablePositionState = {
  holdingId: string;

  security: SecurityIdentity;
  account: AccountIdentity;
  classification: Classification;
  currency: CurrencyCode;

  quantity: number;
  costBaseAud: number;
  averageCostAud: number;

  realisedGainAud: number;
  realisedProceedsAud: number;
  disposedCostBaseAud: number;

  totalIncomeAud: number;
  dividendsReceivedAud: number;
  interestReceivedAud: number;
  returnOfCapitalAud: number;

  firstTransactionAt: string;
  lastTransactionAt: string;

  lots: PositionLot[];
};

export type SecurityIncomeState = {
  securityId: string;
  accountId: string;

  dividendsReceivedAud: number;
  interestReceivedAud: number;
  frankingCreditsAud: number;
  withholdingTaxAud: number;
  returnOfCapitalAud: number;

  totalIncomeAud: number;
};

export type ReplayState = {
  costBasisMethod: CostBasisMethod;

  positions: Map<string, MutablePositionState>;
  disposals: RealisedDisposal[];

  securityIncome: Map<string, SecurityIncomeState>;

  cash: PortfolioCashSummary;
  issues: ValidationIssue[];

  processedTransactions: PortfolioTransaction[];
  rejectedTransactions: PortfolioTransaction[];
};

export type ReplayOptions = {
  costBasisMethod?: CostBasisMethod;

  /**
   * When true, a transfer-in with no cost amount may be accepted with a zero
   * cost base. The engine still emits a warning because tax reporting will
   * remain incomplete.
   */
  allowUnknownTransferCost?: boolean;

  /**
   * Small quantity tolerance used to prevent floating-point dust from leaving
   * false open positions.
   */
  quantityTolerance?: number;
};

export type ReplayPositionResult = {
  holdingId: string;

  security: SecurityIdentity;
  account: AccountIdentity;
  classification: Classification;
  currency: CurrencyCode;

  quantity: number;
  costBaseAud: number;
  averageCostAud: number;

  realisedGainAud: number;
  realisedProceedsAud: number;
  disposedCostBaseAud: number;

  totalIncomeAud: number;
  dividendsReceivedAud: number;
  interestReceivedAud: number;
  returnOfCapitalAud: number;

  firstTransactionAt: string;
  lastTransactionAt: string;

  lots: PositionLot[];
};

export type PortfolioReplayResult = {
  costBasisMethod: CostBasisMethod;

  positions: ReplayPositionResult[];
  openPositions: ReplayPositionResult[];
  closedPositions: ReplayPositionResult[];

  disposals: RealisedDisposal[];

  cash: PortfolioCashSummary;

  securityIncome: SecurityIncomeState[];

  processedTransactions: PortfolioTransaction[];
  rejectedTransactions: PortfolioTransaction[];

  issues: ValidationIssue[];

  processedCount: number;
  rejectedCount: number;
};
