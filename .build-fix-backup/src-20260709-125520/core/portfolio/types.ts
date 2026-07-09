/**
 * ==========================================================
 * TradeHub Professional V4
 * Portfolio Engine
 * Shared Types
 * ==========================================================
 */

export type UUID = string;

export type Currency =
  | "AUD"
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "NZD"
  | "CHF"
  | "HKD"
  | "SGD";

export type AssetClass =
  | "Stock"
  | "ETF"
  | "Crypto"
  | "Cash"
  | "Bond"
  | "Commodity"
  | "Property"
  | "Forex"
  | "Option"
  | "Future"
  | "System";

export type TransactionType =
  | "Buy"
  | "Sell"
  | "Cash Deposit"
  | "Cash Withdrawal"
  | "Transfer Deposit"
  | "Transfer Send"
  | "Cash Dividend"
  | "Cash Interest"
  | "Fee"
  | "Tax"
  | "Split"
  | "Merge"
  | "Adjustment"
  | "Portfolio Snapshot"
  | "Import Complete"
  | "System";

export type RiskLevel =
  | "Very Low"
  | "Low"
  | "Medium"
  | "High"
  | "Very High";

export type PositionStatus =
  | "Open"
  | "Closed";

export interface Money {

  amount:number;

  currency:Currency;

}

export interface PortfolioTransaction {

  id:string;

  source:string;

  sourceRow:number;

  date:string;

  action:TransactionType;

  assetTicker:string;

  quantity:number;

  price:number;

  fees:number;

  currency:Currency;

  platform:string;

  assetClass:AssetClass;

  sector?:string;

  industry?:string;

  country?:string;

  exchange?:string;

  strategy?:string;

  notes?:string | null;

}

export interface PortfolioAsset {

  ticker:string;

  company:string;

  exchange:string;

  currency:Currency;

  assetClass:AssetClass;

  sector:string;

  industry:string;

  country:string;

  risk:RiskLevel;

  dividend:boolean;

  franking:number;

  aiGenerated:boolean;

}

export interface PortfolioLot {

  id:string;

  ticker:string;

  purchaseDate:string;

  quantity:number;

  remaining:number;

  purchasePrice:number;

  fees:number;

  currency:Currency;

}

export interface RealisedTrade {

  sellTransactionId:string;

  ticker:string;

  buyLotId:string;

  quantity:number;

  buyPrice:number;

  sellPrice:number;

  realisedProfit:number;

  realisedPercent:number;

  fees:number;

  openDate:string;

  closeDate:string;

}

export interface CashMovement {

  id:string;

  date:string;

  amount:number;

  currency:Currency;

  broker:string;

  type:TransactionType;

  notes?:string;

}


/* ==========================================================
 * Holdings
 * ========================================================== */

export interface HoldingMetrics {

  marketPrice:number;

  marketValue:number;

  averageCost:number;

  costBasis:number;

  realisedProfit:number;

  unrealisedProfit:number;

  totalProfit:number;

  totalReturnPercent:number;

  allocationPercent:number;

  dividendYield:number;

  yieldOnCost:number;

}

export interface Holding {

  ticker:string;

  company:string;

  exchange:string;

  currency:Currency;

  assetClass:AssetClass;

  sector:string;

  industry:string;

  country:string;

  strategy:string;

  risk:RiskLevel;

  quantity:number;

  openLots:PortfolioLot[];

  metrics:HoldingMetrics;

  firstPurchaseDate:string;

  lastPurchaseDate:string;

  isClosed:boolean;

}

/* ==========================================================
 * Cash
 * ========================================================== */

export interface CashAccount {

  broker:string;

  currency:Currency;

  balance:number;

  deposited:number;

  withdrawn:number;

  dividends:number;

  interest:number;

  fees:number;

  invested:number;

  realisedSales:number;

}

export interface CashSummary {

  accounts:CashAccount[];

  totalCash:number;

  totalDeposits:number;

  totalWithdrawals:number;

  totalDividends:number;

  totalInterest:number;

  totalFees:number;

  totalInvested:number;

  totalSales:number;

}

/* ==========================================================
 * Dividends
 * ========================================================== */

export interface DividendRecord {

  id:string;

  ticker:string;

  company:string;

  paymentDate:string;

  amount:number;

  currency:Currency;

  franking:number;

  shares:number;

  dividendPerShare:number;

}

export interface DividendSummary {

  total:number;

  monthly:number;

  yearly:number;

  forwardIncome:number;

  yield:number;

  yieldOnCost:number;

  records:DividendRecord[];

}


/* ==========================================================
 * Performance
 * ========================================================== */

