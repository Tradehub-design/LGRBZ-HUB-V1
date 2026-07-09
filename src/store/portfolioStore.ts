import { create } from "zustand";

export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR" | "NZD" | "CAD" | "JPY" | "HKD" | "SGD" | "CHF"
  | "CNY";

export type LedgerRow = {
  id: string;
  raw: Record<string, unknown>;
  rowNumber: number;
  date: string;
  action: string;
  type?: string;
  assetTicker: string;
  ticker: string;
  platform: string;
  currency: CurrencyCode;
  quantity: number;
  price: number;
  priceAud: number;
  marketPriceAud: number;
  fiatFees: number;
  feesAud: number;
  total: number;
  totalAud: number;
  totalFeesIncludedAud: number;
  amount: number;
  amountAud: number;
  source: string;
  sourceRow: number;
  fees: number;
  assetClass: string;
  sector: string;
  country: string;
  strategy: string;
  totalFeesIncluded: number;
  notes?: string;
  [key: string]: unknown;
};

export type PortfolioTransaction = LedgerRow;

export type AllocationSlice = {
  label: string;
  value: number;
  percent: number;
};

export type PortfolioHolding = {
  id: string;
  ticker: string;
  assetTicker: string;
  name: string;
  platform: string;
  assetClass: string;
  sector: string;
  country: string;
  currency: CurrencyCode;
  status: "Open" | "Closed" | string;
  quantity: number;
  averagePriceAud: number;
  priceAud: number;
  marketPriceAud: number;
  valueAud: number;
  marketValueAud: number;
  costBaseAud: number;
  realisedPlAud: number;
  unrealisedPlAud: number;
  unrealisedPlPercent: number;
  weightPercent: number;
  portfolioWeightPercent: number;
  company: string;
  exchange: string;
  industry: string;
  strategy: string;
  risk: string;
  totalCostAud: number;
  averageCostAud: number;
  dividendsAud: number;
  lots: unknown[];
  metrics: {
    marketPrice: number;
    marketValue: number;
    unrealisedProfit: number;
    unrealisedPercent: number;
    averageCost: number;
    costBasis: number;
    realisedProfit: number;
    totalProfit: number;
    totalReturnPercent: number;
    allocationPercent: number;
    dividendYield: number;
    yieldOnCost: number;
  };
  [key: string]: unknown;
};

export type PortfolioDividend = {
  id: string;
  date: string;
  amount: number;
  amountAud: number;
  ticker: string;
  assetTicker: string;
  platform: string;
  currency: CurrencyCode;
  sector: string;
  country: string;
  notes: string;
};

export type PortfolioCashAccount = {
  id: string;
  name: string;
  platform: string;
  currency: CurrencyCode;
  balance: number;
  balanceAud: number;
  totalCash: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalDividends: number;
  totalInterest: number;
  depositsAud: number;
  withdrawalsAud: number;
  dividendsAud: number;
  interestAud: number;
  feesAud: number;
};

export type PortfolioPerformance = {
  realisedPnL: number;
  realisedPlAud: number;
  winRate: number;
  totalReturnAud: number;
  totalReturnPercent: number;
  allTime: number;
};

export type Portfolio = {
  generatedAt: string;
  transactions: LedgerRow[];
  holdings: PortfolioHolding[];
  realisedTrades: unknown[];
  cash: PortfolioCashAccount[];
  dividends: PortfolioDividend[];
  dashboard: Record<string, unknown>;
  replay: Record<string, unknown>;
  timeline: { date: string; portfolioValue: number; valueAud: number; investedAud: number; cumulativeCashFlowAud: number; profit: number }[];
  performance: PortfolioPerformance;
};

export type PortfolioEngine = {
  portfolio: Portfolio;
  transactions: LedgerRow[];
  holdings: PortfolioHolding[];
  openHoldings: PortfolioHolding[];
  closedHoldings: PortfolioHolding[];
  dividends: PortfolioDividend[];
  cashAccounts: PortfolioCashAccount[];
  allocation: {
    assetClass: AllocationSlice[];
    sector: AllocationSlice[];
    country: AllocationSlice[];
    currency: AllocationSlice[];
    platform: AllocationSlice[];
    account: AllocationSlice[];
    risk: AllocationSlice[];
  };
  summary: {
    totalCostAud: number;
    feesAud: number;
    realisedPlAud: number;
  };
  validRows: number;
  sourceRows: number;
  invalidRows: unknown[];
  warnings: string[];
};

