import type {
  DashboardSummary,
  Holding,
  Portfolio
} from "@/core/portfolio/types";

export function getDashboardSummary(
  portfolio:Portfolio
):DashboardSummary{

  return portfolio.dashboard;

}

export function getTopHoldings(

  portfolio:Portfolio,

  limit:number=5

):Holding[]{

  return [...portfolio.holdings]

    .sort(

      (a,b)=>

        b.metrics.marketValue-

        a.metrics.marketValue

    )

    .slice(0,limit);

}

export function getLargestHolding(

  portfolio:Portfolio

):Holding|null{

  if(portfolio.holdings.length===0){

    return null;

  }

  return getTopHoldings(

    portfolio,

    1

  )[0];

}

export function getPortfolioValue(

  portfolio:Portfolio

){

  return (

    portfolio.cash.totalCash+

    portfolio.performance

      .allTime

      .marketValue

  );

}

