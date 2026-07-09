import type { Portfolio } from "@/core/portfolio/types";

export function forecastPortfolio(

portfolio:Portfolio

){

const annualGrowth=0.08;

const years=5;

const current=

portfolio.cash.totalCash+

portfolio.holdings.reduce(

(a,b)=>a+b.metrics.marketValue,

0

);

return{

expectedReturn:annualGrowth,

expectedIncome:

portfolio.dividends.forwardIncome,

expectedValue:

current*Math.pow(

1+annualGrowth,

years

),

confidence:78,

projectionYears:years,

generated:new Date().toISOString()

};

}
