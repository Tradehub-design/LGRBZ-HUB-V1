import type { Portfolio } from "@/core/portfolio/types";

export interface RiskInsight{

title:string;

severity:"Low"|"Medium"|"High";

description:string;

}

export function analysePortfolioRisk(

portfolio:Portfolio

):RiskInsight[]{

const insights:RiskInsight[]=[];

const largest=Math.max(

...portfolio.holdings.map(

h=>h.metrics.allocationPercent

),

0

);

if(largest>25){

insights.push({

title:"Concentration Risk",

severity:"High",

description:

"A single holding exceeds 25% of your portfolio."

});

}

if(portfolio.cash.totalCash<0){

insights.push({

title:"Negative Cash",

severity:"High",

description:

"Portfolio cash balance is below zero."

});

}

return insights;

}

