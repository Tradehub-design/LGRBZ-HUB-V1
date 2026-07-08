"use client";

import { useMemo } from "react";
import {
  calculatePortfolioHealth,
  calculatePortfolioPerformance,
  calculatePortfolioRisk,
} from "@/lib/portfolio-engine/insights";
import {
  calculateEnhancedHoldings,
  calculatePortfolioValuation,
} from "@/lib/portfolio-engine/valuation";
import { usePortfolioStore } from "@/store/portfolioStore";
import { calculatePortfolioAlerts } from "@/lib/portfolio-engine/alerts";
import { calculateTopMovers } from "@/lib/portfolio-engine/movers";
import { calculateFinancialYears } from "@/lib/portfolio-engine/financialYear";
import { calculateIncomeMetrics } from "@/lib/portfolio-engine/incomeMetrics";
import { calculatePerformanceMetrics } from "@/lib/portfolio-engine/performanceMetrics";
import { calculateRecommendations } from "@/lib/portfolio-engine/recommendations";
import { buildPortfolioSnapshot } from "@/lib/portfolio-engine/snapshot";
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

    const totalCashAud = round(
      cashAccounts.reduce((total, account) => total + account.balanceAud, 0),
      2,
    );

    const enhancedHoldings = calculateEnhancedHoldings(openHoldings);
    const valuation = calculatePortfolioValuation({
      enhancedHoldings,
      cashAud: totalCashAud,
    });

    const totalCostAud = valuation.investedCostAud;

    const totalDividendsAud = round(
      dividends.reduce((total, dividend) => total + dividend.amountAud, 0),
      2,
    );

    const realisedPlAud = round(
      holdings.reduce((total, holding) => total + holding.realisedPlAud, 0),
      2,
    );

    const totalValueAud = valuation.totalValueAud;
    const totalReturnAud = round(realisedPlAud + totalDividendsAud + valuation.unrealisedPlAud, 2);
    const totalReturnPercent = round(percentage(totalReturnAud, Math.max(totalCostAud, 1)), 2);

    const topHoldings = [...enhancedHoldings]
      .sort((a, b) => b.marketValueAud - a.marketValueAud)
      .slice(0, 10)
      .map((holding) => ({
        ...holding,
        weightPercent: holding.portfolioWeightPercent,
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

    const financialYears = calculateFinancialYears({
      transactions,
      dividends,
    });

    const incomeMetrics = calculateIncomeMetrics({
      dividends,
      investedCostAud: totalCostAud,
    });

    const enginePerformance = calculatePerformanceMetrics({
      transactions,
      dividends,
      investedCostAud: totalCostAud,
    });

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

    const topMovers = calculateTopMovers(enhancedHoldings);

    const snapshot = buildPortfolioSnapshot({
      totalValueAud,
      totalReturnPercent,
      healthScore: health.score,
      riskScore: risk.riskScore,
      incomeYieldPercent: incomeMetrics.incomeYieldPercent,
      positionCount: openHoldings.length,
    });

    const recommendations = calculateRecommendations({
      healthScore: health.score,
      riskScore: risk.riskScore,
      largestHoldingPercent: risk.largestHoldingPercent,
      largestSectorPercent: risk.largestSectorPercent,
      cashPercent: risk.cashPercent,
      highRiskPercent: risk.highRiskPercent,
      incomeYieldPercent: incomeMetrics.incomeYieldPercent,
    });

    const alerts = calculatePortfolioAlerts({
      enhancedHoldings,
      riskScore: risk.riskScore,
      healthScore: health.score,
      cashPercent: risk.cashPercent,
      largestHoldingPercent: risk.largestHoldingPercent,
      highRiskPercent: risk.highRiskPercent,
    });

    return {
      loaded,
      engine,
      transactions,
      holdings,
      openHoldings,
      closedHoldings,
      enhancedHoldings,
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
      financialYears,
      incomeMetrics,
      enginePerformance,
      risk,
      health,
      snapshot,
      recommendations,
      alerts,
      topMovers,
      valuation,
      summary: engine?.summary ?? null,
    };
  }, [cashAccounts, dividends, engine, holdings, loaded, transactions]);
}
