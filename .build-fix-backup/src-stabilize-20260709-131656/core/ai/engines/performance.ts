import type { PortfolioSnapshot }

from "@/core/business/models/PortfolioSnapshot";

import type { AIInsight }

from "../models/types";

export function performanceInsights(

snapshot:PortfolioSnapshot

):AIInsight[]{

return[{

id:crypto.randomUUID(),

title:"Portfolio performance",

summary:

`${snapshot.returnPercent.toFixed(2)}% total return`,

details:"Performance is calculated from the Business Logic Engine.",

severity:

snapshot.returnPercent>=0

?"success"

:"warning",

score:80,

category:"Performance",

created:new Date().toISOString()

}];

}