type PortfolioState = {
  loaded: boolean;
  rawLedgerCsv: string;
  transactions: LedgerRow[];
  holdings: PortfolioHolding[];
  openHoldings: PortfolioHolding[];
  closedHoldings: PortfolioHolding[];
  dividends: PortfolioDividend[];
  cashAccounts: PortfolioCashAccount[];
  engine: PortfolioEngine;
  portfolio: Portfolio;
  replayEnabled: boolean;
  replayDate: string | null;
  replaySnapshot: Record<string, unknown> | null;

  setRawLedgerCsv: (csv: string) => void;
  setEngine: (engine: unknown, csv?: string) => void;
  setHoldings: (holdings: PortfolioHolding[]) => void;
  clear: () => void;
  calculate: () => void;
  loadTransactions: (tx: LedgerRow[]) => void;
  addTransaction: (tx: LedgerRow) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (tx: LedgerRow) => void;
  enableReplay: (date: string) => void;
  disableReplay: () => void;
};

const emptyCash: PortfolioCashAccount = {
  id: "cash",
  name: "Cash",
  platform: "Manual",
  currency: "AUD",
  balance: 0,
  balanceAud: 0,
  totalCash: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  totalDividends: 0,
  totalInterest: 0,
  depositsAud: 0,
  withdrawalsAud: 0,
  dividendsAud: 0,
  interestAud: 0,
  feesAud: 0,
};

const emptyPortfolio: Portfolio = {
  generatedAt: new Date().toISOString(),
  transactions: [],
  holdings: [],
  realisedTrades: [],
  cash: [emptyCash],
  dividends: [],
  dashboard: {},
  replay: {},
  timeline: [],
  performance: {
    realisedPnL: 0,
    realisedPlAud: 0,
    winRate: 0,
    totalReturnAud: 0,
    totalReturnPercent: 0,
    allTime: 0,
  },
};

const emptyEngine: PortfolioEngine = {
  portfolio: emptyPortfolio,
  transactions: [],
  holdings: [],
  openHoldings: [],
  closedHoldings: [],
  dividends: [],
  cashAccounts: [emptyCash],
  allocation: {
    assetClass: [],
    sector: [],
    country: [],
    currency: [],
    platform: [],
    account: [],
    risk: [],
  },
  summary: {
    totalCostAud: 0,
    feesAud: 0,
    realisedPlAud: 0,
  },
  validRows: 0,
  sourceRows: 0,
  invalidRows: [],
  warnings: [],
};

export const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  loaded: false,
  rawLedgerCsv: "",
  transactions: [],
  holdings: [],
  openHoldings: [],
  closedHoldings: [],
  dividends: [],
  cashAccounts: [emptyCash],
  engine: emptyEngine,
  portfolio: emptyPortfolio,
  replayEnabled: false,
  replayDate: null,
  replaySnapshot: null,

  setRawLedgerCsv: (csv) => set({ rawLedgerCsv: csv, loaded: Boolean(csv.trim()) }),

  setEngine: (input, csv) => {
    const engine = normaliseEngine(input);
    set({
      loaded: true,
      rawLedgerCsv: csv ?? get().rawLedgerCsv,
      engine,
      portfolio: engine.portfolio,
      transactions: engine.transactions,
      holdings: engine.holdings,
      openHoldings: engine.openHoldings,
      closedHoldings: engine.closedHoldings,
      dividends: engine.dividends,
      cashAccounts: engine.cashAccounts,
    });
  },

  setHoldings: (holdings) => {
    set({
      holdings,
      openHoldings: holdings.filter((holding) => holding.status !== "Closed"),
      closedHoldings: holdings.filter((holding) => holding.status === "Closed"),
    });
  },

  clear: () =>
    set({
      loaded: false,
      rawLedgerCsv: "",
      transactions: [],
      holdings: [],
      openHoldings: [],
      closedHoldings: [],
      dividends: [],
      cashAccounts: [emptyCash],
      engine: emptyEngine,
      portfolio: emptyPortfolio,
      replayEnabled: false,
      replayDate: null,
      replaySnapshot: null,
    }),

  calculate: () => {
    const engine = normaliseEngine({ transactions: get().transactions, holdings: get().holdings });
    set({
      loaded: true,
      engine,
      portfolio: engine.portfolio,
      transactions: engine.transactions,
      holdings: engine.holdings,
      openHoldings: engine.openHoldings,
      closedHoldings: engine.closedHoldings,
      dividends: engine.dividends,
      cashAccounts: engine.cashAccounts,
    });
  },

  loadTransactions: (transactions) => {
    set({ transactions, loaded: true });
    get().calculate();
  },

  addTransaction: (tx) => {
    set({ transactions: [...get().transactions, tx], loaded: true });
    get().calculate();
  },

  removeTransaction: (id) => {
    set({ transactions: get().transactions.filter((tx) => tx.id !== id) });
    get().calculate();
  },

  updateTransaction: (tx) => {
    set({ transactions: get().transactions.map((item) => (item.id === tx.id ? tx : item)) });
    get().calculate();
  },

  enableReplay: (date) =>
    set({
      replayEnabled: true,
      replayDate: date,
      replaySnapshot: { date },
    }),

  disableReplay: () =>
    set({
      replayEnabled: false,
      replayDate: null,
      replaySnapshot: null,
    }),
}));

