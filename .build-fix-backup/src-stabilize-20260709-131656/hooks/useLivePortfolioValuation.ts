"use client";

import { useMemo } from "react";
import { buildQuoteMap, cleanQuoteSymbol } from "@/lib/market/quoteMap";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export function useLivePortfolioValuation() {
  const data = useDashboardData();

  const symbols = useMemo(
    () => data.enhancedHoldings.map((holding) => cleanQuoteSymbol(holding.ticker)),
    [data.enhancedHoldings],
  );

  const market = useMarketQuotes(symbols);
  const quoteMap = buildQuoteMap(market.quotes);

  const liveHoldings = data.enhancedHoldings.map((holding) => {
    const quote = quoteMap[cleanQuoteSymbol(holding.ticker)];
    const marketPriceAud = quote?.price ?? holding.marketPriceAud;
    const marketValueAud = holding.quantity * marketPriceAud;
    const unrealisedPlAud = marketValueAud - holding.totalCostAud;
    const unrealisedPlPercent = holding.totalCostAud ? (unrealisedPlAud / holding.totalCostAud) * 100 : 0;

    return {
      ...holding,
      quote,
      marketPriceAud,
      marketValueAud,
      unrealisedPlAud,
      unrealisedPlPercent,
    };
  });

  const marketValueAud = liveHoldings.reduce((sum, holding) => sum + holding.marketValueAud, 0);
  const investedCostAud = liveHoldings.reduce((sum, holding) => sum + holding.totalCostAud, 0);
  const unrealisedPlAud = marketValueAud - investedCostAud;
  const totalValueAud = marketValueAud + data.totalCashAud;

  return {
    loading: market.loading,
    quotes: market.quotes,
    liveHoldings,
    liveValuation: {
      marketValueAud,
      investedCostAud,
      unrealisedPlAud,
      unrealisedPlPercent: investedCostAud ? (unrealisedPlAud / investedCostAud) * 100 : 0,
      totalValueAud,
    },
  };
}
