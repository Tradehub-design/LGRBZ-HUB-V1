import { Portfolio } from "@/core/portfolio/types";

import { PortfolioInsight } from "./types";

export function generateInsights(

portfolio:Portfolio

):PortfolioInsight[]{

const insights:PortfolioInsight[]=[];

if(portfolio.holdings.length<10){

insights.push({

title:"Diversification",

description:

"Portfolio contains fewer than 10 holdings.",

importance:70

});

}

if(

portfolio.cash.totalCash>

portfolio.performance.allTime.marketValue

){

insights.push({

title:"High Cash",

description:

"Cash allocation is larger than invested assets.",

importance:50

});

}

return insights;

}