function normaliseEngine(input: unknown): PortfolioEngine {
  const source = record(input);
  const transactions = array(source.transactions).map(normaliseTransaction);
  const holdings = array(source.holdings).map(normaliseHolding);
  const openHoldings = holdings.filter((holding) => holding.status !== "Closed");
  const closedHoldings = holdings.filter((holding) => holding.status === "Closed");
  const dividends = array(source.dividends).map(normaliseDividend);
  const cashAccounts = array(source.cashAccounts).map(normaliseCashAccount);
  const safeCash = cashAccounts.length ? cashAccounts : [emptyCash];

  const allocation = {
    assetClass: allocationArray(record(source.allocation).assetClass),
    sector: allocationArray(record(source.allocation).sector),
    country: allocationArray(record(source.allocation).country),
    currency: allocationArray(record(source.allocation).currency),
    platform: allocationArray(record(source.allocation).platform),
    account: allocationArray(record(source.allocation).account),
    risk: allocationArray(record(source.allocation).risk),
  };

  const summary = record(source.summary);

  const portfolio: Portfolio = {
    generatedAt: new Date().toISOString(),
    transactions,
    holdings,
    realisedTrades: array(source.realisedTrades),
    cash: safeCash,
    dividends,
    dashboard: {},
    replay: {},
    timeline: array(source.timeline).map((point) => {
      const item = record(point);
      return {
        date: stringValue(item.date, ""),
        portfolioValue: numberValue(item.portfolioValue ?? item.valueAud ?? item.investedAud),
        valueAud: numberValue(item.valueAud ?? item.portfolioValue ?? item.investedAud),
        investedAud: numberValue(item.investedAud ?? item.portfolioValue ?? item.valueAud),
        cumulativeCashFlowAud: numberValue(item.cumulativeCashFlowAud),
        profit: numberValue(item.profit ?? item.changeAud ?? item.totalReturnAud),
      };
    }),
    performance: {
      realisedPnL: numberValue(record(source.performance).realisedPnL ?? record(source.performance).realisedPlAud),
      realisedPlAud: numberValue(record(source.performance).realisedPlAud ?? record(source.performance).realisedPnL),
      winRate: numberValue(record(source.performance).winRate),
      totalReturnAud: numberValue(record(source.performance).totalReturnAud),
      totalReturnPercent: numberValue(record(source.performance).totalReturnPercent),
      allTime: numberValue(record(source.performance).allTime ?? record(source.performance).totalReturnAud),
    },
  };

  return {
    portfolio,
    transactions,
    holdings,
    openHoldings,
    closedHoldings,
    dividends,
    cashAccounts: safeCash,
    allocation,
    summary: {
      totalCostAud: numberValue(summary.totalCostAud),
      feesAud: numberValue(summary.feesAud),
      realisedPlAud: numberValue(summary.realisedPlAud),
    },
    validRows: numberValue(source.validRows, transactions.length),
    sourceRows: numberValue(source.sourceRows, transactions.length),
    invalidRows: array(source.invalidRows),
    warnings: array(source.warnings).map(String),
  };
}

