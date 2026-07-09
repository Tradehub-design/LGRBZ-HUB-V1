import type { PortfolioSnapshot } from "../models/PortfolioSnapshot";

export interface PortfolioMetrics{

totalReturn:number;

cashAllocation:number;

investedAllocation:number;

dividendYield:number;

profitFactor:number;

}

export function buildPortfolioMetrics(

snapshot:PortfolioSnapshot

):PortfolioMetrics{

const invested=

snapshot.marketValue;

const total=

snapshot.portfolioValue;

return{

totalReturn:

snapshot.returnPercent,

cashAllocation:

total===0

?0

:(snapshot.cash/total)*100,

investedAllocation:

total===0

?0

:(invested/total)*100,

dividendYield:

invested===0

?0

:(snapshot.dividends/invested)*100,

profitFactor:

snapshot.realisedPnL+

snapshot.unrealisedPnL

};

}

