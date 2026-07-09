import type { Portfolio } from "@/core/portfolio/types";

export interface DividendAnalytics{

annualIncome:number;

monthlyIncome:number;

yieldOnCost:number;

portfolioYield:number;

frankingCredits:number;

}

export function calculateDividendAnalytics(

portfolio:Portfolio

):DividendAnalytics{

const marketValue=

portfolio.holdings.reduce(

(s,h)=>s+h.metrics.marketValue,

0

);

const annual=

portfolio.dividends.yearly;

return{

annualIncome:annual,

monthlyIncome:annual/12,

yieldOnCost:

marketValue===0

?0

:(annual/marketValue)*100,

portfolioYield:

marketValue===0

?0

:(annual/marketValue)*100,

frankingCredits:

annual*0.30

};

}