function normaliseTransaction(value: unknown, index = 0): LedgerRow {
  const item = record(value);
  const ticker = stringValue(item.assetTicker ?? item.ticker ?? item.symbol, "CASH");
  const quantity = numberValue(item.quantity ?? item.units);
  const price = numberValue(item.price ?? item.priceAud ?? item.unitPrice);
  const fees = numberValue(item.fiatFees ?? item.feesAud ?? item.fees);
  const total = numberValue(item.total ?? item.totalAud ?? item.totalFeesIncludedAud ?? item.amountAud ?? quantity * price + fees);

  return {
    ...item,
    id: stringValue(item.id, `${ticker}-${stringValue(item.date, "row")}-${index}`),
    raw: record(item.raw) ?? item,
    rowNumber: numberValue(item.rowNumber, index + 1),
    date: stringValue(item.date, ""),
    action: stringValue(item.action ?? item.type, "Other"),
    type: stringValue(item.type ?? item.action, "Other"),
    assetTicker: ticker,
    ticker,
    platform: stringValue(item.platform, "Manual"),
    currency: currencyValue(item.currency),
    quantity,
    price,
    priceAud: numberValue(item.priceAud ?? price),
    marketPriceAud: numberValue(item.marketPriceAud ?? item.priceAud ?? price),
    fiatFees: fees,
    feesAud: numberValue(item.feesAud ?? fees),
    total,
    totalAud: numberValue(item.totalAud ?? total),
    totalFeesIncludedAud: numberValue(item.totalFeesIncludedAud ?? total),
    amount: numberValue(item.amount ?? item.amountAud ?? total),
    amountAud: numberValue(item.amountAud ?? item.amount ?? total),
    source: stringValue(item.source, "manual"),
    sourceRow: numberValue(item.sourceRow ?? item.rowNumber, index + 1),
    fees,
    assetClass: stringValue(item.assetClass, "Equity"),
    sector: stringValue(item.sector, "Uncategorised"),
    country: stringValue(item.country, "Australia"),
    strategy: stringValue(item.strategy, "Manual"),
    totalFeesIncluded: numberValue(item.totalFeesIncluded ?? total),
    notes: stringValue(item.notes, ""),
  };
}

function normaliseHolding(value: unknown): PortfolioHolding {
  const item = record(value);
  const ticker = stringValue(item.ticker ?? item.assetTicker ?? item.symbol, "UNKNOWN");
  const valueAud = numberValue(item.valueAud ?? item.marketValueAud ?? record(item.metrics).marketValue);
  const costBaseAud = numberValue(item.costBaseAud ?? record(item.metrics).costBasis);
  const unrealisedPlAud = numberValue(item.unrealisedPlAud ?? record(item.metrics).unrealisedProfit);
  const unrealisedPlPercent = numberValue(item.unrealisedPlPercent ?? record(item.metrics).unrealisedPercent);

  return {
    ...item,
    id: stringValue(item.id, ticker),
    ticker,
    assetTicker: stringValue(item.assetTicker, ticker),
    name: stringValue(item.name, ticker),
    platform: stringValue(item.platform, "Manual"),
    assetClass: stringValue(item.assetClass, "Equity"),
    sector: stringValue(item.sector, "Uncategorised"),
    country: stringValue(item.country, "Australia"),
    currency: currencyValue(item.currency),
    status: stringValue(item.status, "Open"),
    quantity: numberValue(item.quantity ?? item.units),
    averagePriceAud: numberValue(item.averagePriceAud ?? record(item.metrics).averageCost),
    priceAud: numberValue(item.priceAud ?? record(item.metrics).marketPrice),
    marketPriceAud: numberValue(item.marketPriceAud ?? item.priceAud ?? record(item.metrics).marketPrice),
    valueAud,
    marketValueAud: numberValue(item.marketValueAud ?? valueAud),
    costBaseAud,
    realisedPlAud: numberValue(item.realisedPlAud ?? record(item.metrics).realisedProfit),
    unrealisedPlAud,
    unrealisedPlPercent,
    weightPercent: numberValue(item.weightPercent ?? record(item.metrics).allocationPercent),
    portfolioWeightPercent: numberValue(item.portfolioWeightPercent ?? item.weightPercent ?? record(item.metrics).allocationPercent),
    company: stringValue(item.company ?? item.name, ticker),
    exchange: stringValue(item.exchange, "ASX"),
    industry: stringValue(item.industry ?? item.sector, "Uncategorised"),
    strategy: stringValue(item.strategy, "Manual"),
    risk: stringValue(item.risk, "Medium"),
    totalCostAud: numberValue(item.totalCostAud ?? costBaseAud),
    averageCostAud: numberValue(item.averageCostAud ?? item.averagePriceAud),
    dividendsAud: numberValue(item.dividendsAud),
    lots: array(item.lots),
    metrics: {
      marketPrice: numberValue(record(item.metrics).marketPrice ?? item.priceAud),
      marketValue: valueAud,
      unrealisedProfit: unrealisedPlAud,
      unrealisedPercent: unrealisedPlPercent,
      averageCost: numberValue(record(item.metrics).averageCost ?? item.averagePriceAud),
      costBasis: costBaseAud,
      realisedProfit: numberValue(record(item.metrics).realisedProfit ?? item.realisedPlAud),
      totalProfit: numberValue(record(item.metrics).totalProfit),
      totalReturnPercent: numberValue(record(item.metrics).totalReturnPercent),
      allocationPercent: numberValue(record(item.metrics).allocationPercent ?? item.weightPercent),
      dividendYield: numberValue(record(item.metrics).dividendYield),
      yieldOnCost: numberValue(record(item.metrics).yieldOnCost),
    },
  };
}

