import type {

Portfolio

} from "@/core/portfolio/types";

import {

detectOpportunities

} from "../engines/opportunities";

import {

detectRiskAlerts

} from "../engines/riskAlerts";

export function buildIntelligence(

portfolio:Portfolio

){

return[

...detectRiskAlerts(

portfolio.holdings

),

...detectOpportunities(

portfolio.holdings

)

]

.sort(

(a,b)=>

b.score-a.score

);

}

