import type { Portfolio } from "@/core/portfolio/types";

import { createEvent } from "./events";

export function buildTimeline(

portfolio:Portfolio

){

const events=[];

events.push(

createEvent(

"Portfolio Updated",

`${portfolio.holdings.length} holdings currently tracked.`,

80

)

);

if(portfolio.dividends.forwardIncome>0){

events.push(

createEvent(

"Income Forecast",

`Projected annual income: $${portfolio.dividends.forwardIncome.toFixed(2)}`,

90

)

);

}

return events.sort(

(a,b)=>b.priority-a.priority

);

}
