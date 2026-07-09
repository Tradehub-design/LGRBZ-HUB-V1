import type {

Holding

} from "@/core/portfolio/types";

import type {

IntelligenceCard

} from "../models/intelligence";

export function detectRiskAlerts(

holdings:Holding[]

):IntelligenceCard[]{

return holdings

.filter(

h=>

h.metrics.allocationPercent>20

)

.map(h=>({

id:crypto.randomUUID(),

ticker:h.ticker,

type:"warning",

title:

"Portfolio Concentration",

description:

`${h.ticker} exceeds 20% allocation.`,

score:90,

created:new Date().toISOString()

}));

}

