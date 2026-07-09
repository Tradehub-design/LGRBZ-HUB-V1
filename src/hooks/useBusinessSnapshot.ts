import { useMemo } from "react";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export function useBusinessSnapshot() {
  const data = useDashboardData();

  return useMemo(() => {
    const timeline = (data.equityCurve ?? []).map((point) => {
      const row = point as Record<string, unknown>;
      const value = Number(row.portfolioValue ?? row.valueAud ?? row.investedAud ?? 0);

      return {
        date: String(row.date ?? ""),
        portfolioValue: value,
        valueAud: Number(row.valueAud ?? value),
        investedAud: Number(row.investedAud ?? value),
        cumulativeCashFlowAud: Number(row.cumulativeCashFlowAud ?? 0),
        profit: Number(row.profit ?? row.changeAud ?? row.totalReturnAud ?? 0),
      };
    });

    const cashTotals = {
      totalCash: data.cashAccounts.reduce((sum, account) => sum + Number(account.balanceAud ?? 0), 0),
      totalDeposits: data.cashAccounts.reduce((sum, account) => sum + Number(account.depositsAud ?? 0), 0),
      totalWithdrawals: data.cashAccounts.reduce((sum, account) => sum + Number(account.withdrawalsAud ?? 0), 0),
      totalDividends: data.cashAccounts.reduce((sum, account) => sum + Number(account.dividendsAud ?? 0), 0),
      totalInterest: data.cashAccounts.reduce((sum, account) => sum + Number(account.interestAud ?? 0), 0),
    };

    const dividendTotals = {
      records: data.dividends,
      yearly: data.totalDividendsAud,
      monthly: data.totalDividendsAud / 12,
      forwardIncome: data.totalDividendsAud,
      total: data.totalDividendsAud,
    };

    const portfolio = {
      generatedAt: new Date().toISOString(),
      value: data.totalValueAud,
      portfolioValue: data.totalValueAud,
      totalReturn: data.totalReturnAud,
      totalReturnPercent: data.totalReturnPercent,
      transactions: data.transactions as any,
      holdings: data.openHoldings as any,
      realisedTrades: [],
      cash: data.cashAccounts as any,
      dividends: data.dividends as any,
      dashboard: {},
      replay: {
        allTime: {
          marketValue: data.totalValueAud,
          totalCash: cashTotals.totalCash,
        },
        holdings: data.openHoldings,
        timeline,
      },
      timeline,
      performance: {
        realisedPnL: Number(data.enginePerformance.realisedPlAud ?? 0),
        realisedPlAud: Number(data.enginePerformance.realisedPlAud ?? 0),
        winRate: 0,
        allTime: {
          marketValue: data.totalValueAud,
          totalCash: cashTotals.totalCash,
        },
        totalReturnAud: data.totalReturnAud,
        totalReturnPercent: data.totalReturnPercent,
      },
    };

    return {
      portfolio: portfolio as any,
      portfolioValue: data.totalValueAud,
      totalReturn: data.totalReturnAud,
      totalReturnPercent: data.totalReturnPercent,
      income: data.totalDividendsAud,
      healthScore: data.health.score,
      riskScore: data.risk.riskScore,
      holdings: data.openHoldings,
      transactions: data.transactions,
      dividends: dividendTotals,
      cashAccounts: cashTotals,
      timeline,
    };
  }, [data]);
}

export default useBusinessSnapshot;
