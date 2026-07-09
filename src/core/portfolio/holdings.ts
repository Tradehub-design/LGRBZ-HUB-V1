import {

  Holding,

  HoldingMetrics,

  PortfolioLot

} from "./types";

export interface MarketPriceMap{

  [ticker:string]:number;

}

function calculateCostBasis(

  lots:PortfolioLot[]

):number{

  return lots.reduce(

    (sum,lot)=>

      sum+

      (lot.remaining*lot.purchasePrice),

    0

  );

}

function calculateQuantity(

  lots:PortfolioLot[]

):number{

  return lots.reduce(

    (sum,lot)=>

      sum+lot.remaining,

    0

  );

}

function calculateAverageCost(

  quantity:number,

  cost:number

){

  if(quantity===0){

    return 0;

  }

  return cost/quantity;

}


export function updateHoldingValues(

  holding:Holding,

  prices:MarketPriceMap

):Holding{

  const marketPrice=

    prices[holding.ticker] ??

    holding.metrics.marketPrice ??

    0;

  const quantity=

    calculateQuantity(

      holding.openLots

    );

  const costBasis=

    calculateCostBasis(

      holding.openLots

    );

  const averageCost=

    calculateAverageCost(

      quantity,

      costBasis

    );

  const marketValue=

    quantity*marketPrice;

  const unrealised=

    marketValue-costBasis;

  const total=

    unrealised+

    holding.metrics.realisedProfit;

  const percent=

    costBasis===0

      ?0

      :(total/costBasis)*100;


  const metrics:HoldingMetrics={

    ...holding.metrics,

    marketPrice,

    marketValue,

    averageCost,

    costBasis,

    unrealisedProfit:unrealised,

    totalProfit:total,

    totalReturnPercent:percent

  };

  return{

    ...holding,

    quantity,

    metrics

  };

}

export function buildHoldings(

  holdings:Holding[],

  prices:MarketPriceMap

):Holding[]{

  return holdings

    .map(

      h=>updateHoldingValues(

        h,

        prices

      )

    )

    .sort(

      (a,b)=>

        b.metrics.marketValue-

        a.metrics.marketValue

    );

}

export default buildHoldings;