function normaliseDividend(value: unknown): PortfolioDividend {
  const item = record(value);
  const ticker = stringValue(item.ticker ?? item.assetTicker, "UNKNOWN");
  const date = stringValue(item.date ?? item.paymentDate ?? item.exDate, "");

  return {
    id: stringValue(item.id, `${ticker}-${date}`),
    date,
    amount: numberValue(item.amount ?? item.amountAud),
    amountAud: numberValue(item.amountAud ?? item.amount),
    ticker,
    assetTicker: stringValue(item.assetTicker, ticker),
    platform: stringValue(item.platform, "Manual"),
    currency: currencyValue(item.currency),
    sector: stringValue(item.sector, "Uncategorised"),
    country: stringValue(item.country, "Australia"),
    notes: stringValue(item.notes, ""),
  };
}

function normaliseCashAccount(value: unknown): PortfolioCashAccount {
  const item = record(value);
  const balanceAud = numberValue(item.balanceAud ?? item.balance);

  return {
    id: stringValue(item.id, stringValue(item.name, "cash")),
    name: stringValue(item.name, "Cash"),
    platform: stringValue(item.platform, "Manual"),
    currency: currencyValue(item.currency),
    balance: balanceAud,
    balanceAud,
    totalCash: numberValue(item.totalCash ?? balanceAud),
    totalDeposits: numberValue(item.totalDeposits ?? item.depositsAud),
    totalWithdrawals: numberValue(item.totalWithdrawals ?? item.withdrawalsAud),
    totalDividends: numberValue(item.totalDividends ?? item.dividendsAud),
    totalInterest: numberValue(item.totalInterest ?? item.interestAud),
    depositsAud: numberValue(item.depositsAud),
    withdrawalsAud: numberValue(item.withdrawalsAud),
    dividendsAud: numberValue(item.dividendsAud),
    interestAud: numberValue(item.interestAud),
    feesAud: numberValue(item.feesAud),
  };
}

function allocationArray(value: unknown): AllocationSlice[] {
  return array(value).map((item) => {
    const row = record(item);
    return {
      label: stringValue(row.label ?? row.name, "Unknown"),
      value: numberValue(row.value ?? row.valueAud),
      percent: numberValue(row.percent ?? row.weightPercent),
    };
  });
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function currencyValue(value: unknown): CurrencyCode {
  return (
    value === "AUD" ||
    value === "USD" ||
    value === "GBP" ||
    value === "EUR" ||
    value === "NZD" ||
    value === "CAD" ||
    value === "JPY" ||
    value === "HKD" ||
    value === "SGD" ||
    value === "CHF" ||
    value === "CNY"
  )
    ? value
    : "AUD";
}
