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
import { calculateDataQuality } from "@/lib/portfolio-engine/dataQuality";
import { calculateFinancialYears } from "@/lib/portfolio-engine/financialYear";
import { calculateFifoLots } from "@/lib/portfolio-engine/fifo";
import { buildIncomeInsights } from "@/lib/portfolio-engine/incomeIntelligence";
import { buildIntelligenceInsights } from "@/lib/portfolio-engine/intelligence";
import { buildWatchlistIdeas } from "@/lib/portfolio-engine/watchlistIntelligence";
import { calculateCashflowPlan } from "@/lib/portfolio-engine/cashflowPlanner";
import { buildCountryInsights } from "@/lib/portfolio-engine/countryIntelligence";
import { buildCurrencyInsights } from "@/lib/portfolio-engine/currencyIntelligence";
import { buildSectorInsights } from "@/lib/portfolio-engine/sectorIntelligence";
import { calculateIncomeMetrics } from "@/lib/portfolio-engine/incomeMetrics";
import { calculatePerformanceMetrics } from "@/lib/portfolio-engine/performanceMetrics";
import { calculateRecommendations } from "@/lib/portfolio-engine/recommendations";
import { calculateNetWorth } from "@/lib/portfolio-engine/netWorth";
import { calculateRetirementProjection } from "@/lib/portfolio-engine/retirementPlanner";
import { buildDefaultScenarios } from "@/lib/portfolio-engine/scenarioSimulator";
import { calculatePortfolioReplay } from "@/lib/portfolio-engine/replay";
import { calculateReturnMetrics } from "@/lib/portfolio-engine/returnMetrics";
import { buildPortfolioSnapshot } from "@/lib/portfolio-engine/snapshot";
import { calculateEquityCurve } from "@/lib/portfolio-engine/equityCurve";
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

    const fifo = calculateFifoLots(transactions);

    const dataQuality = calculateDataQuality({
      transactions,
      issues: engine?.invalidRows ?? [],
    });

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

    const equityCurve = calculateEquityCurve(transactions);

    const portfolioReplay = calculatePortfolioReplay(transactions);

    const cashflowPlan = calculateCashflowPlan(transactions);

    const netWorth = calculateNetWorth({
      portfolioAud: valuation.marketValueAud,
      cashAud: totalCashAud,
    });

    const scenarios = buildDefaultScenarios(totalValueAud);

    const retirementProjection = calculateRetirementProjection({
      currentPortfolioAud: totalValueAud,
    });

    const returnMetrics = calculateReturnMetrics({
      transactions,
      investedCostAud: totalCostAud,
      unrealisedPlAud: valuation.unrealisedPlAud,
      realisedPlAud,
      dividendIncomeAud: totalDividendsAud,
    });

    const snapshot = buildPortfolioSnapshot({
      totalValueAud,
      totalReturnPercent,
      healthScore: health.score,
      riskScore: risk.riskScore,
      incomeYieldPercent: incomeMetrics.incomeYieldPercent,
      positionCount: openHoldings.length,
    });

    const sectorInsights = buildSectorInsights(allocation.sector);
    const countryInsights = buildCountryInsights(allocation.country);
    const currencyInsights = buildCurrencyInsights(allocation.currency);

    const watchlistIdeas = buildWatchlistIdeas({
      highRiskPercent: risk.highRiskPercent,
      largestSectorPercent: risk.largestSectorPercent,
      incomeYieldPercent: incomeMetrics.incomeYieldPercent,
      cashPercent: risk.cashPercent,
    });

    const incomeInsights = buildIncomeInsights({
      dividends,
      annualisedIncomeAud: incomeMetrics.annualisedIncomeAud,
      incomeYieldPercent: incomeMetrics.incomeYieldPercent,
      monthlyAverageAud: incomeMetrics.monthlyAverageAud,
    });

    const intelligenceInsights = buildIntelligenceInsights({
      riskScore: risk.riskScore,
      healthScore: health.score,
      incomeYieldPercent: incomeMetrics.incomeYieldPercent,
      largestHoldingPercent: risk.largestHoldingPercent,
      largestSectorPercent: risk.largestSectorPercent,
      totalReturnPercent,
      cashPercent: risk.cashPercent,
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
      fifo,
      dataQuality,
      financialYears,
      incomeMetrics,
      enginePerformance,
      risk,
      health,
      equityCurve,
      cashflowPlan,
      portfolioReplay,
      netWorth,
      scenarios,
      retirementProjection,
      returnMetrics,
      snapshot,
      sectorInsights,
      countryInsights,
      currencyInsights,
      watchlistIdeas,
      incomeInsights,
      intelligenceInsights,
      recommendations,
      alerts,
      topMovers,
      valuation,
      summary: engine?.summary ?? null,
    };
  }, [cashAccounts, dividends, engine, holdings, loaded, transactions]);
}