export interface PerformancePeriod {

  deposits:number;

  withdrawals:number;

  dividends:number;

  interest:number;

  realisedProfit:number;

  unrealisedProfit:number;

  fees:number;

  marketValue:number;

  totalReturn:number;

  totalReturnPercent:number;

}

export interface PortfolioPerformance {

  today:PerformancePeriod;

  week:PerformancePeriod;

  month:PerformancePeriod;

  quarter:PerformancePeriod;

  year:PerformancePeriod;

  allTime:PerformancePeriod;

}

export interface SectorAllocation {

  sector:string;

  value:number;

  percentage:number;

}

export interface IndustryAllocation {

  industry:string;

  value:number;

  percentage:number;

}

export interface CountryAllocation {

  country:string;

  value:number;

  percentage:number;

}

export interface AssetAllocation {

  assetClass:AssetClass;

  value:number;

  percentage:number;

}

export interface CurrencyAllocation {

  currency:Currency;

  value:number;

  percentage:number;

}

export interface RiskAllocation {

  risk:RiskLevel;

  value:number;

  percentage:number;

}

/* ==========================================================
 * Timeline
 * ========================================================== */

export interface EquityPoint {

  date:string;

  portfolioValue:number;

  invested:number;

  profit:number;

  cash:number;

}

export interface ReplaySnapshot {

  date:string;

  holdings:Holding[];

  cash:CashSummary;

  performance:PortfolioPerformance;

  equity:number;

}

/* ==========================================================
 * Dashboard
 * ========================================================== */

export interface DashboardSummary {

  portfolioValue:number;

  investedCapital:number;

  availableCash:number;

  totalProfit:number;

  totalProfitPercent:number;

  dividendsReceived:number;

  interestReceived:number;

  totalFees:number;

  openPositions:number;

  closedPositions:number;

  highestHolding:string;

  highestHoldingValue:number;

  bestPerformer:string;

  worstPerformer:string;

}


/* ==========================================================
 * Replay
 * ========================================================== */

export interface ReplayState {

  replayEnabled:boolean;

  replayDate:string;

  snapshot:ReplaySnapshot | null;

}

export interface ReplayEvent {

  id:string;

  date:string;

  transactionId:string;

  ticker:string;

  action:TransactionType;

  quantity:number;

  price:number;

}

/* ==========================================================
 * Portfolio
 * ========================================================== */

export interface Portfolio {

  generatedAt:string;

  transactions:PortfolioTransaction[];

  holdings:Holding[];

  realisedTrades:RealisedTrade[];

  cash:CashSummary;

  dividends:DividendSummary;

  performance:PortfolioPerformance;

  dashboard:DashboardSummary;

  timeline:EquityPoint[];

  replay:ReplayState;

}

/* ==========================================================
 * Engine Results
 * ========================================================== */

export interface EngineWarnings {

  transactionId:string;

  message:string;

}

export interface ValidationResult {

  valid:boolean;

  warnings:EngineWarnings[];

}

export interface PortfolioEngineResult {

  portfolio:Portfolio;

  validation:ValidationResult;

}

/* ==========================================================
 * AI Classification
 * ========================================================== */

export interface AssetAIProfile {

  ticker:string;

  company:string;

  exchange:string;

  sector:string;

  industry:string;

  country:string;

  currency:Currency;

  marketCap:string;

  dividend:boolean;

  risk:RiskLevel;

  beta?:number;

  peRatio?:number;

  aiConfidence:number;

}

export interface AIImportSuggestion {

  ticker:string;

  suggestedCompany:string;

  suggestedSector:string;

  suggestedIndustry:string;

  suggestedCountry:string;

  suggestedExchange:string;

  suggestedRisk:RiskLevel;

  confidence:number;

}

/* ==========================================================
 * Calculator Interface
 * ========================================================== */

export interface PortfolioCalculator {

  calculate(
    transactions:PortfolioTransaction[]
  ):PortfolioEngineResult;

}

/* ==========================================================
 * FIFO Interface
 * ========================================================== */

export interface FIFOProcessor {

  process(
    transactions:PortfolioTransaction[]
  ):{

    holdings:Holding[];

    realisedTrades:RealisedTrade[];

    remainingLots:PortfolioLot[];

  };

}

/* ==========================================================
 * Cash Engine Interface
 * ========================================================== */

export interface CashCalculator {

  calculate(

    transactions:PortfolioTransaction[]

  ):CashSummary;

}

/* ==========================================================
 * Holdings Engine Interface
 * ========================================================== */

export interface HoldingsCalculator {

  build(

    holdings:Holding[]

  ):Holding[];

}

