import type {

Holding

} from "@/core/portfolio/types";

import type {

IntelligenceCard

} from "../models/intelligence";

export function detectOpportunities(

holdings:Holding[]

):IntelligenceCard[]{

return holdings

.filter(

h=>

h.metrics.unrealisedPercent<-10

)

.map(h=>({

id:crypto.randomUUID(),

ticker:h.ticker,

type:"opportunity",

title:

"Potential Buying Opportunity",

description:

`${h.ticker} is down ${h.metrics.unrealisedPercent.toFixed(2)}%`,

score:82,

created:new Date().toISOString()

}));

}

