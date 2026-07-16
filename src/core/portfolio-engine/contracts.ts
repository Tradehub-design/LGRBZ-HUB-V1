/**
 * LGRBZ-HUB V2 canonical Portfolio Engine contracts.
 *
 * This folder is the authoritative calculation boundary for portfolio data.
 *
 * Data flow:
 *
 * Transactions
 *   -> Portfolio Engine
 *   -> Holdings
 *   -> Live valuation
 *   -> Dividends
 *   -> Analytics
 *   -> Dashboard
 *   -> Reports
 *
 * UI components must consume completed engine outputs and must not recreate
 * portfolio calculations independently.
 */

export const PORTFOLIO_ENGINE_SCHEMA_VERSION = 1 as const;

export type PortfolioEngineSchemaVersion =
  typeof PORTFOLIO_ENGINE_SCHEMA_VERSION;

export const SUPPORTED_CURRENCIES = [
  "AUD",
  "USD",
  "NZD",
  "GBP",
  "EUR",
  "CAD",
  "JPY",
  "HKD",
  "SGD",
  "CHF",
  "CNY",
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export const SUPPORTED_MARKETS = [
  "ASX",
  "US",
  "UNKNOWN",
] as const;

export type MarketCode = (typeof SUPPORTED_MARKETS)[number];

export const TRANSACTION_ACTIONS = [
  "BUY",
  "SELL",
  "DIVIDEND",
  "DIVIDEND_REINVESTMENT",
  "INTEREST",
  "DEPOSIT",
  "WITHDRAWAL",
  "FEE",
  "TAX",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "SPLIT",
  "CONSOLIDATION",
  "RETURN_OF_CAPITAL",
  "ADJUSTMENT",
] as const;

export type TransactionAction = (typeof TRANSACTION_ACTIONS)[number];

export const TRADE_ACTIONS = [
  "BUY",
  "SELL",
  "DIVIDEND_REINVESTMENT",
] as const;

export type TradeAction = (typeof TRADE_ACTIONS)[number];

export const INCOME_ACTIONS = [
  "DIVIDEND",
  "INTEREST",
] as const;

export type IncomeAction = (typeof INCOME_ACTIONS)[number];

export const CASH_ACTIONS = [
  "DEPOSIT",
  "WITHDRAWAL",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "FEE",
  "TAX",
  "DIVIDEND",
  "INTEREST",
  "RETURN_OF_CAPITAL",
  "ADJUSTMENT",
] as const;

export type CashAction = (typeof CASH_ACTIONS)[number];

export const CORPORATE_ACTIONS = [
  "SPLIT",
  "CONSOLIDATION",
  "RETURN_OF_CAPITAL",
] as const;

export type CorporateAction = (typeof CORPORATE_ACTIONS)[number];

export type TransactionSource =
  | "excel-seed"
  | "manual"
  | "broker-sync"
  | "system";

export type TransactionStatus =
  | "posted"
  | "pending"
  | "cancelled"
  | "invalid";

export type CostBasisMethod = "AVERAGE" | "FIFO";

export type QuoteSource =
  | "LIVE"
  | "CACHE"
  | "PREVIOUS_CLOSE"
  | "TRANSACTION_FALLBACK"
  | "UNAVAILABLE";

export type QuoteQuality =
  | "LIVE"
  | "DELAYED"
  | "STALE"
  | "FALLBACK"
  | "UNAVAILABLE";

export type ValidationSeverity = "error" | "warning" | "information";

export type ValidationIssueCode =
  | "MISSING_ID"
  | "INVALID_DATE"
  | "INVALID_ACTION"
  | "MISSING_TICKER"
  | "INVALID_QUANTITY"
  | "INVALID_PRICE"
  | "INVALID_FEES"
  | "INVALID_GROSS_AMOUNT"
  | "INVALID_NET_AMOUNT"
  | "UNSUPPORTED_CURRENCY"
  | "MISSING_FX_RATE"
  | "DUPLICATE_TRANSACTION"
  | "SELL_EXCEEDS_POSITION"
  | "INVALID_CORPORATE_ACTION"
  | "INCONSISTENT_AMOUNT"
  | "UNCLASSIFIED_TRANSACTION";

export type ValidationIssue = {
  code: ValidationIssueCode;
  severity: ValidationSeverity;
  message: string;
  transactionId?: string;
  field?: string;
  suppliedValue?: unknown;
};

export type EntityMetadata = {
  createdAt: string;
  updatedAt: string;
};

export type SecurityIdentity = {
  /**
   * Canonical exchange-aware identifier.
   *
   * Examples:
   *   ASX:SEMI
   *   US:AAPL
   */
  securityId: string;

  /**
   * Display ticker without provider-specific suffix unless required by the UI.
   */
  ticker: string;

  /**
   * Market used for quote resolution.
   */
  market: MarketCode;

  /**
   * Provider-compatible ticker.
   *
   * Examples:
   *   SEMI.AX
   *   AAPL
   */
  quoteTicker: string;

  name: string;
  isin?: string;
};

export type Classification = {
  assetClass: string;
  sector: string;
  industry: string;
  country: string;
  strategy: string;
};

export type AccountIdentity = {
  accountId: string;
  accountName: string;
  platform: string;
};

export type TaxMetadata = {
  financialYear?: string;
  frankingPercent?: number;
  frankingCreditAud?: number;
  withholdingTaxAud?: number;
  deductibleFeeAud?: number;
};

export type CorporateActionMetadata = {
  ratioNumerator?: number;
  ratioDenominator?: number;
  relatedTransactionId?: string;
};

export type TransactionAmounts = {
  /**
   * Absolute quantity represented by this transaction.
   *
   * Direction is controlled by action, not by a negative quantity.
   */
  quantity: number;

  /**
   * Unit price in transaction currency.
   */
  unitPrice: number;

  /**
   * Absolute brokerage and other direct transaction fees in transaction
   * currency.
   */
  fees: number;

  /**
   * Gross amount before fees and taxes in transaction currency.
   */
  grossAmount: number;

  /**
   * Cash movement amount after fees and taxes in transaction currency.
   *
   * The value remains positive. The Portfolio Engine derives direction from
   * action.
   */
  netAmount: number;

  /**
   * Foreign exchange rate expressed as AUD received per one unit of the
   * transaction currency.
   *
   * AUD transactions use 1.
   */
  fxRateToAud: number;

  quantityPrecision: number;
  moneyPrecision: number;
};

export type PortfolioTransaction = EntityMetadata & {
  schemaVersion: PortfolioEngineSchemaVersion;
  id: string;
  source: TransactionSource;
  sourceRow?: number;
  externalId?: string;

  status: TransactionStatus;
  action: TransactionAction;

  tradeDate: string;
  settlementDate?: string;

  security: SecurityIdentity | null;
  account: AccountIdentity;
  classification: Classification;

  currency: CurrencyCode;
  amounts: TransactionAmounts;

  tax: TaxMetadata;
  corporateAction: CorporateActionMetadata;

  notes: string;
  tags: string[];

  /**
   * Original imported fields retained for auditability.
   *
   * raw is never used directly for calculations.
   */
  raw?: Readonly<Record<string, unknown>>;
};

export type TransactionLedger = {
  schemaVersion: PortfolioEngineSchemaVersion;
  generatedAt: string;
  transactions: PortfolioTransaction[];
  issues: ValidationIssue[];
  rejectedCount: number;
  acceptedCount: number;
};

export type PositionLot = {
  lotId: string;
  securityId: string;
  accountId: string;
  openedByTransactionId: string;
  openedAt: string;

  originalQuantity: number;
  remainingQuantity: number;

  originalCostAud: number;
  remainingCostAud: number;

  unitCostAud: number;
};

export type RealisedDisposal = {
  disposalId: string;
  transactionId: string;
  securityId: string;
  accountId: string;
  disposedAt: string;

  quantity: number;
  proceedsAud: number;
  feesAud: number;
  costBaseRemovedAud: number;
  realisedGainAud: number;

  matchedLots: Array<{
    lotId: string;
    quantity: number;
    costBaseAud: number;
  }>;
};

export type HoldingCostState = {
  quantity: number;
  costBaseAud: number;
  averageCostAud: number;
  realisedGainAud: number;
  realisedProceedsAud: number;
  disposedCostBaseAud: number;
};

export type QuoteSnapshot = {
  securityId: string;
  ticker: string;
  quoteTicker: string;
  market: MarketCode;
  currency: CurrencyCode;

  price: number;
  previousClose: number | null;

  source: QuoteSource;
  quality: QuoteQuality;

  provider: string;
  quotedAt: string | null;
  receivedAt: string;
  cacheExpiresAt: string | null;

  error?: string;
};

export type HoldingValuation = {
  marketPriceLocal: number;
  marketPriceAud: number;
  marketValueLocal: number;
  marketValueAud: number;
  fxRateToAud: number;

  unrealisedGainAud: number;
  unrealisedGainPercent: number;

  quoteSource: QuoteSource;
  quoteQuality: QuoteQuality;
  quoteProvider: string;
  quotedAt: string | null;
};

export type PortfolioHolding = {
  holdingId: string;

  security: SecurityIdentity;
  account: AccountIdentity;
  classification: Classification;

  currency: CurrencyCode;
  status: "OPEN" | "CLOSED";

  quantity: number;

  averageCostAud: number;
  costBaseAud: number;

  realisedGainAud: number;
  realisedProceedsAud: number;
  disposedCostBaseAud: number;

  valuation: HoldingValuation;

  totalIncomeAud: number;
  totalReturnAud: number;
  totalReturnPercent: number;
  portfolioWeightPercent: number;

  firstTransactionAt: string;
  lastTransactionAt: string;

  lots: PositionLot[];
};

export type CashBalance = {
  currency: CurrencyCode;
  localBalance: number;
  fxRateToAud: number;
  balanceAud: number;
};

export type PortfolioCashSummary = {
  balances: CashBalance[];

  cashAud: number;
  depositsAud: number;
  withdrawalsAud: number;
  transfersInAud: number;
  transfersOutAud: number;
  dividendsReceivedAud: number;
  interestReceivedAud: number;
  feesPaidAud: number;
  taxPaidAud: number;
  returnOfCapitalAud: number;
};

export type AllocationDimension =
  | "security"
  | "assetClass"
  | "sector"
  | "industry"
  | "country"
  | "currency"
  | "platform"
  | "account"
  | "strategy";

export type AllocationSlice = {
  key: string;
  label: string;
  marketValueAud: number;
  percent: number;
  holdingCount: number;
};

export type PortfolioAllocation = Record<
  AllocationDimension,
  AllocationSlice[]
>;

export type PortfolioTotals = {
  securitiesMarketValueAud: number;
  cashAud: number;
  portfolioValueAud: number;

  openCostBaseAud: number;

  realisedGainAud: number;
  unrealisedGainAud: number;

  dividendsReceivedAud: number;
  interestReceivedAud: number;

  feesPaidAud: number;
  taxPaidAud: number;

  totalIncomeAud: number;
  totalReturnAud: number;
  totalReturnPercent: number;

  openPositionCount: number;
  closedPositionCount: number;
  transactionCount: number;
};

export type PortfolioDataQuality = {
  isValid: boolean;
  errorCount: number;
  warningCount: number;

  missingQuoteCount: number;
  fallbackQuoteCount: number;
  staleQuoteCount: number;

  rejectedTransactionCount: number;
  acceptedTransactionCount: number;

  issues: ValidationIssue[];
};

export type PortfolioSnapshot = {
  schemaVersion: PortfolioEngineSchemaVersion;
  snapshotId: string;
  generatedAt: string;
  ledgerGeneratedAt: string;

  baseCurrency: "AUD";
  costBasisMethod: CostBasisMethod;

  transactions: PortfolioTransaction[];
  holdings: PortfolioHolding[];
  openHoldings: PortfolioHolding[];
  closedHoldings: PortfolioHolding[];

  disposals: RealisedDisposal[];

  cash: PortfolioCashSummary;
  totals: PortfolioTotals;
  allocation: PortfolioAllocation;

  quotes: Record<string, QuoteSnapshot>;
  dataQuality: PortfolioDataQuality;
};

export type PortfolioEngineBuildInput = {
  transactions: PortfolioTransaction[];
  quotes?: Record<string, QuoteSnapshot>;
  fxRatesToAud?: Partial<Record<CurrencyCode, number>>;
  costBasisMethod?: CostBasisMethod;
  generatedAt?: string;
};

export type PortfolioEngineBuildResult = {
  snapshot: PortfolioSnapshot;
  issues: ValidationIssue[];
};

export type TransactionSortKey = {
  tradeDate: string;
  sourceRow: number;
  id: string;
};

export function isSupportedCurrency(
  value: string,
): value is CurrencyCode {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export function isTransactionAction(
  value: string,
): value is TransactionAction {
  return (TRANSACTION_ACTIONS as readonly string[]).includes(value);
}

export function isTradeAction(
  value: TransactionAction,
): value is TradeAction {
  return (TRADE_ACTIONS as readonly TransactionAction[]).includes(value);
}

export function isIncomeAction(
  value: TransactionAction,
): value is IncomeAction {
  return (INCOME_ACTIONS as readonly TransactionAction[]).includes(value);
}

export function isCashAction(
  value: TransactionAction,
): value is CashAction {
  return (CASH_ACTIONS as readonly TransactionAction[]).includes(value);
}

export function isCorporateAction(
  value: TransactionAction,
): value is CorporateAction {
  return (CORPORATE_ACTIONS as readonly TransactionAction[]).includes(value);
}
