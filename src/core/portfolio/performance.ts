import {
  CashSummary,
  DividendSummary,
  Holding,
  PerformancePeriod,
  PortfolioPerformance,
  PortfolioTransaction
} from "./types";

function createEmptyPeriod():PerformancePeriod{

  return{

    deposits:0,

    withdrawals:0,

    dividends:0,

    interest:0,

    realisedProfit:0,

    unrealisedProfit:0,

    fees:0,

    marketValue:0,

    totalReturn:0,

    totalReturnPercent:0

  };

}

function calculateMarketValue(

  holdings:Holding[]

){

  return holdings.reduce(

    (sum,h)=>

      sum+h.metrics.marketValue,

    0

  );

}


export function calculatePerformance(

  transactions:PortfolioTransaction[],

  holdings:Holding[],

  cash:CashSummary,

  dividends:DividendSummary

):PortfolioPerformance{

  const all=createEmptyPeriod();

  all.marketValue=

    calculateMarketValue(

      holdings

    );

  all.deposits=

    cash.totalDeposits;

  all.withdrawals=

    cash.totalWithdrawals;

  all.dividends=

    dividends.total;

  all.interest=

    cash.totalInterest;

  all.fees=

    cash.totalFees;

  all.realisedProfit=

    holdings.reduce(

      (s,h)=>

        s+h.metrics.realisedProfit,

      0

    );

  all.unrealisedProfit=

    holdings.reduce(

      (s,h)=>

        s+h.metrics.unrealisedProfit,

      0

    );


  all.totalReturn=

    all.realisedProfit+

    all.unrealisedProfit+

    all.dividends+

    all.interest-

    all.fees;

  const invested=

    all.deposits-

    all.withdrawals;

  all.totalReturnPercent=

    invested===0

      ?0

      :(all.totalReturn/invested)*100;

  return{

    today:{...all},

    week:{...all},

    month:{...all},

    quarter:{...all},

    year:{...all},

    allTime:all

  };

}

export default calculatePerformance;

