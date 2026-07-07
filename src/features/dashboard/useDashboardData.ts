"use client";

import { useMemo } from "react";
import {
  calculatePortfolioHealth,
  calculatePortfolioPerformance,
  calculatePortfolioRisk,
} from "@/lib/portfolio-engine/insights";
import { usePortfolioStore } from "@/store/portfolioStore";
import { percentage, round } from "@/utils/math";

export function useDashboardData() {
  const engine = usePortfolioStore((state) => state.engine);
  const loaded = usePortfolioStore((state) => state.loaded);
  const transactions = usePortfolioStore((state) => state.transactions);
  const holdings = usePortfolioStore((state) => state.holdings);
  const dividends = usePortfolioStore((state) => state.dividends);
  const cashAccounts = usePortfolioStore((state) => state.cashAccounts);

  return useMemo(() => {
    const openHoldings = holdings.filter((holding) => holding.status === "Open");
    const closedHoldings = holdings.filter((holding) => holding.status === "Closed");

    const totalCostAud = round(
      openHoldings.reduce((total, holding) => total + holding.totalCostAud, 0),
      2,
    );

    const totalCashAud = round(
      cashAccounts.reduce((total, account) => total + account.balanceAud, 0),
      2,
    );

    const totalDividendsAud = round(
      dividends.reduce((total, dividend) => total + dividend.amountAud, 0),
      2,
    );

    const realisedPlAud = round(
      holdings.reduce((total, holding) => total + holding.realisedPlAud, 0),
      2,
    );

    const totalValueAud = round(totalCostAud + totalCashAud, 2);
    const totalReturnAud = round(realisedPlAud + totalDividendsAud, 2);
    const totalReturnPercent = round(percentage(totalReturnAud, Math.max(totalCostAud, 1)), 2);

    const topHoldings = [...openHoldings]
      .sort((a, b) => b.totalCostAud - a.totalCostAud)
      .slice(0, 10)
      .map((holding) => ({
        ...holding,
        weightPercent: round(percentage(holding.totalCostAud, Math.max(totalCostAud, 1)), 2),
      }));

    const recentTransactions = [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 12);

    const latestDividends = [...dividends]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);

    const allocation = engine?.allocation ?? {
      assetClass: [],
      sector: [],
      country: [],
      risk: [],
      currency: [],
      platform: [],
    };

    const performance = calculatePortfolioPerformance({
      openHoldings,
      holdings,
      cashAccounts,
      dividends,
      transactions,
    });

    const risk = calculatePortfolioRisk({
      openHoldings,
      totalCostAud,
      totalCashAud,
      sectorAllocation: allocation.sector,
      countryAllocation: allocation.country,
      riskAllocation: allocation.risk,
    });

    const health = calculatePortfolioHealth({
      openHoldings,
      totalCostAud,
      totalCashAud,
      totalDividendsAud,
      sectorAllocation: allocation.sector,
      countryAllocation: allocation.country,
      risk,
    });

    return {
      loaded,
      engine,
      transactions,
      holdings,
      openHoldings,
      closedHoldings,
      dividends,
      cashAccounts,
      totalCostAud,
      totalCashAud,
      totalDividendsAud,
      realisedPlAud,
      totalValueAud,
      totalReturnAud,
      totalReturnPercent,
      topHoldings,
      recentTransactions,
      latestDividends,
      allocation,
      performance,
      risk,
      health,
      summary: engine?.summary ?? null,
    };
  }, [cashAccounts, dividends, engine, holdings, loaded, transactions]);
}
