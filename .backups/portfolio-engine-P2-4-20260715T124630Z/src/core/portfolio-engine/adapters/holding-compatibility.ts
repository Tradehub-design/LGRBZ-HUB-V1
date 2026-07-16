import type {
  PortfolioHolding as CanonicalHolding,
  PortfolioSnapshot,
} from "../contracts";

import type {
  PortfolioHolding as StoreHolding,
} from "@/store/portfolioStore";

function riskFromWeight(
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

  const totalProfit =
    holding.totalReturnAud;

  return {
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

    accountId:
      holding.account.accountId,

    accountName:
      holding.account.accountName,

    assetClass:
      holding.classification.assetClass,

    sector:
      holding.classification.sector,

    industry:
      holding.classification.industry,

    country:
      holding.classification.country,

    strategy:
      holding.classification.strategy,

    exchange:
      holding.security.market,

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
      holding.valuation.marketPriceAud,

    marketPriceAud:
      holding.valuation.marketPriceAud,

    valueAud:
      holding.valuation.marketValueAud,

    marketValueAud:
      holding.valuation.marketValueAud,

    costBaseAud:
      holding.costBaseAud,

    totalCostAud:
      holding.costBaseAud,

    realisedPlAud:
      holding.realisedGainAud,

    unrealisedPlAud:
      holding.valuation.unrealisedGainAud,

    unrealisedPlPercent:
      holding.valuation.unrealisedGainPercent,

    weightPercent:
      holding.portfolioWeightPercent,

    portfolioWeightPercent:
      holding.portfolioWeightPercent,

    dividendsAud:
      holding.totalIncomeAud,

    risk:
      riskFromWeight(
        holding.portfolioWeightPercent,
      ),

    lots:
      holding.lots,

    quoteSource:
      holding.valuation.quoteSource,

    quoteQuality:
      holding.valuation.quoteQuality,

    quoteProvider:
      holding.valuation.quoteProvider,

    quotedAt:
      holding.valuation.quotedAt,

    metrics: {
      marketPrice:
        holding.valuation.marketPriceAud,

      marketValue:
        holding.valuation.marketValueAud,

      unrealisedProfit:
        holding.valuation.unrealisedGainAud,

      unrealisedPercent:
        holding.valuation.unrealisedGainPercent,

      averageCost:
        holding.averageCostAud,

      costBasis:
        holding.costBaseAud,

      realisedProfit:
        holding.realisedGainAud,

      totalProfit,

      totalReturnPercent:
        holding.totalReturnPercent,

      allocationPercent:
        holding.portfolioWeightPercent,

      dividendYield: 0,

      yieldOnCost: 0,
    },
  };
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
