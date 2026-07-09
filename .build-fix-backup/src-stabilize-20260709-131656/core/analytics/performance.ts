import type { Portfolio } from "@/core/portfolio/types";

export interface PerformanceMetrics {

  portfolioValue:number;

  investedCapital:number;

  totalReturn:number;

  totalReturnPercent:number;

  annualisedReturn:number;

  cagr:number;

  volatility:number;

  maxDrawdown:number;

  sharpeRatio:number;

  sortinoRatio:number;

}

export function calculatePerformanceMetrics(

  portfolio:Portfolio

):PerformanceMetrics{

  const value=

    portfolio.performance

      .allTime

      .marketValue+

    portfolio.cash.totalCash;

  const invested=

    portfolio.cash.totalDeposits-

    portfolio.cash.totalWithdrawals;

  const profit=

    value-invested;

  const percent=

    invested===0

      ?0

      :(profit/invested)*100;

  return{

    portfolioValue:value,

    investedCapital:invested,

    totalReturn:profit,

    totalReturnPercent:percent,

    annualisedReturn:0,

    cagr:0,

    volatility:0,

    maxDrawdown:0,

    sharpeRatio:0,

    sortinoRatio:0

  };

}

