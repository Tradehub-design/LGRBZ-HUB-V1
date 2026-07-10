import type {
  AllocationSlice,
  MasterCash,
  MasterHolding,
  MasterTransaction,
  PortfolioEngineV2,
} from "./types";

function isAction(tx: MasterTransaction, word: string) {
  return String(tx.action ?? "").toLowerCase().includes(word);
}

function addSlice(slices: AllocationSlice[], label: string, value: number) {
  const key = label || "Unknown";
  const existing = slices.find((slice) => slice.label === key);

  if (existing) {
    existing.value += value;
  } else {
    slices.push({ label: key, value, percent: 0 });
  }
}

function finaliseSlices(slices: AllocationSlice[], total: number) {
  return slices
    .map((slice) => ({
      ...slice,
      percent: total ? (slice.value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

function createHolding(tx: MasterTransaction): MasterHolding {
  return {
    id: tx.ticker,
    ticker: tx.ticker,
    assetTicker: tx.assetTicker,
    name: tx.ticker,
    platform: tx.platform,
    assetClass: tx.assetClass,
    sector: tx.sector,
    country: tx.country,
    currency: tx.currency,
    status: "Open",
    quantity: 0,
    averageCostAud: 0,
    marketPriceAud: tx.price,
    marketValueAud: 0,
    costBaseAud: 0,
    realisedPlAud: 0,
    unrealisedPlAud: 0,
    unrealisedPlPercent: 0,
    portfolioWeightPercent: 0,
  };
}

export function buildPortfolioEngineV2(
  transactions: MasterTransaction[],
): PortfolioEngineV2 {
  const holdings = new Map<string, MasterHolding>();

  const cash: MasterCash = {
    balanceAud: 0,
    depositsAud: 0,
    withdrawalsAud: 0,
    dividendsAud: 0,
    feesAud: 0,
    interestAud: 0,
  };

  let realisedPlAud = 0;
  const dividends: MasterTransaction[] = [];

  for (const tx of transactions) {
    const ticker = tx.ticker || tx.assetTicker || "CASH";
    const total = Number(tx.total || tx.quantity * tx.price + tx.fees || 0);
    const fees = Number(tx.fees || 0);

    cash.feesAud += fees;

    if (isAction(tx, "deposit")) {
      cash.balanceAud += total;
      cash.depositsAud += total;
      continue;
    }

    if (isAction(tx, "withdraw")) {
      cash.balanceAud -= total;
      cash.withdrawalsAud += total;
      continue;
    }

    if (isAction(tx, "dividend")) {
      cash.balanceAud += total;
      cash.dividendsAud += total;
      dividends.push(tx);
      continue;
    }

    if (isAction(tx, "interest")) {
      cash.balanceAud += total;
      cash.interestAud += total;
      continue;
    }

    let holding = holdings.get(ticker);

    if (!holding) {
      holding = createHolding(tx);
      holdings.set(ticker, holding);
    }

    if (isAction(tx, "buy")) {
      holding.quantity += tx.quantity;
      holding.costBaseAud += total;
      holding.marketPriceAud = tx.price || holding.marketPriceAud;
      cash.balanceAud -= total;
    }

    if (isAction(tx, "sell")) {
      const averageCost = holding.quantity ? holding.costBaseAud / holding.quantity : 0;
      const costRemoved = averageCost * tx.quantity;
      const realised = total - costRemoved - fees;

      holding.quantity -= tx.quantity;
      holding.costBaseAud -= costRemoved;
      holding.realisedPlAud += realised;
      realisedPlAud += realised;
      cash.balanceAud += total;
    }

    holding.quantity = Math.max(0, holding.quantity);
    holding.costBaseAud = Math.max(0, holding.costBaseAud);
    holding.averageCostAud = holding.quantity ? holding.costBaseAud / holding.quantity : 0;
    holding.marketValueAud = holding.quantity * holding.marketPriceAud;
    holding.unrealisedPlAud = holding.marketValueAud - holding.costBaseAud;
    holding.unrealisedPlPercent = holding.costBaseAud
      ? (holding.unrealisedPlAud / holding.costBaseAud) * 100
      : 0;
    holding.status = holding.quantity > 0 ? "Open" : "Closed";
  }

  const holdingList = Array.from(holdings.values());

  const portfolioValueAud = holdingList.reduce((sum, holding) => sum + holding.marketValueAud, 0);
  const investedCostAud = holdingList.reduce((sum, holding) => sum + holding.costBaseAud, 0);
  const unrealisedPlAud = holdingList.reduce((sum, holding) => sum + holding.unrealisedPlAud, 0);

  for (const holding of holdingList) {
    holding.portfolioWeightPercent = portfolioValueAud
      ? (holding.marketValueAud / portfolioValueAud) * 100
      : 0;
  }

  const openHoldings = holdingList.filter((holding) => holding.status === "Open");
  const closedHoldings = holdingList.filter((holding) => holding.status === "Closed");

  const assetClass: AllocationSlice[] = [];
  const sector: AllocationSlice[] = [];
  const country: AllocationSlice[] = [];
  const currency: AllocationSlice[] = [];
  const platform: AllocationSlice[] = [];

  for (const holding of openHoldings) {
    addSlice(assetClass, holding.assetClass, holding.marketValueAud);
    addSlice(sector, holding.sector, holding.marketValueAud);
    addSlice(country, holding.country, holding.marketValueAud);
    addSlice(currency, holding.currency, holding.marketValueAud);
    addSlice(platform, holding.platform, holding.marketValueAud);
  }

  const totalReturnAud = realisedPlAud + unrealisedPlAud + cash.dividendsAud + cash.interestAud - cash.feesAud;

  return {
    generatedAt: new Date().toISOString(),
    transactions,
    holdings: holdingList,
    openHoldings,
    closedHoldings,
    cash,
    dividends,
    allocation: {
      assetClass: finaliseSlices(assetClass, portfolioValueAud),
      sector: finaliseSlices(sector, portfolioValueAud),
      country: finaliseSlices(country, portfolioValueAud),
      currency: finaliseSlices(currency, portfolioValueAud),
      platform: finaliseSlices(platform, portfolioValueAud),
    },
    totals: {
      portfolioValueAud,
      investedCostAud,
      cashAud: cash.balanceAud,
      dividendsAud: cash.dividendsAud,
      feesAud: cash.feesAud,
      realisedPlAud,
      unrealisedPlAud,
      totalReturnAud,
      totalReturnPercent: investedCostAud ? (totalReturnAud / investedCostAud) * 100 : 0,
    },
  };
}
