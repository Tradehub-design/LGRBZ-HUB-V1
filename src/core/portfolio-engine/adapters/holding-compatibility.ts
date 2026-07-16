import type {
  PortfolioHolding as CanonicalHolding,
  PortfolioSnapshot,
} from "../contracts";

import type {
  PortfolioHolding as StoreHolding,
} from "@/store/portfolioStore";

function concentrationRisk(
  weightPercent: number,
): string {
  if (weightPercent >= 25) {
    return "Very High";
  }

  if (weightPercent >= 15) {
    return "High";
  }

  if (weightPercent >= 7.5) {
    return "Medium";
  }

  if (weightPercent > 0) {
    return "Low";
  }

  return "Very Low";
}

export function canonicalHoldingToStoreHolding(
  holding: CanonicalHolding,
): StoreHolding {
  const ticker =
    holding.security.ticker;

  const marketPriceAud =
    holding.valuation.marketPriceAud;

  const marketValueAud =
    holding.valuation.marketValueAud;

  const unrealisedPlAud =
    holding.valuation.unrealisedGainAud;

  const unrealisedPlPercent =
    holding.valuation.unrealisedGainPercent;

  const totalProfitAud =
    holding.totalReturnAud;

  const result: StoreHolding = {
    id:
      holding.holdingId,

    ticker,

    assetTicker:
      ticker,

    name:
      holding.security.name,

    company:
      holding.security.name,

    platform:
      holding.account.platform,

    assetClass:
      holding.classification.assetClass,

    sector:
      holding.classification.sector,

    country:
      holding.classification.country,

    currency:
      holding.currency,

    status:
      holding.status === "OPEN"
        ? "Open"
        : "Closed",

    quantity:
      holding.quantity,

    averagePriceAud:
      holding.averageCostAud,

    averageCostAud:
      holding.averageCostAud,

    priceAud:
      marketPriceAud,

    marketPriceAud,

    valueAud:
      marketValueAud,

    marketValueAud,

    costBaseAud:
      holding.costBaseAud,

    totalCostAud:
      holding.costBaseAud,

    realisedPlAud:
      holding.realisedGainAud,

    unrealisedPlAud,

    unrealisedPlPercent,

    weightPercent:
      holding.portfolioWeightPercent,

    portfolioWeightPercent:
      holding.portfolioWeightPercent,

    exchange:
      holding.security.market,

    industry:
      holding.classification.industry,

    strategy:
      holding.classification.strategy,

    risk:
      concentrationRisk(
        holding.portfolioWeightPercent,
      ),

    dividendsAud:
      holding.totalIncomeAud,

    lots:
      holding.lots.map(
        (lot) => ({
          ...lot,
        }),
      ),

    metrics: {
      marketPrice:
        marketPriceAud,

      marketValue:
        marketValueAud,

      unrealisedProfit:
        unrealisedPlAud,

      unrealisedPercent:
        unrealisedPlPercent,

      averageCost:
        holding.averageCostAud,

      costBasis:
        holding.costBaseAud,

      realisedProfit:
        holding.realisedGainAud,

      totalProfit:
        totalProfitAud,

      totalReturnPercent:
        holding.totalReturnPercent,

      allocationPercent:
        holding.portfolioWeightPercent,

      /**
       * Dividend forecast fields remain zero until Sprint P4 connects the
       * canonical Dividend Engine. Historical income is not treated as yield.
       */
      dividendYield: 0,
      yieldOnCost: 0,
    },

    accountId:
      holding.account.accountId,

    accountName:
      holding.account.accountName,

    securityId:
      holding.security.securityId,

    quoteTicker:
      holding.security.quoteTicker,

    quoteSource:
      holding.valuation.quoteSource,

    quoteQuality:
      holding.valuation.quoteQuality,

    quoteProvider:
      holding.valuation.quoteProvider,

    quotedAt:
      holding.valuation.quotedAt,

    marketPriceLocal:
      holding.valuation.marketPriceLocal,

    marketValueLocal:
      holding.valuation.marketValueLocal,

    fxRateToAud:
      holding.valuation.fxRateToAud,

    realisedProceedsAud:
      holding.realisedProceedsAud,

    disposedCostBaseAud:
      holding.disposedCostBaseAud,

    totalIncomeAud:
      holding.totalIncomeAud,

    totalReturnAud:
      holding.totalReturnAud,

    totalReturnPercent:
      holding.totalReturnPercent,

    firstTransactionAt:
      holding.firstTransactionAt,

    lastTransactionAt:
      holding.lastTransactionAt,
  };

  return result;
}

export function snapshotToStoreHoldings(
  snapshot: PortfolioSnapshot,
): StoreHolding[] {
  return snapshot.holdings.map(
    canonicalHoldingToStoreHolding,
  );
}

export function snapshotToOpenStoreHoldings(
  snapshot: PortfolioSnapshot,
): StoreHolding[] {
  return snapshot.openHoldings.map(
    canonicalHoldingToStoreHolding,
  );
}

export function snapshotToClosedStoreHoldings(
  snapshot: PortfolioSnapshot,
): StoreHolding[] {
  return snapshot.closedHoldings.map(
    canonicalHoldingToStoreHolding,
  );
}
