import type { Portfolio } from "@/core/portfolio/types";

export interface PortfolioRisk{

portfolioRisk:number;

largestPosition:number;

cashExposure:number;

equityExposure:number;

cryptoExposure:number;

diversification:number;

}

export function calculatePortfolioRisk(

portfolio:Portfolio

):PortfolioRisk{

const total=

portfolio.holdings.reduce(

(s,h)=>s+h.metrics.marketValue,

0

);

const largest=Math.max(

0,

...portfolio.holdings.map(

h=>h.metrics.marketValue

)

);

const crypto=

portfolio.holdings

.filter(h=>h.assetClass==="Crypto")

.reduce(

(s,h)=>s+h.metrics.marketValue,

0

);

const equity=

portfolio.holdings

.filter(h=>h.assetClass==="Stock")

.reduce(

(s,h)=>s+h.metrics.marketValue,

0

);

return{

portfolioRisk:

Math.min(

100,

portfolio.holdings.length*6

),

largestPosition:

total===0?0:

largest/total*100,

cashExposure:

portfolio.cash.totalCash,

equityExposure:

equity,

cryptoExposure:

crypto,

diversification:

portfolio.holdings.length

};

}
