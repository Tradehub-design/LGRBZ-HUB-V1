import type { Holding } from "@/core/portfolio/types";

import type { AIInsight } from "../models/types";

export function riskInsights(

holdings:Holding[]

):AIInsight[]{

const large=

holdings.filter(

h=>h.metrics.allocationPercent>20

);

return large.map(h=>({

id:crypto.randomUUID(),

title:`${h.ticker} concentration risk`,

summary:`${h.metrics.allocationPercent.toFixed(2)}% allocation`,

details:"Consider reviewing position sizing against your target allocation.",

severity:"warning",

score:95,

category:"Risk",

created:new Date().toISOString()

}));

}
