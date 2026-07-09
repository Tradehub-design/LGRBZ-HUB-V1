import type { Portfolio } from "@/core/portfolio/types";

import type { AIInsight } from "../models/types";

export function incomeInsights(

portfolio:Portfolio

):AIInsight[]{

if(

portfolio.dividends.forwardIncome<=0

){

return[];

}

return[{

id:crypto.randomUUID(),

title:"Dividend income forecast",

summary:`Projected annual income $${portfolio.dividends.forwardIncome.toFixed(2)}`,

details:"Income forecast is based on your current holdings and projected annual distributions.",

severity:"success",

score:91,

category:"Income",

created:new Date().toISOString()

}];

}
