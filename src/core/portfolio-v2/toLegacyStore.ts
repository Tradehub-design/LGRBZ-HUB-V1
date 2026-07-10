import type {
  AllocationSlice,
  CurrencyCode,
  LedgerRow,
  PortfolioCashAccount,
  PortfolioDividend,
  PortfolioEngine,
  PortfolioHolding,
} from "@/store/portfolioStore";
import type { PortfolioEngineV2, MasterTransaction, MasterHolding } from "./types";

function legacyTransaction(tx: MasterTransaction, index: number): LedgerRow {
  return {
    id: tx.id,
    raw: tx.raw ?? tx,
    rowNumber: index + 1,
    date: tx.date,
    action: tx.action,
    type: tx.action,
    assetTicker: tx.assetTicker,
    ticker: tx.ticker,
    platform: tx.platform,
    currency: tx.currency as CurrencyCode,
    quantity: tx.quantity,
    price: tx.price,
    priceAud: tx.price,
    marketPriceAud: tx.price,
    fiatFees: tx.fees,
    feesAud: tx.fees,
    total: tx.total,
    totalAud: tx.total,
    totalFeesIncludedAud: tx.total,
    amount: tx.total,
    amountAud: tx.total,
    source: tx.source,
    sourceRow: tx.sourceRow,
    fees: tx.fees,
    assetClass: tx.assetClass,
    sector: tx.sector,
    country: tx.country,
    strategy: tx.strategy,
    totalFeesIncluded: tx.total,
    notes: tx.notes,
  };
}

function legacyHolding(holding: MasterHolding): PortfolioHolding {
  return {
    id: holding.id,
    ticker: holding.ticker,
    assetTicker: holding.assetTicker,
    name: holding.name,
    platform: holding.platform,
    assetClass: holding.assetClass,
    sector: holding.sector,
    country: holding.country,
    currency: holding.currency as CurrencyCode,
    status: holding.status,
    quantity: holding.quantity,
    averagePriceAud: holding.averageCostAud,
    priceAud: holding.marketPriceAud,
    marketPriceAud: holding.marketPriceAud,
    valueAud: holding.marketValueAud,
    marketValueAud: holding.marketValueAud,
    costBaseAud: holding.costBaseAud,
    realisedPlAud: holding.realisedPlAud,
    unrealisedPlAud: holding.unrealisedPlAud,
    unrealisedPlPercent: holding.unrealisedPlPercent,
    weightPercent: holding.portfolioWeightPercent,
    portfolioWeightPercent: holding.portfolioWeightPercent,
    company: holding.name,
    exchange: "",
    industry: holding.sector,
    strategy: holding.assetClass,
    risk: "Medium",
    totalCostAud: holding.costBaseAud,
    averageCostAud: holding.averageCostAud,
    dividendsAud: 0,
    lots: [],
    metrics: {
      marketPrice: holding.marketPriceAud,
      marketValue: holding.marketValueAud,
      unrealisedProfit: holding.unrealisedPlAud,
      unrealisedPercent: holding.unrealisedPlPercent,
      averageCost: holding.averageCostAud,
      costBasis: holding.costBaseAud,
      realisedProfit: holding.realisedPlAud,
      totalProfit: holding.realisedPlAud + holding.unrealisedPlAud,
      totalReturnPercent: holding.unrealisedPlPercent,
      allocationPercent: holding.portfolioWeightPercent,
      dividendYield: 0,
      yieldOnCost: 0,
    },
  };
}

export function toLegacyPortfolioEngine(v2: PortfolioEngineV2): PortfolioEngine {
  const transactions = v2.transactions.map(legacyTransaction);
  const holdings = v2.holdings.map(legacyHolding);
  const openHoldings = v2.openHoldings.map(legacyHolding);
  const closedHoldings = v2.closedHoldings.map(legacyHolding);

  const cash: PortfolioCashAccount = {
    id: "cash",
    name: "Cash",
    platform: "Manual",
    currency: "AUD",
    balance: v2.cash.balanceAud,
    balanceAud: v2.cash.balanceAud,
    totalCash: v2.cash.balanceAud,
    totalDeposits: v2.cash.depositsAud,
    totalWithdrawals: v2.cash.withdrawalsAud,
    totalDividends: v2.cash.dividendsAud,
    totalInterest: v2.cash.interestAud,
    depositsAud: v2.cash.depositsAud,
    withdrawalsAud: v2.cash.withdrawalsAud,
    dividendsAud: v2.cash.dividendsAud,
    interestAud: v2.cash.interestAud,
    feesAud: v2.cash.feesAud,
  };

  const dividends: PortfolioDividend[] = v2.dividends.map((tx) => ({
    id: `div-${tx.id}`,
    date: tx.date,
    amount: tx.total,
    amountAud: tx.total,
    ticker: tx.ticker,
    assetTicker: tx.assetTicker,
    platform: tx.platform,
    currency: tx.currency as CurrencyCode,
    sector: tx.sector,
    country: tx.country,
    notes: tx.notes,
  }));

  const risk: AllocationSlice[] = holdings.length
    ? [{ label: "Medium", value: v2.totals.portfolioValueAud, percent: 100 }]
    : [];

  return {
    portfolio: {
      generatedAt: v2.generatedAt,
      transactions,
      holdings,
      realisedTrades: [],
      cash: [cash],
      dividends,
      dashboard: {},
      replay: {},
      timeline: [
        {
          date: new Date().toISOString().slice(0, 10),
          portfolioValue: v2.totals.portfolioValueAud,
          valueAud: v2.totals.portfolioValueAud,
          investedAud: v2.totals.investedCostAud,
          cumulativeCashFlowAud: v2.totals.investedCostAud,
          profit: v2.totals.totalReturnAud,
        },
      ],
      performance: {
        realisedPnL: v2.totals.realisedPlAud,
        realisedPlAud: v2.totals.realisedPlAud,
        winRate: 0,
        totalReturnAud: v2.totals.totalReturnAud,
        totalReturnPercent: v2.totals.totalReturnPercent,
        allTime: v2.totals.portfolioValueAud,
      },
    },
    transactions,
    holdings,
    openHoldings,
    closedHoldings,
    dividends,
    cashAccounts: [cash],
    allocation: {
      assetClass: v2.allocation.assetClass,
      sector: v2.allocation.sector,
      country: v2.allocation.country,
      currency: v2.allocation.currency,
      platform: v2.allocation.platform,
      account: v2.allocation.platform,
      risk,
    },
    summary: {
      totalCostAud: v2.totals.investedCostAud,
      feesAud: v2.totals.feesAud,
      realisedPlAud: v2.totals.realisedPlAud,
    },
    validRows: transactions.length,
    sourceRows: transactions.length,
    invalidRows: [],
    warnings: [],
  };
}
